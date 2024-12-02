import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from 'path';

import formRoutes from './routes/form';
import taskRoutes from './routes/tasks';
import fetchDemoRoutes from './routes/fetchDemo';

import problemDetailsResponseMiddleware from "./middlewares/problem-details-response";
import axios from "axios";
import https from "https";

dotenv.config();

const initServer = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json()); // Add this line to enable JSON parsing in the request body

  app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "./pages/index.html"));
  });

  app.get("/sip", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "./pages/webrtcsip_multi_mics.html"));
  });

  app.get("/nxcctv.html", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "./pages/nxcctv.html"));
  });

  app.get("/hlsplayer.html", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "./pages/hlsplayer.html"));
  });

  app.use(express.static(path.join(__dirname, 'public')));

  app.get("/stream", async (req: Request, res: Response) => {
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    const url = req.query.authenticatedUrl as string;
    const token = req.query.token as string;
    await axios.get(url, {
      httpsAgent: agent,
      headers: {
        "Accept": "video/webm",
        "Content-Type": "video/webm",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Authorization": `Bearer ${token}`
      },
      responseType: "stream"
    })
      .then(response => {
        response.data.pipe(res);
      })
      .catch((error) => {
        if (error?.response?.status === undefined)
          res.status(500).json(error);
        else if (error.response.status === 401)
          res.send("Invalid token");
        else
          res.status(500).json(error);
      });

  });

  app.use('/form', formRoutes);
  app.use('/tasks', taskRoutes);
  app.use('/fetchDemo', fetchDemoRoutes);

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