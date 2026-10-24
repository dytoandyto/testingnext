# Deployment and Operations Handbook
## Interactive 3D Indie Portfolio CMS

This document specifies the deployment architecture, configuration requirements, database migration lifecycle, operational safeguards, and recovery workflows for production deployment on **Vercel**, **Neon PostgreSQL**, and **Cloudinary**.

---

## 1. Environment Variables Specification

The application requires specific environment variables partitioned across server-only and client-exposed tiers. 

| Variable Name | Required | Target Environment | Sensitivity | Description & Recommended Value |
| :--- | :---: | :---: | :---: | :--- |
| `DATABASE_URL` | **Yes** | Server (Vercel & Local) | **Secret** | Neon pooled PostgreSQL connection string with PgBouncer (`-pooler.region.neon.tech`). Used for runtime server queries and serverless lambdas. Format: `postgresql://user:pass@ep-xyz-pooler.region.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | **Yes** | Server (Vercel & Local) | **Secret** | Direct Neon compute endpoint without connection pooling (`ep-xyz.region.neon.tech`). Required by Prisma CLI for running schema migrations and DDL commands. Format: `postgresql://user:pass@ep-xyz.region.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | **Yes** | Server (Vercel & Local) | **Secret** | Cryptographic 32-byte secret used by Auth.js (NextAuth v5) to sign and encrypt session JWTs and cookies. Generate via: `openssl rand -base64 32` or `npx auth secret`. |
| `AUTH_URL` | **Yes** | Server (Local & Production) | Public | The canonical base URL of the authentication service. Local: `http://localhost:3000`. Production: `https://your-custom-domain.com` or `https://your-project.vercel.app`. |
| `ADMIN_EMAIL` | **Yes** | Server (Provisioning only) | Public | Root administrative email address used during initial bootstrap seeding. Default: `admin@indie-realm.io`. |
| `ADMIN_PASSWORD` | **Yes** | Server (Provisioning only) | **Secret** | Initial master cipher for the administrator account (minimum 8 characters). Must be set only when running `npm run seed:admin`. |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Server | Public | Cloudinary cloud identifier (e.g. `indie-realm-cloud`). Used to construct media delivery and upload URLs. |
| `CLOUDINARY_API_KEY` | **Yes** | Server | Semi-public | Cloudinary API key for signed upload requests. |
| `CLOUDINARY_API_SECRET` | **Yes** | Server | **Secret** | Cloudinary API secret used strictly on the server to compute HMAC-SHA1 signatures for secure uploads. **Never expose to the client.** |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Client & Server | Public | Base canonical URL for generating localized OpenGraph tags, sitemaps, and hreflang alternates (e.g., `https://portfolio.example.com`). |

---

## 2. Environment Separation & Secret Hygiene

- **Local Development:** Configured exclusively in `.env.local` (untracked, Git-ignored).
- **Vercel Production:** Configured in **Vercel Project Settings → Environment Variables**.
  - Restrict `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `CLOUDINARY_API_SECRET` to the **Production** and **Preview** environments.
  - Disable "Automatically expose System Environment Variables" if public leakage is a concern.
- **Client Bundle Protection:**
  - Only `NEXT_PUBLIC_APP_URL` is prefixed with `NEXT_PUBLIC_`.
  - Sensitive operations (Cloudinary upload authorization, database queries, password verification, audit logging) execute strictly within Next.js Server Components, Server Actions (`"use server"`), or Route Handlers.
  - The static analysis audit in Phase 7 verified that zero secret strings or database credentials are leaked in client bundles or public HTTP responses.

---

## 3. Database Architecture & Connection Pooling

The database is hosted on **Neon Serverless PostgreSQL**.

### Connection Strategy
1. **Application Runtime (`DATABASE_URL`):**
   - Connects through Neon's built-in connection pooler (`-pooler.region.neon.tech`).
   - Neon's pooler uses PgBouncer in transaction mode to multiplex connections from concurrent serverless functions, preventing `remaining connection slots are reserved for non-replication superuser connections` errors during traffic spikes.
   - Initialized in [`src/lib/db.ts`](file:///c:/campus/portofolioweb/src/lib/db.ts) using `@prisma/adapter-neon` via the `PrismaNeon` WebSocket driver adapter for optimal serverless latency.

2. **Schema Migrations (`DIRECT_URL`):**
   - Connects directly to the compute node (`ep-xyz.region.neon.tech`).
   - Bypasses PgBouncer because transactional pooling prohibits prepared statements and specific advisory locks required by Prisma migration operations.

---

## 4. Prisma Migration Workflow

### Safe Development Migration
When changing schema locally:
```bash
# 1. Update prisma/schema.prisma
# 2. Create versioned migration file locally
npx prisma migrate dev --name <descriptive_name>
```

### Safe Production Deployment Migration
In CI/CD (Vercel), destructive schema resets are disabled. Migrations are executed non-destructively:
```bash
# Deploys only pending unapplied migrations from prisma/migrations/
npm run migrate:deploy
```
- The baseline migration `20261024000000_init` has been recorded in the `_prisma_migrations` table as applied.
- Forward migrations will execute sequentially inside transactions.
- Zero destructive commands (`prisma db push --force-reset` or `prisma migrate reset`) should ever be executed against production instances.

---

## 5. Cloudinary Media Upload Authorization

All uploads to Cloudinary are authenticated through a server-signed flow:

```
[Browser / Client] 
     │
     ├─ 1. Requests upload authorization with file metadata (size, format, folder)
     ▼
[Server Action / API: /api/media/upload]
     │
     ├─ 2. Validates session with requireAdmin()
     ├─ 3. Computes HMAC-SHA1 signature using CLOUDINARY_API_SECRET + timestamp
     ▼
[Browser / Client]
     │
     ├─ 4. Directly dispatches file + signature to https://api.cloudinary.com/v1_1/<cloud_name>/auto/upload
     ▼
[Cloudinary CDN]
     │
     ├─ 5. Verifies signature against API Secret
     ├─ 6. Returns secure URL, public ID, width, height, format, byte size
     ▼
[Server Action / CMS]
     │
     └─ 7. Registers MediaAsset record in Neon PostgreSQL
```

- **Deletion Constraint:** Media assets referenced by any project in `project_media` cannot be deleted (`onDelete: Restrict`). Attempting to delete in-use media returns a clear error preventing broken image references across the portfolio.

---

## 6. Vercel & GitHub Deployment Walkthrough

### Step A: Push Code to GitHub
Ensure all changes are committed and pushed to your remote repository:
```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

### Step B: Connect Project in Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New... → Project**.
3. Import your GitHub repository.
4. Set **Framework Preset** to `Next.js`.
5. Root Directory: `./` (default).
6. Under **Build and Output Settings**:
   - Build Command: `npm run vercel-build` (automatically executes `prisma generate && next build`).
   - Output Directory: `.next` (default).
   - Install Command: `npm install` (default).

### Step C: Configure Environment Variables
In the Vercel project configuration, add all required variables documented in Section 1:
- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `AUTH_URL` (set to `https://<your-project>.vercel.app` or your production domain)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_APP_URL` (e.g. `https://<your-project>.vercel.app`)

### Step D: Trigger Initial Deployment
1. Click **Deploy**.
2. Vercel executes `npm run vercel-build`, generates the 18 static/dynamic routes, runs TypeScript verification, and provisions the edge proxy.
3. Upon completion, note your production URL (e.g. `https://portofolioweb.vercel.app`).

---

## 7. Admin Provisioning Guide

Once the database is connected and migration `20261024000000_init` is applied, run the one-time provisioning script:

### Windows (PowerShell)
```powershell
$env:ADMIN_EMAIL = "admin@indie-realm.io"
$env:ADMIN_PASSWORD = "YourSecureMasterCipher2026!"
npm run seed:admin
```

### Linux / macOS / Vercel CLI
```bash
ADMIN_EMAIL="admin@indie-realm.io" ADMIN_PASSWORD="YourSecureMasterCipher2026!" npm run seed:admin
```

### Provisioning Behavior:
- Checks `users` table for existing `role: ADMIN` accounts.
- If an admin exists, it engages an idempotent safety lock and exits without modifying any records.
- If no admin exists, it hashes the password with bcrypt (12 rounds) and creates the root administrator.
- Automatically initializes default `SiteSettings`, the `Slate Obsidian` theme preset, and the `Astral Archipelago` 3D world scene with 5 default portal coordinates (`/projects`, `/about`, `/experience`, `/skills`, `/contact`).
- Logs a `BOOTSTRAP_PROVISIONING` entry in `audit_logs`.

---

## 8. Post-Deployment Verification & Smoke Tests

Verify all operational paths on the live production URL:

1. **Public Exploration:**
   - Visit `https://<deployed-url>/en` — verify 3D diorama canvas loads, canvas ambient fog matches active theme, and portal labels are readable.
   - Toggle to **2D Fallback** — verify fallback cards render with coordinate coordinates and direct portal links.
2. **Bilingual Navigation:**
   - Switch language to Indonesian (`/id`) — verify HTML tag updates to `<html lang="id">`, portal titles display translated labels (`Bengkel Karya`, `Riwayat Perjalanan`), and hreflang alternates are intact.
3. **Draft Privacy:**
   - Verify unauthenticated public requests to `/en/projects` display only `PUBLISHED` projects.
4. **Administrative Gate & CMS CRUD:**
   - Visit `/admin` — confirm automatic redirect to `/admin/login`.
   - Submit invalid credentials — confirm login attempt fails with rate limit feedback.
   - Log in with provisioned credentials — confirm access to `/admin` dashboard.
   - Create a draft project, update metadata, attach media, and publish.
   - Verify published project appears immediately on `/en/projects`.
5. **Theme Switching:**
   - In `/admin/theme`, switch the active theme from `Slate Obsidian` to `Forest Moss`.
   - Refresh the public landing page `/en` — verify background tokens update immediately across both public layout and 3D fog canvas.
6. **Error Resilience:**
   - Visit `/en/projects/non-existent-artifact` — confirm custom stylized 404 page is returned without exposing stack traces or server internal paths.

---

## 9. Rollback & Disaster Recovery Procedures

### Application Rollback (Vercel)
If a regressions occurs in deployment:
1. Open **Vercel Dashboard → Deployments**.
2. Locate the previous healthy deployment.
3. Click the three dots `...` → **Instant Rollback**.
4. Traffic is rerouted to the prior immutable build artifact in < 500ms.

### Database Recovery (Neon Point-in-Time Recovery)
If accidental data modification or corruption occurs:
1. Open the **Neon Console** (`console.neon.tech`).
2. Navigate to your project branch (`main`).
3. Under **Branching**, select **Restore from Point in Time**.
4. Choose the timestamp prior to the incident (Neon supports minute-level recovery up to 7-30 days based on plan tier).
5. Neon will instantly spin up a recovered branch with zero data loss.
6. Point your `DATABASE_URL` to the recovered branch or promote it to default.

---

## 10. Troubleshooting & Known Limitations

| Symptom / Error | Cause | Remediation |
| :--- | :--- | :--- |
| `EPERM: rename query_engine-windows.dll.node` | Local Windows file lock caused by active `next dev` background process. | Keep `npm run build` using `next build` locally; use `vercel-build` in Vercel CI. If locked locally, restart the dev terminal. |
| `Database connection timeout` | Connecting to direct endpoint instead of pooler during high traffic. | Ensure `DATABASE_URL` uses the `-pooler.region.neon.tech` host. |
| `Cloudinary 401 Unauthorized` | Invalid `CLOUDINARY_API_KEY` or signature mismatch. | Re-verify `CLOUDINARY_API_SECRET` in environment settings; ensure no trailing spaces. |
| WebGL Canvas Black / Context Lost | Mobile device or browser without hardware acceleration. | The application automatically falls back to the high-contrast 2D diorama stage with accessible portal links. |
| React Compiler form `.watch()` notices | Using React Hook Form real-time watchers for dynamic theme/world previews. | Non-blocking advisory notices; form inputs operate reliably without stale closures. |
