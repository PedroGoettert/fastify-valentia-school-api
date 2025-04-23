import type { ClassUser } from "@prisma/client";

export interface Class {
	id: string;
	name: string;
	hour: string | null; // Aceita string ou null
	day: string | null; // Aceita string ou null

	classUser?: ClassUser[];
}

export interface ClassCreate {
	name: string;
	hour: string;
	day: string;
	maxStudent: number;
}

export interface AddStudentsInClass {
	classId: string;
	studentId: string;
}

export interface FindClassById {
	id: string;
}

export interface ClassRepository {
	create(data: ClassCreate): Promise<Class>;
	addStudentsInClass(data: AddStudentsInClass): Promise<void>;
	findClassById(data: FindClassById): Promise<Class | null>;
	findAllClass(): Promise<Class[]>;
	deleteStudentFromClassById(data: AddStudentsInClass): Promise<void>;
}
