import Database from "better-sqlite3";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbPath = join(__dirname, "database.sqlite");

export function openDb() {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )
  `);
  return db;
}

export function seedIfEmpty(db) {
  const row = db.prepare("SELECT COUNT(*) AS c FROM users").get();
  if (row.c > 0) return;

  const seedPath = join(__dirname, "..", "src", "db.json");
  if (!existsSync(seedPath)) return;

  const raw = readFileSync(seedPath, "utf8");
  const parsed = JSON.parse(raw);
  const users = parsed.users;
  if (!Array.isArray(users) || users.length === 0) return;

  const insert = db.prepare(
    "INSERT OR REPLACE INTO users (id, data) VALUES (?, ?)",
  );

  const run = db.transaction(() => {
    for (const u of users) {
      const id = String(u.id);
      const payload = { ...u, id };
      insert.run(id, JSON.stringify(payload));
    }
  });
  run();
}
