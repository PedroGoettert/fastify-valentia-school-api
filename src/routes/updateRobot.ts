import type { FastifyInstance } from "fastify";

export async function UpdateRoboot(server: FastifyInstance) {
  server.get("/ping", async (request, reply) => {
    return reply.status(200).send();
  });
}
