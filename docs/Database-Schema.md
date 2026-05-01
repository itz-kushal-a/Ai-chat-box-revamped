# Database Schema: AI-Chat-Box

## 1. Entity Relationship Diagram (Text-Based)

```text
  ┌──────────┐       ┌───────────┐       ┌──────────┐
  │  Users   │1─────*│ Projects  │1─────*│  Files   │
  └──────────┘       └───────────┘       └──────────┘
        1                  1
        │                  │
        └────────┬─────────┘
                 │
                 ▼
          ┌──────────┐       ┌──────────┐
          │  Chats   │1─────*│ Messages │
          └──────────┘       └──────────┘
```

## 2. Table Structures (PostgreSQL Style)

### 2.1. `users`
Stores user authentication and profile information.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier for the user. |
| `email` | VARCHAR(255) | Unique email address. |
| `name` | VARCHAR(100) | Display name. |
| `password_hash` | TEXT | Bcrypt hash of the user's password. |
| `created_at` | TIMESTAMP | Record creation time. |
| `updated_at` | TIMESTAMP | Last update time. |

### 2.2. `projects`
Workspaces where files and chats are organized.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier for the project. |
| `owner_id` | UUID (FK) | Reference to `users.id`. |
| `name` | VARCHAR(100) | Project name. |
| `description` | TEXT | Optional project description. |
| `created_at` | TIMESTAMP | Record creation time. |
| `updated_at` | TIMESTAMP | Last update time. |

### 2.3. `files`
The source code or text files within a project.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier for the file. |
| `project_id` | UUID (FK) | Reference to `projects.id`. |
| `path` | TEXT | File path within the project (e.g., `src/index.ts`). |
| `content` | TEXT | The actual content of the file. |
| `language` | VARCHAR(50) | Programming language (for syntax highlighting). |
| `created_at` | TIMESTAMP | Record creation time. |
| `updated_at` | TIMESTAMP | Last update time. |

### 2.4. `chats`
Conversation sessions linked to a project and user.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier for the chat. |
| `project_id` | UUID (FK) | Reference to `projects.id`. |
| `user_id` | UUID (FK) | Reference to `users.id`. |
| `title` | VARCHAR(255) | Auto-generated or user-defined title. |
| `created_at` | TIMESTAMP | Record creation time. |

### 2.5. `messages`
Individual exchanges within a chat session.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Unique identifier for the message. |
| `chat_id` | UUID (FK) | Reference to `chats.id`. |
| `role` | VARCHAR(20) | One of: `user`, `assistant`, `system`. |
| `content` | TEXT | The message body (Markdown supported). |
| `timestamp` | TIMESTAMP | When the message was sent/received. |

## 3. Example Data

### 3.1. User Record
```json
{
  "id": "u123",
  "email": "dev@example.com",
  "name": "Jane Developer",
  "created_at": "2026-05-01T10:00:00Z"
}
```

### 3.2. Project & File
```json
{
  "project": {
    "id": "p456",
    "owner_id": "u123",
    "name": "My Awesome App"
  },
  "file": {
    "id": "f789",
    "project_id": "p456",
    "path": "src/App.tsx",
    "language": "typescript",
    "content": "export const App = () => <div>Hello World</div>;"
  }
}
```

### 3.3. Chat & Message
```json
{
  "chat": {
    "id": "c001",
    "project_id": "p456",
    "user_id": "u123",
    "title": "Fixing the Header"
  },
  "message": {
    "chat_id": "c001",
    "role": "assistant",
    "content": "I've analyzed your `App.tsx`. You can fix the header by adding a `padding` property.",
    "timestamp": "2026-05-01T10:15:00Z"
  }
}
```

## 4. Implementation Notes
- **Indexes:** Create indexes on `owner_id` in `projects`, `project_id` in `files` and `chats`, and `chat_id` in `messages` to ensure fast lookups.
- **Cascading Deletes:** Deleting a project should optionally delete all associated files and chats.
- **Version Control:** For the `files` table, consider adding a `version` or `checksum` column to handle concurrent edits safely.
