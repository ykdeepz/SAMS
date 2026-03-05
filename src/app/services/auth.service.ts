import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private firebaseService = inject(FirebaseService);
  currentUser = signal<User | null>(null);
  
  constructor(private router: Router) {
    this.initAuthListener();
  }

  private initAuthListener() {
    if (this.isBrowser) {
      onAuthStateChanged(this.firebaseService.auth, async (firebaseUser) => {
        if (firebaseUser) {
          await this.loadUserData(firebaseUser.uid);
        } else {
          // Only clear current user if we don't already have one set
          // (to prevent clearing during account creation flow)
          if (this.currentUser() === null) {
            this.currentUser.set(null);
          }
        }
      });
    }
  }

  private async loadUserData(uid: string) {
    try {
      const userDoc = await getDoc(doc(this.firebaseService.firestore, 'users', uid));
      if (userDoc.exists()) {
        this.currentUser.set(userDoc.data() as User);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseService.auth, 
        email, 
        password
      );
      
      await this.loadUserData(userCredential.user.uid);
      const user = this.currentUser();
      
      if (user) {
        this.redirectByRole(user.role);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async register(email: string, password: string, userData: Partial<User>): Promise<boolean> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseService.auth,
        email,
        password
      );

      const user: User = {
        user_id: userCredential.user.uid,
        email: email,
        role: userData.role || 'student',
        first_name: userData.first_name || '',
        middle_name: userData.middle_name || '',
        last_name: userData.last_name || '',
        full_name: `${userData.first_name} ${userData.last_name}`,
        created_at: new Date().toISOString()
      };

      await setDoc(doc(this.firebaseService.firestore, 'users', userCredential.user.uid), user);
      this.currentUser.set(user);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  async createUserAccount(
    email: string, 
    password: string, 
    userData: Partial<User>,
    additionalData?: { type: 'instructor' | 'student' | 'parent'; data: any }
  ): Promise<{ success: boolean; uid?: string }> {
    try {
      if (!this.firebaseService.secondaryAuth) {
        throw new Error('Secondary auth not available');
      }
      
      // Create new user using secondary auth (won't affect main admin session)
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseService.secondaryAuth,
        email,
        password
      );

      const user: User = {
        user_id: userCredential.user.uid,
        email: email,
        role: userData.role || 'student',
        first_name: userData.first_name || '',
        middle_name: userData.middle_name || '',
        last_name: userData.last_name || '',
        full_name: `${userData.first_name} ${userData.last_name}`,
        created_at: new Date().toISOString()
      };

      await setDoc(doc(this.firebaseService.firestore, 'users', userCredential.user.uid), user);
      
      // If there's additional data (instructor/student/parent profile), create it now
      if (additionalData) {
        const collectionName = additionalData.type === 'instructor' ? 'instructors' :
                               additionalData.type === 'student' ? 'students' : 'parents';
        
        const cleanData = Object.fromEntries(
          Object.entries(additionalData.data).filter(([_, v]) => v !== undefined)
        );
        
        // Set user_id to the created user's uid
        cleanData['user_id'] = userCredential.user.uid;
        
        await setDoc(
          doc(this.firebaseService.firestore, collectionName, userCredential.user.uid), 
          cleanData
        );
      }
      
      // Sign out from secondary auth
      await signOut(this.firebaseService.secondaryAuth);
      
      return { success: true, uid: userCredential.user.uid };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false };
    }
  }

  async logout() {
    try {
      await signOut(this.firebaseService.auth);
      this.currentUser.set(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private redirectByRole(role: string) {
    switch(role) {
      case 'admin':
      case 'instructor':
        this.router.navigate(['/dashboard']);
        break;
      case 'student':
      case 'parent':
        this.router.navigate(['/attendance-records']);
        break;
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }
}
