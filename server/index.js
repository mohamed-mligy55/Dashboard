import express from "express";
import cors from "cors";
import { openDb, seedIfEmpty } from "./db.js";
import { deepMerge } from "./merge.js";

const PORT = Number(process.env.PORT) || 5000;

const app = express();
// السماح بأي منفذ localhost أثناء التطوير (Vite قد يستخدم 5174+ إذا كان 5173 مشغولاً)
app.use(
  cors({
    origin: (origin, cb) => {
      if (
        !origin ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  }),
);
app.use(express.json());

const db = openDb();
seedIfEmpty(db);

const selectAll = db.prepare("SELECT data FROM users ORDER BY rowid");
const selectOne = db.prepare("SELECT data FROM users WHERE id = ?");
const insertUser = db.prepare(
  "INSERT INTO users (id, data) VALUES (?, ?)",
);
const updateUser = db.prepare(
  "UPDATE users SET data = ? WHERE id = ?",
);
const deleteUser = db.prepare("DELETE FROM users WHERE id = ?");

function parseRow(row) {
  if (!row) return null;
  return JSON.parse(row.data);
}

/** GET /users */
app.get("/users", (_req, res) => {
  const rows = selectAll.all();
  const users = rows.map((r) => JSON.parse(r.data));
  res.json(users);
});

/** GET /users/:id */
app.get("/users/:id", (req, res) => {
  const id = String(req.params.id);
  const row = selectOne.get(id);
  const user = parseRow(row);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

/** POST /users */
app.post("/users", (req, res) => {
  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  let id = body.id != null ? String(body.id) : String(Date.now());
  const existing = parseRow(selectOne.get(id));
  if (existing) {
    id = String(Date.now());
  }

  const user = {
    ...body,
    id,
    __v: body.__v ?? 0,
  };

  insertUser.run(id, JSON.stringify(user));
  res.status(201).json(user);
});

/** PATCH /users/:id */
app.patch("/users/:id", (req, res) => {
  const id = String(req.params.id);
  const current = parseRow(selectOne.get(id));
  if (!current) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const patch = req.body;
  if (!patch || typeof patch !== "object") {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const merged = deepMerge(current, patch);
  merged.id = id;

  updateUser.run(JSON.stringify(merged), id);
  res.json(merged);
});

/** PUT /users/:id — full replace (optional, mirrors REST) */
app.put("/users/:id", (req, res) => {
  const id = String(req.params.id);
  const current = parseRow(selectOne.get(id));
  if (!current) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const body = req.body;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const user = { ...body, id };
  updateUser.run(JSON.stringify(user), id);
  res.json(user);
});

/** DELETE /users/:id */
app.delete("/users/:id", (req, res) => {
  const id = String(req.params.id);
  const info = deleteUser.run(id);
  if (info.changes === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.status(204).send();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
