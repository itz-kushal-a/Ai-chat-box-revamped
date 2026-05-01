import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { APP_NAME, ChatRequest, ChatResponse, Message } from '@ai-chat-box/shared';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: `Welcome to ${APP_NAME} API` });
});

app.post('/api/chat', (req, res) => {
  const { messages }: ChatRequest = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' });
  }

  // Mock AI response logic
  const lastUserMessage = messages[messages.length - 1];
  const botMessage: Message = {
    id: uuidv4(),
    role: 'assistant',
    content: `You said: "${lastUserMessage.content}". This is a mock response from ${APP_NAME}.`,
    timestamp: Date.now(),
  };

  const response: ChatResponse = {
    message: botMessage,
  };

  // Simulate delay
  setTimeout(() => {
    res.json(response);
  }, 1000);
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
