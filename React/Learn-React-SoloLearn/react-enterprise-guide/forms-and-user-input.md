# Forms and User Input

> **Real-world UI work**

## Why Forms Feel Hard in React

In traditional HTML, forms "just work":

```html
<form>
  <input name="email" />
  <button type="submit">Submit</button>
</form>
```

In React, you need to **control** the form state. This feels like extra work, but it gives you:
- **Validation** at the right time
- **Better UX** (instant feedback)
- **Security** (controlled data flow)

## Controlled Components: The React Way

### The Pattern

**Controlled component** = React controls the input's value via state

```jsx
function EmailInput() {
  const [email, setEmail] = useState('');
  
  return (
    <input
      type="email"
      value={email}              // Controlled by React
      onChange={(e) => setEmail(e.target.value)} // React updates it
    />
  );
}
```

**Key points:**
- `value` is tied to state
- `onChange` updates state
- React is the "single source of truth"

### Why Controlled?

**Uncontrolled** (traditional HTML):
```jsx
// ❌ React doesn't know the value
<input type="email" />
// You'd have to use refs to read it
```

**Controlled** (React way):
```jsx
// ✅ React knows the value at all times
const [email, setEmail] = useState('');
<input value={email} onChange={(e) => setEmail(e.target.value)} />
// You can validate, transform, etc.
```

## Basic Form Pattern

### Single Input

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', query);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

### Multiple Inputs

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value  // Update specific field
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

**Pattern:** Use an object for form state, update specific fields by name.

## Validation

### Client-Side Validation

**When:** Before submitting to server  
**Why:** Better UX (instant feedback), reduce server load

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Validate on change
    if (value && !validateEmail(value)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate on submit
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    // Submit if valid
    console.log('Logging in:', email);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="Email"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Validation Strategies

**1. Validate on blur** (user leaves field)
```jsx
const handleBlur = () => {
  if (!validateEmail(email)) {
    setError('Invalid email');
  }
};
```

**2. Validate on change** (as user types)
```jsx
const handleChange = (e) => {
  const value = e.target.value;
  setEmail(value);
  if (value && !validateEmail(value)) {
    setError('Invalid email');
  }
};
```

**3. Validate on submit** (only when form is submitted)
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateEmail(email)) {
    setError('Invalid email');
    return;
  }
  // Submit...
};
```

**Best practice:** Combine strategies:
- Show errors **on blur** (don't annoy while typing)
- Show errors **on submit** (catch everything)
- Optional: Show errors **on change** for critical fields (password strength)

## Server-Side Validation

**Always validate on the server.** Client-side validation is for UX, not security.

**Why:**
- Users can disable JavaScript
- Malicious users can bypass client validation
- Client validation can be wrong (outdated rules)

**Pattern:**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      setError(error.message); // Server validation error
      return;
    }
    
    // Success...
  } catch (err) {
    setError('Network error');
  }
};
```

## Security Basics

### XSS (Cross-Site Scripting) Awareness

**Problem:** User input could contain malicious scripts

```jsx
// ❌ Dangerous: Rendering user input directly
<div>{userInput}</div> // If userInput = "<script>alert('XSS')</script>"

// ✅ Safe: React escapes by default
<div>{userInput}</div> // React escapes HTML, safe

// ⚠️ Dangerous: Using dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // Don't do this with user input
```

**React's default:** React **escapes** all values by default. `<` becomes `&lt;`, etc.

**Rule:** Only use `dangerouslySetInnerHTML` if you **trust** the source and have sanitized it.

### Trust Boundaries

**Client = Untrusted**
- User input
- URL parameters
- LocalStorage (can be modified)

**Server = Trusted**
- Database values (if properly secured)
- Environment variables
- Server-side validation results

**Pattern:** Validate and sanitize at trust boundaries (client → server, server → database).

## Common Form Patterns

### Loading State

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Reset After Submit

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  // Submit...
  setFormData({ name: '', email: '', message: '' }); // Reset
};
```

### Conditional Fields

```jsx
function RegistrationForm() {
  const [userType, setUserType] = useState('personal');
  const [companyName, setCompanyName] = useState('');
  
  return (
    <form>
      <select value={userType} onChange={(e) => setUserType(e.target.value)}>
        <option value="personal">Personal</option>
        <option value="business">Business</option>
      </select>
      
      {userType === 'business' && (
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company Name"
        />
      )}
    </form>
  );
}
```

## File Inputs

File inputs are **always uncontrolled** (for security reasons):

```jsx
function FileUpload() {
  const [file, setFile] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    
    await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
}
```

**Note:** You can't set `value` on file inputs. Use `onChange` to track the selected file.

## Form Libraries (When to Use)

### When Forms Get Complex

If you have:
- Many fields (10+)
- Complex validation rules
- Conditional logic
- Need for form state management

Consider libraries:
- **React Hook Form** — popular, performant
- **Formik** — feature-rich
- **React Final Form** — flexible

**Rule:** Start with controlled components. Add a library when forms become painful.

## Key Takeaways

1. **Controlled components** — React controls input values via state
2. **Validate on client** for UX, **validate on server** for security
3. **React escapes by default** — safe from XSS (unless you use `dangerouslySetInnerHTML`)
4. **Use objects for form state** when you have multiple fields
5. **Handle loading states** — disable buttons, show spinners

## Common Pitfalls

- **Forgetting `e.preventDefault()`** — form will submit and reload page
- **Not handling async submission** — show loading states
- **Validating only on client** — always validate on server too
- **Using `dangerouslySetInnerHTML` with user input** — security risk

## Next Steps

- **API integration:** [`api-and-backend-integration.md`](./api-and-backend-integration.md)
- **See examples:** [`../Contact Manager/`](../Contact%20Manager/)
- **Learn React basics:** [`../Intro To React/`](../Intro%20To%20React/)

