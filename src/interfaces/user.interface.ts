import type { Role } from "@prisma/client";

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  role: Role;
  updatedAt: Date | null;
  createdAt: Date | null;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  role: Role;
  updatedAt: Date | null;
  createdAt: Date | null;
}

export interface CreateUser {
  name: string;
  email: string;
  role: Role;
  password: string;
}

export interface FindUserByEmail {
  email: string;
}

export interface UserRepository {
  create({ email, name, role, password }: CreateUser): Promise<PublicUser>;
  findUserByEmail({ email }: FindUserByEmail): Promise<PublicUser>;
}
