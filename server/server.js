const axios = require('axios');
const express = require('express');
const cors = require('cors');
const crypto = require("crypto");

const { readStore, updateStore } = require("./store");
const { hashPassword, newId, signToken, verifyToken } = require("./auth");

const app = express();

app.use(cors({ origin: true, credentials: false, allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send(
    "SpellTracker backend is running. Open http://localhost:3000 for the UI. API is on port 3001."
  );
});

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: "missing_token" });
  const token = m[1];
  const v = verifyToken(token);
  if (!v.ok) return res.status(401).json({ error: "invalid_token", reason: v.reason });
  req.userId = v.payload.sub;
  next();
}

app.post("/auth/register", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) return res.status(400).json({ error: "missing_fields" });

  const store = readStore();
  const existing = store.users.find((u) => u.email === email);
  if (existing) return res.status(409).json({ error: "email_taken" });

  const userId = newId();
  const { saltHex, hashHex } = hashPassword(password);
  updateStore((s) => ({
    ...s,
    users: [...s.users, { id: userId, email, saltHex, hashHex, createdAt: Date.now() }],
  }));

  const token = signToken({ sub: userId });
  return res.json({ token, user: { id: userId, email } });
});

app.post("/auth/login", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  if (!email || !password) return res.status(400).json({ error: "missing_fields" });

  const store = readStore();
  const user = store.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "invalid_credentials" });

  const { hashHex } = hashPassword(password, user.saltHex);
  if (hashHex !== user.hashHex) return res.status(401).json({ error: "invalid_credentials" });

  const token = signToken({ sub: user.id });
  return res.json({ token, user: { id: user.id, email: user.email } });
});

app.get("/auth/me", requireAuth, (req, res) => {
  const store = readStore();
  const user = store.users.find((u) => u.id === req.userId);
  if (!user) return res.status(401).json({ error: "invalid_token" });
  return res.json({ user: { id: user.id, email: user.email } });
});

function sha256Hex(input) {
  return crypto.createHash("sha256").update(String(input), "utf8").digest("hex");
}

function isProd() {
  return String(process.env.NODE_ENV || "").toLowerCase() === "production";
}

const MAX_CHARACTERS_PER_USER = 5;

function getCharacterSummary(character) {
  return {
    id: character.id,
    userId: character.userId,
    name: character.name,
    createdAt: character.createdAt,
    updatedAt: character.updatedAt,
    lastUsedAt: character.lastUsedAt || character.updatedAt || character.createdAt,
  };
}

function getOwnedCharacter(store, userId, characterId) {
  if (!characterId) return null;
  return (store.characters || []).find(
    (character) => character.id === characterId && character.userId === userId
  );
}

function requireOwnedCharacter(req, res, source = "query") {
  const rawId =
    source === "params"
      ? req.params?.id
      : source === "body"
        ? req.body?.characterId
        : req.query?.characterId;
  const characterId = String(rawId || "").trim();
  if (!characterId) {
    res.status(400).json({ error: "missing_character_id" });
    return null;
  }

  const store = readStore();
  const character = getOwnedCharacter(store, req.userId, characterId);
  if (!character) {
    res.status(404).json({ error: "character_not_found" });
    return null;
  }

  return { store, character, characterId };
}

// Dev-only password reset flow:
// - POST /auth/request-password-reset { email } -> { ok: true, token? }
// - POST /auth/reset-password { email, token, newPassword } -> { ok: true }
//
// In production, you should email the token (or a reset link) and omit it from the response.
app.post("/auth/request-password-reset", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "missing_email" });

  let issuedToken = null;
  updateStore((s) => {
    const next = { ...s };
    next.users = (s.users || []).map((u) => {
      if (u.email !== email) return u;
      issuedToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHashHex = sha256Hex(issuedToken);
      return {
        ...u,
        resetTokenHashHex,
        resetTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
        resetTokenIssuedAt: Date.now(),
      };
    });
    return next;
  });

  // Always return ok=true to avoid email enumeration.
  // In dev, include the token to keep the flow usable without an email provider.
  return res.json({ ok: true, ...(issuedToken && !isProd() ? { token: issuedToken } : {}) });
});

app.post("/auth/reset-password", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const token = String(req.body?.token || "").trim();
  const newPassword = String(req.body?.newPassword || "");

  if (!email || !token || !newPassword) return res.status(400).json({ error: "missing_fields" });
  if (newPassword.length < 6) return res.status(400).json({ error: "weak_password" });

  const tokenHashHex = sha256Hex(token);

  let updated = false;
  updateStore((s) => {
    const next = { ...s };
    next.users = (s.users || []).map((u) => {
      if (u.email !== email) return u;
      const expiresAt = Number(u.resetTokenExpiresAt || 0);
      if (!u.resetTokenHashHex || expiresAt <= Date.now()) return u;
      if (u.resetTokenHashHex !== tokenHashHex) return u;

      const { saltHex, hashHex } = hashPassword(newPassword);
      updated = true;
      return {
        ...u,
        saltHex,
        hashHex,
        resetTokenHashHex: null,
        resetTokenExpiresAt: null,
        resetTokenIssuedAt: null,
        updatedAt: Date.now(),
      };
    });
    return next;
  });

  if (!updated) return res.status(400).json({ error: "invalid_or_expired_token" });
  return res.json({ ok: true });
});

app.get("/characters", requireAuth, (req, res) => {
  const store = readStore();
  const characters = (store.characters || [])
    .filter((character) => character.userId === req.userId)
    .sort((a, b) => Number(b.lastUsedAt || b.updatedAt || 0) - Number(a.lastUsedAt || a.updatedAt || 0))
    .map(getCharacterSummary);

  res.json({ count: characters.length, results: characters, maxCharacters: MAX_CHARACTERS_PER_USER });
});

app.post("/characters", requireAuth, (req, res) => {
  const name = String(req.body?.name || "").trim();
  if (!name) return res.status(400).json({ error: "missing_name" });

  const profile = req.body?.profile && typeof req.body.profile === "object" ? req.body.profile : {};
  const store = readStore();
  const existingCharacters = (store.characters || []).filter((character) => character.userId === req.userId);
  if (existingCharacters.length >= MAX_CHARACTERS_PER_USER) {
    return res.status(400).json({ error: "character_limit_reached", maxCharacters: MAX_CHARACTERS_PER_USER });
  }

  const now = Date.now();
  const record = {
    id: newId(),
    userId: req.userId,
    name,
    profile,
    createdAt: now,
    updatedAt: now,
    lastUsedAt: now,
  };

  updateStore((s) => ({
    ...s,
    characters: [...(s.characters || []), record],
  }));

  res.status(201).json({ character: { ...getCharacterSummary(record), profile: record.profile } });
});

app.get("/characters/:id", requireAuth, (req, res) => {
  const resolved = requireOwnedCharacter(req, res, "params");
  if (!resolved) return;
  const { character } = resolved;
  res.json({ character: { ...getCharacterSummary(character), profile: character.profile || {} } });
});

app.put("/characters/:id", requireAuth, (req, res) => {
  const resolved = requireOwnedCharacter(req, res, "params");
  if (!resolved) return;

  const nextName =
    req.body?.name !== undefined ? String(req.body.name || "").trim() : undefined;
  const nextProfile =
    req.body?.profile !== undefined && req.body?.profile && typeof req.body.profile === "object"
      ? req.body.profile
      : req.body?.profile !== undefined
        ? {}
        : undefined;

  let updatedCharacter = null;
  updateStore((s) => {
    const next = { ...s };
    next.characters = (s.characters || []).map((character) => {
      if (character.id !== resolved.character.id || character.userId !== req.userId) return character;
      updatedCharacter = {
        ...character,
        name: nextName !== undefined ? nextName || character.name : character.name,
        profile: nextProfile !== undefined ? nextProfile : character.profile || {},
        updatedAt: Date.now(),
        lastUsedAt: Date.now(),
      };
      return updatedCharacter;
    });
    return next;
  });

  if (!updatedCharacter) return res.status(404).json({ error: "character_not_found" });
  res.json({ character: { ...getCharacterSummary(updatedCharacter), profile: updatedCharacter.profile || {} } });
});

app.get("/custom-spells", requireAuth, (req, res) => {
  const resolved = requireOwnedCharacter(req, res, "query");
  if (!resolved) return;
  const level = req.query.level !== undefined ? Number(req.query.level) : null;
  const spells = resolved.store.customSpells
    .filter((s) => s.userId === req.userId)
    .filter((s) => s.characterId === resolved.characterId)
    .filter((s) => (level === null ? true : s.level === level))
    .map((s) => ({
      index: `custom:${s.id}`,
      name: s.title,
      level: s.level,
      range: s.range,
      duration: s.duration,
      casting_time: s.castingTime,
      components: s.components ? s.components.split(",").map((c) => c.trim()).filter(Boolean) : [],
      concentration: Boolean(s.concentration),
      ritual: Boolean(s.ritual),
      desc: s.description ? [s.description] : [],
      isCustom: true,
    }));

  res.json({ count: spells.length, results: spells });
});

app.post("/custom-spells", requireAuth, (req, res) => {
  const resolved = requireOwnedCharacter(req, res, "body");
  if (!resolved) return;
  const level = Number(req.body?.level);
  const title = String(req.body?.title || "").trim();
  const description = String(req.body?.description || "").trim();
  const range = String(req.body?.range || "").trim();
  const duration = String(req.body?.duration || "").trim();
  const castingTime = String(req.body?.castingTime || "").trim();
  const components = String(req.body?.components || "").trim();
  const concentration = Boolean(req.body?.concentration);
  const ritual = Boolean(req.body?.ritual);

  if (!Number.isFinite(level) || level < 0 || level > 9) return res.status(400).json({ error: "bad_level" });
  if (!title) return res.status(400).json({ error: "missing_title" });

  const id = newId();
  const record = {
    id,
    userId: req.userId,
    characterId: resolved.characterId,
    level,
    title,
    description,
    range,
    duration,
    castingTime,
    components,
    concentration,
    ritual,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  updateStore((s) => ({ ...s, customSpells: [...s.customSpells, record] }));

  res.status(201).json({
    index: `custom:${id}`,
    name: title,
    level,
    range,
    duration,
    casting_time: castingTime,
    components: components ? components.split(",").map((c) => c.trim()).filter(Boolean) : [],
    concentration,
    ritual,
    desc: description ? [description] : [],
    isCustom: true,
  });
});

app.put("/custom-spells/:id", requireAuth, (req, res) => {
  const id = String(req.params.id || "");
  const updates = {
    title: req.body?.title !== undefined ? String(req.body.title || "").trim() : undefined,
    description:
      req.body?.description !== undefined ? String(req.body.description || "").trim() : undefined,
    range: req.body?.range !== undefined ? String(req.body.range || "").trim() : undefined,
    duration: req.body?.duration !== undefined ? String(req.body.duration || "").trim() : undefined,
    castingTime:
      req.body?.castingTime !== undefined ? String(req.body.castingTime || "").trim() : undefined,
    components:
      req.body?.components !== undefined ? String(req.body.components || "").trim() : undefined,
    concentration:
      req.body?.concentration !== undefined ? Boolean(req.body.concentration) : undefined,
    ritual: req.body?.ritual !== undefined ? Boolean(req.body.ritual) : undefined,
  };

  let updatedRecord = null;
  updateStore((s) => {
    const next = { ...s };
    next.customSpells = s.customSpells.map((sp) => {
      if (sp.id !== id || sp.userId !== req.userId) return sp;
      updatedRecord = {
        ...sp,
        title: updates.title ?? sp.title,
        description: updates.description ?? sp.description,
        range: updates.range ?? sp.range,
        duration: updates.duration ?? sp.duration,
        castingTime: updates.castingTime ?? sp.castingTime,
        components: updates.components ?? sp.components,
        concentration: updates.concentration ?? sp.concentration,
        ritual: updates.ritual ?? sp.ritual,
        updatedAt: Date.now(),
      };
      return updatedRecord;
    });
    return next;
  });

  if (!updatedRecord) return res.status(404).json({ error: "not_found" });

  return res.json({
    index: `custom:${updatedRecord.id}`,
    name: updatedRecord.title,
    level: updatedRecord.level,
    range: updatedRecord.range,
    duration: updatedRecord.duration,
    casting_time: updatedRecord.castingTime,
    components: updatedRecord.components
      ? updatedRecord.components.split(",").map((c) => c.trim()).filter(Boolean)
      : [],
    concentration: Boolean(updatedRecord.concentration),
    ritual: Boolean(updatedRecord.ritual),
    desc: updatedRecord.description ? [updatedRecord.description] : [],
    isCustom: true,
  });
});

app.delete("/custom-spells/:id", requireAuth, (req, res) => {
  const id = String(req.params.id || "");
  let removed = false;
  updateStore((s) => {
    const beforeLen = s.customSpells.length;
    const nextSpells = s.customSpells.filter((sp) => !(sp.id === id && sp.userId === req.userId));
    removed = nextSpells.length !== beforeLen;
    return { ...s, customSpells: nextSpells };
  });

  if (!removed) return res.status(404).json({ error: "not_found" });
  return res.status(204).send();
});

app.get("/custom-features", requireAuth, (req, res) => {
  const resolved = requireOwnedCharacter(req, res, "query");
  if (!resolved) return;
  const kindRaw = req.query.kind !== undefined ? String(req.query.kind || "") : "";
  const trackedRaw = req.query.tracked !== undefined ? String(req.query.tracked || "") : "";

  const kind = kindRaw ? kindRaw.trim().toLowerCase() : null;
  const tracked =
    trackedRaw === ""
      ? null
      : trackedRaw.trim().toLowerCase() === "true"
        ? true
        : trackedRaw.trim().toLowerCase() === "false"
          ? false
          : null;

  const results = resolved.store.customFeatures
    .filter((f) => f.userId === req.userId)
    .filter((f) => f.characterId === resolved.characterId)
    .filter((f) => (kind ? f.kind === kind : true))
    .filter((f) => (tracked === null ? true : Boolean(f.tracked) === tracked))
    .map((f) => ({
      id: f.id,
      kind: f.kind,
      tracked: Boolean(f.tracked),
      name: f.title,
      desc: f.description || "",
      isCustom: true,
    }));

  res.json({ count: results.length, results });
});

app.post("/custom-features", requireAuth, (req, res) => {
  const resolved = requireOwnedCharacter(req, res, "body");
  if (!resolved) return;
  const kind = String(req.body?.kind || "").trim().toLowerCase();
  const title = String(req.body?.title || "").trim();
  const description = String(req.body?.description || "").trim();
  const tracked = Boolean(req.body?.tracked);

  if (kind !== "class" && kind !== "subclass") return res.status(400).json({ error: "bad_kind" });
  if (!title) return res.status(400).json({ error: "missing_title" });

  const id = newId();
  const record = {
    id,
    userId: req.userId,
    characterId: resolved.characterId,
    kind,
    tracked,
    title,
    description,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  updateStore((s) => ({ ...s, customFeatures: [...(s.customFeatures || []), record] }));

  res.status(201).json({
    id,
    kind,
    tracked,
    name: title,
    desc: description,
    isCustom: true,
  });
});

app.put("/custom-features/:id", requireAuth, (req, res) => {
  const id = String(req.params.id || "");
  const updates = {
    title: req.body?.title !== undefined ? String(req.body.title || "").trim() : undefined,
    description:
      req.body?.description !== undefined ? String(req.body.description || "").trim() : undefined,
    tracked: req.body?.tracked !== undefined ? Boolean(req.body.tracked) : undefined,
  };

  let updatedRecord = null;
  updateStore((s) => {
    const next = { ...s };
    next.customFeatures = (s.customFeatures || []).map((f) => {
      if (f.id !== id || f.userId !== req.userId) return f;
      updatedRecord = {
        ...f,
        title: updates.title ?? f.title,
        description: updates.description ?? f.description,
        tracked: updates.tracked ?? f.tracked,
        updatedAt: Date.now(),
      };
      return updatedRecord;
    });
    return next;
  });

  if (!updatedRecord) return res.status(404).json({ error: "not_found" });

  res.json({
    id: updatedRecord.id,
    kind: updatedRecord.kind,
    tracked: Boolean(updatedRecord.tracked),
    name: updatedRecord.title,
    desc: updatedRecord.description || "",
    isCustom: true,
  });
});

app.delete("/custom-features/:id", requireAuth, (req, res) => {
  const id = String(req.params.id || "");
  let removed = false;
  updateStore((s) => {
    const beforeLen = (s.customFeatures || []).length;
    const nextFeatures = (s.customFeatures || []).filter(
      (f) => !(f.id === id && f.userId === req.userId)
    );
    removed = nextFeatures.length !== beforeLen;
    return { ...s, customFeatures: nextFeatures };
  });

  if (!removed) return res.status(404).json({ error: "not_found" });
  return res.status(204).send();
});

app.get('/singlespell/:spell_index', async (req, res) => {
    const spell_index = String(req.params.spell_index || "").trim();
    if (!spell_index) return res.status(400).json({ error: "invalid_spell_index" });

    // The `/api/2014` dataset is SRD-only and does not contain many common (non-SRD) spells.
    // To avoid surfacing those as 500 errors, we try a small fallback chain and return 404 when missing.
    const urlsToTry = [
        `https://www.dnd5eapi.co/api/2014/spells/${spell_index}`,
        `https://www.dnd5eapi.co/api/spells/${spell_index}`,
    ];

    let lastErr = null;

    for (const url of urlsToTry) {
        try {
            const response = await axios.get(url);
            return res.json(response.data);
        } catch (error) {
            lastErr = error;
            const status = error?.response?.status;
            // Missing in this dataset -> try next.
            if (status === 404) continue;
            // Bad request (e.g. invalid slug) -> no point retrying.
            if (status === 400) return res.status(400).json({ error: "invalid_spell_index" });
            // Other errors: network/server issues.
            console.error("Failed to fetch spell details:", { spell_index, url, status });
            return res.status(502).json({ error: "upstream_error" });
        }
    }

    const status = lastErr?.response?.status;
    if (status === 404) return res.status(404).json({ error: "not_found", index: spell_index });
    console.error("Failed to fetch spell details:", { spell_index, status });
    return res.status(502).json({ error: "upstream_error" });
});

app.get('/allspells/:numerical_spell_level/:character_class', (req, res) => {
    const numerical_spell_level = parseInt(req.params.numerical_spell_level);
    const character_class = req.params.character_class;

    axios.get(`https://www.dnd5eapi.co/api/2014/classes/${character_class}/spells`)
        .then(response => {
            const allSpells = response.data?.results || [];
            const filtered = allSpells.filter(s => Number(s?.level) === numerical_spell_level);
            res.json({ count: filtered.length, results: filtered });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
        });
})

app.get('/spellsbylevel/:numerical_spell_level', async (req, res) => {
    const numerical_spell_level = parseInt(req.params.numerical_spell_level);

    if (!Number.isFinite(numerical_spell_level)) {
        return res.status(400).json({ error: "invalid_level" });
    }

    try {
        const response = await axios.get(`https://www.dnd5eapi.co/api/2014/spells`, {
            params: { level: numerical_spell_level },
        });
        const results = response.data?.results || [];
        return res.json({ count: results.length, results });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/spellsbyschool/:numerical_spell_level/:school?', async (req, res) => {
    const numerical_spell_level = parseInt(req.params.numerical_spell_level);

    const rawSchool = String(req.params.school || req.query.school || "").trim();
    let decodedSchool = rawSchool;
    try {
        decodedSchool = decodeURIComponent(rawSchool);
    } catch {
        decodedSchool = rawSchool;
    }
    const school = String(decodedSchool || "").trim();

    if (!Number.isFinite(numerical_spell_level)) {
        return res.status(400).json({ error: "invalid_level" });
    }
    if (!school) {
        return res.status(400).json({ error: "invalid_school" });
    }

    const schools = school.split(",").map((s) => String(s || "").trim()).filter(Boolean);
    const uniqueSchools = Array.from(new Set(schools.length ? schools : [school]));

    try {
        const responses = await Promise.all(
            uniqueSchools.map((schoolIndex) =>
                axios.get(`https://www.dnd5eapi.co/api/2014/spells`, {
                    params: { level: numerical_spell_level, school: schoolIndex },
                })
            )
        );

        const results = [];
        const seen = new Set();
        responses.forEach((r) => {
            const list = r.data?.results || [];
            list.forEach((spell) => {
                const key = String(spell?.index || spell?.url || "");
                if (!key || seen.has(key)) return;
                seen.add(key);
                results.push(spell);
            });
        });

        return res.json({ count: results.length, results });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
})

// function that gets the individual spell 
    // uses base then url value from the spell list 

// Should my server by 3000 or 3001? 
// If making changes, be sure to restart server

app.listen(3001, () => {
    console.log('Server is running')
})
