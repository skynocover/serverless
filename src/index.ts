import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/version', (req, res) => {
  res.json({ env: process.env.NODE_ENV, version: process.env.VERSION });
});

app.listen(process.env.PORT, () => {
  console.log(new Date(), `env: ${process.env.NODE_ENV}`);
  console.log(new Date(), `version: ${process.env.VERSION}`);
  console.log(new Date(), `server listening on ${process.env.PORT}`);
});
