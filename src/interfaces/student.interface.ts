export interface Student {
  id: string;
  name: string;
  email: string;
}

export interface StudentCreate {
  name: string;
  email: string;
}

export interface StudentById {
  id: string;
}

export interface StudentUpdate {
  id: string;
  name?: string;
  email?: string;
}

export interface StudentsRepository {
  create({ email, name }: StudentCreate): Promise<Student>;
  deleteUserById({ id }: StudentById): Promise<Student>;
  updateStudentById({ id, email, name }: StudentUpdate): Promise<Student>;
  findAllStudents(): Promise<Student[]>;
}
