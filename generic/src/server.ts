import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from 'path';

import formRoutes from './routes/form';
import taskRoutes from './routes/tasks';
import fetchDemoRoutes from './routes/fetchDemo';

import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger';

import { TspecDocsMiddleware } from 'tspec';



import problemDetailsResponseMiddleware from "./middlewares/problem-details-response";

dotenv.config();

const initServer = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json()); // Add this line to enable JSON parsing in the request body

  app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "./pages/index.html"));
  });

  app.use('/form', formRoutes);
  app.use('/tasks', taskRoutes);
  app.use('/fetchDemo', fetchDemoRoutes);

  // Serve Swagger documentation
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.use('/docs', await TspecDocsMiddleware());

  app.use(problemDetailsResponseMiddleware);
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}
initServer();