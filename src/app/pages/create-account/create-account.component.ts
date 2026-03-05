import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { InstructorFormComponent } from './instructor-form/instructor-form.component';
import { StudentFormComponent, StudentFormData } from './student-form/student-form.component';
import { Instructor } from '../../models/user.model';
import { LucideAngularModule, CheckCircle2, AlertCircle, X, UserCircle, GraduationCap } from 'lucide-angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, InstructorFormComponent, StudentFormComponent, LucideAngularModule],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  
  // Lucide icons
  readonly CheckCircle2 = CheckCircle2;
  readonly AlertCircle = AlertCircle;
  readonly X = X;
  readonly UserCircle = UserCircle;
  readonly GraduationCap = GraduationCap;
  
  activeTab = signal<'instructor' | 'student'>('instructor');
  
  // Role permissions
  canCreateInstructor = this.roleService.isAdmin;
  canCreateStudent = this.roleService.canCreateAccounts;

  constructor() {
    // Set default tab based on role
    if (!this.canCreateInstructor() && this.canCreateStudent()) {
      this.activeTab.set('student');
    }
  }

  setActiveTab(tab: 'instructor' | 'student') {
    this.activeTab.set(tab);
  }

  async onInstructorSubmit(instructor: Instructor) {
    try {
      // Prepare instructor data
      const instructorData = {
        ...instructor,
        user_id: '', // Will be set by auth service
        created_at: new Date().toISOString()
      };
      
      // Create Firebase Auth account, user document, and instructor profile all at once
      const result = await this.authService.createUserAccount(
        instructor.email,
        'instructor123',
        {
          role: 'instructor',
          first_name: instructor.first_name,
          middle_name: instructor.middle_name,
          last_name: instructor.last_name
        },
        {
          type: 'instructor',
          data: instructorData
        }
      );
      
      if (!result.success || !result.uid) {
        throw new Error('Failed to create auth account');
      }
      
      // Reload data to show the new instructor
      await this.dataService.loadInstructors();
      await this.dataService.loadUsers();
      
      await Swal.fire({
        title: 'Success!',
        html: 'Instructor account created successfully!<br><strong>Default password:</strong> instructor123',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error creating instructor:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to create instructor account. Please try again.',
        icon: 'error'
      });
    }
  }

  async onStudentSubmit(data: StudentFormData) {
    try {
      // Prepare student data
      const studentData = {
        ...data.student,
        user_id: '',
        created_at: new Date().toISOString()
      };
      
      // Create student account with profile
      const studentResult = await this.authService.createUserAccount(
        data.student.email,
        'student123',
        {
          role: 'student',
          first_name: data.student.first_name,
          middle_name: data.student.middle_name,
          last_name: data.student.last_name
        },
        {
          type: 'student',
          data: studentData
        }
      );
      
      if (!studentResult.success || !studentResult.uid) {
        throw new Error('Failed to create student auth account');
      }
      
      // Prepare parent data
      const parentData = {
        ...data.parent,
        user_id: '',
        created_at: new Date().toISOString()
      };
      
      // Create parent account with profile
      const parentResult = await this.authService.createUserAccount(
        data.parent.email,
        'parent123',
        {
          role: 'parent',
          first_name: data.parent.first_name,
          middle_name: data.parent.middle_name,
          last_name: data.parent.last_name
        },
        {
          type: 'parent',
          data: parentData
        }
      );
      
      if (!parentResult.success || !parentResult.uid) {
        throw new Error('Failed to create parent auth account');
      }
      
      // Reload data to show the new accounts
      await this.dataService.loadStudents();
      await this.dataService.loadParents();
      await this.dataService.loadUsers();
      
      await Swal.fire({
        title: 'Success!',
        html: 'Student and parent accounts created!<br><strong>Default passwords:</strong> student123 / parent123',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error creating student:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to create student account. Please try again.',
        icon: 'error'
      });
    }
  }
}
