Interview Management Dashboard – React/Next.js (Frontend Only)

Setup
- Node 18+
- Install: `npm i`
- Dev: `npm run dev` then open http://localhost:3000

Tech Choices
- Next.js 15 (App Router) + TypeScript
- TailwindCSS for styling
- Redux Toolkit for global auth state
- React Hook Form + Zod for forms and validation
- Axios for API calls to DummyJSON
- Radix primitives available for future UI

Roles
- admin: full access, role management mock
- ta_member: candidates, dashboards, view details
- panelist: candidates, dashboards, view details, submit feedback

Role Simulation
- Role is selected at login and stored in sessionStorage (non-sensitive). UI hides/blocks unauthorized actions and routes redirect to `/login` when not authenticated.

API Endpoints (DummyJSON)
- POST `/auth/login`
- GET `/users`, `/users/:id`
- GET `/todos?userId=<id>`
- GET `/posts?userId=<id>`

Notes on DummyJSON auth stability
- If `/auth/login` returns 400 for common samples, try `emilys` / `emilyspass`. If token is missing, the UI generates a client token to let the flow continue (frontend-only simulation).

OWASP UI Considerations
- Broken Access Control: `Protected` and `RoleGate` components hide unauthorized UI; routes redirect unauthenticated users.
- Cryptographic Failures: Do not persist passwords or secrets. Only non-sensitive session info saved in sessionStorage.
- Injection: All inputs validated via Zod, basic sanitization via React escaping; avoid dangerouslySetInnerHTML.
- Security Misconfiguration: No debug secrets; minimal logs.
- Authentication: Explicit login/logout; session bootstrap on load.
- Data Integrity: Using trusted libraries only.
- Logging/Monitoring: Non-sensitive console logs only in dev.
- CSRF Awareness: Submit buttons disable during submission with visual feedback.

Folder Structure (key)
- `src/app` – routes (`/login`, `/dashboard`, `/candidates`, `/admin`)
- `src/features/auth` – auth slice and bootstrapper
- `src/components` – shared UI (auth gates, header, KPI card)
- `src/lib` – `api.ts`, `secureStorage.ts`

Future Enhancements
- Add code splitting/lazy tabs
- Add unit tests with RTL
- Add charts for KPIs
