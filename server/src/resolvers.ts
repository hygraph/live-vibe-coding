import db from './db';

interface Snippet {
  id: string;
  title: string;
  language?: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateSnippetInput {
  title: string;
  language?: string;
  code: string;
  description?: string;
}

interface UpdateSnippetInput {
  title?: string;
  language?: string;
  code?: string;
  description?: string;
}

export const resolvers = {
  Query: {
    snippets: (
      _: any,
      { search, language }: { search?: string; language?: string }
    ): Snippet[] => {
      let query = 'SELECT * FROM snippets';
      const params: any[] = [];
      const conditions: string[] = [];

      // Add search condition (searches in title and code)
      if (search) {
        conditions.push('(title LIKE ? OR code LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }

      // Add language filter
      if (language) {
        conditions.push('language = ?');
        params.push(language);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY createdAt DESC';

      const stmt = db.prepare(query);
      return stmt.all(...params) as Snippet[];
    },

    snippet: (_: any, { id }: { id: string }): Snippet | null => {
      const stmt = db.prepare('SELECT * FROM snippets WHERE id = ?');
      const result = stmt.get(id) as Snippet | undefined;
      return result || null;
    },
  },

  Mutation: {
    createSnippet: (
      _: any,
      { input }: { input: CreateSnippetInput }
    ): Snippet => {
      const now = new Date().toISOString();
      const stmt = db.prepare(`
        INSERT INTO snippets (title, language, code, description, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        input.title,
        input.language || null,
        input.code,
        input.description || null,
        now,
        now
      );

      // Get the created snippet
      const getStmt = db.prepare('SELECT * FROM snippets WHERE id = ?');
      return getStmt.get(result.lastInsertRowid) as Snippet;
    },

    updateSnippet: (
      _: any,
      { id, input }: { id: string; input: UpdateSnippetInput }
    ): Snippet | null => {
      // Check if snippet exists
      const existsStmt = db.prepare('SELECT id FROM snippets WHERE id = ?');
      if (!existsStmt.get(id)) {
        return null;
      }

      const now = new Date().toISOString();
      const updateFields: string[] = [];
      const params: any[] = [];

      // Build dynamic update query based on provided fields
      if (input.title !== undefined) {
        updateFields.push('title = ?');
        params.push(input.title);
      }
      if (input.language !== undefined) {
        updateFields.push('language = ?');
        params.push(input.language);
      }
      if (input.code !== undefined) {
        updateFields.push('code = ?');
        params.push(input.code);
      }
      if (input.description !== undefined) {
        updateFields.push('description = ?');
        params.push(input.description);
      }

      if (updateFields.length === 0) {
        // No fields to update, return current snippet
        const getStmt = db.prepare('SELECT * FROM snippets WHERE id = ?');
        return getStmt.get(id) as Snippet;
      }

      updateFields.push('updatedAt = ?');
      params.push(now, id);

      const updateQuery = `UPDATE snippets SET ${updateFields.join(', ')} WHERE id = ?`;
      const stmt = db.prepare(updateQuery);
      stmt.run(...params);

      // Return updated snippet
      const getStmt = db.prepare('SELECT * FROM snippets WHERE id = ?');
      return getStmt.get(id) as Snippet;
    },

    deleteSnippet: (_: any, { id }: { id: string }): boolean => {
      const stmt = db.prepare('DELETE FROM snippets WHERE id = ?');
      const result = stmt.run(id);
      return result.changes > 0;
    },
  },
};
