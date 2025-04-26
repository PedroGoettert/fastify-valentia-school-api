import {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";
import type {
	AddStudentsInClass,
	Class,
	ClassCreate,
	ClassRepository,
	FindClassById,
} from "../interfaces/class.interface";
import { prismaClient } from "../utils/prisma";

export class ClassRepositoryPrisma implements ClassRepository {
	async create({ name, day, hour, maxStudent }: ClassCreate): Promise<Class> {
		try {
			return await prismaClient.class.create({
				data: {
					name,
					day,
					hour,
					maxStudent,
				},
			});
		} catch (err) {
			throw new Error("Erro do servidor");
		}
	}

	async addStudentsInClass({
		classId,
		studentId,
	}: AddStudentsInClass): Promise<void> {
		try {
			await prismaClient.classUser.create({
				data: {
					classId,
					studentId,
				},
			});
		} catch (err) {
			throw new Error("Erro do servidor");
		}
	}

	async findClassById({ id }: FindClassById): Promise<Class | null> {
		try {
			return await prismaClient.class.findUnique({
				where: {
					id,
				},
				include: {
					classUser: { include: { Student: true } },
				},
			});
		} catch (err) {
			throw new Error("Erro do servidor");
		}
	}

	async findAllClass(): Promise<Class[]> {
		try {
			const classData = await prismaClient.class.findMany({
				include: {
					classUser: { include: { Student: true } },
				},
			});

			if (!classData) {
				throw new Error("Nenhuma turma encontrada");
			}

			return classData;
		} catch (err) {
			throw new Error("Erro interno do servidor");
		}
	}

	async deleteStudentFromClassById({
		classId,
		studentId,
	}: AddStudentsInClass): Promise<void> {
		try {
			await prismaClient.classUser.delete({
				where: {
					studentId_classId: {
						classId,
						studentId,
					},
				},
			});
		} catch (err: unknown) {
			// Erro específico de banco de dados
			if (err instanceof PrismaClientKnownRequestError) {
				console.error("Erro de banco de dados:", err.message, err.code);
				throw new Error(
					"Erro ao remover aluno da turma. Verifique os dados e tente novamente.",
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				console.error("Erro desconhecido do banco de dados:", err.message);
				throw new Error("Erro inesperado ao acessar o banco de dados.");
			}

			console.error("Erro desconhecido:", err);
			throw new Error("Erro ao remover aluno da turma.");
		}
	}
}
