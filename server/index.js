import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import stylesRouter from './routes/styles.js';
import storyRouter from './routes/story.js';
import renderRouter from './routes/render.js';
import audioRouter from './routes/audio.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/styles', stylesRouter);
app.use('/api/story', storyRouter);
app.use('/api/render', renderRouter);
app.use('/api/audio', audioRouter);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', studio: 'Lemo-Opuscar Web Studio', timestamp: new Date().toISOString() });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('[WS] Client connected to live studio pipeline');
  ws.send(JSON.stringify({ type: 'connected', message: 'Connected to Lemo-Opuscar Studio Stream' }));

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (e) { }
  });
});

export function broadcastLog(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'log', data }));
    }
  });
}

server.listen(port, () => {
  console.log(`[Lemo-Opuscar Studio Backend] Running on http://localhost:${port}`);
});
