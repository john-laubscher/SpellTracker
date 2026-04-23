const axios = require('axios');
const express = require('express');
const cors = require('cors');

const { readStore, updateStore } = require("./store");
const { hashPassword, newId, signToken, verifyToken } = require("./auth");

const app = express();

app.use(cors({ origin: true, credentials: false, allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());

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

app.get("/custom-spells", requireAuth, (req, res) => {
  const level = req.query.level !== undefined ? Number(req.query.level) : null;
  const store = readStore();
  const spells = store.customSpells
    .filter((s) => s.userId === req.userId)
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

app.get('/singlespell/:spell_index', (req, res) => {
        // const spell_index= 'acid-splash'

    const spell_index= req.params.spell_index
    console.log('SPELLURL', spell_index)
    axios.get(`https://www.dnd5eapi.co/api/spells/${spell_index}`)
        .then(response => {
            res.json(response.data)
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error');
          });
})

app.get('/allspells/:numerical_spell_level/:character_class', (req, res) => {
    const numerical_spell_level = parseInt(req.params.numerical_spell_level);
    const character_class = req.params.character_class;

    if (numerical_spell_level === 0) {
        axios.get(`https://www.dnd5eapi.co/api/2014/classes/${character_class}/spells`)
            .then(response => {
                const allSpells = response.data.results || [];
                const cantripPromises = allSpells.map(spell =>
                    axios.get(`https://www.dnd5eapi.co/api/spells/${spell.index}`)
                        .then(r => r.data)
                        .catch(() => null)
                );
                return Promise.all(cantripPromises);
            })
            .then(spellDetails => {
                const cantrips = spellDetails
                    .filter(s => s && s.level === 0)
                    .map(s => ({ index: s.index, name: s.name, url: `/api/spells/${s.index}` }));
                res.json({ count: cantrips.length, results: cantrips });
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Internal Server Error');
            });
    } else {
        axios.get(`https://www.dnd5eapi.co/api/classes/${character_class}/levels/${numerical_spell_level}/spells`)
            .then(response => {
                res.json(response.data)
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Internal Server Error');
            });
    }
})

// function that gets the individual spell 
    // uses base then url value from the spell list 

// Should my server by 3000 or 3001? 
// If making changes, be sure to restart server

app.listen(3001, () => {
    console.log('Server is running')
})
