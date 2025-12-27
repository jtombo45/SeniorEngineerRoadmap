# Architecture Overview

This document explains how each AWS service works in the Wild Rydes application and how they interact end-to-end.

## Service Roles

### AWS Amplify
**Purpose:** Hosts the static frontend files (HTML, CSS, JavaScript) and provides CI/CD integration with GitHub.

**What it does:**
- Serves the web application files to users' browsers
- Automatically deploys new versions when code is pushed to GitHub
- Provides HTTPS and a global CDN for fast content delivery

**In this app:** Amplify hosts `index.html`, `signin.html`, `ride.html`, and all static assets.

---

### Amazon Cognito (User Pool)
**Purpose:** Manages user authentication - registration, login, password reset, and email verification.

**What it does:**
- Stores user accounts (email, password hash)
- Handles user registration and email verification
- Authenticates users and generates JWT (JSON Web Token) tokens
- Provides secure session management

**In this app:** Users register with email/password, verify via email code, then sign in to receive a JWT token that proves their identity to the API.

---

### Amazon API Gateway
**Purpose:** Creates a REST API endpoint that acts as the "front door" for backend services.

**What it does:**
- Exposes HTTP endpoints (like `/ride`) that clients can call
- Validates incoming requests using authorizers (Cognito in this case)
- Routes requests to backend services (Lambda functions)
- Handles CORS (Cross-Origin Resource Sharing) for browser security
- Can throttle, cache, and transform requests

**In this app:** API Gateway exposes the `/ride` POST endpoint, validates the JWT token from Cognito, then invokes the Lambda function.

---

### AWS Lambda
**Purpose:** Runs backend code without managing servers - executes only when triggered.

**What it does:**
- Executes your code (Node.js, Python, etc.) in response to events
- Automatically scales from zero to thousands of concurrent executions
- You only pay for compute time used (billed per millisecond)
- No server management, patching, or capacity planning

**In this app:** The Lambda function receives ride requests, selects a unicorn from the fleet, and records the ride in DynamoDB.

---

### Amazon DynamoDB
**Purpose:** A fast, flexible NoSQL database that stores application data.

**What it does:**
- Stores data in tables with items (rows) and attributes (columns)
- Automatically scales to handle any amount of traffic
- Provides single-digit millisecond latency
- NoSQL means flexible schema - you can add new attributes without migrations

**In this app:** DynamoDB stores ride records with RideId, User, Unicorn details, and RequestTime.

---

### AWS IAM (Identity and Access Management)
**Purpose:** Controls permissions - defines who (or what service) can do what actions on which resources.

**What it does:**
- Creates roles that services can "assume" to get permissions
- Attaches policies (JSON documents) that grant specific permissions
- Acts as the "permissions glue" between services

**In this app:**
- Lambda execution role has permission to write to DynamoDB
- API Gateway authorizer has permission to validate Cognito tokens

---

## End-to-End Request Flow

Here's what happens when a user requests a ride:

### 1. User Signs In (Initial Setup)
```
Browser → Cognito User Pool
  • User enters email/password
  • Cognito validates credentials
  • Cognito returns JWT token
  • Browser stores token (in memory/session)
```

### 2. User Clicks on Map (Frontend)
```
Browser (ride.html)
  • User clicks map to set pickup location
  • JavaScript captures latitude/longitude
  • "Request Unicorn" button becomes enabled
```

### 3. User Requests Ride (API Call)
```
Browser → API Gateway (/ride POST)
  • JavaScript sends POST request with:
    - Authorization header: JWT token
    - Body: { PickupLocation: { Latitude, Longitude } }
```

### 4. API Gateway Validates Request
```
API Gateway
  • Receives request
  • Extracts JWT token from Authorization header
  • Cognito Authorizer validates token:
    - Checks signature (proves token came from Cognito)
    - Checks expiration (token not expired)
    - Extracts user claims (username, email, etc.)
  • If valid: proceeds to Lambda
  • If invalid: returns 401 Unauthorized
```

### 5. Lambda Processes Request
```
API Gateway → Lambda Function
  • Lambda receives event with:
    - requestContext.authorizer.claims (user info from token)
    - body (pickup location)
  • Lambda generates unique RideId
  • Lambda selects random unicorn from fleet
  • Lambda prepares DynamoDB record
```

### 6. Lambda Writes to DynamoDB
```
Lambda → DynamoDB
  • Lambda assumes its execution role (IAM)
  • IAM role grants dynamodb:PutItem permission
  • Lambda writes ride record to Rides table
  • DynamoDB confirms write success
```

### 7. Response Returns to User
```
Lambda → API Gateway → Browser
  • Lambda returns success response:
    - Status: 201 Created
    - Body: { RideId, Unicorn, Eta, Rider }
    - Headers: CORS headers
  • API Gateway forwards response
  • Browser receives response
  • JavaScript updates UI (shows unicorn name, color, etc.)
```

## IAM as "Permissions Glue"

IAM connects services by granting permissions:

**Lambda → DynamoDB:**
- Lambda execution role has a policy: `Allow: dynamodb:PutItem on table Rides`
- When Lambda tries to write, AWS checks: "Does this role have permission?" → Yes → Write succeeds

**API Gateway → Cognito:**
- API Gateway authorizer has permission to call Cognito's token validation API
- When API Gateway receives a token, it asks Cognito: "Is this valid?" → Cognito responds → API Gateway proceeds or rejects

**No IAM permissions needed for:**
- Browser → Amplify (public static files)
- Browser → Cognito (public authentication endpoints)
- Browser → API Gateway (public API endpoint, but protected by authorizer)

## Data Flow Diagram

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Sign In
     ▼
┌─────────────────┐
│ Amazon Cognito  │
│  • Validates    │
│  • Returns JWT  │
└────┬────────────┘
     │ 2. JWT Token
     ▼
┌──────────┐
│ Browser  │ (stores token)
└────┬─────┘
     │ 3. POST /ride + JWT
     ▼
┌─────────────────┐
│  API Gateway     │
│  • Validates JWT │
│  • Extracts user │
└────┬────────────┘
     │ 4. Invoke with event
     ▼
┌─────────────────┐
│  AWS Lambda      │
│  • Process ride  │
│  • Select unicorn│
└────┬────────────┘
     │ 5. PutItem
     ▼
┌─────────────────┐
│  DynamoDB       │
│  • Store ride   │
└─────────────────┘
     │ 6. Success
     ▼
┌─────────────────┐
│  Lambda         │
│  • Return response│
└────┬────────────┘
     │ 7. Response
     ▼
┌─────────────────┐
│  API Gateway    │
│  • Add CORS     │
└────┬────────────┘
     │ 8. JSON Response
     ▼
┌──────────┐
│ Browser  │ (updates UI)
└──────────┘
```

## Key Concepts

### Stateless Authentication
- JWT tokens contain all user information (no server-side session storage)
- Each API request includes the token, so the server doesn't need to remember previous requests
- Tokens expire after a set time (default: 1 hour) for security

### Serverless Architecture
- No servers to manage - AWS handles infrastructure
- Pay only for what you use (requests, compute time, storage)
- Automatic scaling - handles 1 user or 1 million users

### Event-Driven
- Lambda is triggered by events (API Gateway HTTP request)
- Each request is independent - no shared state between invocations
- Perfect for microservices and scalable architectures

## Security Layers

1. **HTTPS:** All communication encrypted (Amplify, API Gateway)
2. **JWT Tokens:** Cryptographically signed, can't be forged
3. **IAM Policies:** Least privilege - Lambda can only write to DynamoDB, nothing else
4. **CORS:** Browser security - only allowed origins can call the API
5. **API Gateway Authorizer:** Validates every request before reaching Lambda

## Scalability

- **Amplify:** CDN automatically scales globally
- **Cognito:** Handles millions of users
- **API Gateway:** Handles millions of requests per second
- **Lambda:** Auto-scales from 0 to thousands of concurrent executions
- **DynamoDB:** Auto-scales storage and throughput

No configuration needed - AWS handles it all automatically!

