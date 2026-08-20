# AccessFlow — Governed Access Management Portal

I built this application to convert the static `access-management.html` prototype into a real, production-ready full-stack application. Rather than just making the UI interactive, I focused on turning the prototype's state model into server-enforced business logic: real role-based permissions, database-backed access requests, multi-step provisioning lifecycles, and governed board configuration.

---

## 🚀 Quick Start (Local Dev)

To get the app running locally in one command:

```bash
# 1. Install dependencies
npm install

# 2. Sync database schema and seed demo records
npx prisma db push && npm run seed

# 3. Start the Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 📸 Screenshots

<details>
<summary>View Application Screenshots</summary>

### 1. Premium Glassmorphic Login
![Login Screen](docs/screenshots/01-login.png)

### 2. Registration Page
![Signup Screen](docs/screenshots/02-signup.png)

### 3. Main Dashboard & Access Directory
![Dashboard](docs/screenshots/03-dashboard.png)

</details>

---

## 👥 Demo Accounts & Logins

The database is pre-seeded with sample users, catalog boards, requests in various stages, audit logs, and notifications. You can use the 1-click switcher on the login page or enter credentials manually:

| Persona | Name | Email | Password | Role & Context |
| :--- | :--- | :--- | :--- | :--- |
| **Employee** | Manvi Mehta | `manvi@company.com` | `emp123` | Product Team · Approver for Marketing & Zendesk, requester for Salesforce |
| **Board Admin** | Rahul Sharma | `rahul@company.com` | `admin123` | IT Support & Access Provider · Handles manual queue, Access ID governance, board settings |
| **Employee** | Ananya Rao | `ananya@company.com` | `emp123` | Support Team · Has a pending request awaiting review from Manvi |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Components & Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with the prototype's exact colors (`--navy #0F1B33`, `--accent #2F6FED`, badge variants, layout radii)
- **Database & ORM**: Prisma ORM (SQLite for local zero-config setup, PostgreSQL/Neon ready for production)
- **Authentication**: NextAuth.js (Credentials provider with bcrypt password hashing, JWT sessions, route protection)
- **Validation**: Zod for form inputs and Server Action arguments
- **Testing**: Vitest for state machine transitions and concurrency tests

---

## 🔄 How the Workflows Work

1. **Access Directory & Eligibility**:
   - The directory searches across tools, board names, groups, and categories.
   - Eligibility is dynamically evaluated based on the logged-in user's department (`eligibleGroups` vs `user.group`).
2. **Access Requests (Self vs. On-Behalf)**:
   - Users can submit requests for themselves or on behalf of colleagues using the employee picker.
   - If an employee needs access to an out-of-group board, they can submit an **Access Exception** with a reason, required-until date, and urgency level.
3. **Approvals**:
   - Approvers only see requests routed to them.
   - Rejections strictly require an explanatory reason, which updates the timeline and notifies the requester.
4. **Provisioning**:
   - **Automated (`automation: true`)**: Approval immediately transitions the request to `Completed` (or `Access Provisioned` for on-behalf).
   - **Manual (`automation: false`)**: Approval routes the request to the Board Admin's manual queue (`Pending Manual Provisioning`). The admin explicitly clicks "Provision Access" to transition the request.
   - **On-Behalf Closure**: Requesters can close provisioned on-behalf requests once access is verified.
5. **Access ID Governance Review**:
   - If a board lacks an Access ID, users submit an Access ID Creation Request.
   - Board Admins review the request, verify duplicates, and issue a unique `AC-XXXX` ID to unblock future requests.
6. **Board Configuration**:
   - Admins can toggle automated provisioning on/off and update approvers/providers. Every change appends an immutable audit log entry.

---

## 🔒 Part 4 Improvement: Race-Safe Manual Provisioning

For the Part 4 improvement, I chose **Option A: Race-Safe Manual Provisioning**. 

I prioritized correctness over surface-level features: in a high-volume IT environment, two admins concurrently reviewing the manual queue could easily double-provision the same request without atomic database guards. I wrapped the manual provisioning transition inside an interactive database transaction (`prisma.$transaction`) with a conditional status guard (`where: { id: requestId, status: "Pending Manual Provisioning" }`). If a second admin attempts to provision simultaneously, the transaction detects the zero-row match and rejects cleanly with a concurrency error.

I also wrote an automated concurrency stress test in Vitest (`tests/workflow.test.ts`) that fires simultaneous provisioning calls to prove that exactly one transaction succeeds and the other is safely rejected.

---

## 🧪 Running Tests

To run the Vitest test suite covering all state transitions, automated/manual provisioning, rejections, governance, and concurrency guards:

```bash
npm run test
```

---

## 🌐 Production Deployment (Vercel + Neon / Supabase)

To deploy on Vercel:

1. In `prisma/schema.prisma`, switch datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set these environment variables in your Vercel Project Settings:
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g. `postgresql://user:password@ep-cool-project-123456.us-east-2.aws.neon.tech/accessflow?sslmode=require`)
   - `NEXTAUTH_SECRET`: A 32+ character random string
   - `NEXTAUTH_URL`: Your deployment URL (e.g. `https://access-flow.vercel.app`)
   - `NEXT_PUBLIC_ENABLE_DEMO_ACCOUNTS`: Optional (`"true"` to enable the quick demo switcher for evaluation, `"false"` to disable)
3. Deploy and run database migrations:
   ```bash
   npx prisma migrate deploy && npx prisma db seed
   ```
