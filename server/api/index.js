import { createApp } from '../src/app.js';

const app = createApp();

export default function handler(req, res) {
  res.setHeader('x-seen-path', req.url);
  return app(req, res);
}
