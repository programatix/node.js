import fastify from 'fastify'
import dotenv from "dotenv";
import path from 'path';
import fs from 'fs';

//import taskRoutes from './routes/tasks';
//import fetchDemoRoutes from './routes/fetchDemo';

dotenv.config();

const app = fastify();
const port = parseInt(<string>process.env.PORT, 10) || 3000;

app.get("/", (req, res) => {
  const stream = fs.createReadStream(path.join(__dirname, "./pages/index.html"));
  res.type('text/html').send(stream);
});

app.register(require('./routes/form'))
//app.use('/tasks', taskRoutes);
//app.use('/fetchDemo', fetchDemoRoutes);

/*
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});*/

const start = async () => {
  try {
    await app.listen({ port: port });
    console.log(`[server]: Server is running at http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
start();