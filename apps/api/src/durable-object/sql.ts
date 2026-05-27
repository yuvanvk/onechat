export const MessageSchema = `
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          role TEXT NOT NULL,
          content TEXT,
          model TEXT,
          created_at INTEGER NOT NULL
        )
      `;

export const QueryMessages = `SELECT id, role, content FROM messages ORDER BY created_at ASC`;
export const InsertIntoMessage = `INSERT INTO messages (id, role, content, model, created_at) VALUES (?, ?, ?, ?, ?)`
