# React Project Structure

> **How to read and navigate real React codebases**

## The Goal

When you join a React project, you need to answer:
- **Where do I find components?**
- **Where does state live?**
- **Where are API calls?**
- **How is this organized?**

This guide shows you common patterns so you can orient yourself quickly.

## Common Folder Structures

### Pattern 1: Feature-Based (Most Common in Enterprise)

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   └── authApi.js
│   │   └── index.js
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── cart/
├── shared/
│   ├── components/
│   │   ├── Button.jsx
│   │   └── Modal.jsx
│   └── utils/
│       └── helpers.js
├── store/
│   └── reducers/
└── App.jsx
```

**Philosophy:** Group by **business feature**, not by technical layer.

**Why:** Teams own features. Easier to find related code.

**When you'll see this:** Large apps, multiple teams, micro-frontends.

### Pattern 2: Layer-Based (Traditional)

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   └── Input.jsx
│   └── pages/
│       ├── HomePage.jsx
│       └── AboutPage.jsx
├── containers/
│   ├── HomeContainer.jsx
│   └── AboutContainer.jsx
├── hooks/
│   └── useApi.js
├── services/
│   └── api.js
├── store/
│   └── reducers/
└── App.jsx
```

**Philosophy:** Group by **technical layer** (components, logic, data).

**Why:** Clear separation of concerns, familiar to MVC developers.

**When you'll see this:** Smaller apps, teams coming from MVC backgrounds.

### Pattern 3: Hybrid (Common in Practice)

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   │   ├── Button.jsx
│   │   └── Modal.jsx
│   └── layout/      # Layout components
│       ├── Header.jsx
│       └── Footer.jsx
├── features/
│   ├── auth/
│   └── products/
├── hooks/
│   └── useAuth.js
├── services/
│   └── api.js
└── App.jsx
```

**Philosophy:** Mix of both—shared components separate, features grouped.

**Why:** Balance between reusability and feature ownership.

**When you'll see this:** Medium-to-large apps, evolving codebases.

## What Lives Where

### `/components` or `/features/*/components`

**What:** React components (JSX files)

**Examples:**
- `Button.jsx` — reusable button
- `UserProfile.jsx` — user profile display
- `ProductCard.jsx` — product display card

**Naming:** Usually PascalCase (`UserProfile.jsx`)

**What to look for:**
- `.jsx` or `.js` files
- Files that export React components
- Often paired with `.css` or `.module.css` files

### `/hooks` or `/features/*/hooks`

**What:** Custom React hooks

**Examples:**
- `useAuth.js` — authentication logic
- `useApi.js` — API call wrapper
- `useLocalStorage.js` — localStorage helper

**Naming:** Usually camelCase starting with `use` (`useAuth.js`)

**What to look for:**
- Functions that start with `use`
- Files that export hooks
- Logic that's reused across components

### `/services` or `/api` or `/features/*/services`

**What:** API calls, external service integrations

**Examples:**
- `authApi.js` — authentication endpoints
- `productApi.js` — product endpoints
- `api.js` — centralized API client

**Naming:** Usually camelCase (`authApi.js`)

**What to look for:**
- Functions that make HTTP requests
- `fetch()` or `axios` calls
- API endpoint definitions

**Example:**
```jsx
// services/authApi.js
export async function login(email, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```

### `/store` or `/redux` or `/state`

**What:** Global state management (Redux, Zustand, Context)

**Examples:**
- `store.js` — Redux store configuration
- `reducers/` — Redux reducers
- `actions/` — Redux actions

**What to look for:**
- `createStore()` or `configureStore()`
- Reducer functions
- Action creators

> 💡 **Reference:** See [`../Intro To React/`](../Intro%20To%20React/) for Redux deep dives.

### `/pages` or `/routes` or `/views`

**What:** Top-level page components (route handlers)

**Examples:**
- `HomePage.jsx` — home route
- `ProductPage.jsx` — product detail route
- `NotFoundPage.jsx` — 404 page

**What to look for:**
- Components that correspond to URLs
- Often used with React Router

### `/utils` or `/helpers` or `/lib`

**What:** Pure utility functions (no React-specific code)

**Examples:**
- `formatDate.js` — date formatting
- `validateEmail.js` — email validation
- `constants.js` — app constants

**What to look for:**
- Functions that don't use React hooks
- Pure functions (same input → same output)
- No JSX

### `/assets` or `/public`

**What:** Static files (images, fonts, etc.)

**Examples:**
- `logo.png`
- `fonts/`
- `icons/`

**Note:** `/public` is usually served directly. `/assets` is usually imported in code.

## Mapping to MVC Mental Models

If you're coming from MVC frameworks:

| MVC Concept | React Equivalent | Location |
|------------|------------------|----------|
| **View** | Component | `/components` |
| **Controller** | Container/Hook | `/containers` or `/hooks` |
| **Model** | State/Store | `/store` or component state |
| **Service** | API Service | `/services` or `/api` |

**Key difference:** In React, the "controller" logic often lives in:
- Custom hooks (`useAuth`, `useProducts`)
- Container components
- Redux thunks/sagas

## How Large Teams Organize

### Feature Teams

Each team owns a **feature folder**:

```
src/
├── features/
│   ├── checkout/      # Team A owns this
│   ├── products/      # Team B owns this
│   └── user-profile/  # Team C owns this
```

**Benefits:**
- Clear ownership
- Teams don't step on each other
- Easier to split into micro-frontends later

### Shared Components

Common UI components live in `/shared` or `/components/ui`:

```
src/
├── shared/
│   ├── components/
│   │   ├── Button.jsx    # Everyone uses this
│   │   └── Modal.jsx
│   └── hooks/
│       └── useDebounce.js
```

**Rule:** If two or more features use it, it's shared.

## How to Orient Yourself in a New Repo

### Step 1: Find the Entry Point

Look for:
- `src/index.js` or `src/main.jsx`
- `src/App.jsx` or `src/App.js`

This shows you the **root component** and routing structure.

### Step 2: Understand Routing

Look for:
- `react-router` imports
- `<Route>` components
- `/pages` or `/routes` folder

This tells you **what pages exist** and how URLs map to components.

### Step 3: Find State Management

Look for:
- `redux` imports → Redux store
- `useContext` → Context API
- `zustand` or other → alternative state lib

This tells you **where global state lives**.

### Step 4: Find API Integration

Look for:
- `/services` or `/api` folder
- `fetch` or `axios` imports
- API base URLs in config

This tells you **how the app talks to the backend**.

### Step 5: Find the Feature You're Working On

Look for:
- Feature-based folders
- Component names related to your task
- Related hooks/services

This tells you **where your changes go**.

## Common File Naming Conventions

### Components
- `PascalCase.jsx` — `UserProfile.jsx`
- Sometimes: `user-profile.jsx` (kebab-case)

### Hooks
- `camelCase` starting with `use` — `useAuth.js`

### Utilities
- `camelCase.js` — `formatDate.js`
- Sometimes: `kebab-case.js` — `format-date.js`

### Constants
- `UPPER_SNAKE_CASE.js` — `API_CONSTANTS.js`
- Or: `camelCase.js` — `constants.js`

## Example: Navigating a Real Project

**Task:** "Add a 'Save' button to the user profile page"

**Your process:**
1. **Find routing** → Look in `App.jsx` for `/profile` route
2. **Find component** → `features/user-profile/components/UserProfile.jsx`
3. **Check state** → Does it use Redux? Check `/store/reducers/user.js`
4. **Check API** → Does it save? Check `/services/userApi.js`
5. **Add button** → Edit `UserProfile.jsx`, import shared `Button` component

## Red Flags (Things That Suggest Poor Organization)

- **Everything in one file** → Should be split
- **No clear feature boundaries** → Hard to find related code
- **Components calling APIs directly** → Should use services/hooks
- **State scattered everywhere** → Should be centralized or clearly scoped

## Key Takeaways

1. **Feature-based** is most common in enterprise
2. **Components** = UI, **Hooks** = Logic, **Services** = API calls
3. **Shared code** lives in `/shared` or `/components/ui`
4. **State** lives in `/store` (global) or components (local)
5. **Start with entry point** → routing → state → your feature

## Next Steps

- **Understand data flow:** [`state-and-data-flow.md`](./state-and-data-flow.md)
- **See a real example:** [`../Contact Manager/`](../Contact%20Manager/)
- **Learn React basics:** [`../Intro To React/`](../Intro%20To%20React/)

