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

			console.log(user);

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
				// Verifica o código de erro específico
				if (err.code === "P2002") {
					// P2002 é erro de violação de chave única, como no caso do email já existente
					console.error("Email já registrado:", err);
					throw new Error("Este email já está registrado.");
				}
				if (err.code === "P2003") {
					// P2003 é erro de violação de chave estrangeira
					console.error("Erro de chave estrangeira:", err);
					throw new Error("Referência a dados inválidos.");
				}

				// Outros erros conhecidos podem ser tratados aqui, se necessário
				console.error("Erro conhecido da requisição Prisma:", err);
				throw new Error("Erro ao processar a requisição.");
			}

			throw err;
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
