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

- Node.js 20+
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

### 3. Start the database

```bash
docker-compose up -d
```

### 4. Install dependencies

```bash
cd apps/api
npm install
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the API

```bash
npm run start:dev
```

API runs at: `http://localhost:3000`

Swagger docs at: `http://localhost:3000/api/docs`

### 7. Register default admin user via Swagger

Open `http://localhost:3000/api/docs` and register:

| Email | Password | Name |
|---|---|---|
| admin@test.com | password123 | Admin User |

Then set admin role:

```bash
docker exec -it $(docker ps -qf "name=postgres") psql -U postgres -d ticketing -c "UPDATE \"User\" SET role = 'ADMIN' WHERE email = 'admin@test.com';"
```

Admin can manage all other user roles via `PATCH /users/:id/role`.

> Seed file coming soon — will automate this step.

---

## Frontend

> In progress — Angular 21 setup coming soon.