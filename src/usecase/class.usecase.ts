import type {
	AddStudentsInClass,
	ClassCreate,
	ClassRepository,
	FindClassById,
} from "../interfaces/class.interface";
import { ClassRepositoryPrisma } from "../repositories/class.repositories";

export class ClassUseCase {
	private classRepository: ClassRepository;

	constructor() {
		this.classRepository = new ClassRepositoryPrisma();
	}

	async create({ name, day, hour, maxStudent }: ClassCreate) {
		await this.classRepository.create({
			name,
			hour,
			day,
			maxStudent,
		});
	}

	async addStudentInClass({ classId, studentId }: AddStudentsInClass) {
		await this.classRepository.addStudentsInClass({ classId, studentId });
	}

	async findClassById({ id }: FindClassById) {
		return await this.classRepository.findClassById({ id });
	}

	async findAllClass() {
		return await this.classRepository.findAllClass();
	}

	async deleteUserFromClass({ classId, studentId }: AddStudentsInClass) {
		if (!classId || !studentId) {
			throw new Error("Class ID e Student ID são obrigatórios.");
		}

		await this.classRepository.deleteStudentFromClassById({
			classId,
			studentId,
		});
	}
}
