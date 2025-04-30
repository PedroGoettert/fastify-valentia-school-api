import type {
  StudentById,
  StudentCreate,
  StudentUpdate,
  StudentsRepository,
} from "../interfaces/student.interface";
import { StudentsRepositoryPrisma } from "../repositories/students.repositories";

export class StudentsUseCase {
  private studentsRepository: StudentsRepository;

  constructor() {
    this.studentsRepository = new StudentsRepositoryPrisma();
  }

  async create({ email, name }: StudentCreate) {
    this.studentsRepository.create({ email, name });
  }

  async delete({ id }: StudentById) {
    await this.studentsRepository.deleteUserById({ id });
  }

  async update({ email, id, name }: StudentUpdate) {
    await this.studentsRepository.updateStudentById({ email, id, name });
  }

  async findAllStudents() {
    return await this.studentsRepository.findAllStudents();
  }
}
