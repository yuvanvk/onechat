export const MessageSchema = `
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    content TEXT,
    model TEXT,
    created_at INTEGER NOT NULL
  )
`;

export const ImageSchema = `
  CREATE TABLE IF NOT EXISTS image (
    id TEXT PRIMARY KEY,
    imageUrl TEXT UNIQUE,
    messageId TEXT REFERENCES messages(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL
  );
`;

export const PDFSchema = `
  CREATE TABLE IF NOT EXISTS pdf (
    id TEXT PRIMARY KEY,
    pdfUrl TEXT UNIQUE,
    name TEXT,
    size INTEGER,
    messageId TEXT REFERENCES messages(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL
  );
`;

export const QueryMessages = `SELECT id, role, content FROM messages ORDER BY created_at ASC`;
export const InsertIntoMessage = `INSERT INTO messages (id, role, content, model, created_at) VALUES (?, ?, ?, ?, ?)`
export const UpdateConversationTitle = `UPDATE conversation SET title = ? WHERE id = ?` 