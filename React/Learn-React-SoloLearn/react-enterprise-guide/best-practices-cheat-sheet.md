# Best Practices Cheat Sheet

> **Skimmable wisdom from someone who's been burned before**

## Component Design

### ✅ Do

- **Keep components small** — one job per component
- **Use descriptive names** — `UserProfileCard`, not `Card`
- **Extract reusable logic** — custom hooks for shared behavior
- **Compose components** — build complex UIs from simple pieces
- **Use function components** — modern standard

### ❌ Don't

- **Giant components** — if it's 200+ lines, split it up
- **Generic names** — `Component`, `Wrapper`, `Container` (be specific)
- **Duplicate logic** — extract to hooks or utilities
- **Mix concerns** — UI, logic, and API calls in one component
- **Use class components** — unless maintaining legacy code

## State Management

### ✅ Do

- **Start with local state** — `useState` is fine for most cases
- **Lift state when needed** — when siblings need to share
- **Use global state sparingly** — only when many components need it
- **Compute derived state** — don't store what you can calculate
- **Keep state close to usage** — don't lift higher than necessary

### ❌ Don't

- **Overuse Redux** — most apps don't need it
- **Store derived state** — compute it instead
- **Prop drill unnecessarily** — use Context for deep trees
- **Duplicate state** — single source of truth
- **Mutate state** — always create new objects/arrays

```jsx
// ❌ Bad: Mutation
items.push(newItem);
setItems(items);

// ✅ Good: New array
setItems([...items, newItem]);
```

## Props and Data Flow

### ✅ Do

- **Pass only needed props** — don't pass entire objects if you only need one field
- **Use prop types** — TypeScript or PropTypes for validation
- **Keep props minimal** — if passing 5+ props, consider an object
- **Document complex props** — JSDoc comments for clarity

### ❌ Don't

- **Pass everything** — `{...props}` everywhere (be selective)
- **Modify props** — props are read-only
- **Pass functions that recreate** — memoize callbacks if needed
- **Prop drill deeply** — use Context or state management

## Performance

### ✅ Do

- **Memoize expensive calculations** — `useMemo` for heavy computations
- **Memoize callbacks** — `useCallback` when passing to memoized children
- **Lazy load routes** — `React.lazy()` for code splitting
- **Optimize re-renders** — `React.memo` for expensive components
- **Profile first** — measure before optimizing

### ❌ Don't

- **Premature optimization** — optimize when you have a problem
- **Memoize everything** — overhead can outweigh benefits
- **Forget dependencies** — `useEffect`, `useMemo`, `useCallback` need correct deps
- **Create objects in render** — can cause unnecessary re-renders

```jsx
// ❌ Bad: New object every render
<Child style={{ color: 'red' }} />

// ✅ Good: Stable reference
const style = { color: 'red' };
<Child style={style} />
```

## Hooks

### ✅ Do

- **Follow Rules of Hooks** — only call at top level, not in conditionals
- **Include all dependencies** — in `useEffect`, `useMemo`, `useCallback`
- **Clean up effects** — return cleanup function from `useEffect`
- **Extract custom hooks** — for reusable logic
- **Name hooks with "use"** — `useAuth`, `useProducts`

### ❌ Don't

- **Call hooks conditionally** — always at top level
- **Forget dependencies** — causes stale closures
- **Create infinite loops** — `useEffect` that updates its own dependency
- **Mix concerns in one hook** — one hook, one purpose

```jsx
// ❌ Bad: Missing dependency
useEffect(() => {
  fetchUser(userId);
}, []); // Missing userId

// ✅ Good: All dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

## File Organization

### ✅ Do

- **Group by feature** — when features are independent
- **Group by layer** — when code is shared across features
- **One component per file** — easier to find and maintain
- **Co-locate related files** — component + styles + tests together
- **Use index files** — for clean imports

### ❌ Don't

- **Mix patterns** — be consistent within a project
- **Deep nesting** — 3-4 levels max
- **Generic folders** — `components`, `utils` (be more specific)
- **Everything in one file** — split when it gets long

## Naming Conventions

### ✅ Do

- **PascalCase for components** — `UserProfile.jsx`
- **camelCase for functions/hooks** — `getUser`, `useAuth`
- **UPPER_SNAKE_CASE for constants** — `API_BASE_URL`
- **Descriptive names** — `handleSubmit`, not `handleClick`
- **Boolean prefixes** — `isLoading`, `hasError`, `canEdit`

### ❌ Don't

- **Abbreviations** — `usr` instead of `user`
- **Generic names** — `data`, `item`, `thing`
- **Magic numbers/strings** — use named constants
- **Reserved words** — `class`, `function`, `return`

## Error Handling

### ✅ Do

- **Handle errors gracefully** — show user-friendly messages
- **Log errors** — `console.error` or error tracking service
- **Set error boundaries** — catch component tree errors
- **Validate inputs** — client and server side
- **Provide fallbacks** — loading states, empty states

### ❌ Don't

- **Silent failures** — log or show errors
- **Expose technical errors** — "Network error" not "ECONNREFUSED"
- **Ignore async errors** — always `.catch()` promises
- **Assume APIs work** — always handle failures

```jsx
// ❌ Bad: No error handling
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);

// ✅ Good: Error handling
useEffect(() => {
  fetchUser(userId)
    .then(setUser)
    .catch(error => {
      console.error('Failed to fetch user:', error);
      setError('Failed to load user');
    });
}, [userId]);
```

## Security

### ✅ Do

- **Validate on server** — client validation is for UX only
- **Sanitize user input** — before rendering
- **Use HTTPS** — in production
- **Keep secrets server-side** — never in client code
- **Escape by default** — React does this, but be careful with `dangerouslySetInnerHTML`

### ❌ Don't

- **Trust client input** — always validate server-side
- **Expose API keys** — keep in environment variables (server-side)
- **Use `dangerouslySetInnerHTML` with user input** — XSS risk
- **Store sensitive data in localStorage** — can be accessed by scripts

## Testing (High-Level)

### ✅ Do

- **Test behavior, not implementation** — test what user sees
- **Test user interactions** — clicks, inputs, form submissions
- **Test edge cases** — empty states, error states
- **Keep tests simple** — one assertion per test (when possible)

### ❌ Don't

- **Test implementation details** — test outcomes, not how
- **Over-mock** — mock only external dependencies
- **Write brittle tests** — tests that break on refactors
- **Skip testing** — at least test critical paths

## Code Quality

### ✅ Do

- **Use ESLint** — catch common mistakes
- **Format consistently** — Prettier or similar
- **Write readable code** — code is read more than written
- **Comment "why" not "what"** — code should be self-documenting
- **Refactor regularly** — don't let tech debt accumulate

### ❌ Don't

- **Ignore linting errors** — fix or configure, don't ignore
- **Write clever code** — write clear code
- **Copy-paste without understanding** — know what code does
- **Leave TODO comments** — either do it or remove the comment

## Common Pitfalls

### 1. Stale Closures

```jsx
// ❌ Bad: Stale count
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count); // Always logs initial value
  }, 1000);
  return () => clearInterval(timer);
}, []); // Missing count dependency

// ✅ Good: Current count
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count); // Logs current value
  }, 1000);
  return () => clearInterval(timer);
}, [count]); // Include dependency
```

### 2. Infinite Loops

```jsx
// ❌ Bad: Updates dependency
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1); // Infinite loop!
}, [count]);

// ✅ Good: Conditional update
useEffect(() => {
  if (count < 10) {
    setCount(count + 1);
  }
}, []); // Or use different logic
```

### 3. Missing Cleanup

```jsx
// ❌ Bad: Memory leak
useEffect(() => {
  const subscription = subscribe();
  // No cleanup - subscription never unsubscribes
}, []);

// ✅ Good: Cleanup
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe(); // Cleanup
}, []);
```

## Quick Reference

### Component Checklist

- [ ] Single responsibility
- [ ] Descriptive name
- [ ] Props typed/validated
- [ ] Error handling
- [ ] Loading states
- [ ] Accessible (if UI component)

### State Checklist

- [ ] State in right place (local vs global)
- [ ] No derived state stored
- [ ] No mutations
- [ ] Proper cleanup (if needed)

### Effect Checklist

- [ ] All dependencies included
- [ ] Cleanup function (if needed)
- [ ] No infinite loops
- [ ] Handles errors

## If You Remember Nothing Else

1. **Components are functions** — input (props) → output (JSX)
2. **State flows down, events flow up** — fundamental pattern
3. **Don't mutate state** — create new objects/arrays
4. **Handle errors** — always
5. **Profile before optimizing** — measure, don't guess

## Next Steps

- **Architecture overview:** [`architecture-overview.md`](./architecture-overview.md)
- **State management:** [`state-and-data-flow.md`](./state-and-data-flow.md)
- **Project structure:** [`project-structure.md`](./project-structure.md)
- **Deep dives:** [`../Intro To React/`](../Intro%20To%20React/)

---

**Remember:** These are guidelines, not rules. Context matters. When in doubt, prioritize readability and maintainability.

