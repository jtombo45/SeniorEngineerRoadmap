# State and Data Flow

> **How data actually moves in React apps**

## The Core Principle

React follows **unidirectional data flow**:
- **Data flows down** (via props)
- **Events flow up** (via callbacks)
- **State lives where it's needed**

Understanding this is the difference between writing React code and *thinking* in React.

## Local State vs Global State

### Local State (useState)

**Lives in:** The component that needs it  
**Scope:** That component + children (via props)  
**Use when:** Data is only relevant to one component tree branch

```jsx
function Counter() {
  const [count, setCount] = useState(0); // Local state
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

**When to use:**
- Form inputs
- UI toggles (modals, dropdowns)
- Component-specific calculations
- Temporary UI state

**Rule of thumb:** Start with local state. Only lift it up if you need to.

### Lifted State

**Lives in:** A common ancestor  
**Scope:** Multiple sibling components  
**Use when:** Siblings need to share data

```jsx
function App() {
  const [theme, setTheme] = useState('light'); // Lifted up
  
  return (
    <>
      <Header theme={theme} onThemeChange={setTheme} />
      <Content theme={theme} />
      <Footer theme={theme} />
    </>
  );
}
```

**When to use:**
- Sibling components need the same data
- You need to coordinate multiple components
- Data needs to be in sync across a subtree

**Pattern:** Find the **lowest common ancestor** of components that need the data.

### Global State (Redux, Context, Zustand)

**Lives in:** A store or context provider  
**Scope:** Entire app (or a large subtree)  
**Use when:** Many unrelated components need access

```jsx
// Redux example (simplified)
function App() {
  return (
    <Provider store={store}>
      <Header />  {/* Can access user */}
      <Content /> {/* Can access user */}
      <Footer />  {/* Can access user */}
    </Provider>
  );
}

function Header() {
  const user = useSelector(state => state.user); // Global state
  return <div>Welcome, {user.name}</div>;
}
```

**When to use:**
- User authentication
- Shopping cart
- App-wide settings (theme, language)
- Data shared across many unrelated components

**Rule of thumb:** Use global state when lifting state would require passing props through many levels ("prop drilling").

> 💡 **Reference:** See [`../Intro To React/`](../Intro%20To%20React/) for Redux deep dives.

## The Data Flow Pattern

### 1. Data Flows Down (Props)

```
Parent (owns state)
    ↓ props: { user, onUpdate }
Child
    ↓ props: { user }
Grandchild
```

**Example:**
```jsx
function App() {
  const [user, setUser] = useState({ name: "Alice" });
  
  return <Profile user={user} />; // Data flows down
}

function Profile({ user }) {
  return <div>{user.name}</div>;
}
```

**Key point:** Children **cannot** directly modify parent state. They receive data as **read-only props**.

### 2. Events Flow Up (Callbacks)

```
Grandchild (triggers event)
    ↑ callback: onClick
Child (passes through)
    ↑ callback: onUpdate
Parent (handles event, updates state)
```

**Example:**
```jsx
function App() {
  const [count, setCount] = useState(0);
  
  const handleIncrement = () => setCount(count + 1);
  
  return <Counter onIncrement={handleIncrement} />; // Handler flows down
}

function Counter({ onIncrement }) {
  return <button onClick={onIncrement}>+</button>; // Event flows up
}
```

**Key point:** Children **notify** parents of events. Parents **decide** how to handle them.

### 3. The Complete Cycle

```
1. User clicks button (in Child)
2. Child calls onClick handler (passed from Parent)
3. Parent's handler updates state
4. Parent re-renders
5. New state flows down as props
6. Child re-renders with new data
```

**Visual:**
```
[User Action] → [Event Handler] → [State Update] → [Re-render] → [New Props] → [UI Update]
```

## Derived State vs Stored State

### Stored State

**What:** State you explicitly manage with `useState` or Redux

```jsx
const [users, setUsers] = useState([]);
const [filter, setFilter] = useState('');
```

### Derived State

**What:** State computed from other state (don't store it, compute it)

```jsx
const [users, setUsers] = useState([]);
const [filter, setFilter] = useState('');

// ❌ Don't do this:
const [filteredUsers, setFilteredUsers] = useState([]);
useEffect(() => {
  setFilteredUsers(users.filter(u => u.name.includes(filter)));
}, [users, filter]);

// ✅ Do this:
const filteredUsers = users.filter(u => u.name.includes(filter));
```

**Why:** Derived state can get out of sync. Compute it instead.

**Rule:** If you can compute it, don't store it.

## Common Anti-Patterns

### 1. Prop Drilling

**Problem:** Passing props through many levels just to reach a deep child

```jsx
// ❌ Bad
function App() {
  const [user, setUser] = useState({});
  return <Layout user={user} />;
}

function Layout({ user }) {
  return <Header user={user} />;
}

function Header({ user }) {
  return <UserMenu user={user} />; // Only this needs it!
}
```

**Solution:** Use Context or lift state differently

```jsx
// ✅ Good
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({});
  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}

function UserMenu() {
  const user = useContext(UserContext); // Direct access
  return <div>{user.name}</div>;
}
```

### 2. Storing Derived State

**Problem:** Storing state that can be computed

```jsx
// ❌ Bad
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ Good
const fullName = `${firstName} ${lastName}`;
```

### 3. Duplicating State

**Problem:** Same data in multiple places

```jsx
// ❌ Bad
const [localUser, setLocalUser] = useState(user);
// Now you have to keep localUser and user in sync

// ✅ Good
// Just use user directly, or if you need local edits:
const [localUser, setLocalUser] = useState(user);
// But update the source when done, don't maintain both
```

### 4. State in Wrong Place

**Problem:** State too high or too low in the tree

```jsx
// ❌ Bad: State in App, but only Modal needs it
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return <Modal isOpen={isModalOpen} />;
}

// ✅ Good: State where it's needed
function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  // ...
}
```

## State Management Decision Tree

```
Do multiple unrelated components need this data?
│
├─ No → Is it only used in one component?
│       │
│       ├─ Yes → Local state (useState)
│       │
│       └─ No → Do siblings need it?
│               │
│               ├─ Yes → Lift state to common ancestor
│               │
│               └─ No → Local state is fine
│
└─ Yes → Global state (Redux, Context, Zustand)
```

## Redux: When and Why

### When to Use Redux

- **Complex state logic** — many interdependent pieces
- **Many components** need the same data
- **Time-travel debugging** — need to replay state changes
- **Predictable updates** — want strict patterns for state changes
- **Large team** — need consistent patterns

### When NOT to Use Redux

- **Small app** — useState is fine
- **Simple state** — no complex interactions
- **Mostly local state** — few components share data
- **Learning React** — master basics first

**Rule:** Don't add Redux until you feel the pain of prop drilling or state complexity.

> 💡 **Reference:** See [`../Intro To React/`](../Intro%20To%20React/) for Redux deep dives.

## Context API: Lightweight Global State

Context is React's built-in way to share data without prop drilling:

```jsx
// Create context
const ThemeContext = createContext();

// Provide value
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Content />
    </ThemeContext.Provider>
  );
}

// Consume value
function Button() {
  const { theme } = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
}
```

**When to use:**
- Simple global state (theme, user, language)
- Avoiding prop drilling
- Don't need Redux's features (time-travel, middleware)

**When not to use:**
- Complex state logic (use Redux)
- Frequently changing data (Context can cause performance issues)

## State Updates: Important Rules

### 1. State Updates Are Asynchronous

```jsx
const [count, setCount] = useState(0);

// ❌ This doesn't work as expected
setCount(count + 1);
setCount(count + 1); // Still uses old count value

// ✅ Use functional updates
setCount(prev => prev + 1);
setCount(prev => prev + 1); // Uses previous value
```

### 2. State Updates Trigger Re-renders

```jsx
const [name, setName] = useState('Alice');

setName('Bob'); // Component re-renders
// All children re-render too (unless optimized)
```

### 3. State Updates Are Batched

```jsx
// React batches these into one re-render
setCount(1);
setName('Alice');
setTheme('dark');
// Only one re-render happens
```

## Key Takeaways

1. **Data flows down, events flow up** — this is fundamental
2. **State lives where it's needed** — local → lifted → global
3. **Don't store derived state** — compute it instead
4. **Avoid prop drilling** — use Context or Redux when needed
5. **Start simple** — useState first, add complexity only when needed

## Next Steps

- **Understand architecture:** [`architecture-overview.md`](./architecture-overview.md)
- **See project structure:** [`project-structure.md`](./project-structure.md)
- **Learn React basics:** [`../Intro To React/`](../Intro%20To%20React/)

