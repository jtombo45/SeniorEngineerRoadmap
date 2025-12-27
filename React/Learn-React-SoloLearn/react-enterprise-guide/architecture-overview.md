# React Architecture Overview

> **React as a system, not isolated features**

## The Big Picture

React is a **library for building user interfaces**. But in practice, React apps are **component trees** that manage state, handle events, and render efficiently.

Understanding React's architecture means understanding:
1. **How components compose** into trees
2. **How data flows** through those trees
3. **When and why** things re-render
4. **Where state lives** and how it's shared

## Component Tree Mental Model

Every React app is a **tree of components**:

```
App
├── Header
│   ├── Logo
│   └── Navigation
│       ├── NavItem (Home)
│       ├── NavItem (About)
│       └── NavItem (Contact)
├── MainContent
│   ├── Sidebar
│   │   └── FilterPanel
│   └── ContentArea
│       ├── ProductList
│       │   └── ProductCard (×N)
│       └── Pagination
└── Footer
    └── Copyright
```

**Key insight:** Components are **nested**, and data flows **down** the tree.

## Data Flow: The One-Way Street

React follows a **unidirectional data flow** pattern:

### Data Flows Down (Props)

```
Parent Component
    ↓ (props)
Child Component
    ↓ (props)
Grandchild Component
```

**Example:**
```jsx
// Parent owns the data
function App() {
  const [user, setUser] = useState({ name: "Alice" });
  
  // Pass data down via props
  return <Profile user={user} />;
}

// Child receives data via props
function Profile({ user }) {
  return <div>{user.name}</div>;
}
```

### Events Flow Up (Callbacks)

```
Grandchild Component
    ↑ (onClick handler)
Child Component
    ↑ (onChange handler)
Parent Component
    ↑ (updates state)
```

**Example:**
```jsx
// Child triggers event
function Button({ onClick }) {
  return <button onClick={onClick}>Click me</button>;
}

// Parent handles it
function App() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => setCount(count + 1);
  
  // Pass handler down
  return <Button onClick={handleClick} />;
}
```

**Why this matters:** In enterprise apps, you'll see this pattern everywhere. State lives "high enough" in the tree to be shared, and callbacks bubble up to update it.

## The Render Cycle

React doesn't re-render everything on every change. It's smarter:

### When Re-renders Happen

1. **State changes** in a component → that component + children re-render
2. **Props change** → receiving component re-renders
3. **Parent re-renders** → children re-render (unless optimized)

### The Virtual DOM

React uses a **Virtual DOM** to decide what actually needs to update:

```
1. State changes
2. React creates new Virtual DOM tree
3. React compares (diffs) old vs new Virtual DOM
4. React updates only the changed parts in real DOM
```

**Why this matters:** You don't manually update the DOM. React figures out the minimal changes needed.

### Example Render Flow

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // When setCount(1) is called:
  // 1. State updates to 1
  // 2. React schedules a re-render
  // 3. Component function runs again
  // 4. React diffs the output
  // 5. Only the changed text updates in DOM
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

## State Management: Where Data Lives

### Local State (useState)

**Lives in:** The component that needs it  
**Scope:** That component + children (via props)  
**Use when:** Data is only relevant to one component tree branch

```jsx
function Form() {
  const [email, setEmail] = useState(''); // Local to Form
  // ...
}
```

### Lifted State

**Lives in:** A common ancestor  
**Scope:** Multiple sibling components  
**Use when:** Siblings need to share data

```jsx
function App() {
  const [theme, setTheme] = useState('light'); // Lifted up
  
  return (
    <>
      <Header theme={theme} />
      <Content theme={theme} />
      <Footer theme={theme} />
    </>
  );
}
```

### Global State (Redux, Context, etc.)

**Lives in:** A store or context provider  
**Scope:** Entire app (or a large subtree)  
**Use when:** Data needs to be accessed from many unrelated components

```jsx
// Redux store (simplified)
const store = {
  user: { name: "Alice" },
  cart: { items: [...] }
};

// Any component can access it
function Header() {
  const user = useSelector(state => state.user);
  // ...
}
```

**When to use what:**
- **Local state** → Start here. Most state should be local.
- **Lifted state** → When siblings need to share.
- **Global state** → When many unrelated components need access.

> 💡 **Reference:** For deep dives on state management, see [`../Intro To React/`](../Intro%20To%20React/) and any Redux-specific folders.

## Component Types: A Quick Map

### Function Components (Modern Standard)

```jsx
function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(0);
  return <div>{prop1}</div>;
}
```

**Use:** Always. This is the modern way.

### Class Components (Legacy)

```jsx
class MyComponent extends React.Component {
  state = { count: 0 };
  render() {
    return <div>{this.state.count}</div>;
  }
}
```

**Use:** Only when maintaining legacy code. New code uses functions.

### Hooks (State & Side Effects)

```jsx
function MyComponent() {
  const [state, setState] = useState(0);        // State
  useEffect(() => { /* side effect */ }, []);   // Side effects
  const memoized = useMemo(() => compute(), []); // Memoization
}
```

**Use:** For all state and side effects in function components.

> 💡 **Reference:** See [`../Intro To React/`](../Intro%20To%20React/) for detailed hooks explanations.

## Where Redux Fits

Redux is a **state management library** that sits alongside React:

```
React Components
    ↓ (dispatch actions)
Redux Store
    ↓ (state updates)
React Components (re-render)
```

**High-level flow:**
1. Component dispatches an **action** (e.g., `{ type: 'ADD_ITEM', payload: item }`)
2. Redux **reducer** processes the action and updates state
3. Components **subscribe** to state changes and re-render

**When you'll see Redux:**
- Large apps with complex state
- Apps where many components need the same data
- Apps with predictable state update patterns

**When you won't:**
- Small apps (useState is fine)
- Apps where state is mostly local

> 💡 **Reference:** See Redux-specific folders in [`../Intro To React/`](../Intro%20To%20React/) for deep dives.

## Common Patterns You'll See

### Container/Presentational Pattern

```jsx
// Container: Handles logic
function UserContainer() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  return <UserDisplay user={user} />;
}

// Presentational: Just displays
function UserDisplay({ user }) {
  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

### Custom Hooks (Logic Reuse)

```jsx
// Extract logic
function useUser(userId) {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser(userId).then(setUser); }, [userId]);
  return user;
}

// Use it
function UserProfile({ userId }) {
  const user = useUser(userId);
  return <div>{user?.name}</div>;
}
```

## Key Takeaways

1. **React apps are component trees** — understand the hierarchy
2. **Data flows down, events flow up** — this is the foundation
3. **State lives where it's needed** — local → lifted → global
4. **Re-renders are optimized** — React handles the heavy lifting
5. **Redux is optional** — use it when state gets complex

## Next Steps

- **Understand project structure:** [`project-structure.md`](./project-structure.md)
- **Deep dive on state:** [`state-and-data-flow.md`](./state-and-data-flow.md)
- **Learn React basics:** [`../Intro To React/`](../Intro%20To%20React/)

