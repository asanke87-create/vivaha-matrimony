# Vivaha.lk — Sri Lankan Matrimony Website

A full-stack matrimony website inspired by [Poruwa.lk](https://www.poruwa.lk/), built with **Kotlin (Spring Boot)** backend and **React (TypeScript)** frontend.

---

## Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Backend   | Kotlin · Spring Boot 3 · Spring Security · JPA/H2  |
| Frontend  | React 18 · TypeScript · React Router v6 · CSS Modules |
| Auth      | JWT (Bearer tokens)                                 |
| Database  | H2 (in-memory, dev) — swap for PostgreSQL/MySQL     |

---

## Features

- **Landing page** with hero, search widget, stats, features, and testimonials
- **Browse & search** profiles with filters (gender, age, religion, ethnicity)
- **User registration & login** with JWT auth
- **4-step profile creation** wizard
- **Detailed profile view** (privacy-controlled — last names hidden for guests)
- **Send / receive / accept / decline interests**
- **Dashboard** with profile overview, sent & received interests
- **Seeded demo data** (6 sample profiles auto-created on startup)
- Fully **responsive** design

---

## Prerequisites

- **Java 17+** (for the Kotlin backend)
- **Gradle** (wrapper included)
- **Node.js 18+** and **npm** (for the React frontend)

---

## Quick Start

### 1. Start the Backend

```bash
cd backend
./gradlew bootRun        # Linux/Mac
gradlew.bat bootRun      # Windows
```

The API runs at **http://localhost:8080**  
H2 Console: **http://localhost:8080/h2-console** (JDBC URL: `jdbc:h2:mem:matrimonydb`)

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
```

The app runs at **http://localhost:3000**

---

## Demo Accounts (auto-seeded)

| Email              | Password    |
|--------------------|-------------|
| nimal@email.com    | password123 |
| kumari@email.com   | password123 |
| sunil@email.com    | password123 |
| priya@email.com    | password123 |

---

## API Endpoints

| Method | Endpoint                          | Auth | Description                |
|--------|-----------------------------------|------|----------------------------|
| POST   | `/api/auth/register`              | ❌   | Register new user          |
| POST   | `/api/auth/login`                 | ❌   | Login, returns JWT token   |
| GET    | `/api/profiles/search`            | ❌   | Search profiles (public)   |
| GET    | `/api/profiles/{id}`              | ❌   | Get profile by ID          |
| POST   | `/api/profiles`                   | ✅   | Create your profile        |
| GET    | `/api/profiles/me`                | ✅   | Get my profile             |
| POST   | `/api/interests/send/{profileId}` | ✅   | Send interest              |
| PUT    | `/api/interests/{id}/respond`     | ✅   | Accept/decline interest    |
| GET    | `/api/interests/received`         | ✅   | Get received interests     |
| GET    | `/api/interests/sent`             | ✅   | Get sent interests         |

---

## Project Structure

```
wed/
├── backend/                        # Kotlin Spring Boot
│   ├── src/main/kotlin/com/matrimony/
│   │   ├── config/                 # Security config, data seeder
│   │   ├── controller/             # REST controllers
│   │   ├── dto/                    # Request/response DTOs
│   │   ├── model/                  # JPA entities
│   │   ├── repository/             # Spring Data repositories
│   │   ├── security/               # JWT utils, filters
│   │   └── service/                # Business logic
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                       # React TypeScript
    └── src/
        ├── components/             # Navbar, Footer, ProfileCard
        ├── context/                # AuthContext
        ├── pages/                  # Home, Search, Login, Register, etc.
        ├── services/               # API layer (axios)
        └── types/                  # TypeScript interfaces
```

---

## Production Notes

- Replace **H2** with PostgreSQL or MySQL in `application.properties`
- Set a strong `app.jwt.secret` (min 32 chars)
- Enable HTTPS, configure proper CORS origins
- Add file upload service for profile photos (AWS S3 / Cloudinary)
- Add email verification flow
