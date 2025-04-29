import { z } from "zod";
import type {
	CreateUser,
	FindUserByEmail,
	PublicUser,
	UserRepository,
} from "../interfaces/user.interface";
import { prismaClient } from "../utils/prisma";
import {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";

export class UserRepositoryPrisma implements UserRepository {
	async create({
		email,
		name,
		role,
		password,
	}: CreateUser): Promise<PublicUser> {
		try {
			const user = await prismaClient.user.findUnique({
				where: {
					email,
				},
			});

			if (user) {
				throw new Error("Usuário já cadastrado");
			}

			return await prismaClient.user.create({
				data: {
					email,
					name,
					password,
					role,
				},
			});
		} catch (err) {
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new Error(err.message);
			}

			if (err instanceof PrismaClientKnownRequestError) {
				throw new Error(err.message);
			}

			throw new Error("Erro interno do servidor");
		}
	}

	async findUserByEmail({ email }: FindUserByEmail): Promise<PublicUser> {
		try {
			const user = await prismaClient.user.findUnique({
				where: { email },
			});

			if (!user) {
				throw new Error("Usuário não encontrado");
			}

			return user;
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				console.log(err);
				throw new Error(err.message);
			}

			if (err instanceof PrismaClientUnknownRequestError) {
				console.log(err);
				throw new Error(err.message);
			}

			throw new Error("Erro do servidor");
		}
	}
}
