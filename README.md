# 🔶 HN Stories — MERN Stack Web Application

A full-stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js) that scrapes the top stories from [Hacker News](https://news.ycombinator.com), displays them with sorting and pagination, and allows authenticated users to bookmark their favourite stories.

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Setup & Installation](#setup--installation)
- [Running the Project Locally](#running-the-project-locally)
- [API Endpoints](#api-endpoints)
- [Bonus Features](#bonus-features)
- [Screenshots](#screenshots)

---

## ✨ Features

### Backend
- **Web Scraper** — Automatically scrapes the top 10 stories from Hacker News on every server start using `axios` and `cheerio`
- **Manual Scrape Trigger** — Re-scrape anytime via `POST /api/scrape`
- **JWT Authentication** — Secure register and login with hashed passwords using `bcryptjs`
- **Story APIs** — Fetch all stories sorted by points, fetch a single story by ID
- **Bookmark Toggle** — Authenticated users can bookmark and un-bookmark stories
- **Pagination** — Query stories by page and limit via query parameters

### Frontend
- **Stories List** — Displays all scraped stories with title, points, author, and posted time
- **Skeleton Loading** — Shimmer placeholder cards while data loads
- **Auth Pages** — Clean Login and Register forms with validation
- **Bookmark Functionality** — Toggle bookmarks per story with instant UI feedback
- **Protected Bookmarks Page** — Only accessible to logged-in users
- **Auth Context** — Global authentication state managed with React Context API
- **Persistent Login** — User stays logged in across page refreshes via localStorage
- **Responsive Design** — Works cleanly on desktop, tablet, and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router DOM, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Web Scraping** | Axios, Cheerio |
| **Styling** | Pure CSS (per-component CSS files) |
| **Dev Tools** | Nodemon, dotenv |

---

## 📁 Project Structure

```
Hackernews_app/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register & Login logic
│   │   ├── scrapeController.js    # Manual scrape trigger
│   │   └── storyController.js     # Story CRUD + bookmark toggle
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT token verification
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt hashing)
│   │   └── Story.js               # Story schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── scrapeRoutes.js        # /api/scrape
│   │   └── storyRoutes.js         # /api/stories
│   ├── scraper/
│   │   └── hackerNewsScraper.js   # Axios + Cheerio HN scraper
│   ├── utils/
│   │   └── generateToken.js       # JWT token generator
│   ├── .env                       # Backend environment variables
│   ├── package.json
│   |── server.js                  # Express app entry point
|   └── stories.json      
|           
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance + interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── StoryCard.jsx
│   │   │   ├── StoryCard.css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Stories list + scrape button
│   │   │   ├── Home.css
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── Register.jsx
│   │   │   ├── Register.css
│   │   │   ├── Bookmarks.jsx      # Protected bookmarks page
│   │   │   └── Bookmarks.css
│   │   ├── App.jsx                # Router + route definitions
│   │   ├── index.css              # Global base styles
│   │   └── main.jsx               # React entry point
│   ├── .env                       # Frontend environment variables
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

Make sure you have the following installed before starting:

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | v18 or higher | `node -v` |
| **npm** | v9 or higher | `npm -v` |
| **Git** | Any recent version | `git -v` |

You also need a **free MongoDB Atlas account**:
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free **M0 cluster**
3. Create a database user with a password
4. Whitelist your IP address (or use `0.0.0.0/0` for all IPs)
5. Get your connection string from **Connect → Drivers**

---

## 🔐 Environment Variables

### Backend — `backend/.env`

Create a file called `.env` inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/Hackernews_app?retryWrites=true&w=majority
JWT_SECRET=your_strong_random_secret_key_here
```

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the Express server runs on | `5000` |
| `MONGO_URI` | Your MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWT tokens — make it long and random | `mySecretKey123HN` |

### Frontend — `frontend/.env`

Create a file called `.env` inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL for all API calls | `http://localhost:5000/api` |

> ⚠️ **Important:** Never commit `.env` files to GitHub. Both are listed in `.gitignore`.

---

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Hackernews_app.git
cd Hackernews_app
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

```bash
# Inside the backend/ folder, create your .env file
# Copy the template from the Environment Variables section above
# and fill in your MongoDB URI and JWT secret
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 5. Configure Frontend Environment Variables

```bash
# Inside the frontend/ folder, create your .env file
# Add: VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Project Locally

You need **two terminals** running at the same time.

### Terminal 1 — Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
⏳ Running initial scrape on server start...
🔄 Starting HackerNews scrape...
✅ Scraped 10 stories from HackerNews
💾 New stories saved to database
✅ Initial scrape complete
```

### Terminal 2 — Start the Frontend

```bash
cd frontend
npm run dev
npm run start
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Open in Browser

Visit **[http://localhost:5173](http://localhost:5173)**

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login with email & password | ❌ |

#### Register — Request Body
```json
{
  "username": "abc",
  "email": "abc@example.com",
  "password": "123456"
}
```

#### Register / Login — Response
```json
{
  "_id": "64abc123...",
  "username": "abc",
  "email": "abc@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Scraper

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `POST` | `/api/scrape` | Trigger a fresh scrape of HackerNews | ❌ |

---

### Stories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `GET` | `/api/stories` | Get all stories sorted by points (descending) | ❌ |
| `GET` | `/api/stories?page=1&limit=10` | Get stories with pagination | ❌ |
| `GET` | `/api/stories/bookmarks` | Get logged-in user's bookmarked stories | ✅ |
| `GET` | `/api/stories/:id` | Get a single story by ID | ❌ |
| `POST` | `/api/stories/:id/bookmark` | Toggle bookmark on a story | ✅ |

#### GET /api/stories — Response
```json
{
  "stories": [
    {
      "_id": "64abc...",
      "title": "Story Title Here",
      "url": "https://example.com/article",
      "points": 1514,
      "author": "username",
      "postedAt": "20 hours ago",
      "scrapedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalStories": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

#### POST /api/stories/:id/bookmark — Headers Required
```
Authorization: Bearer <your_jwt_token>
```

#### POST /api/stories/:id/bookmark — Response
```json
{
  "message": "Story bookmarked",
  "bookmarked": true,
  "bookmarks": ["64abc...", "64def..."]
}
```

---

### Protected Routes — How to Send Token

For all routes that require authentication, include the JWT in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Bonus Features

### ✅ Pagination
Stories support pagination via query parameters:
```
GET /api/stories?page=1&limit=10
GET /api/stories?page=2&limit=5
```

The response includes full pagination metadata:
```json
{
  "pagination": {
    "currentPage": 2,
    "totalPages": 3,
    "totalStories": 25,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

---

## 🔍 How It Works — Architecture Overview

```
┌───────────────────────────────────────────────────────┐
│                    FRONTEND (React)                   │
│  Home Page → StoryCard → Bookmark Button              │
│  Login / Register Pages                               │
│  AuthContext (global state via React Context API)     │
│  Axios instance (auto-attaches JWT from localStorage) │
└────────────────────┬──────────────────────────────────┘
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────┐
│                BACKEND (Express + Node.js)          │
│  Routes → Middleware (JWT) → Controllers            │
│                     │                               │
│         ┌───────────┴──────────┐                    │
│         ▼                      ▼                    │
│   MongoDB (Mongoose)    HackerNews Scraper          │
│   User + Story models   axios + cheerio             │
└─────────────────────────────────────────────────────┘
```

### Scraper Flow
1. Server starts → auto-scrapes HackerNews top 10 stories
2. `axios.get()` fetches the HTML of `https://news.ycombinator.com`
3. `cheerio.load()` parses the HTML like jQuery
4. Extracts title, URL, points, author, and posted time from each story row
5. `Story.deleteMany()` clears old stories → `Story.insertMany()` saves fresh ones
6. Also triggerable manually via `POST /api/scrape`

### Auth Flow
1. User registers → password hashed by bcrypt → saved to MongoDB → JWT returned
2. User logs in → password compared → JWT returned → stored in localStorage
3. Every API request → Axios interceptor attaches JWT in `Authorization` header
4. Protected routes → `authMiddleware` verifies JWT → attaches `req.user` → handler runs

---

## 📝 Available Scripts

### Backend
```bash
npm run dev     # Start with nodemon (auto-restart on save)
npm start       # Start without nodemon (production)
```

### Frontend
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build locally
```

---

## 👤 Author

**Faizan**

- GitHub: [@faizangit123](https://github.com/faizangit123)
- Repository: [Hackernews_app](https://github.com/faizangit123/Hackernews_app)

Built as part of a MERN stack assignment demonstrating full-stack development
skills including web scraping, REST API design, JWT authentication, and React
frontend development.