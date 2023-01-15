import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { SoundCloudExtractor } from "./extractors/SoundCloud";

const fastify = Fastify({ logger: true });
const SoundCloud = new SoundCloudExtractor();

fastify.get("/", async (request, reply) => {
  reply.type("application/json")
    .send({ endpoints: ["/soundcloud"] });
})

/**
 * /soundcloud - Get info from a soundcloud url
 * Query Params: url - The url to get info from
 */
type InfoRequest = FastifyRequest<{Querystring: { url?: string }}>;
fastify.get('/soundcloud', async (request: InfoRequest, reply: FastifyReply) => {
    reply.type('application/json')
    if (!request.query.url) return reply.send({ error: 'Required query params - url: string' }).code(500)
    const url: string = request.query.url
    const info = await SoundCloud.get(url)
    if (!info) return reply.send({ error: 'Track not found.', message: "The provided track does not exists." }).code(404)
    reply.send(info.toJSON()).code(200)
    return 
})

fastify.setErrorHandler((error, request, reply) => {
    reply.code(500).type('application/json').send({ error: error.message, message: "The server encountered while processing your request." });
})

fastify.listen(
  {
    port: isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT),
  },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`API server listening on ${address}`);
  }
);
