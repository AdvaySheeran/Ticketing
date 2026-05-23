# Ticketing tool - Architecture document
## overview
A modernized ticket management system built to replace a legacy stack (Angular 6, CodeIgniter 3.1.8, PHP 7.1, MySQL)

### Goal
The goal is to build a simple, maintainable and scalable system

### Legacy Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Angular 6.1.10                    |
| Backend    | CodeIgniter 3.1.8 / PHP 7.1       |
| Database   | MySQL                             |
| Auth       | Sessions                          |
| Hosting    | Shared Hosting (BigRock/HostGator)|
| CI/CD      | Manual FTP deployment             |
| Email      | Google SMTP                       |

### Modern Stack

| Layer      | Technology                        | Why                                                                 |
|------------|-----------------------------------|---------------------------------------------------------------------|
| Frontend   | Angular 21                        | Same ecosystem as legacy, lower retraining cost, structured by default |
| Backend    | NestJS                            | Modular, team-friendly structure, built-in guards and validation    |
| ORM        | Prisma                            | Type-safe queries, reliable migrations, schema as source of truth   |
| Database   | PostgreSQL                        | Tickets are relational data - joins, foreign keys, referential integrity |
| Auth       | JWT (access token)                | Stateless, scalable, no session storage needed                      |
| Validation | class-validator                   | Decorator-based, pairs natively with NestJS DTOs                    |
| Email      | Nodemailer + Gmail SMTP           | Zero setup for prototype, swap to Resend/SES in production          |
| Hosting    | Railway (prototype)               | Free tier, native PostgreSQL, auto-deploy from GitHub               |
| Docker     | docker-compose (local dev)        | One command spins up entire local environment                       |
| CI/CD      | GitHub Actions                    | Lint, typecheck, build on every push                                |

## Architecture layers

**Clients**
- Angular 21 SPA
- Auth Guard - blocks unuthenticated routes
- HTTP Interceptor - attches JWT to every request
- Role based UI - Shows / Hides features by role


**API - NestJs**
- Auth Module - Register, login and JWTStrategy 
- Tickets Module - Create, list, assign and status update
- Comments Module - Nested under tickets
- User Module - List users and role management for  admin 
- Notifications Module - Email triggers on Ticket creation, assign and resolve
- Guards - JWTGuard token check and RoleGuard permissions check


**Data**
- Prisma ORM -Type safe queries and schema as source of truth
- PostgreSQL -Relational database, runs in docker


**Email**
- Nodemailer + Gmail SMTP
- Fire and forget, email failure never breaks main flow

**Request flow**
- HTTP request + Bearer token
- JWTGuard - Token validation
- RoleGuard - Role permissions check
- Controller - Validates DTO
- Service - Business logic
- Prisma - DB query
- Response with valid HTTP codes

---

## Migration Approach 
Should be in phases by 8 weeks
**1. Infrastructure**
**2. Dual-Streaming Data Engine**
**3. Beta Split and Router**
**4. Traffic Ramp-Up and Cutover**


### Why Not a Complete Rewrite

Replacing everything at once is high risk, data may loss, downtime and no rollback.
A phased approach keeps the business running while modernizing incrementally.

---

### Phases

### Phase 1 - Infrastructure and Baseline Snapshot (Weeks 1-2)

**Goal:** Provision target environment and establish baseline database.

**Week 1**
- Provision AWS RDS PostgreSQL instance
- Set up secure VPC networking between legacy MySQL host and new AWS environment

**Week 2**
- Take static snapshot of production MySQL database
- Load into PostgreSQL using schema conversion tool (pgloader or AWS SCT)

---

### Phase 2 - Dual-Streaming Data Engine (Weeks 3-4)

**Goal:** Real-time bi-directional data sync without touching legacy application code.

**Week 3**
- Set up CDC pipeline (Debezium or AWS DMS)
- Stream MySQL transaction log (binlog) to PostgreSQL in real-time
- Legacy application code remains untouched

**Week 4**
- Set up reverse pipeline - PostgreSQL → MySQL
- Beta user actions reflect back in legacy system
- Conflict resolution rule defined: PostgreSQL wins on simultaneous edits
- Build NestJS JWT auth endpoints in parallel

---

### Phase 3 - Beta Split and Router (Weeks 5-6)

**Goal:** Deploy new stack, allow users to opt-in via routing rules.

**Week 5**
- Deploy Angular 21 frontend to app-new.domain.com
- Deploy NestJS API behind AWS Application Load Balancer

**Week 6**
- Update main landing page to offer Beta choice
- Beta users routed directly to new stack
- Auth handled natively via NestJS JWT

---

### Phase 4 - Traffic Ramp-Up and Cutover (Weeks 7-8)

**Goal:** Route primary traffic to new system, decommission legacy.

**Week 7**
- Change default DNS - domain.com points to Angular 21
- Temporary fallback link to classic version remains available

**Week 8**
- After 7 days of 99% traffic stability on new system
- Turn off CDC sync pipelines
- Legacy CodeIgniter server and MySQL moved to read-only archive


### Risk Mitigation

| Risk | Mitigation |
|---|---|
| Legacy app breaks | No legacy code changes - routing at DNS layer only |
| Data loss on rollback | CDC keeps MySQL in sync until final decommission |
| New system crashes | DNS flip back to legacy takes minutes |
| Simultaneous edit conflict | PostgreSQL wins - defined upfront |


### Rollback at Any Phase

- **Phase 1-2** - flip DNS, nothing changed in legacy
- **Phase 3** - revert DNS, beta users redirected back
- **Phase 4** - DNS flip back instant, MySQL still up-to-date via CDC

---

## Security

| Area | Implementation |
|---|---|
| Authentication | JWT stateless tokens - no server-side session storage |
| Password storage | bcrypt with salt rounds - never plain text |
| Role enforcement | Two-layer - JwtGuard + RolesGuard on every protected route |
| Input validation | class-validator on all DTOs - whitelist + forbid unknown fields |
| Data exposure | Prisma select - password hash never returned in any response |
| Error messages | Generic auth errors - prevents email enumeration attacks |

---

## Scalability

**Current setup is correct for this scale - monolith is not a dirty word.**

When traffic grows:

| Bottleneck | Solution |
|---|---|
| API servers | Horizontal scaling behind AWS ALB |
| Database connections | PgBouncer connection pooling |
| Email sending | Move to queue (Bull + Redis) - async and retryable |
| Static assets | CloudFront CDN for Angular build |

---

## Maintainability

| Concern | How we addressed it |
|---|---|
| Structure | NestJS enforces module boundaries - new dev knows where everything lives |
| Type safety | TypeScript end-to-end - Angular + NestJS + Prisma |
| Schema changes | Prisma migrations - versioned, committed to git, reproducible |
| API contracts | Swagger auto-generated - always in sync with code |
| Environment config | .env with validation - no hardcoded secrets |
| Onboarding | One command local setup - docker-compose up |

---

## What We Deliberately Left Out

These are known gaps, not oversights:

- **Refresh tokens** - access token expiry is 15min, acceptable for prototype
- **Rate limiting** - add throttler guard in production
- **Pagination** - list endpoints return all records, add cursor pagination at scale
- **Request logging** - add correlation IDs and structured logging in production
- **Secrets management** - use AWS Secrets Manager instead of .env in production

---

## Team Structure

| Role | Responsibilities |
|---|---|
| Tech Lead | Architecture, PR approvals (auth/DB), unblocking the team |
| Backend Engineer | NestJS APIs, Prisma schemas, business logic |
| Frontend Engineer | Angular 21, routing, UI/UX implementation |
| DevOps Engineer | AWS setup, Docker, CI/CD pipelines, database sync |
| QA Engineer | Integration testing, regression, UAT |

**Minimum viable team (3 people):** Tech Lead (backend-focused) + Frontend Engineer + DevOps

---

## Engineering Standards

### Code Reviews
- All changes via pull request - no direct commits to main
- Minimum 1 peer approval + passing automated checks (lint, TS, tests)
- Tech Lead must explicitly approve all security and database PRs

### Task Breakdown - Vertical Slices
Deliver end-to-end features, not horizontal layers. Prevents integration bottlenecks.

Example - "Create Ticket" task includes:
- Prisma schema
- API endpoint
- Angular form

All in one PR.

### Tech Debt Management
- Track debt explicitly with GitHub labels
- Pay down continuously during regular sprints - not a separate cleanup sprint
- Never let debt block a feature - isolate, document, move on
- Priority: Security -> Reliability -> Performance -> Developer Experience

---

## CI/CD Pipeline

**Deployment Flow**
- Push to branch -> lint, prettier, TS typecheck, Jest tests
- Pull request -> code review and approval
- Merge to main -> auto-deploy to staging, smoke tests run
- Tag release -> deploy to production, Slack notification sent

**DevOps Stack**

| Purpose | Tool |
|---|---|
| CI/CD | GitHub Actions |
| Containers | Docker + Docker Compose |
| Hosting | Railway (staging) -> AWS ECS (production) |
| Monitoring | CloudWatch + Sentry |

---

## Summary

This architecture is intentionally simple, scalable, and maintainable.
Every decision prioritizes team velocity and stability over hype.
No technology was chosen unless it directly fit the project's requirements.