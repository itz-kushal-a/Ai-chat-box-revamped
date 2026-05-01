# UI/UX Design Specification: AI-Chat-Box

## 1. Overview
The AI-Chat-Box UI is designed to be a sleek, modern, and developer-centric environment. It features a dark-themed, VS Code-inspired layout for desktop/web and a clean, accessible layout for mobile.

## 2. Global Design Language
- **Theme:** Dark mode by default.
  - Background: `#1e1e1e` (Main), `#252526` (Sidebars).
  - Borders: `#333333`.
- **Typography:** 
  - UI: **Inter** (sans-serif) for labels, buttons, and system text.
  - Code: **Fira Code** (monospace) for editor and chat code blocks.
- **Accent Colors:** 
  - Primary: `#007acc` (VS Code blue).
  - Hover: `#2a2d2e`.

## 3. Desktop & Web Layout (Three-Pane Architecture)

### 3.1. Left Pane: Navigation & Explorer (15-20% Width)
- **Activity Bar (Fixed Narrow Strip):** Icons for Explorer, Search, and Settings.
- **Sidebar (Collapsible):** 
  - **Header:** "EXPLORER" in caps, small font.
  - **Tree View:** Folders and files with indentation.
  - **Interaction:** Single click to preview (italics tab), double click to open (solid tab).

### 3.2. Middle Pane: Code Workspace (50-60% Width)
- **Tab Bar:**
  - Horizontal list of open files.
  - Close button on hover.
  - Unsaved changes indicator (circle icon).
- **Editor Area:**
  - Line numbers gutter.
  - Subtle vertical line at 80/100 characters.
  - Smooth scrolling.

### 3.3. Right Pane: AI Assistant (25-30% Width)
- **Header:** "AI CHAT" with a "New Chat" icon and a model selector dropdown.
- **Message List:**
  - **User Message:** Right-aligned, subtle blue tint background.
  - **AI Message:** Left-aligned, no background, separated by subtle lines.
  - **Code Blocks:** Syntax highlighted with a floating "Copy" button.
- **Input Area:**
  - Expanding textarea (auto-resize).
  - Markdown support.
  - Cmd/Ctrl + Enter to send.

## 4. Mobile UI/UX (Touch-First Experience)

### 4.1. Primary View: Chat
- Focus on the conversation.
- Large, tappable input area at the bottom.
- Swipe right from the left edge to open the File Explorer/Menu drawer.

### 4.2. Code Interaction
- **Floating Action Button (FAB):** "View Active Code" button appears when code is generated.
- **Full-Screen Modal:** Code is viewed in a full-screen modal with pinch-to-zoom support for readability.
- **Horizontal Swipe:** Swipe between multiple code snippets generated in the same session.

## 5. Interaction & UX Suggestions
- **Transitions:** Use `200ms ease-in-out` for all pane expansions and tab switches.
- **Empty States:** Display a "Welcome" graphic and suggested prompts (e.g., "Explain this file", "Write a test") in the chat when it's empty.
- **Feedback:** Subtle "pulse" animation on the Send button while the AI is thinking.
- **Accessibility:** 
  - Full keyboard navigation support (Tab indexing).
  - ARIA labels for all icon-only buttons.
  - High contrast ratios for all text elements.

## 6. Component Structure (React/TypeScript)

```text
src/
├── components/
│   ├── Layout/
│   │   ├── MainLayout.tsx     # Grid-based wrapper
│   │   ├── ActivityBar.tsx    # Left-most vertical icon strip
│   │   ├── Sidebar.tsx        # Explorer container
│   │   └── ChatPane.tsx       # AI chat container
│   ├── Explorer/
│   │   ├── FileTree.tsx       # Logic for recursive listing
│   │   └── FileNode.tsx       # File/Folder item with icon
│   ├── Editor/
│   │   ├── TabBar.tsx         # Active file management
│   │   └── EditorCore.tsx     # Syntax highlighting wrapper
│   ├── Chat/
│   │   ├── MessageList.tsx    # Scroll/History logic
│   │   ├── MessageBubble.tsx  # Content renderer
│   │   └── ChatInput.tsx      # Auto-expanding textarea
│   └── UI/
│       ├── Button.tsx         # Styled primitive
│       └── Icons.tsx          # SVG component library
```
