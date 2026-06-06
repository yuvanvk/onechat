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
  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    size INTEGER NOT NULL,
    message_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id)
  )
`;

export const PDFSchema = `
  CREATE TABLE IF NOT EXISTS pdfs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL, 
    size INTEGER NOT NULL,
    message_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id)
  )
`;

export const QueryMessages = `
  SELECT 
    m.id,
    m.role,
    m.content,
    m.model,
    m.created_at,
    json_group_array(
      CASE WHEN i.id IS NOT NULL 
      THEN json_object('name', i.name, 'type', 'image', 'size', i.size)
      ELSE NULL END
    ) as images,
    json_group_array(
      CASE WHEN p.id IS NOT NULL 
      THEN json_object('name', p.name, 'type', 'pdf', 'size', p.size)
      ELSE NULL END
    ) as pdfs
  FROM messages m
  LEFT JOIN images i ON i.message_id = m.id
  LEFT JOIN pdfs p ON p.message_id = m.id
  GROUP BY m.id
  ORDER BY m.created_at ASC;
`;
export const InsertIntoMessage = `INSERT INTO messages (id, role, content, model, created_at) VALUES (?, ?, ?, ?, ?)`;
export const UpdateConversationTitle = `UPDATE conversation SET title = ? WHERE id = ?`;
export const InsertIntoImage = `INSERT INTO images (id, name, size, message_id, created_at) VALUES (?, ?, ?, ?, ?)`;
export const UpdateMessageContent = `UPDATE messages SET content = ? WHERE id = ?`;