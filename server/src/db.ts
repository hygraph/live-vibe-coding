import Database from 'better-sqlite3';
import { join } from 'path';

// Path to SQLite file inside the data directory (one level up from src)
const dbPath = join(__dirname, '..', 'data', 'db.sqlite');

const db = new Database(dbPath);

// Ensure the `snippets` table exists
// Schema: id, title, code, language, description, createdAt, updatedAt
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    language TEXT,
    code TEXT NOT NULL,
    description TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`;

db.exec(createTableSQL);

export default db;
