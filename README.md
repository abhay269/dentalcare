# 🦷 DentalCare – Dental Management System

A complete, production-ready full-stack dental clinic management system built with React.js, Node.js, Express.js, and MongoDB.

---

## ✨ Features

### Admin / Receptionist
- Dashboard with live statistics and charts
- Complete Patient CRUD (Add, Edit, View, Delete, Search, Filter, Paginate)
- Dentist management with user account creation
- Appointment booking, rescheduling, and status management
- Treatment records management
- Digital prescriptions with multi-medicine support + print
- Invoice and billing management with ₹ INR support
- Mark invoices as Paid with payment method
- Print invoices
- Reports & Analytics with Recharts
- Clinic settings and profile management

### Dentist
- Personal dashboard with today's schedule
- View and manage assigned appointments
- View patient list and medical history
- Create treatment records
- Create and print digital prescriptions

### Patient
- Personal health dashboard
- Book appointments with available time slot selection
- Cancel appointments
- View treatment history
- View and print prescriptions
- View billing and payment status
- Edit profile

---

## 🏗️ Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | React.js 18, Vite              |
| Styling     | Tailwind CSS 3                 |
| Charts      | Recharts                       |
| Routing     | React Router v6                |
| HTTP Client | Axios                          |
| Backend     | Node.js, Express.js            |
| Database    | MongoDB + Mongoose             |
| Auth        | JWT + bcryptjs                 |
| Date Utils  | date-fns                       |
| Icons       | @heroicons/react               |
| Toasts      | react-hot-toast                |

---

## 📁 Folder Structure

```
dentalcare/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── dentistController.js
│   │   ├── appointmentController.js
│   │   ├── treatmentController.js
│   │   ├── prescriptionController.js
│   │   ├── invoiceController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── auth.js                # JWT protect + role authorize
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Dentist.js
│   │   ├── Appointment.js
│   │   ├── Treatment.js
│   │   ├── Prescription.js
│   │   └── Invoice.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── dentists.js
│   │   ├── appointments.js
│   │   ├── treatments.js
│   │   ├── prescriptions.js
│   │   ├── invoices.js
│   │   └── dashboard.js
│   ├── seeds/
│   │   └── seed.js                # Demo data seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js           # Configured Axios instance
    │   ├── components/
    │   │   └── common/
    │   │       ├── AdminLayout.jsx  # Sidebar + Navbar
    │   │       ├── StatCard.jsx
    │   │       ├── StatusBadge.jsx
    │   │       ├── Modal.jsx
    │   │       ├── ConfirmDialog.jsx
    │   │       ├── LoadingSpinner.jsx
    │   │       ├── EmptyState.jsx
    │   │       └── Pagination.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── auth/     Login.jsx, Register.jsx
    │   │   ├── admin/    Dashboard, Patients, Dentists, Appointments...
    │   │   ├── dentist/  Dashboard, Appointments, Patients...
    │   │   └── patient/  Dashboard, Profile, BookAppointment...
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` folder (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dentalcare
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js >= 16
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone / Extract the project
```bash
cd dentalcare
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed Demo Data
```bash
npm run seed
```
This creates demo users, dentists, patients, appointments, treatments, and invoices.

### 4. Start Backend
```bash
npm run dev      # Development (nodemon)
npm start        # Production
```
Backend runs on http://localhost:5000

### 5. Frontend Setup
```bash
cd ../frontend
npm install
```

### 6. Start Frontend
```bash
npm run dev
```
Frontend runs on http://localhost:5173

---

## 👥 User Roles & Demo Credentials

| Role                | Email                    | Password     |
|---------------------|--------------------------|--------------|
| Admin/Receptionist  | admin@dentalcare.com     | Admin@123    |
| Dentist             | priya@dentalcare.com     | Doctor@123   |
| Dentist             | rahul@dentalcare.com     | Doctor@123   |
| Patient             | arjun@example.com        | Patient@123  |
| Patient             | sneha@example.com        | Patient@123  |

---

## 🔌 API Overview

| Method | Endpoint                          | Description                   | Auth      |
|--------|-----------------------------------|-------------------------------|-----------|
| POST   | /api/auth/register                | Register user                 | Public    |
| POST   | /api/auth/login                   | Login                         | Public    |
| GET    | /api/auth/me                      | Current user                  | Required  |
| GET    | /api/patients                     | List patients                 | Admin/Doc |
| POST   | /api/patients                     | Create patient                | Admin     |
| PUT    | /api/patients/:id                 | Update patient                | Admin     |
| DELETE | /api/patients/:id                 | Delete patient                | Admin     |
| GET    | /api/dentists                     | List dentists                 | All       |
| POST   | /api/dentists                     | Create dentist                | Admin     |
| GET    | /api/appointments                 | List appointments             | All       |
| POST   | /api/appointments                 | Book appointment              | All       |
| GET    | /api/appointments/slots           | Available time slots          | All       |
| PUT    | /api/appointments/:id             | Update appointment            | All       |
| GET    | /api/treatments                   | List treatments               | All       |
| POST   | /api/treatments                   | Add treatment                 | Admin/Doc |
| GET    | /api/prescriptions                | List prescriptions            | All       |
| POST   | /api/prescriptions                | Create prescription           | Admin/Doc |
| GET    | /api/invoices                     | List invoices                 | Admin/Pat |
| POST   | /api/invoices                     | Create invoice                | Admin     |
| PUT    | /api/invoices/:id/pay             | Mark invoice as paid          | Admin     |
| GET    | /api/dashboard/admin              | Admin dashboard stats         | Admin     |
| GET    | /api/dashboard/dentist            | Dentist dashboard stats       | Dentist   |
| GET    | /api/dashboard/patient            | Patient dashboard stats       | Patient   |

---

## 🔐 Security

- Passwords are hashed with bcryptjs (salt rounds: 10)
- JWT tokens expire in 7 days
- Role-based authorization on every protected route
- Tokens stored in localStorage; auto-cleared on 401 responses
- Passwords never returned in API responses

---

## 📊 Database Models

| Model        | Key Fields                                              |
|--------------|---------------------------------------------------------|
| User         | name, email, password (hashed), role, linkedId         |
| Patient      | patientId, name, dob, gender, bloodGroup, allergies    |
| Dentist      | name, specialization, experience, availability          |
| Appointment  | patient, dentist, date, timeSlot, status               |
| Treatment    | patient, dentist, diagnosis, treatmentType, cost       |
| Prescription | patient, dentist, diagnosis, medicines[]               |
| Invoice      | patient, items[], subtotal, discount, total, status    |

---

## 🧪 Testing Instructions

1. Run `npm run seed` to populate demo data
2. Login as Admin → explore Dashboard, Patients, Appointments, Billing
3. Login as Dentist → view today's schedule, add treatments, write prescriptions
4. Login as Patient → book appointment, view prescriptions, check bills
5. Test complete workflow: Admin creates patient → Books appointment → Dentist adds treatment → Creates prescription → Admin creates invoice → Marks as paid

---

## 🎨 Design System

| Token        | Value      |
|--------------|------------|
| Primary Blue | #2563EB    |
| Teal Accent  | #0EA5A4    |
| Success      | #16A34A    |
| Warning      | #F59E0B    |
| Danger       | #DC2626    |
| Text Dark    | #1E293B    |
| Text Gray    | #64748B    |
| Font         | Inter      |

---

## 📝 B.Tech Project Notes

This project demonstrates:
- **Software Engineering**: MVC architecture, separation of concerns, modular codebase
- **Problem Solving**: Real-world clinic workflow with connected modules
- **Documentation**: Comprehensive README, code comments, env variables
- **Innovation**: Role-based access, real-time slot availability, printable documents
- **Full-stack integration**: React ↔ Express ↔ MongoDB complete data flow

---

Built with ❤️ for B.Tech Computer Science Final Year Project
