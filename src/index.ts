import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { test } from './routes/test';
import process from 'process';
// import winston from 'winston';
// import { LoggingWinston } from '@google-cloud/logging-winston';

import { Knex, knex } from 'knex';
import { createPoolAndEnsureSchema, getVoteCount, getVotes, insertVote } from './database/db';
import { createPool } from '../src/utils/dbpool';
// import { logger } from './utils/logger';
// import { db1 } from './routes/db1';
// import { db2 } from './routes/db2';
// import { Pool1, Pool2 } from './database/db';

const app = express();

app.set('view engine', 'pug');
app.enable('trust proxy');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

app.get('/api/version', (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    version: process.env.VERSION,
    db: {
      name1: process.env.CLOUD_SQL_CONNECTION_NAME1,
      name2: process.env.CLOUD_SQL_CONNECTION_NAME2,
    },
    // pool: { pool1: Pool1(), pool2: Pool2() },
  });
});

app.get('/api/host', (req, res) => {
  const host = req.get('host');
  res.json({ host });
});

app.use('/api', test);
// app.use(db1);
// app.use(db2);

app.listen(process.env.PORT, () => {
  console.log(new Date(), `env: ${process.env.NODE_ENV}`);
  console.log(new Date(), `version: ${process.env.VERSION}`);
  console.log(new Date(), `server listening on ${process.env.PORT}`);
});
