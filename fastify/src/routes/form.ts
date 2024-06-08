import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import path from 'path';
import fs from 'fs';

/*const fastify = Fastify().withTypeProvider<TypeBoxTypeProvider>()

fastify.get("/", (req, res) => {
    const stream = fs.createReadStream(path.join(__dirname, "./pages/form.html"));
    res.type('text/html').send(stream);
});*/

async function routes (fastify:Fastify, options:any) {
    fastify.get('/', async (request, reply) => {
      return { hello: 'world' }
    })
  }

export default fastify;