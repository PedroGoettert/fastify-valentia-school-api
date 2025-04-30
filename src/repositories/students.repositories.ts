import type {
  Student,
  StudentById,
  StudentCreate,
  StudentUpdate,
  StudentsRepository,
} from "../interfaces/student.interface";
import { prismaClient } from "../utils/prisma";

export class StudentsRepositoryPrisma implements StudentsRepository {
  async create({ email, name }: StudentCreate): Promise<Student> {
    return await prismaClient.student.create({
      data: {
        email,
        name,
      },
    });
  }

  async deleteUserById({ id }: StudentById): Promise<Student> {
    try {
      const student = await prismaClient.student.findUnique({
        where: { id },
      });

      if (!student) {
        throw new Error("Aluno não encontrado");
      }

      const deleteUser = await prismaClient.student.delete({
        where: { id },
      });

      return deleteUser;
    } catch (err) {
      if (err instanceof Error && err.message === "Aluno não encontrado") {
        throw err;
      }

      throw new Error("Erro do servidor");
    }
  }

  async updateStudentById({
    id,
    email,
    name,
  }: StudentUpdate): Promise<Student> {
    try {
      const student = await prismaClient.student.findUnique({
        where: {
          id,
        },
      });

      if (!student) {
        throw new Error("Aluno não encontrado");
      }

      const updateStudent = await prismaClient.student.update({
        where: {
          id,
        },
        data: {
          email,
          name,
        },
      });

      return updateStudent;
    } catch (err) {
      if (err instanceof Error && err.message === "Aluno não encontrado") {
        throw err;
      }
      throw new Error("Erro do servidor");
    }
  }

  async findAllStudents(): Promise<Student[]> {
    try {
      const students = await prismaClient.student.findMany({
        include: {
          classUser: true,
        },
      });

      if (!students) {
        throw new Error("Nenhum aluno encontrada");
      }

      return students;
    } catch (err) {
      throw new Error("Erro no servidor");
    }
  }
}
