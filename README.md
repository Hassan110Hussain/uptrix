# Uptrix Frontend

A modern Next.js uptime monitoring dashboard built with TypeScript, Tailwind CSS, and React Context for state management. This application provides a comprehensive interface for monitoring website uptime, managing monitors, and handling user authentication.

## 🚀 Setup Steps

### Prerequisites

- **Node.js 18+** - Required for running the Next.js application
- **Backend API** - The Uptrix backend server running on port 5000
- **Modern Browser** - Chrome, Firefox, Safari, or Edge

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd uptrix-frontend
npm install
```

### 2. Environment Configuration

The project includes a `.env.local` file with the following configuration:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000/api/v1
```

If you need to modify the backend URL, update this file accordingly.

### 3. Start the Backend Server

Ensure the Uptrix backend API is running on port 5000. The frontend expects the following endpoints to be available:

- Authentication: `/auth/*`
- Monitors: `/monitors/*`
- User Profile: `/auth/me`, `/auth/update-profile`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production

```bash
npm run build
npm start
```

## 🏗️ Approach

### Architecture Overview

The application follows a modern React architecture with the following key principles:

#### **Next.js 16 App Router**
- Utilizes the latest App Router for file-based routing
- Server Components for static content and Client Components for interactive features
- Automatic code splitting and optimization

#### **Component-Based Architecture**
```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard pages
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI primitives
│   ├── auth/             # Authentication components
│   ├── landing/          # Landing page sections
│   ├── dashboard/        # Dashboard layout components
│   └── monitors/         # Monitor management components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
└── types/                # TypeScript type definitions
```

#### **Design System**
- **Dark Theme**: Primary background `#0a0f0d` with accent color `#00c896`
- **Typography**: Inter font family for clean, modern appearance
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation support

#### **Authentication Flow**
1. **Registration** → Email verification via OTP → Dashboard access
2. **Login** → JWT token storage → Persistent sessions
3. **Password Recovery** → OTP verification → Password reset
4. **Session Management** → Automatic token refresh and logout

#### **API Integration**
- Centralized API client in `src/lib/api.ts`
- Automatic JWT token attachment for authenticated requests
- Comprehensive error handling with user-friendly messages
- Type-safe API calls with TypeScript interfaces

## 🔄 State Management Choice

### React Context + useState Pattern

**Primary Choice: React Context API with Local State**

The application uses a hybrid approach combining React Context for global state and local `useState` for component-specific state:

#### **Global State (AuthContext)**
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}
```

**Features:**
- **Session Persistence**: Automatic localStorage integration for token/user data
- **SSR Compatibility**: Handles hydration mismatches gracefully
- **Type Safety**: Full TypeScript support with strict typing
- **Performance**: Minimal re-renders with selective context updates

#### **Local State Management**
- Form data and validation states use `useState`
- UI toggles (modals, dropdowns) managed locally
- Loading states for individual components
- Toast notifications via custom `useToast` hook

#### **Why This Approach?**

1. **Simplicity**: No external dependencies, leverages React's built-in capabilities
2. **Bundle Size**: Keeps the application lightweight
3. **Learning Curve**: Easy to understand and maintain
4. **Sufficient Complexity**: Adequate for the current application scope

## ⚖️ Tradeoffs

### Technical Decisions and Their Implications

| Decision | Benefits | Tradeoffs | Rationale |
|----------|----------|-----------|-----------|
| **localStorage for Token Storage** | Simple implementation, works across tabs, persists sessions | Not suitable for SSR, vulnerable to XSS attacks | Appropriate for SPA architecture, simpler than httpOnly cookies |
| **Client-Side Authentication Guard** | Easy to implement, works with App Router | Brief redirect flash on protected routes | Acceptable UX trade-off, middleware would require cookie-based auth |
| **React Context vs External State Library** | No additional dependencies, built-in React feature | Limited devtools, manual optimization needed | Project complexity doesn't justify Redux/Zustand overhead |
| **Tailwind CSS** | Rapid development, consistent design system, small bundle | Learning curve, utility-first approach | Excellent for component-based architecture and responsive design |
| **TypeScript Strict Mode** | Type safety, better developer experience, fewer runtime errors | Longer development time, steeper learning curve | Essential for maintainable large-scale applications |
| **Next.js App Router** | Modern routing, automatic optimizations, server components | Newer API, fewer community resources | Future-proof choice, better performance characteristics |

### Performance Considerations

- **Code Splitting**: Automatic route-based splitting via Next.js
- **Image Optimization**: Next.js built-in image optimization for assets
- **Bundle Analysis**: Minimal dependencies to keep bundle size small
- **Caching Strategy**: Browser caching for static assets, API response caching

### Security Considerations

- **Input Validation**: Client-side validation with server-side verification
- **XSS Protection**: Sanitized user inputs and secure token handling
- **CSRF Protection**: Token-based authentication reduces CSRF risks
- **Environment Variables**: Sensitive configuration via environment variables

### Scalability Considerations

- **Component Reusability**: Modular UI components for easy extension
- **Type Safety**: Comprehensive TypeScript coverage for maintainability
- **API Abstraction**: Centralized API layer for easy backend changes
- **State Management**: Easily upgradeable to more complex state solutions

## 🎯 Features Implemented

### Core Functionality
- ✅ **Landing Page** - Hero section, features, pricing, responsive design
- ✅ **User Authentication** - Register, login, OTP verification, password reset
- ✅ **Session Management** - Persistent login, automatic logout, token refresh
- ✅ **Monitor Management** - CRUD operations for uptime monitors
- ✅ **Dashboard** - Overview statistics, monitor list, user profile
- ✅ **Search & Filtering** - Filter monitors by name, URL, method, status
- ✅ **Responsive Design** - Mobile-first approach, works on all devices

### Technical Features
- ✅ **Type Safety** - Comprehensive TypeScript coverage
- ✅ **Error Handling** - User-friendly error messages and loading states
- ✅ **Form Validation** - Real-time validation with error feedback
- ✅ **Accessibility** - ARIA labels, keyboard navigation, semantic HTML
- ✅ **Performance** - Optimized builds, code splitting, lazy loading

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Project Structure

The codebase follows a feature-based organization with clear separation of concerns:

- **Pages**: App Router structure in `src/app/`
- **Components**: Reusable UI components in `src/components/`
- **Business Logic**: API calls and utilities in `src/lib/`
- **Type Definitions**: Centralized types in `src/types/`
- **State Management**: Context providers in `src/context/`

This structure ensures maintainability, testability, and scalability as the application grows.