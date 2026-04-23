const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "data", "store.json");

function ensureStoreFile() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(
      STORE_PATH,
      JSON.stringify({ users: [], customSpells: [] }, null, 2),
      "utf8"
    );
  }
}

function readStore() {
  ensureStoreFile();
  const raw = fs.readFileSync(STORE_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      customSpells: Array.isArray(parsed.customSpells) ? parsed.customSpells : [],
    };
  } catch {
    return { users: [], customSpells: [] };
  }
}

function writeStore(next) {
  ensureStoreFile();
  const tmpPath = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(next, null, 2), "utf8");
  fs.renameSync(tmpPath, STORE_PATH);
}

function updateStore(mutator) {
  const store = readStore();
  const next = mutator(store) || store;
  writeStore(next);
  return next;
}

module.exports = {
  STORE_PATH,
  readStore,
  updateStore,
};

