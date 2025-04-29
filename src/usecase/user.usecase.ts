import type { CreateUser, UserRepository } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repositories";

export class UserUseCase {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepositoryPrisma();
	}

	async create({ email, name, password, role }: CreateUser) {
		await this.userRepository.create({ email, name, password, role });
	}
}
