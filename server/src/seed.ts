import db from './db';

interface SnippetSeed {
  title: string;
  language: string;
  code: string;
  description: string;
}

const snippets: SnippetSeed[] = [
  {
    title: 'Hello World (JavaScript)',
    language: 'javascript',
    code: 'console.log("Hello World");',
    description: 'Basic Hello World snippet.',
  },
  {
    title: 'Sum util (TypeScript)',
    language: 'typescript',
    code: 'export const sum = (a: number, b: number) => a + b;\n',
    description: 'Simple function to sum two numbers.',
  },
];

const insert = db.prepare(
  `INSERT INTO snippets (title, language, code, description, createdAt, updatedAt)
   VALUES (?, ?, ?, ?, ?, ?)`
);

const now = new Date().toISOString();

for (const s of snippets) {
  insert.run(s.title, s.language, s.code, s.description, now, now);
}

console.log(`Seeded ${snippets.length} snippets ✅`);
