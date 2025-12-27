# Debugging and Dev Workflow

> **How people actually debug React apps**

## The Goal

When things break in React, you need to:
1. **Find the problem** (which component, what state)
2. **Understand why** (data flow, timing, state)
3. **Fix it** (update code, test, verify)

This guide shows you the tools and strategies that actually work.

## React DevTools: Your Best Friend

### Installation

**Chrome/Edge:** Install "React Developer Tools" extension  
**Firefox:** Install "React Developer Tools" add-on

### What It Shows You

1. **Component tree** — see all components and their hierarchy
2. **Props and state** — inspect values in real-time
3. **Hooks** — see hook values and dependencies
4. **Profiler** — find performance bottlenecks

### How to Use It

**1. Open DevTools:**
- Right-click → Inspect
- Or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)

**2. Find React tab:**
- Look for "⚛️ Components" tab
- If you don't see it, React DevTools isn't installed or page doesn't use React

**3. Inspect components:**
- Click a component in the tree
- See props, state, hooks in the right panel
- Edit values to test changes

**4. Find components:**
- Click the "target" icon (crosshair)
- Click an element on the page
- DevTools highlights the React component

### Common Use Cases

**"Why isn't this updating?"**
1. Select component in DevTools
2. Check if props/state changed
3. If not, trace data flow up the tree

**"What props is this receiving?"**
1. Select component
2. See props in right panel
3. Check if values are what you expect

**"What's the current state?"**
1. Select component
2. See state/hooks in right panel
3. Verify values match expectations

## Redux DevTools (If Using Redux)

### Installation

**Chrome/Edge:** Install "Redux DevTools" extension

### What It Shows You

1. **State tree** — current Redux state
2. **Action history** — all dispatched actions
3. **Time travel** — replay actions to see state changes
4. **Diff view** — see what changed after each action

### How to Use It

**1. Open DevTools:**
- Look for "Redux" tab (or "⚛️" tab if using React DevTools integration)

**2. Inspect state:**
- See current state tree
- Search for specific values
- Inspect nested objects

**3. Debug actions:**
- See action history (what was dispatched, when)
- Click an action to see state before/after
- Replay actions to reproduce bugs

**4. Time travel:**
- Click "Jump to action" to see state at that point
- Useful for: "What was the state when this bug happened?"

> 💡 **Reference:** See [`../Intro To React/`](../Intro%20To%20React/) for Redux setup.

## Console Debugging Strategy

### The Basics

**console.log()** — Your go-to tool

```jsx
function UserProfile({ userId }) {
  console.log('UserProfile rendered with userId:', userId);
  
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    console.log('Fetching user:', userId);
    getUser(userId).then(user => {
      console.log('User fetched:', user);
      setUser(user);
    });
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

### Better Console Methods

**console.table()** — For arrays/objects
```jsx
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
console.table(users);
// Shows nice table in console
```

**console.group()** — Group related logs
```jsx
console.group('User Profile');
console.log('userId:', userId);
console.log('user:', user);
console.groupEnd();
```

**console.error()** — For errors (shows in red, includes stack trace)
```jsx
try {
  await riskyOperation();
} catch (error) {
  console.error('Operation failed:', error);
}
```

### Debugging State Updates

**Problem:** State isn't updating as expected

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    console.log('Before update:', count);
    setCount(count + 1);
    console.log('After update (wrong!):', count); // Still old value!
  };
  
  // ✅ Log in render or useEffect
  console.log('Current count:', count);
  
  return <button onClick={handleClick}>Count: {count}</button>;
}
```

**Key point:** State updates are **asynchronous**. Log in render or `useEffect` to see new values.

### Debugging useEffect

**Problem:** Effect runs too often or not at all

```jsx
useEffect(() => {
  console.log('Effect running');
  console.log('Dependencies:', { userId, filter });
  
  // Your effect code
}, [userId, filter]); // Log dependencies to see what changed
```

**Common issues:**
- Missing dependency → effect doesn't run when it should
- Wrong dependency → effect runs when it shouldn't
- Object/array dependency → effect runs every render (reference changes)

## Reasoning About Bugs in Component Trees

### The Process

**1. Identify the symptom:**
- "Button doesn't work"
- "Data doesn't show"
- "Component doesn't update"

**2. Find the component:**
- Use React DevTools "target" icon
- Or search codebase for component name

**3. Check data flow:**
- Where does data come from? (props, state, API)
- Is data correct? (log it, check in DevTools)
- Does data flow down correctly? (check parent)

**4. Check event flow:**
- Is event handler attached? (check `onClick={handler}`)
- Does handler update state? (check handler code)
- Does state update trigger re-render? (check if component re-renders)

**5. Trace the flow:**
```
User clicks button
  → onClick handler called?
    → State updated?
      → Component re-rendered?
        → New props passed down?
          → Child updated?
```

### Example: "Button doesn't update count"

**Step 1:** Find the button component
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Step 2:** Check if handler is called
```jsx
const handleClick = () => {
  console.log('Button clicked'); // Add this
  setCount(count + 1);
};
```

**Step 3:** Check if state updates
```jsx
useEffect(() => {
  console.log('Count changed:', count); // Add this
}, [count]);
```

**Step 4:** Check if component re-renders
```jsx
console.log('Counter rendered, count:', count); // Add this at top
```

**If count updates but UI doesn't:** Check if you're reading the right state, or if there's a rendering issue.

## Common Debugging Scenarios

### "Component doesn't re-render"

**Check:**
1. Did state actually change? (log it, check DevTools)
2. Is state in the right component? (maybe it's in parent/child)
3. Are you mutating state? (React won't detect object/array mutations)

```jsx
// ❌ Bad: Mutation
const [items, setItems] = useState([1, 2, 3]);
items.push(4); // Mutation - React won't detect
setItems(items); // Still same reference

// ✅ Good: New array
setItems([...items, 4]); // New reference - React detects
```

### "Props aren't updating"

**Check:**
1. Is parent passing new props? (check parent component)
2. Are props the same reference? (object/array props)
3. Is component memoized? (React.memo might be blocking update)

```jsx
// Parent
const [user, setUser] = useState({ name: 'Alice' });
// ❌ Bad: Same object reference
user.name = 'Bob';
setUser(user);

// ✅ Good: New object
setUser({ ...user, name: 'Bob' });
```

### "useEffect runs too often"

**Check:**
1. Dependencies array (is it missing or wrong?)
2. Object/array dependencies (reference changes every render)

```jsx
const [user, setUser] = useState({ id: 1, name: 'Alice' });

// ❌ Bad: Object dependency
useEffect(() => {
  fetchUser(user.id);
}, [user]); // Runs every render (new object reference)

// ✅ Good: Primitive dependency
useEffect(() => {
  fetchUser(user.id);
}, [user.id]); // Only runs when id changes
```

### "API call happens multiple times"

**Check:**
1. Is component mounting multiple times? (check console logs)
2. Are dependencies changing? (log dependencies)
3. Is there a race condition? (multiple calls before first completes)

```jsx
useEffect(() => {
  let cancelled = false;
  
  fetchUser(userId).then(user => {
    if (!cancelled) {
      setUser(user);
    }
  });
  
  return () => {
    cancelled = true; // Cleanup: cancel if component unmounts
  };
}, [userId]);
```

## Performance Debugging

### React Profiler

**In React DevTools:**
1. Go to "Profiler" tab
2. Click "Record"
3. Interact with your app
4. Click "Stop"
5. See which components rendered and how long they took

**What to look for:**
- Components rendering unnecessarily
- Slow components (high render time)
- Components that re-render on every action

### Identifying Performance Issues

**Symptom:** App feels slow

**Check:**
1. Are too many components re-rendering? (Profiler)
2. Are expensive calculations in render? (move to useMemo)
3. Are API calls happening in render? (move to useEffect)

```jsx
// ❌ Bad: Expensive calculation every render
function ProductList({ products }) {
  const expensive = products.map(p => heavyCalculation(p));
  return <div>{expensive}</div>;
}

// ✅ Good: Memoized
function ProductList({ products }) {
  const expensive = useMemo(
    () => products.map(p => heavyCalculation(p)),
    [products]
  );
  return <div>{expensive}</div>;
}
```

## Development Workflow

### Hot Reload / Fast Refresh

**What it is:** Changes to code automatically update the browser (no page refresh).

**How it works:**
- Save file → browser updates
- State is preserved (usually)
- Fast feedback loop

**When it doesn't work:**
- Syntax errors (fix error first)
- Sometimes with class components (use function components)

### Source Maps

**What they are:** Maps minified/bundled code back to original source.

**Why:** You can debug original code, not minified bundle.

**Usually enabled in development, disabled in production** (for performance).

### Breakpoints (Browser DevTools)

**Set breakpoint:**
1. Open DevTools → Sources tab
2. Find your file
3. Click line number to set breakpoint
4. Code pauses when it hits that line

**Useful for:**
- Stepping through code line by line
- Inspecting variables at specific points
- Understanding execution flow

## Key Takeaways

1. **React DevTools** — essential for inspecting components and state
2. **Console logging** — simple but effective
3. **Trace data flow** — props down, events up
4. **Check state updates** — are they actually changing?
5. **Use Profiler** — for performance issues

## Debugging Checklist

When something's broken:

- [ ] Open React DevTools, inspect the component
- [ ] Check props/state values (are they what you expect?)
- [ ] Add console.logs to trace execution
- [ ] Check if state is actually updating
- [ ] Verify data flow (parent → child)
- [ ] Verify event flow (child → parent)
- [ ] Check for mutations (object/array updates)
- [ ] Check useEffect dependencies
- [ ] Use Profiler if performance issue

## Next Steps

- **Best practices:** [`best-practices-cheat-sheet.md`](./best-practices-cheat-sheet.md)
- **State management:** [`state-and-data-flow.md`](./state-and-data-flow.md)
- **See examples:** [`../Contact Manager/`](../Contact%20Manager/)

