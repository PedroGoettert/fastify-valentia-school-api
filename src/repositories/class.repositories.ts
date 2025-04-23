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
		} catch (err) {
			console.error("Erro ao deletar o aluno da turma:", err);
			throw new Error("Erro ao remover aluno da turma.");
		}
	}
}
