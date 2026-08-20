# AccessFlow — Governed Access Management Portal

I built this application to convert the static `access-management.html` prototype into a real, production-ready full-stack application. Rather than just making the UI interactive, I focused on turning the prototype's state model into server-enforced business logic: real role-based permissions, database-backed access requests, multi-step provisioning lifecycles, and governed board configuration.

---

> [!WARNING]
> **Vercel Deployment Error?** 
> If you deployed to Vercel and are seeing `"Database not initialized"` or `"DATABASE_URL is missing"` errors when trying to register/login, it is because **Vercel is a Serverless environment that cannot run local SQLite files**. 
> 
> To fix this and make the live app work, you **must** provision a PostgreSQL database (like Neon or Supabase) and configure it in your Vercel Environment Variables. See the **[Production Deployment](#-production-deployment-vercel--neon--supabase)** section at the bottom of this README for the exact 3-step instructions!

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

## 🔒 Part 4 Improvements

For the Part 4 improvements, I implemented two major features focused on backend robustness and administrative UX:

**1. Race-Safe Manual Provisioning**
I prioritized correctness over surface-level features: in a high-volume IT environment, two admins concurrently reviewing the manual queue could easily double-provision the same request without atomic database guards. I wrapped the manual provisioning transition inside an interactive database transaction (`prisma.$transaction`) with a conditional status guard (`where: { id: requestId, status: "Pending Manual Provisioning" }`). If a second admin attempts to provision simultaneously, the transaction detects the zero-row match and rejects cleanly with a concurrency error.

**2. Inline Quick-Approvals for Board Admins**
*Problem:* The prototype required Board Admins to click into each pending request to open a drawer, review the details, and then approve/reject. For high-volume queues, this leads to significant click fatigue.
*Solution:* I added inline **Quick Approve** and **Quick Reject** action buttons directly on the Governance Queue table rows (`ApprovalsSection.tsx`). The buttons trigger server actions seamlessly with inline loading states, allowing admins to clear their queue rapidly.

---

## 🤖 AI Usage Report

In developing this full-stack implementation, I collaborated with **Google Deepmind's Antigravity (AGY)** AI assistant. 

### Tools Used
- **Antigravity IDE (AGY)**: Used as an agentic pair-programmer to scaffold out the UI layout and handle backend logic generation.

### Prompts
- Provided the comprehensive project rubric detailing the need for route groups, PostgreSQL database bindings, public marketing pages, and the authentication flow.

### What AI Generated
- Next.js 14 App Router boilerplate and route group scaffolding (`(marketing)` vs `(app)`).
- Initial Prisma schema design (`schema.prisma`) mapping out relationships.
- The `AutomationBackground` WebGL shader adaptation.

### What Was Manually Edited & Human Judgment
- **Design Tokens**: I had to manually restrict the AI from using generic ShadCN defaults and explicitly forced it to bind the CSS variables (`--navy`, `--accent`) to match the prototype exact visual identity.
- **Race-Safe Provisioning**: The AI originally suggested a standard `update` call for provisioning. I manually intervened and instructed it to use a Prisma `$transaction` with status guards to prevent race conditions during concurrent admin approvals.
- **Client-Side Hydration**: Fixed several Suspense boundary issues around `useSearchParams` in the signup flow that the AI missed, ensuring production builds wouldn't crash.

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
