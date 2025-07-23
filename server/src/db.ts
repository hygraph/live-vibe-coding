import Database from 'better-sqlite3';
import { join } from 'path';

// Path to SQLite file inside the data directory (one level up from src)
const dbPath = join(__dirname, '..', 'data', 'db.sqlite');

const db = new Database(dbPath);

// Ensure the `snippets` table exists
// Schema: id, title, language, content (markdown), createdAt, updatedAt
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    language TEXT,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`;

// Migration: Convert existing snippets with code+description to markdown content
const migrateToMarkdownSQL = `
  UPDATE snippets 
  SET content = CASE 
    WHEN description IS NOT NULL AND description != '' THEN 
      description || char(10) || char(10) || '\`\`\`' || COALESCE(language, '') || char(10) || code || char(10) || '\`\`\`'
    ELSE 
      '\`\`\`' || COALESCE(language, '') || char(10) || code || char(10) || '\`\`\`'
  END
  WHERE content IS NULL;
`;

// Add content column if it doesn't exist (for migration)
const addContentColumnSQL = `
  ALTER TABLE snippets ADD COLUMN content TEXT;
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

// Create tables
db.exec(createTableSQL);
db.exec(createCommentsTableSQL);

// Perform migration if needed
try {
  // Check if we need to migrate (if old schema exists)
  const tableInfo = db.pragma('table_info(snippets)') as Array<{
    name: string;
    type: string;
    notnull: number;
    dflt_value: any;
    pk: number;
  }>;
  const hasCodeColumn = tableInfo.some(col => col.name === 'code');
  const hasContentColumn = tableInfo.some(col => col.name === 'content');

  if (hasCodeColumn && !hasContentColumn) {
    console.log('Migrating snippets to markdown format...');
    db.exec(addContentColumnSQL);
    db.exec(migrateToMarkdownSQL);

    // Remove old columns after successful migration
    db.exec(`
      CREATE TABLE snippets_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        language TEXT,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    db.exec(`
      INSERT INTO snippets_new (id, title, language, content, createdAt, updatedAt)
      SELECT id, title, language, content, createdAt, updatedAt FROM snippets;
    `);

    db.exec('DROP TABLE snippets;');
    db.exec('ALTER TABLE snippets_new RENAME TO snippets;');

    console.log('Migration to markdown format completed successfully.');
  } else if (!hasContentColumn) {
    // New installation, create with correct schema
    console.log('Creating snippets table with markdown support.');
  }
} catch (error) {
  console.error('Migration error:', error);
}

export default db;
