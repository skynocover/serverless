import express, { Request, Response, NextFunction } from 'express';

const routes = express.Router();

// redirect
routes.get('/redirect', async (req, res) => {
  res.status(200).json({ errorCode: 0 });
});

export { routes as test };
