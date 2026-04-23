const crypto = require("crypto");

function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input), "utf8");
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecodeToString(input) {
  const s = String(input).replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s + pad, "base64").toString("utf8");
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function getJwtSecret() {
  return process.env.SPELLTRACKER_JWT_SECRET || "dev-only-change-me";
}

function signToken(payload, { expiresInSeconds = 60 * 60 * 24 * 30 } = {}) {
  const header = { alg: "HS256", typ: "JWT" };
  const nowSec = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: nowSec, exp: nowSec + expiresInSeconds };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedBody}`;
  const sig = crypto
    .createHmac("sha256", getJwtSecret())
    .update(data)
    .digest();
  const encodedSig = base64UrlEncode(sig);
  return `${data}.${encodedSig}`;
}

function verifyToken(token) {
  const parts = String(token).split(".");
  if (parts.length !== 3) return { ok: false, reason: "bad_format" };
  const [h, b, s] = parts;
  const data = `${h}.${b}`;
  const expected = crypto
    .createHmac("sha256", getJwtSecret())
    .update(data)
    .digest();
  const expectedB64 = base64UrlEncode(expected);
  if (!crypto.timingSafeEqual(Buffer.from(expectedB64), Buffer.from(String(s)))) {
    return { ok: false, reason: "bad_signature" };
  }
  const body = safeJsonParse(base64UrlDecodeToString(b));
  if (!body || !body.sub || !body.exp) return { ok: false, reason: "bad_payload" };
  const nowSec = Math.floor(Date.now() / 1000);
  if (nowSec >= body.exp) return { ok: false, reason: "expired" };
  return { ok: true, payload: body };
}

function hashPassword(password, salt) {
  const saltBuf = salt ? Buffer.from(salt, "hex") : crypto.randomBytes(16);
  const hashBuf = crypto.scryptSync(String(password), saltBuf, 64);
  return { saltHex: saltBuf.toString("hex"), hashHex: hashBuf.toString("hex") };
}

function newId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

module.exports = {
  newId,
  signToken,
  verifyToken,
  hashPassword,
};

