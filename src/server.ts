import fastify from "fastify";
import { env } from "./env";
import { StudentsRoutes } from "./routes/students.routes";
import { ClassRoutes } from "./routes/class.routes";
import cors from "@fastify/cors";
import { UpdateRoboot } from "./routes/updateRobot";
import { UserRoutes } from "./routes/user.routes";

const server = fastify();

server.register(cors, {
	methods: ["GET", "PUT", "DELETE", "PATCH"],
	origin: "*",
});
server.register(StudentsRoutes);
server.register(ClassRoutes);
server.register(UserRoutes);

server.get("/helloworld", async (request, reply) => {
	return reply.status(200).send("Olá mundo");
});

server.register(UpdateRoboot);

server
	.listen({
		port: env.PORT,
		host: "0.0.0.0",
	})
	.then(() => console.log(`HTTP Server Running in port ${env.PORT}`));
