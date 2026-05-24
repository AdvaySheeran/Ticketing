# Ticketing
Ticket Management System built with Angular, NestJS, Prisma, PostgreSQL and JWT authentication.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21 |
| Backend | NestJS |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT |
| Email | Nodemailer + Gmail SMTP |
| Local Dev | Docker + docker-compose |

---

## Prerequisites

- Node.js 22.12+
- Docker Desktop
- npm 9+

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/AdvaySheeran/Ticketing.git
cd Ticketing
```

### 2. Set up environment variables

```bash
cp apps/api/.env.example apps/api/.env
```

Update `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ticketing"
JWT_SECRET="your_secret_here"
SMTP_USER="your_gmail@gmail.com"
SMTP_PASS="your_gmail_app_password"
```

### 3. Install backend dependencies

```bash
cd apps/api
npm install
```

### 4. Start the database

```bash
docker-compose up -d
```

### 5. Run migrations, generateclient and seed

```bash
cd apps/api
npx prisma migrate dev

npx prisma generate

npx prisma db seed
```


### 6. Start the API

```bash
npm run start:dev
```

API runs at: `http://localhost:3000`

Swagger docs at: `http://localhost:3000/api/docs`


### 7. Install frontend dependencies

```bash
cd apps/web
npm install
```

### 8. Start the frontend

```bash
npm start
```

Frontend: `http://localhost:4200`

#### Run Fronend and Backend Together

From project root:
```bash
npm run dev
```