# API and Backend Integration

> **How React talks to the backend at work**

## The Big Picture

React is a **frontend library**. It runs in the browser. To get data or save data, it needs to talk to a **backend API**.

This guide shows you:
- **Where** API calls live in React apps
- **How** to structure API integration
- **What** patterns you'll see in enterprise codebases

## Where API Calls Live

### Pattern 1: Service Layer (Most Common)

**Location:** `/services` or `/api` folder

```jsx
// services/userApi.js
export async function getUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

export async function updateUser(userId, data) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

**Why:** Separation of concerns. Components don't know about URLs or HTTP methods.

**Usage in components:**
```jsx
import { getUser } from '../services/userApi';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    getUser(userId).then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

### Pattern 2: Custom Hooks

**Location:** `/hooks` folder

```jsx
// hooks/useUser.js
function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    getUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading, error };
}
```

**Usage:**
```jsx
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
}
```

**Why:** Reusable logic. Multiple components can use the same data-fetching pattern.

### Pattern 3: Redux Thunks/Sagas

**Location:** `/store` or `/redux` folder

```jsx
// store/thunks/userThunks.js
export const fetchUser = (userId) => async (dispatch) => {
  dispatch({ type: 'USER_LOADING' });
  try {
    const user = await getUser(userId);
    dispatch({ type: 'USER_SUCCESS', payload: user });
  } catch (error) {
    dispatch({ type: 'USER_ERROR', payload: error });
  }
};
```

**Usage:**
```jsx
function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  
  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [userId, dispatch]);
  
  return <div>{user.name}</div>;
}
```

**When:** Large apps with Redux. Centralized state management.

> 💡 **Reference:** See [`../Intro To React/`](../Intro%20To%20React/) for Redux deep dives.

## Separation of Concerns

### The Layers

```
Component (UI)
    ↓ calls
Custom Hook (React logic)
    ↓ calls
Service (API calls)
    ↓ calls
Backend API
```

**Example:**
```jsx
// services/productApi.js (API layer)
export async function getProducts() {
  const response = await fetch('/api/products');
  return response.json();
}

// hooks/useProducts.js (React logic layer)
function useProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);
  return products;
}

// components/ProductList.jsx (UI layer)
function ProductList() {
  const products = useProducts();
  return <div>{products.map(p => <Product key={p.id} {...p} />)}</div>;
}
```

**Why:** Each layer has one job. Easy to test, easy to change.

## REST Basics (High-Level)

### HTTP Methods

- **GET** — Read data (`fetch('/api/users')`)
- **POST** — Create data (`fetch('/api/users', { method: 'POST', body: ... })`)
- **PUT** — Update data (`fetch('/api/users/1', { method: 'PUT', body: ... })`)
- **DELETE** — Delete data (`fetch('/api/users/1', { method: 'DELETE' })`)

### Common Patterns

**Get list:**
```jsx
GET /api/products
// Returns: [{ id: 1, name: "..." }, ...]
```

**Get one:**
```jsx
GET /api/products/1
// Returns: { id: 1, name: "..." }
```

**Create:**
```jsx
POST /api/products
Body: { name: "New Product" }
// Returns: { id: 2, name: "New Product" }
```

**Update:**
```jsx
PUT /api/products/1
Body: { name: "Updated Product" }
// Returns: { id: 1, name: "Updated Product" }
```

**Delete:**
```jsx
DELETE /api/products/1
// Returns: 204 No Content (or success message)
```

## API Client Setup

### Basic Fetch

```jsx
// services/api.js
const API_BASE_URL = 'https://api.example.com';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}
```

### With Authentication

```jsx
// services/api.js
function getAuthToken() {
  return localStorage.getItem('token');
}

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    },
    ...options
  });
  
  if (response.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  
  return response.json();
}
```

### Using Axios (Alternative to Fetch)

```jsx
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Usage:**
```jsx
// services/userApi.js
import api from './api';

export async function getUser(userId) {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}
```

## Loading, Error, and Success States

### The Pattern

Every API call has three states:
1. **Loading** — request in progress
2. **Success** — data received
3. **Error** — request failed

### Implementation

```jsx
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);
  
  return { products, loading, error };
}
```

### Usage in Component

```jsx
function ProductList() {
  const { products, loading, error } = useProducts();
  
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {products.map(product => (
        <Product key={product.id} {...product} />
      ))}
    </div>
  );
}
```

## How React Fits with Backends

### Node.js / Express

**Backend:**
```js
// server.js
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});
```

**React:**
```jsx
// services/userApi.js
export async function getUsers() {
  const response = await fetch('/api/users');
  return response.json();
}
```

**Same origin:** If React app and API are on same domain, use relative URLs (`/api/users`).

### .NET API

**Backend:**
```csharp
// Controllers/UsersController.cs
[HttpGet]
public IActionResult GetUsers() {
    return Ok(new[] { new { Id = 1, Name = "Alice" } });
}
```

**React:**
```jsx
// services/userApi.js
const API_BASE = 'https://api.mycompany.com';

export async function getUsers() {
  const response = await fetch(`${API_BASE}/api/users`);
  return response.json();
}
```

**Cross-origin:** If React app and API are on different domains, configure CORS on backend.

### Python / Django / Flask

**Backend:**
```python
# views.py
@api_view(['GET'])
def get_users(request):
    return Response([{'id': 1, 'name': 'Alice'}])
```

**React:**
```jsx
// Same pattern as above
export async function getUsers() {
  const response = await fetch('/api/users');
  return response.json();
}
```

## Common Patterns

### Pagination

```jsx
// services/productApi.js
export async function getProducts(page = 1, limit = 10) {
  const response = await fetch(`/api/products?page=${page}&limit=${limit}`);
  return response.json();
}
```

### Search/Filter

```jsx
export async function searchProducts(query) {
  const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
  return response.json();
}
```

### Error Handling

```jsx
export async function getUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`Server error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error('Network error - check your connection');
    }
    throw error;
  }
}
```

## Key Takeaways

1. **API calls live in services** — keep them separate from components
2. **Use custom hooks** — for reusable data-fetching logic
3. **Handle three states** — loading, success, error
4. **Separate concerns** — component → hook → service → API
5. **React is frontend-only** — it needs a backend API for data

## Common Pitfalls

- **API calls in components** — move to services/hooks
- **Not handling errors** — always handle network failures
- **Not showing loading states** — users need feedback
- **Hardcoding URLs** — use environment variables
- **Not handling CORS** — configure backend for cross-origin requests

## Next Steps

- **Environment variables:** [`environment-and-configuration.md`](./environment-and-configuration.md)
- **Forms:** [`forms-and-user-input.md`](./forms-and-user-input.md)
- **See examples:** [`../Contact Manager/`](../Contact%20Manager/)

