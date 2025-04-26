import type { FastifyInstance } from "fastify";
import { StudentsUseCase } from "../usecase/students.usecase";
import { z, ZodError } from "zod";

const studentsUseCase = new StudentsUseCase();

export async function UserRoutes(server: FastifyInstance) {
	server.post("/students", async (request, reply) => {
		const studentsSchema = z.object({
			name: z.string(),
			email: z.string().toLowerCase().email(),
		});

		try {
			const { email, name } = studentsSchema.parse(request.body);
			await studentsUseCase.create({ email, name });

			return reply.status(201).send("Usuário criado com sucesso");
		} catch (err) {
			throw new Error("Erro no servidor");
		}
	});

	server.get("/students", async (request, reply) => {
		try {
			const students = await studentsUseCase.findAllStudents();
			return reply.status(200).send(students);
		} catch (err) {
			throw new Error("Erro do servidor");
		}
	});

	server.delete("/students/:id", async (request, reply) => {
		const studentSchema = z.object({
			id: z.string(),
		});

		try {
			const { id } = studentSchema.parse(request.params);

			await studentsUseCase.delete({ id });

			return reply.status(204).send();
		} catch (err) {
			if (err instanceof Error) {
				if (err.message === "Aluno não encontrado") {
					return reply.status(404).send({ message: err.message });
				}
			}

			return reply.status(500).send({ message: "Erro do servidor" });
		}
	});

	server.put("/students/:id", async (request, reply) => {
		const studentSchema = z.object({
			id: z.string(),
			name: z.string().optional(),
			email: z.string().email("Insira um email válido").optional(),
		});

		try {
			const { id, name, email } = studentSchema.parse(request.params);

			const updatedStudent = await studentsUseCase.update({ id, name, email });
			return reply.status(200).send({
				message: "Dados atualizados com sucesso",
				student: updatedStudent,
			});
		} catch (err) {
			if (err instanceof Error && err.message === "Aluno não encontrado") {
				throw err;
			}

			if (err instanceof ZodError) {
				return reply.status(400).send({
					message: "Erro de validação de dados",
					errors: err.message,
				});
			}

			throw new Error("Erro do servidor");
		}
	});
}
