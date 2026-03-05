import { Injectable, signal, inject } from '@angular/core';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { Student, Subject, Attendance, SubjectEnrollment, Instructor, Parent, User, Department } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firebaseService = inject(FirebaseService);

  students = signal<Student[]>([]);
  subjects = signal<Subject[]>([]);
  attendance = signal<Attendance[]>([]);
  enrollments = signal<SubjectEnrollment[]>([]);
  instructors = signal<Instructor[]>([]);
  parents = signal<Parent[]>([]);
  users = signal<User[]>([]);
  departments = signal<Department[]>([]);

  constructor() {
    this.loadAllData();
  }

  async loadAllData() {
    await Promise.all([
      this.loadStudents(),
      this.loadSubjects(),
      this.loadAttendance(),
      this.loadEnrollments(),
      this.loadInstructors(),
      this.loadParents(),
      this.loadUsers(),
      this.loadDepartments()
    ]);
  }

  // Users
  async loadUsers() {
    try {
      const snapshot = await getDocs(collection(this.firebaseService.firestore, 'users'));
      this.users.set(snapshot.docs.map(doc => doc.data() as User));
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  async addUser(user: User) {
    try {
      // Remove undefined values
      const cleanUser = Object.fromEntries(
        Object.entries(user).filter(([_, v]) => v !== undefined)
      );
      await addDoc(collection(this.firebaseService.firestore, 'users'), cleanUser);
      await this.loadUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async updateUser(user: User) {
    try {
      if (!user.user_id) return;
      await updateDoc(doc(this.firebaseService.firestore, 'users', user.user_id), { ...user });
      await this.loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async deleteUser(userId: string) {
    try {
      await deleteDoc(doc(this.firebaseService.firestore, 'users', userId));
      await this.loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  // Students
  async loadStudents() {
    try {
      const snapshot = await getDocs(collection(this.firebaseService.firestore, 'students'));
      this.students.set(snapshot.docs.map(doc => doc.data() as Student));
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  getStudents() {
    return this.students();
  }

  async addStudent(student: Student) {
    try {
      // Remove undefined values
      const cleanStudent = Object.fromEntries(
        Object.entries(student).filter(([_, v]) => v !== undefined)
      );
      await addDoc(collection(this.firebaseService.firestore, 'students'), cleanStudent);
      await this.loadStudents();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  }

  async updateStudent(student: Student) {
    try {
      if (!student.id) return;
      await updateDoc(doc(this.firebaseService.firestore, 'students', student.id.toString()), { ...student });
      await this.loadStudents();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  }

  async deleteStudent(studentId: string) {
    try {
      await deleteDoc(doc(this.firebaseService.firestore, 'students', studentId));
      await this.loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  }

  // Subjects
  async loadSubjects() {
    try {
      const snapshot = await getDocs(collection(this.firebaseService.firestore, 'subjects'));
      this.subjects.set(snapshot.docs.map(doc => doc.data() as Subject));
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  }

  getSubjects() {
    return this.subjects();
  }

  async addSubject(subject: Subject) {
    try {
      // Remove undefined values
      const cleanSubject = Object.fromEntries(
        Object.entries(subject).filter(([_, v]) => v !== undefined)
      );
      await addDoc(collection(this.firebaseService.firestore, 'subjects'), cleanSubject);
      await this.loadSubjects();
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  }

  async updateSubject(subject: Subject) {
    try {
      if (!subject.id) return;
      await updateDoc(doc(this.firebaseService.firestore, 'subjects', subject.id.toString()), { ...subject });
      await this.loadSubjects();
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  }

  async deleteSubject(id: string) {
    try {
      await deleteDoc(doc(this.firebaseService.firestore, 'subjects', id));
      await this.loadSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  }

  // Attendance
  async loadAttendance() {
    try {
      const snapshot = await getDocs(collection(this.firebaseService.firestore, 'attendance'));
      this.attendance.set(snapshot.docs.map(doc => doc.data() as Attendance));
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  }

  getAttendance() {
    return this.attendance();
  }

  async addAttendance(record: Attendance) {
    try {
      // Remove undefined values
      const cleanRecord = Object.fromEntries(
        Object.entries(record).filter(([_, v]) => v !== undefined)
      );
      await addDoc(collection(this.firebaseService.firestore, 'attendance'), cleanRecord);
      await this.loadAttendance();
    } catch (error) {
      console.error('Error adding attendance:', error);
      throw error;
    }
  }

  // Enrollments
  async loadEnrollments() {
    try {
      const snapshot = await getDocs(collection(this.firebaseService.firestore, 'enrollments'));
      this.enrollments.set(snapshot.docs.map(doc => doc.data() as SubjectEnrollment));
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  }

  getEnrollments() {
    return this.enrollments();
  }

  async enrollStudent(enrollment: SubjectEnrollment) {
    try {
      // Remove undefined values
      const cleanEnrollment = Object.fromEntries(
        Object.entries(enrollment).filter(([_, v]) => v !== undefined)
      );
      await addDoc(collection(this.firebaseService.firestore, 'enrollments'), cleanEnrollment);
      await this.loadEnrollments();
    } catch (error) {
      console.error('Error enrolling student:', error);
    }
  }

  async unenrollStudent(enrollmentId: string) {
    try {
      await deleteDoc(doc(this.firebaseService.firestore, 'enrollments', enrollmentId));
      await this.loadEnrollments();
    } catch (error) {
      console.error('Error unenrolling student:', error);
    }
  }

  // Instructors
  async loadInstructors() {
    try {
      const snapshot = await getDocs(collection(this.firebaseService.firestore, 'instructors'));
      this.instructors.set(snapshot.docs.map(doc => doc.data() as Instructor));
    } catch (error) {
      console.error('Error loading instructors:', error);
    }
  }

  getInstructors() {
    return this.instructors();
  }

  async getInstructorByUserId(userId: string): Promise<Instructor | undefined> {
    try {
      const q = query(collection(this.firebaseService.firestore, 'instructors'), where('user_id', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.empty ? undefined : snapshot.docs[0].data() as Instructor;
    } catch (error) {
      console.error('Error getting instructor:', error);
      return undefined;
    }
  }

  async addInstructor(instructor: Instructor) {
    try {
      // Remove undefined values
      const cleanInstructor = Object.fromEntries(
        Object.entries(instructor).filter(([_, v]) => v !== undefined)
      );
      await addDoc(collection(this.firebaseService.firestore, 'instructors'), cleanInstructor);
      await this.loadInstructors();
    } catch (error) {
      console.error('Error adding instructor:', error);
    }
  }

  async updateInstructor(instructor: Instructor) {
    try {
      if (!instructor.id) return;
      await updateDoc(doc(this.firebaseService.firestore, 'instructors', instructor.id.toString()), { ...instructor });
      await this.loadInstructors();
    } catch (error) {
      console.error('Error updating instructor:', error);
    }
  }

  async deleteInstructor(instructorId: string) {
    try {
      await deleteDoc(doc(this.firebaseService.firestore, 'instructors', instructorId));
      await this.loadInstructors();
    } catch (error) {
      console.error('Error deleting instructor:', error);
    }
  }

  // Parents
  async loadParents() {
    try {
      const snapshot = await getDocs(collection(this.firebaseService.firestore, 'parents'));
      this.parents.set(snapshot.docs.map(doc => doc.data() as Parent));
    } catch (error) {
      console.error('Error loading parents:', error);
    }
  }

  getParents() {
    return this.parents();
  }

  async addParent(parent: Parent) {
    try {
      // Remove undefined values
      const cleanParent = Object.fromEntries(
        Object.entries(parent).filter(([_, v]) => v !== undefined)
      );
      await addDoc(collection(this.firebaseService.firestore, 'parents'), cleanParent);
      await this.loadParents();
    } catch (error) {
      console.error('Error adding parent:', error);
    }
  }

  async updateParent(parent: Parent) {
    try {
      if (!parent.id) return;
      await updateDoc(doc(this.firebaseService.firestore, 'parents', parent.id.toString()), { ...parent });
      await this.loadParents();
    } catch (error) {
      console.error('Error updating parent:', error);
    }
  }

  async deleteParent(parentId: string) {
    try {
      await deleteDoc(doc(this.firebaseService.firestore, 'parents', parentId));
      await this.loadParents();
    } catch (error) {
      console.error('Error deleting parent:', error);
    }
  }

  // Departments
  async loadDepartments() {
    try {
      const snapshot = await getDocs(collection(this.firebaseService.firestore, 'departments'));
      this.departments.set(snapshot.docs.map(doc => doc.data() as Department));
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  }

  getDepartments() {
    return this.departments();
  }

  async addDepartment(department: Department) {
    try {
      // Remove undefined values
      const cleanDepartment = Object.fromEntries(
        Object.entries(department).filter(([_, v]) => v !== undefined)
      );
      await addDoc(collection(this.firebaseService.firestore, 'departments'), cleanDepartment);
      await this.loadDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  }

  async updateDepartment(department: Department) {
    try {
      if (!department.id) return;
      await updateDoc(doc(this.firebaseService.firestore, 'departments', department.id.toString()), { ...department });
      await this.loadDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
    }
  }

  async deleteDepartment(id: number) {
    try {
      await deleteDoc(doc(this.firebaseService.firestore, 'departments', id.toString()));
      await this.loadDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  }
}
