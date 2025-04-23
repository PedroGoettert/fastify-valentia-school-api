import { StudentsRepositoryPrisma } from "../repositories/students.repositories";
import type {
	StudentById,
	StudentCreate,
	StudentsRepository,
	StudentUpdate,
} from "../interfaces/student.interface";

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
