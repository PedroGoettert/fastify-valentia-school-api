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
			role: z.nativeEnum(Role).optional(),
			email: z.string().email().nonempty("Campo obrigatório"),
		});

		try {
			const { email, name, password, role } = userSchema.parse(request.body);

			const finalRole = role ?? Role.USER;

			await userUseCase.create({ email, name, password, role: finalRole });

			return reply.status(201).send({
				message: "Usuário criado com sucesso",
				token: "qualquer coisa", // ajuste conforme necessário
			});
		} catch (err) {
			// Erro de validação do Zod
			if (err instanceof z.ZodError) {
				return reply.status(400).send({
					message: "Erro de validação",
					errors: err.flatten().fieldErrors, // retorna os erros de forma organizada
				});
			}

			// Erro de negócio: usuário já cadastrado
			if (err instanceof Error && err.message === "Usuário já cadastrado") {
				return reply.status(409).send({
					message: err.message,
				});
			}

			// Outros erros inesperados
			console.error("Erro interno:", err);
			return reply.status(500).send({
				message: "Erro interno do servidor",
			});
		}
	});
}
