import { Role } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import z from "zod";
import { UserUseCase } from "../usecase/user.usecase";

export async function UserRoutes(server: FastifyInstance) {
	const userUseCase = new UserUseCase();

	server.post("/user", async (request, reply) => {
		const userSchema = z.object({
			name: z.string().nonempty("Campo obrigatório"),
			password: z.string().nonempty("Campo obrigatório"),
			role: z.nativeEnum(Role),
			email: z.string().email().nonempty("Campo obrigatório"),
		});

		try {
			const { email, name, password, role } = userSchema.parse(request.body);

			await userUseCase.create({ email, name, password, role });

			return reply.status(201).send({
				message: "Usuário criado com sucesso",
				token: "qualquer coisa",
			});
		} catch (err) {
			if (err instanceof Error) {
				throw new Error(err.message);
			}
		}
	});
}
