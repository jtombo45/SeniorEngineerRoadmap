# Environment and Configuration

> **Stuff beginners usually find confusing**

## The Goal

When you join a React project, you'll see:
- `package.json` with mysterious scripts
- `.env` files with secrets
- Build errors you don't understand
- Configuration files everywhere

This guide demystifies the React development environment.

## package.json: Your Project's Manifest

### What It Is

`package.json` is the **configuration file** for your Node.js/React project. It tells the system:
- What dependencies you need
- What scripts you can run
- Project metadata (name, version, etc.)

### Key Sections

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "@vitejs/plugin-react": "^3.0.0"
  }
}
```

### Scripts

**What they are:** Commands you can run with `npm run <script-name>`

**Common scripts:**
- `npm start` or `npm run dev` — start development server
- `npm run build` — create production build
- `npm test` — run tests
- `npm run lint` — check code quality

**Example:**
```json
{
  "scripts": {
    "dev": "vite",           // npm run dev → starts dev server
    "build": "vite build",   // npm run build → creates dist/
    "preview": "vite preview" // npm run preview → previews build
  }
}
```

**How to use:**
```bash
npm run dev      # Runs "dev" script
npm run build    # Runs "build" script
```

### Dependencies vs devDependencies

**dependencies:**
- Packages needed **in production** (when app runs)
- Examples: `react`, `react-dom`, `axios`
- Installed when user runs your app

**devDependencies:**
- Packages needed **only during development**
- Examples: `vite`, `eslint`, testing libraries
- Not included in production build

**Rule of thumb:**
- If code **imports** it → `dependencies`
- If it's a **tool** (build, test, lint) → `devDependencies`

**Example:**
```json
{
  "dependencies": {
    "react": "^18.2.0"  // Your code imports React
  },
  "devDependencies": {
    "vite": "^4.0.0"    // Vite builds your app, but code doesn't import it
  }
}
```

## Environment Variables

### What They Are

**Environment variables** are configuration values that change based on environment (development, staging, production).

**Why:** You don't want to hardcode:
- API URLs (different per environment)
- API keys (should be secret)
- Feature flags

### How to Use Them

**1. Create `.env` file** (in project root):
```bash
# .env
VITE_API_URL=http://localhost:3000/api
VITE_API_KEY=your-secret-key
```

**2. Access in code:**
```jsx
// In React (Vite)
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;
```

**Important:** In Vite, variables must start with `VITE_` to be exposed to client code.

**3. Use in API calls:**
```jsx
// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
}
```

### Different Environments

**`.env`** — Default (usually development)  
**`.env.local`** — Local overrides (gitignored)  
**`.env.production`** — Production values  
**`.env.development`** — Development values  

**Priority:** `.env.local` > `.env.production` > `.env.development` > `.env`

### Security: What NOT to Put in .env

**❌ Don't put in client-side code:**
- Real API keys (they'll be visible in browser)
- Database passwords
- Private keys

**✅ Safe to put:**
- Public API URLs
- Feature flags
- Non-sensitive configuration

**Why:** Environment variables in React are **bundled into the JavaScript**. Anyone can see them in the browser.

**For real secrets:** Keep them on the server. React calls your backend, backend calls the API with secrets.

## Build vs Runtime Configuration

### Build-Time

**When:** During `npm run build`  
**What:** Values baked into the JavaScript bundle  
**Example:** Environment variables, feature flags

```jsx
// This value is determined at build time
const API_URL = import.meta.env.VITE_API_URL;
// If you change .env after building, it won't change
```

### Runtime

**When:** When the app runs in the browser  
**What:** Values read when code executes  
**Example:** User preferences, dynamic config

```jsx
// This value is read at runtime
const theme = localStorage.getItem('theme') || 'light';
// Can change while app is running
```

## Common Configuration Files

### vite.config.js (Vite Projects)

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'  // Proxy API calls
    }
  }
});
```

**What it does:** Configures the Vite build tool.

### .eslintrc.js or eslint.config.js

```js
module.exports = {
  extends: ['react-app'],
  rules: {
    'no-console': 'warn'
  }
};
```

**What it does:** Configures code linting rules.

### tsconfig.json (TypeScript Projects)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx"
  }
}
```

**What it does:** Configures TypeScript compiler.

## Common Mistakes

### 1. Forgetting VITE_ Prefix

```jsx
// ❌ Won't work
const apiUrl = import.meta.env.API_URL;

// ✅ Works
const apiUrl = import.meta.env.VITE_API_URL;
```

### 2. Using process.env (Create React App) in Vite

```jsx
// ❌ Vite doesn't use process.env
const apiUrl = process.env.REACT_APP_API_URL;

// ✅ Vite uses import.meta.env
const apiUrl = import.meta.env.VITE_API_URL;
```

**Note:** Create React App uses `process.env.REACT_APP_*`. Vite uses `import.meta.env.VITE_*`.

### 3. Not Restarting Dev Server

**Problem:** Changed `.env` file, but changes don't appear.

**Solution:** Restart the dev server (`npm run dev`).

### 4. Committing .env to Git

**Problem:** Secrets in version control.

**Solution:** Add `.env` to `.gitignore`:
```
.env
.env.local
```

**Create `.env.example`** (committed) with placeholder values:
```bash
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_API_KEY=your-api-key-here
```

### 5. Hardcoding URLs

```jsx
// ❌ Bad: Hardcoded
const response = await fetch('http://localhost:3000/api/users');

// ✅ Good: Environment variable
const API_URL = import.meta.env.VITE_API_URL;
const response = await fetch(`${API_URL}/users`);
```

## Understanding Build Output

### Development Build

**Command:** `npm run dev`  
**Output:** Development server (no files created)  
**Features:** Hot reload, source maps, fast refresh

### Production Build

**Command:** `npm run build`  
**Output:** `dist/` folder with optimized files  
**Features:** Minified, optimized, ready to deploy

**What's in `dist/`:**
```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js  (minified, hashed)
│   └── index-def456.css
```

**File hashing:** Files have hashes in names (`index-abc123.js`). This enables caching—when code changes, filename changes, browser downloads new file.

## Node Modules: What Are They?

**`node_modules/`** — Folder containing all installed packages.

**When you run `npm install`:**
1. Reads `package.json`
2. Downloads packages listed in `dependencies` and `devDependencies`
3. Stores them in `node_modules/`

**Rule:** Never edit files in `node_modules/`. They are managed by npm.

**Size:** Can be huge (hundreds of MB). That's normal.

**`.gitignore`:** Usually gitignored (too large, can be regenerated).

## package-lock.json

**What it is:** Lock file that pins exact versions of dependencies.

**Why:** Ensures everyone gets the same versions.

**Rule:** Commit it to git. Don't edit it manually.

## Key Takeaways

1. **package.json** — project configuration and dependencies
2. **dependencies** vs **devDependencies** — production vs development tools
3. **Environment variables** — use `.env` files (with `VITE_` prefix in Vite)
4. **Never commit secrets** — use `.env.local` and `.gitignore`
5. **Restart dev server** after changing `.env`

## Quick Reference

### Vite Environment Variables
```jsx
// Access
const value = import.meta.env.VITE_MY_VAR;

// Mode (development/production)
const isDev = import.meta.env.MODE === 'development';
```

### Create React App Environment Variables
```jsx
// Access
const value = process.env.REACT_APP_MY_VAR;

// Mode
const isDev = process.env.NODE_ENV === 'development';
```

### Common Scripts
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm start            # Start dev server (CRA)
npm run build        # Create production build
npm test             # Run tests
npm run lint         # Check code quality
```

## Next Steps

- **Debugging:** [`debugging-and-dev-workflow.md`](./debugging-and-dev-workflow.md)
- **Project structure:** [`project-structure.md`](./project-structure.md)
- **See examples:** Check `package.json` in [`../Contact Manager/`](../Contact%20Manager/)

