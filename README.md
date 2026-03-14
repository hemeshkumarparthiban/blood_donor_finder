# 🩸 BloodConnect - Blood Donor Finder

A full-stack web application for finding blood donors and managing blood requests, built with **React**, **Node.js/Express**, and **MySQL**.

---

## 📁 Project Structure

```
blood-donor-finder/
├── backend/
│   ├── config/
│   │   ├── db.js              # MySQL connection pool
│   │   └── schema.sql         # Database schema + seed data
│   ├── controllers/
│   │   ├── authController.js  # Register, login, profile
│   │   ├── donorController.js # Search donors, stats
│   │   ├── requestController.js # Blood requests CRUD
│   │   ├── adminController.js # Admin dashboard & management
│   │   └── campController.js  # Camps, testimonials, donations
│   ├── middleware/
│   │   └── auth.js            # JWT auth middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── donors.js
│   │   ├── requests.js
│   │   ├── admin.js
│   │   └── misc.js
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js      # Responsive sticky navbar
    │   │   ├── Footer.js      # Full footer
    │   │   └── UIComponents.js # Toast, Spinner, DonorCard, etc.
    │   ├── context/
    │   │   └── AuthContext.js # Global auth state
    │   ├── pages/
    │   │   ├── Home.js        # Landing page with hero & stats
    │   │   ├── Login.js       # Login form
    │   │   ├── Register.js    # Multi-step registration
    │   │   ├── Donors.js      # Searchable donor directory
    │   │   ├── Requests.js    # Blood requests board
    │   │   ├── Dashboard.js   # User dashboard
    │   │   ├── AdminPanel.js  # Full admin panel
    │   │   └── OtherPages.js  # Camps & About pages
    │   ├── utils/
    │   │   └── api.js         # All Axios API calls
    │   ├── App.js             # Router setup
    │   ├── index.css          # Global styles & animations
    │   └── index.js           # React entry point
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ 
- **MySQL** 8.0+
- npm or yarn

---

### 1️⃣ Database Setup

Open MySQL and run:
```sql
-- Create the database and tables
source /path/to/backend/config/schema.sql
```

Or paste the SQL from `backend/config/schema.sql` into MySQL Workbench / phpMyAdmin.

---

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
# Edit .env with your MySQL credentials:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=blood_donor_db
# JWT_SECRET=your_secret_key

# Start the server
npm run dev      # development (with nodemon)
# or
npm start        # production
```

Backend runs on: `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on: `http://localhost:3000`

> The `proxy` field in `frontend/package.json` is set to `http://localhost:5000`, so all API calls are automatically forwarded.

---

## 🔐 Default Login Credentials

| Role  | Email                      | Password  |
|-------|----------------------------|-----------|
| Admin | admin@bloodfinder.com      | password  |
| User  | arjun@example.com          | password  |
| User  | priya@example.com          | password  |

---

## 🌐 Pages & Routes

| Route        | Page              | Access       |
|--------------|-------------------|--------------|
| `/`          | Home / Landing    | Public       |
| `/donors`    | Find Donors       | Public       |
| `/requests`  | Blood Requests    | Public (Post: Auth) |
| `/camps`     | Blood Camps       | Public       |
| `/about`     | About             | Public       |
| `/login`     | Login             | Guest only   |
| `/register`  | Register          | Guest only   |
| `/dashboard` | User Dashboard    | Auth         |
| `/admin`     | Admin Panel       | Admin only   |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint             | Description       |
|--------|----------------------|-------------------|
| POST   | /api/auth/register   | Register user     |
| POST   | /api/auth/login      | Login             |
| GET    | /api/auth/me         | Get profile       |
| PUT    | /api/auth/profile    | Update profile    |
| PUT    | /api/auth/change-password | Change password |

### Donors
| Method | Endpoint                  | Description       |
|--------|---------------------------|-------------------|
| GET    | /api/donors               | Search donors     |
| GET    | /api/donors/:id           | Donor detail      |
| GET    | /api/donors/stats/overview | Stats overview  |

### Blood Requests
| Method | Endpoint                  | Description         |
|--------|---------------------------|---------------------|
| GET    | /api/requests             | List requests       |
| POST   | /api/requests             | Create request (Auth)|
| GET    | /api/requests/my          | My requests (Auth)  |
| PUT    | /api/requests/:id/status  | Update status       |
| DELETE | /api/requests/:id         | Delete request      |

### Misc
| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| GET    | /api/camps             | Upcoming camps       |
| GET    | /api/testimonials      | Approved testimonials|
| POST   | /api/testimonials      | Submit testimonial   |
| POST   | /api/donations         | Record donation (Auth)|
| GET    | /api/donations/my      | My donations (Auth)  |

### Admin (Admin only)
| Method | Endpoint                          |
|--------|-----------------------------------|
| GET    | /api/admin/dashboard              |
| GET    | /api/admin/users                  |
| PUT    | /api/admin/users/:id/toggle-status|
| DELETE | /api/admin/users/:id              |
| GET    | /api/admin/requests               |
| GET/POST/DELETE | /api/admin/camps         |
| GET    | /api/admin/testimonials           |
| PUT    | /api/admin/testimonials/:id/approve|

---

## 🎨 Features

### Frontend
- ✅ Stunning dark crimson & gold design theme
- ✅ Fully animated hero section with floating elements
- ✅ Blood compatibility chart (interactive)
- ✅ Quick donor search from home page
- ✅ Multi-step registration form
- ✅ Dark mode login/register screens
- ✅ Responsive sticky navbar with mobile hamburger menu
- ✅ Donor cards with availability status
- ✅ Blood request cards with urgency indicators
- ✅ User dashboard with tabs (Overview / Requests / Donations / Edit Profile)
- ✅ Admin panel with sidebar navigation
- ✅ Toast notifications for all actions
- ✅ Page loading spinners
- ✅ Smooth CSS animations throughout

### Backend
- ✅ JWT authentication (7-day tokens)
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control (user / admin)
- ✅ MySQL connection pooling
- ✅ Full CRUD for all entities
- ✅ Pagination for donors and requests
- ✅ Advanced filtering (blood group, city, urgency)
- ✅ Donation tracking system
- ✅ Blood camp management
- ✅ Testimonial moderation

---

## 🛠 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React 18, React Router v6 |
| Styling   | CSS-in-JS (inline), Custom CSS |
| Fonts     | Playfair Display + DM Sans |
| HTTP      | Axios              |
| Backend   | Node.js + Express  |
| Auth      | JWT + bcryptjs     |
| Database  | MySQL 8 + mysql2   |
| Dev       | nodemon            |

---

## 📝 Notes

- The default admin password in the seed SQL is hashed as `password` (using bcrypt $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`)
- For production, update `JWT_SECRET` in `.env` to a strong random string
- Enable HTTPS in production and update CORS origins in `server.js`
