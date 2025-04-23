import fastify from "fastify";
import { env } from "./env";
import { UserRoutes } from "./routes/students.routes";
import { ClassRoutes } from "./routes/class.routes";
import cors from "@fastify/cors";

const server = fastify();

server.register(cors, {
	methods: ["GET", "PUT", "DELETE", "PATCH"],
	origin: "*",
});
server.register(UserRoutes);
server.register(ClassRoutes);

server.get("/helloworld", async (request, reply) => {
	return reply.status(200).send("Olá mundo");
});

server
	.listen({
		port: env.PORT,
		host: "0.0.0.0",
	})
	.then(() => console.log(`HTTP Server Running in port ${env.PORT}`));
