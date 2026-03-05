# Student Attendance System (SAMS)

**Version 3.0.0** | Firebase Cloud | Production Ready

A comprehensive student attendance management system built with Angular and Firebase, featuring real-time cloud synchronization and role-based access control.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

**Access**: http://localhost:4200  
**Login**: admin@sams.com / admin123

---

## ✨ Key Features

- ✅ **Firebase Integration** - Cloud-based authentication and database
- ✅ **Real-Time Sync** - Instant updates across all devices
- ✅ **Role-Based Access** - Admin, Instructor, Student, Parent roles
- ✅ **Account Management** - Create, edit, delete accounts
- ✅ **Department Management** - Organize instructors by department
- ✅ **Attendance System** - Take attendance with QR codes or manual entry
- ✅ **Modern UI** - Beautiful gradient designs with smooth animations
- ✅ **SweetAlert2** - Beautiful notifications throughout
- ✅ **Secure Authentication** - Firebase Auth with email/password
- ✅ **Reactive State** - Angular signals for real-time updates

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sams.com | admin123 |
| Instructor | (created by admin) | instructor123 |
| Student | (created by instructor) | student123 |
| Parent | (created with student) | parent123 |

**⚠️ Change default passwords after first login**

---

## 🛠️ Technology Stack

- **Frontend**: Angular 21, Tailwind CSS, Lucide Icons
- **Backend**: Firebase (Authentication + Firestore)
- **Database**: Cloud Firestore (NoSQL)
- **State Management**: Angular Signals
- **Notifications**: SweetAlert2
- **Language**: TypeScript

---

## 📁 Project Structure

```
student-attendance-system/
├── src/
│   ├── app/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # Business logic & Firebase
│   │   ├── models/             # Data models
│   │   └── guards/             # Route guards
│   └── environments/           # Firebase configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🔥 Firebase Setup

### Prerequisites
- Firebase project created at https://console.firebase.google.com
- Authentication enabled (Email/Password)
- Firestore Database created
- Security rules configured

### Configuration
Firebase config is located in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

### Security Rules
Firestore rules ensure only authenticated users can access data:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /{collection}/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🎯 System Workflow

1. **Admin** creates instructor accounts and manages departments
2. **Instructor** creates subjects and student accounts
3. **Students** view their subjects and attendance records
4. **Parents** monitor child's attendance (read-only)

---

## 🎨 UI Features

### Modern Design
- Gradient headers with floating animations
- Modern card designs with hover effects
- Smooth transitions and animations
- Enhanced buttons with ripple effects
- Beautiful modals with backdrop blur
- Responsive mobile-friendly layouts
- Consistent orange/amber color scheme

### User Experience
- SweetAlert2 for all notifications
- Auto-closing success messages
- Confirmation dialogs for destructive actions
- Loading states and feedback
- Intuitive navigation
- Touch-optimized for mobile

---

## 🔒 Security Features

- Firebase Authentication
- Role-based route guards
- Permission-based UI elements
- Firestore security rules
- Session management
- Data validation

---

## � Data Collections

### Firestore Collections
- **users** - User accounts with roles
- **instructors** - Instructor profiles
- **students** - Student profiles
- **parents** - Parent profiles
- **subjects** - Course information
- **enrollments** - Student-subject relationships
- **attendance** - Attendance records
- **departments** - Department information

---

## � Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting (Optional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🆘 Troubleshooting

### Common Issues

**Login fails with "Invalid credentials"**
- Verify email and password
- Check Firebase Console > Authentication for user existence
- Ensure user document exists in Firestore > users collection

**Data not loading**
- Check browser console for errors
- Verify Firestore security rules
- Ensure user is authenticated
- Check network tab for blocked requests (ad blockers)

**Ad blocker blocking Firebase**
- Whitelist `firestore.googleapis.com`
- Whitelist `identitytoolkit.googleapis.com`
- Or disable ad blocker for localhost

**Account creation fails**
- Check browser console for errors
- Verify email format is valid
- Ensure email is not already in use
- Check Firebase quota limits

---

## 📝 Recent Updates (v3.0.0)

- ✅ Migrated from JSON Server to Firebase
- ✅ Real-time cloud synchronization
- ✅ Firebase Authentication integration
- ✅ Firestore Database implementation
- ✅ Secondary auth instance for account creation
- ✅ Improved error handling
- ✅ Removed json-server dependencies
- ✅ Updated security architecture

---

## 📄 License

Educational purposes. Free to use and modify.

---

**Built with ❤️ using Angular and Firebase**
