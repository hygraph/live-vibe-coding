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

// Ensure the `comments` table exists
// Schema: id, snippetId, author, content, createdAt, updatedAt
const createCommentsTableSQL = `
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    snippetId INTEGER NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (snippetId) REFERENCES snippets (id) ON DELETE CASCADE
  );
`;

db.exec(createTableSQL);
db.exec(createCommentsTableSQL);

export default db;
