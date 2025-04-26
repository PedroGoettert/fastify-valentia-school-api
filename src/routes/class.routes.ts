import type { FastifyInstance } from "fastify";
import { ClassUseCase } from "../usecase/class.usecase";
import { z } from "zod";

const classUseCase = new ClassUseCase();

export async function ClassRoutes(server: FastifyInstance) {
	server.post("/class", async (request, reply) => {
		const classSchema = z.object({
			name: z.string(),
			day: z.string(),
			hour: z.string(),
			maxStudent: z.number(),
		});

		try {
			const { name, day, hour, maxStudent } = classSchema.parse(request.body);

			await classUseCase.create({ name, day, hour, maxStudent });
			return reply.status(201).send("Turma criada com sucesso");
		} catch (err) {
			throw new Error("erro do servidor");
		}
	});

	server.get("/class", async (request, reply) => {
		const classData = await classUseCase.findAllClass();
		return reply.status(200).send(classData);
	});

	server.post("/add", async (request, reply) => {
		const studentClassSchema = z.object({
			classId: z.string(),
			studentId: z.string(),
		});

		try {
			const { classId, studentId } = studentClassSchema.parse(request.body);

			await classUseCase.addStudentInClass({ classId, studentId });
		} catch (err) {
			throw new Error("Erro do servidor");
		}
	});

	server.get("/class/:id", async (request, reply) => {
		const classSchema = z.object({
			id: z.string(),
		});

		try {
			const { id } = classSchema.parse(request.params);
			const classData = await classUseCase.findClassById({ id });

			return reply.status(200).send(classData);
		} catch (err) {
			throw new Error("Erro do servidor");
		}
	});

	server.delete("/class/student", async (request, reply) => {
		try {
			const { classId, studentId } = request.body as {
				classId: string;
				studentId: string;
			};

			await classUseCase.deleteUserFromClass({
				classId,
				studentId,
			});

			return reply
				.status(200)
				.send({ message: "Aluno removido da turma com sucesso." });
		} catch (err) {
			console.error(err);
			return reply.status(400).send({ error: err.message });
		}
	});
}
