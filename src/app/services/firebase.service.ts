import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: FirebaseApp;
  private secondaryApp: FirebaseApp | null = null;
  public auth!: Auth;
  public secondaryAuth: Auth | null = null;
  public firestore!: Firestore;
  public analytics: Analytics | null = null;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    this.app = initializeApp(environment.firebase);
    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);
    
    // Create secondary app for user creation without affecting main auth
    if (this.isBrowser) {
      try {
        this.secondaryApp = initializeApp(environment.firebase, 'secondary');
        this.secondaryAuth = getAuth(this.secondaryApp);
        this.analytics = getAnalytics(this.app);
      } catch (error) {
        console.warn('Secondary app or analytics not available:', error);
      }
    }
  }
}
