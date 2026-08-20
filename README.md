# AccessFlow — Governed Access Management System (New Age Portal)

> A production-grade, full-stack enterprise access management and board governance portal built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **NextAuth.js**, **Zod**, and **Vitest**.

Converted 1:1 from the `access-management.html` prototype into a resilient, multi-persona web application with server-enforced state transitions, immutable audit logging, and automated/manual provisioning pipelines.

---

## 🚀 Quick Start (One-Command Local Dev)

Clone the repository and run:

```bash
# 1. Install dependencies
npm install

# 2. Synchronize database and seed demo data
npx prisma db push && npm run seed

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Seed Accounts & Demo Credentials

The database is pre-populated with realistic catalog items, active requests in various statuses, audit logs, and notifications. You can use the **1-Click Demo Account Login** on the login page or enter credentials manually:

| Persona | Name | Email | Password | Role & Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Employee** | Manvi Mehta | `manvi@company.com` | `emp123` | Product Team Lead · Approver for Marketing & Support, requester for Salesforce |
| **Board Admin** | Rahul Sharma | `rahul@company.com` | `admin123` | IT Support & Access Provider · Full governance queue, board configs, manual provisioning |
| **Employee** | Ananya Rao | `ananya@company.com` | `emp123` | Support Team · Pending request awaiting approval from Manvi |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Components & Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS configured with exact prototype design tokens (`--navy #0F1B33`, `--accent #2F6FED`, status badges, container radii)
- **Database & ORM**: Prisma ORM (SQLite for zero-config local dev, PostgreSQL / Neon ready for production)
- **Authentication**: NextAuth.js (Credentials provider, bcrypt password hashing, JWT session strategy, persisted cookies)
- **Validation**: Zod for runtime schema validation on all mutations and API routes
- **Testing**: Vitest for workflow state machine unit testing

---

## 🏗 Architecture & Data Model

### Entity Relationship & Core Tables

1. **`User`**: Accounts with roles (`EMPLOYEE`, `BOARD_ADMIN`), department groups, titles, avatar colors, and hashed credentials.
2. **`AccessItem`**: Governed catalog of boards and applications with eligibility groups, assigned approvers, backup approvers, access providers, and automation flags.
3. **`AccessRequest`**: Governed request instances with lifecycle statuses:
   - `Pending Approval`
   - `Pending Exception Approval`
   - `Approved`
   - `Provisioning`
   - `Pending Manual Provisioning`
   - `Access Provisioned`
   - `Completed`
   - `Rejected`
4. **`AccessIdQueueItem`**: Governed review queue for unissued Board Access IDs (`Pending Governance Review` → `Access ID Created`).
5. **`AuditLog`**: Append-only immutable trail logging every state change, configuration update, and actor timestamp.
6. **`Notification`**: Real-time multi-channel notifications (Portal / Slack) for requesters, approvers, and admins.

---

## 🔄 Core Workflows & Business Rules

1. **Access Directory & Eligibility**:
   - Live search by keyword, tool, team, or category.
   - Eligibility is evaluated dynamically based on the logged-in user's department.
2. **Request Submission (Self vs. On-Behalf)**:
   - Standard requests: Self or On-Behalf of another employee (with dedicated employee selector).
   - Exception requests: For out-of-group access, requiring justification, reason, required until date, and urgency level.
3. **Approvals**:
   - Approver or backup approver reviews request details, business justification, and beneficiary eligibility.
   - Rejection requires an explanatory reason and updates the timeline accordingly.
4. **Automated vs. Manual Provisioning**:
   - **Automated (`automation: true`)**: Approval immediately transitions request to `Completed` (or `Access Provisioned` for on-behalf).
   - **Manual (`automation: false`)**: Approval routes request to the Board Admin's manual provisioning queue. The admin provisions access, transitioning to `Completed` (or `Access Provisioned`).
   - **On-Behalf Closure**: The requester of record can explicitly close provisioned requests on behalf of the beneficiary.
5. **Access ID Governance Review**:
   - Boards lacking an Access ID cannot be requested immediately. Users submit an Access ID Creation Request.
   - Board Admins review the request, perform duplicate verification, and issue a unique `AC-XXXX` ID.
6. **Board Configuration**:
   - Board Admins can toggle automated provisioning on/off in real time.
   - Approvers, backup approvers, and access providers can be edited with changes recorded to the audit log.

---

## 🧪 Running Automated Tests

Run the Vitest test suite covering state machine transitions, automated/manual provisioning, rejections, exceptions, and governance review:

```bash
# Run unit tests
npm run test
```

---

## 🌐 Production Deployment (Vercel + Neon / Supabase)

### 1. Environment Variables in Vercel Dashboard

When deploying to Vercel, configure the following Environment Variables in **Project Settings → Environment Variables**:

| Variable | Description | Example / Format |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@ep-cool-project-123456.us-east-2.aws.neon.tech/accessflow?sslmode=require` |
| `NEXTAUTH_SECRET` | 32+ character random secret string | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical URL of your deployment | `https://your-project.vercel.app` (or Vercel auto-detected URL) |

### 2. Switching Prisma to PostgreSQL for Production

In `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run migrations on your production database:
```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## 📂 Project Structure

```
AccessFlow/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx       # Auth login with 1-click demo switcher
│   │   └── signup/page.tsx      # User registration form
│   ├── actions/
│   │   └── requests.ts          # Server Actions for workflow mutations
│   ├── api/
│   │   └── auth/                # NextAuth & registration endpoints
│   ├── globals.css              # Prototype design tokens & badge CSS
│   ├── layout.tsx               # Root layout with AuthProvider & ToastRoot
│   └── page.tsx                 # Server Component dashboard
├── components/
│   ├── dashboard/               # Search, MyRequests, Approvals, Admin queues
│   ├── drawers/                 # Details, Forms, Status, & Config drawers
│   ├── layout/                  # Navigation header & notification panel
│   ├── modals/                  # Close, Reject, and Confirm modals
│   ├── providers/               # NextAuth SessionProvider
│   └── ui/                      # Badges, Timeline, and Toast container
├── lib/
│   ├── auth.ts                  # NextAuth credentials config & callbacks
│   ├── prisma.ts                # Prisma singleton client
│   ├── services/
│   │   └── workflow.ts          # State machine business logic & audit writer
│   └── validations/
│       └── request.ts           # Zod input validation schemas
├── prisma/
│   ├── schema.prisma            # Prisma schema models & relations
│   └── seed.ts                  # Seed script with demo data
├── tests/
│   └── workflow.test.ts         # Vitest unit test suite
├── .env.example                 # Example environment variables
└── README.md                    # Project documentation
```
