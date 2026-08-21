# AccessFlow — Governed Access Management Portal

AccessFlow is a production-ready, full-stack enterprise access governance portal built with Next.js 14 App Router, TypeScript, Tailwind CSS, NextAuth.js, and Prisma ORM backed by Neon PostgreSQL.

The application converts a high-fidelity access management interface into a robust, server-enforced governance system featuring role-based access control, atomic multi-step provisioning lifecycles, real-time audit logging, exception workflows, and persistent cloud database storage.

🎥 **Video Walkthrough**: [Watch Full Technical Assessment & Architecture Walkthrough on Loom](https://www.loom.com/share/29c58419235641c2960d123bccff30e0)

---

## 🚀 Quick Start (Local Setup)

To get the application running locally:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (create .env from .env.example)
cp .env.example .env

# 3. Synchronize database schema and seed demo records
npx prisma db push && npm run seed

# 4. Start the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3001](http://localhost:3001)) to view the portal.

---

## 📸 Screenshots

<details open>
<summary><b>Click to expand / collapse preview screenshots</b></summary>

### 1. Public Marketing Landing Page (`/`)
![Public Landing Page](docs/screenshots/01-landing.png)

### 2. Glassmorphic Authentication (`/login`)
![Login Screen](docs/screenshots/02-login.png)

### 3. User Registration (`/signup`)
![Registration Screen](docs/screenshots/03-signup.png)

### 4. Employee Governance Dashboard (`/dashboard`)
![Employee Dashboard](docs/screenshots/04-dashboard.png)

### 5. Board Administrator Management View (`/dashboard`)
![Board Admin View](docs/screenshots/05-admin-dashboard.png)

### 6. About the Project & Assessment Summary (`/about`)
![About Project Page](docs/screenshots/06-about.png)

### 7. Projects Showcase (`/projects`)
![Projects Showcase Page](docs/screenshots/07-projects.png)

</details>

---

## 👥 Demo Personas & Credentials

The cloud database is pre-seeded with sample users, catalog boards, multi-stage requests, audit logs, and notification feeds:

| Persona | Name | Email | Password | Role & Context |
| :--- | :--- | :--- | :--- | :--- |
| **Employee** | Manvi Mehta | `manvi@company.com` | `emp123` | Product Team · Approver for Marketing & Zendesk, requester for Salesforce |
| **Board Admin** | Rahul Sharma | `rahul@company.com` | `admin123` | IT Support & Access Provider · Handles manual queue, Access ID governance, board settings |
| **Employee** | Ananya Rao | `ananya@company.com` | `emp123` | Support Team · Customer Support associate with pending requests |
| **Employee** | Neha Kapoor | `neha@company.com` | `password123` | Sales Team · Sales Lead & Approver for Sales Operations |
| **Employee** | Muskan Kohli | `muskan@company.com` | `password123` | Finance Team · Finance Manager & Approver for Finance Tracker |

---

## 🛠 Tech Stack & Architecture

- **Framework**: Next.js 14+ (App Router, Server Components & Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens (`--navy: #0F1B33`, `--accent: #2F6FED`, custom badges, glassmorphic cards)
- **Database**: Neon PostgreSQL (Serverless Cloud Postgres via `@prisma/client`)
- **Authentication**: NextAuth.js (Credentials provider with bcrypt password hashing, JWT sessions, route protection)
- **Validation**: Zod schema validation for inputs and server actions
- **Automated Testing**: Vitest test suite covering state transitions and concurrency locks

---

## 🔄 Core Governance Workflows

1. **Access Directory & Dynamic Eligibility**:
   - Evaluates department eligibility dynamically (`eligibleGroups` vs `user.group`).
   - Supports tool and board catalog search across categories, tools, and access IDs.
2. **Access Requests (Self vs. On-Behalf)**:
   - Supports self-requests and requesting on behalf of colleagues via the employee picker.
   - Out-of-group requests automatically prompt an **Access Exception** workflow requiring reason, required-until date, and urgency level.
3. **Approval Lifecycle**:
   - Approvers only see requests routed directly to them.
   - Rejections strictly require an explanatory reason, which appends to the immutable timeline and notifies the requester.
4. **Provisioning Engine**:
   - **Automated (`automation: true`)**: Approval immediately transitions the request to `Completed` (or `Access Provisioned` for on-behalf).
   - **Manual (`automation: false`)**: Approval routes the request to the Board Admin queue (`Pending Manual Provisioning`).
5. **Access ID Governance Review**:
   - When boards lack an Access ID, employees submit an Access ID Creation Request.
   - Board Admins review duplicates and issue unique `AC-XXXX` IDs.
6. **Board Configuration & Audit Logging**:
   - Admins can toggle automation and update approvers/providers with complete audit logging.

---

## 🔒 Part 4 Improvements Report

### 1. Race-Safe Manual Provisioning
* **Opportunity Identified**: In high-volume IT environments, two administrators reviewing the manual provisioning queue simultaneously could attempt to provision the same request at the same time, leading to double-provisioning and desynchronized audit trails.
* **Why It Matters**: Concurrency safety is critical for compliance and data integrity.
* **What Was Changed**: Wrapped the manual provisioning transition inside an interactive database transaction (`prisma.$transaction`) with a conditional status guard (`where: { id: requestId, status: "Pending Manual Provisioning" }`). If a second admin attempts to provision simultaneously, the transaction detects the zero-row match and rejects cleanly with a concurrency conflict error.
* **Automated Verification**: Added automated concurrency stress tests in Vitest (`tests/workflow.test.ts`) that fire simultaneous provisioning requests to verify atomic isolation.

### 2. Inline Quick-Approvals for Board Admins
* **Opportunity Identified**: Reviewing large queues previously required opening a slide-out drawer for every single item to take action, causing significant click-fatigue.
* **Why It Matters**: Streamlines the administrative approval queue for rapid daily operations.
* **What Was Changed**: Added inline **Quick Approve** and **Quick Reject** action buttons directly on the Governance Queue table rows (`ApprovalsSection.tsx`) with inline loading indicators and direct server action triggers.
* **What Was Intentionally Kept Unchanged**: Kept the detailed drawer accessible by clicking on the row for complex multi-step reviews requiring full audit timeline inspection.

---

## 🤖 AI Usage & Engineering Decisions

### Important Prompts & Scaffolding
- Structured prompts defining Next.js 14 App Router route group architecture `(marketing)` vs `(app)` to cleanly separate public marketing pages from authenticated governance workspaces.
- Data modeling prompts mapping relational entities: `User`, `AccessItem`, `AccessRequest`, `AccessIdQueueItem`, `AuditLog`, and `Notification`.

### What AI Generated
- Initial Next.js 14 boilerplate and route group scaffolding.
- Baseline Prisma relational schema definitions.
- WebGL shader canvas component for the ambient automation background.

### What Was Manually Engineered & Human Judgment Decisions
- **Design Token Discipline**: Enforced strict adherence to the prototype's exact visual identity (`--navy #0F1B33`, `--accent #2F6FED`, HSL status badges) over default utility styling.
- **Race-Condition Prevention**: Replaced standard single-statement updates with Prisma `$transaction` conditional status guards for atomic concurrency safety.
- **Suspense & Client-Side Hydration Boundaries**: Added `<Suspense>` boundaries around query parameter hooks (`useSearchParams`) to eliminate build-time prerendering failures.
- **Persistent Cloud Database Migration**: Switched Prisma datasource configuration from local SQLite to Neon PostgreSQL with SSL connection pooling and automated seeding.

---

## 🧪 Running Automated Tests

To execute the Vitest test suite covering workflow state transitions, provisioning engines, rejections, governance lifecycles, and concurrency locks:

```bash
npm run test
```

---

## 🌐 Production Deployment (Vercel)

1. Set the following Environment Variables in your Vercel Project Settings:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string (`postgresql://username:password@ep-...neon.tech/neondb?sslmode=require`)
   - `NEXTAUTH_SECRET`: A 32+ character random string
   - `NEXTAUTH_URL`: Your deployment URL (e.g. `https://access-flow.vercel.app`)
   - `NEXT_PUBLIC_ENABLE_DEMO_ACCOUNTS`: `"true"`
2. Deploy the repository to Vercel (automatically builds via `npm run build` and runs migrations).
