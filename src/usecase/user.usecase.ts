import { env } from "../env";
import type {
	CreateUser,
	LoginUser,
	UserRepository,
} from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repositories";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UserUseCase {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepositoryPrisma();
	}

	async create({ email, name, password, role }: CreateUser) {
		const passwordHash = await bcrypt.hash(password, 10);

		await this.userRepository.create({
			email,
			name,
			password: passwordHash,
			role,
		});
	}

	async login({ email, password }: LoginUser) {
		const user = await this.userRepository.findUserByEmail({ email });

		if (!user) {
			throw new Error("Usuário não encontrado");
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw new Error("Senha inválida");
		}

		const tokenPayLoad = {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};

		const token = jwt.sign(tokenPayLoad, env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const { password: _, ...publicUser } = user;
		return {
			user: publicUser,
			token,
		};
	}
}
