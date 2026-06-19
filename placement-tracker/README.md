# Placement Tracker – Job Application Management System

A MERN stack application to help students track placement applications, interview progress, and final outcomes.

## Current Status

✅ **Backend: Complete**
⏳ **Frontend: Not yet built** (coming in the next step — React + Vite + Tailwind CSS)

---

## Backend Setup Instructions

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**

   Open `backend/.env` and replace the placeholder values:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/placement-tracker?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```
   - Get your `MONGO_URI` from MongoDB Atlas (Database → Connect → Drivers).
   - Generate a strong `JWT_SECRET`, e.g. run: `openssl rand -base64 32`

3. **Run the server**
   ```bash
   npm run dev      # using nodemon (auto-restarts on file changes)
   # or
   npm start        # plain node
   ```

4. **Verify it's running**

   Visit `http://localhost:5000/` in your browser or run:
   ```bash
   curl http://localhost:5000/
   ```
   You should see: `{"message":"Placement Tracker API is running 🚀"}`

---

## Backend Folder Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB Atlas connection logic
├── models/
│   ├── User.js                # User schema (name, email, password) + bcrypt hashing
│   └── Application.js         # Job application schema (company, role, date, status)
├── middleware/
│   └── authMiddleware.js      # JWT verification — protects private routes
├── controllers/
│   ├── authController.js      # register, login, getMe logic
│   └── applicationController.js  # CRUD + dashboard stats + search/filter logic
├── routes/
│   ├── authRoutes.js          # /api/auth/* endpoints
│   └── applicationRoutes.js   # /api/applications/* endpoints
├── server.js                  # Express app entry point
├── .env                       # Environment variables (fill in your own values)
├── .env.example                # Template showing required env vars
└── package.json
```

## API Endpoints (Backend)

### Auth (`/api/auth`)
| Method | Endpoint         | Access  | Description                  |
|--------|------------------|---------|-------------------------------|
| POST   | `/register`      | Public  | Register a new user           |
| POST   | `/login`          | Public  | Login and receive a JWT       |
| GET    | `/me`             | Private | Get logged-in user's profile  |

### Applications (`/api/applications`) — all require `Authorization: Bearer <token>`
| Method | Endpoint               | Description                                  |
|--------|------------------------|-----------------------------------------------|
| GET    | `/`                     | Get all applications (supports `?search=` & `?status=`) |
| POST   | `/`                     | Create a new application                      |
| GET    | `/:id`                  | Get a single application                       |
| PUT    | `/:id`                  | Update an application                          |
| DELETE | `/:id`                  | Delete an application                           |
| GET    | `/stats/dashboard`     | Get total / selected / rejected / pending counts |

---

## Next Steps

1. Set up your MongoDB Atlas cluster and plug the connection string into `.env`.
2. Test the backend endpoints using Postman (collection will be provided).
3. Build the frontend (React + Vite + Tailwind CSS) and connect it to this API.
4. Deploy backend + frontend to Render.
