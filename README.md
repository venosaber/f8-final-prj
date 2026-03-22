# 📝 Online Testing Platform

A full-stack online testing platform with auto-grading, built for teachers to create and manage exams and for students to take them with instant results.

## Features

### 👩‍🏫 Teacher
- Create and manage **classes** with student invitations (via email link)
- Create **exam groups** with scheduling (start time, wait time) and attempt control (one-time or repeatable)
- Create **exams** within groups — each with a name, code, time limit, description, and attached PDF
- Define **questions** per exam — single-choice, multiple-choice, or long-response
- **Auto-grading** for choice-based questions; manual marking for long-response answers
- View student results, scores, and per-question answer breakdowns

### 🎓 Student
- Join classes via **invitation links**
- Take exams within scheduled exam groups
- View exam results, scores, and answer correctness after completion

### 🔐 Admin
- Manage all users (view, edit, delete)

### General
- JWT authentication with access + refresh tokens (remember me support)
- Password reset via email (forgot password flow)
- User profiles with avatar upload (Cloudinary)
- Swagger API docs at `/docs`

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Material UI (MUI) |
| **Backend** | NestJS, TypeORM, PostgreSQL |
| **File Storage** | Cloudinary |
| **Email** | Brevo SMTP (configurable) |
| **Reverse Proxy** | Nginx with auto SSL (Let's Encrypt) |
| **Containerization** | Docker Compose |

## Project Structure

```
├── web/                    # React frontend (Vite)
│   └── src/
│       ├── pages/          # Login, Register, Classes, ClassDetail, Profile, ...
│       ├── components/     # ExamGroup, TeacherMarking, StudentAnswers, ...
│       ├── contexts/       # ExamFlowProvider
│       ├── router/         # Public, Protected, ExamFlow layouts
│       └── utils/          # API helpers, auth utilities
│
├── api/                    # NestJS backend
│   └── src/
│       ├── modules/        # auth, user, class, exam, exam_group, question,
│       │                   # answer, exam_result, invitation, student,
│       │                   # teacher, admin, cloudinary, pdf-viewer, file
│       ├── infrastructure/ # Mail service
│       ├── migrations/     # TypeORM migrations
│       └── shares/         # Shared types & enums (Role, QuestionType)
│
├── nginx/                  # Nginx config template (auto-generated at runtime)
├── certbot/                # SSL certificate storage (gitignored)
├── db/                     # PostgreSQL data volume (gitignored)
├── docker-compose.yml      # Production services
├── docker-compose.override.yml  # Local dev overrides (gitignored)
├── init-letsencrypt.sh     # One-time SSL bootstrap script
└── .env.example            # Environment variable template
```

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- A domain name pointing to your server (for production)

### Local Development

```bash
# 1. Clone the repository
git clone <repo-url> && cd <repo-name>

# 2. Create environment file
cp .env.example .env
# Edit .env — the defaults work for local dev

# 3. Create the local dev override file
cat > docker-compose.override.yml << 'EOF'
services:
  web:
    ports:
      - '4000:4000'

  api:
    ports:
      - '3000:3000'

  db:
    ports:
      - '5000:5432'

  # no need for nginx and certbot at local
EOF

# 4. Start services
docker compose up
```

- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/docs
- **Database** (external access): `localhost:5000`

### Production Deployment (VPS)

```bash
# 1. SSH into your VPS and clone the repo
git clone <repo-url> && cd <repo-name>

# 2. Create and configure environment
cp .env.example .env
# Edit .env:
#   VITE_DOMAIN=yourdomain.com
#   EMAIL=your-email@example.com
#   FRONTEND_URL=https://yourdomain.com
#   VITE_API_URL=https://yourdomain.com/api
#   (+ database, mail, cloudinary, JWT secrets)

# 3. Bootstrap SSL certificates (first time only)
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh

# 4. Start all services
docker compose up -d
```

Subsequent deploys after `git pull` only need `docker compose up -d`.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_DOMAIN` | Domain name (used by nginx & Vite) | `mydomain.com` |
| `EMAIL` | Email for Let's Encrypt SSL notifications | `admin@mydomain.com` |
| `FRONTEND_URL` | Full frontend URL | `https://mydomain.com` |
| `VITE_API_URL` | Full API URL (frontend uses this) | `https://mydomain.com/api` |
| `POSTGRES_*` | Database credentials | see `.env.example` |
| `CLOUDINARY_*` | Cloudinary API credentials | see `.env.example` |
| `MAIL_HOST` | SMTP host | `smtp-relay.brevo.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_SECURE` | Use direct TLS (`true` for 465, `false` for 587) | `false` |
| `MAIL_USER` | SMTP username | `you@example.com` |
| `MAIL_PASS` | SMTP password/API key | — |
| `JWT_ACCESS_SECRET` | Secret for access tokens | — |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | — |

## Database Migrations

Migrations run **automatically** when the API container starts (`npm run migration:run` runs before `npm run start:dev`). On a fresh VPS this creates all tables; on subsequent deploys it applies any new migrations and skips already-applied ones.

For manual control (e.g. generating a new migration from entity changes):

```bash
# Generate a new migration from entity changes
docker compose exec api npm run migration:generate -- src/migrations/MigrationName

# Run pending migrations manually
docker compose exec api npm run migration:run

# Revert the last migration
docker compose exec api npm run migration:revert
```

## API Documentation

Swagger UI is served by NestJS at `/docs`, but is **blocked by nginx in production** for security.

- **Local**: http://localhost:3000/docs (accessible directly on the API port)
- **To re-enable in production temporarily**: comment out the `return 404;` block and uncomment the proxy block in `nginx/nginx.conf.template`, then run `docker compose exec nginx nginx -s reload`

## License

This project is unlicensed (private).
