# Uptrix Frontend

A Next.js uptime monitoring dashboard built for the Uptrix backend API.

---

## Setup Steps

### Prerequisites

- Node.js 18+
- The [node-test backend](https://github.com/ArhamAzeem/node-test) running locally

### 1. Clone and install

```bash
git clone <your-repo-url>
cd uptrix-frontend
npm install
```

### 2. Configure environment

Copy `.env.local` (already included) or create it:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Start the backend

Follow the backend repo instructions to run the Node.js server on port 5000.

### 4. Run the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── verify-otp/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   └── dashboard/
│       ├── layout.tsx          # Protected layout with auth guard
│       ├── page.tsx            # Overview with stats
│       ├── monitors/page.tsx   # Full CRUD monitor management
│       └── profile/page.tsx    # Profile & password management
├── components/
│   ├── ui/                     # Reusable primitives (Button, Input, Modal, etc.)
│   ├── auth/                   # Auth-specific components
│   ├── landing/                # Landing page sections
│   ├── dashboard/              # Dashboard layout components
│   └── monitors/               # Monitor-specific components
├── context/
│   └── AuthContext.tsx         # Global auth state via React Context
├── hooks/
│   └── useToast.ts             # Toast notification hook
├── lib/
│   ├── api.ts                  # Typed API client (fetch wrapper)
│   └── utils.ts                # Utility helpers
└── types/
    └── index.ts                # Shared TypeScript types
```

---

## Approach

### Design System

The landing page follows the provided Figma design with:
- **Dark green theme** (`#080e0b` background, `#00c896` accent)
- **Typography**: Clean sans-serif with proper hierarchy
- **Components**: Reusable UI primitives (Button, Input, Modal, Badge, etc.)
- **Responsive**: Mobile-first approach with breakpoints at sm/md/lg
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

### Architecture

- **Next.js 15 App Router** with TypeScript for type safety and clean routing.
- **Server Components** for static pages (landing, auth forms), **Client Components** only where interactivity is needed.
- **Protected routes** implemented via a client-side layout guard in `dashboard/layout.tsx` — redirects unauthenticated users to `/auth/login`.

### API Integration

All API calls go through `src/lib/api.ts`, a thin typed fetch wrapper that:
- Attaches `Authorization: Bearer <token>` headers automatically
- Throws on non-2xx responses with the server's error message
- Keeps each endpoint co-located and easy to find

### Authentication Flow

1. **Register** → POST `/auth/register` → redirects to OTP verification
2. **Verify OTP** → POST `/auth/verify-otp` → receives JWT, logs in
3. **Login** → POST `/auth/login` → receives JWT, logs in
4. **Forgot Password** → POST `/auth/forgot-password` → OTP sent
5. **Reset Password** → POST `/auth/reset-password` → redirects to login
6. **Logout** → POST `/auth/logout` (blacklists token server-side) + clears local storage

---

## State Management

**React `useState` + `useContext`** — no external library.

- `AuthContext` holds `user`, `token`, `isAuthenticated`, and `isLoading`. It rehydrates from `localStorage` on mount so sessions persist across page refreshes.
- Local component state (`useState`) handles form data, loading flags, and UI toggles.
- The `useToast` hook manages a list of toast notifications with auto-dismiss.

This keeps the bundle lean and avoids over-engineering for the scope of this project.

---

## Tradeoffs

| Decision | Tradeoff |
|---|---|
| `localStorage` for token persistence | Simple and works well for SPAs. Not suitable for SSR-heavy apps where `httpOnly` cookies would be preferred. |
| Client-side auth guard | Slightly visible redirect flash on protected routes. A middleware-based guard (`middleware.ts`) would be cleaner but requires cookie-based auth. |
| No external state library | Keeps things simple. If the app grew significantly (e.g., real-time updates, complex caching), React Query or Zustand would be worth adding. |
| Static export-friendly pages | All pages are statically pre-rendered at build time. Dynamic data is fetched client-side, which is appropriate for a dashboard app. |

---

## Features Implemented

- **Landing Page** — Hero, Features, How It Works, Pricing, Footer. Fully responsive.
- **Authentication** — Register, Login, OTP Verify, Forgot Password, Reset Password, Logout.
- **Session Persistence** — JWT stored in `localStorage`, rehydrated on mount.
- **Protected Routes** — Dashboard layout redirects unauthenticated users.
- **Monitor CRUD** — Create, Read (paginated + filtered), Update, Delete monitors.
- **Monitor Toggle** — Activate/pause monitors with a single click.
- **Search & Filters** — Filter by name/URL, HTTP method, and active status.
- **Profile Management** — Update name, change password.
- **Loading & Error States** — Spinners, error banners, and toast notifications throughout.
- **Form Validation** — Client-side validation with field-level error messages.
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation (Escape closes modals).
