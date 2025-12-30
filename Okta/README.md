# OAuth 2.0 and OpenID Connect (in Plain English)

### A Beginner-Friendly Guide to Delegated Authorization and Authentication

This README explains **how OAuth 2.0 and OpenID Connect work** in plain language, why they exist, how they solve real problems, and when to use each protocol — all without confusing jargon.

The goal is to answer:

* What is OAuth 2.0 and why does it exist?
* What is the delegated authorization problem?
* How does the OAuth 2.0 authorization code flow work?
* What is the difference between front channel and back channel?
* What is OpenID Connect and how does it relate to OAuth 2.0?
* What is an ID token (JWT)?
* Which flow should I use for my application?

No prior OAuth knowledge assumed.

---

## TL;DR

- **OAuth 2.0** = Protocol for delegated authorization (allowing apps to access resources on your behalf without your password)
- **OpenID Connect** = Extension to OAuth 2.0 for authentication (logging users in)
- **Authorization Code Flow** = Most secure flow, uses both front channel and back channel
- **Implicit Flow** = Front-channel only, less secure, used when no back-end server
- **ID Token** = JWT containing user information (who logged in)
- **Access Token** = Token for accessing APIs (what you can do)

---

## Where to start reading

If you're new, read in this order:

1. The Problem: Why OAuth Exists
2. OAuth 2.0 Authorization Code Flow
3. Front Channel vs Back Channel
4. OpenID Connect (Authentication Layer)
5. ID Tokens and JWTs
6. Which Flow Should I Use?

---

## Quick mental model (diagram)

```mermaid
flowchart TD
    A[User] -->|1. Click Connect| B[Client App<br/>Yelp]
    B -->|2. Redirect to| C[Authorization Server<br/>Google]
    C -->|3. Login & Consent| D[Authorization Code]
    D -->|4. Exchange Code| E[Access Token]
    E -->|5. Use Token| F[Resource Server<br/>Google Contacts API]
    
    G[OAuth 2.0 = Delegated Authorization<br/>OpenID Connect = Authentication Layer]
    
    style A fill:#3498DB,color:#fff
    style B fill:#9B59B6,color:#fff
    style C fill:#2ECC71,color:#fff
    style D fill:#F39C12,color:#fff
    style E fill:#E74C3C,color:#fff
    style F fill:#2ECC71,color:#fff
    style G fill:#F39C12,color:#fff
```

**Key points:**
- User grants permission -> App gets token -> App uses token to access resources
- Password never leaves the authorization server

---

# 1) The Problem: Why OAuth Exists

## Simple Login (Before OAuth)

The simplest form of authentication is a basic login form with email/username and password.

```mermaid
flowchart LR
    A[User] -->|Username + Password| B[Web Form]
    B -->|Submit| C[Server]
    C -->|Hash & Verify| D[Database]
    D -->|User Info| C
    C -->|Set Cookie| E[Session Cookie]
    
    style A fill:#3498DB,color:#fff
    style B fill:#9B59B6,color:#fff
    style C fill:#2ECC71,color:#fff
    style D fill:#F39C12,color:#fff
    style E fill:#E74C3C,color:#fff
```

**The process:**
1. User enters credentials
2. Server hashes password and compares with database
3. Server creates session cookie
4. Browser stores cookie to track the user

**Downsides:**
- Security: You're responsible for password hashing, storage, security
- Maintenance: You handle GDPR, HIPAA, security updates, password reset flows

---

## The Delegated Authorization Problem

Imagine this scenario: You want Yelp to find your friends, but you don't want to give Yelp your Gmail password.

**The old (bad) way:**

Early Yelp asked users to give them their Gmail email AND password. This is really bad because:
- Your Gmail password is the "keys to the kingdom"
- Password resets for banks, crypto, etc. often go through email
- You're trusting a startup with your most sensitive credential

**Why this was a problem:**
- You can't give limited access (all or nothing)
- If compromised, attacker has full account access
- No way to revoke access later
- User has to trust the third-party completely

---

## The OAuth Solution

OAuth 2.0 was invented to solve this problem: **How do you grant limited access without sharing your password?**

```mermaid
flowchart LR
    A[User] -->|I trust Google<br/>I kind of trust Yelp| B[I want Yelp to access<br/>my contacts only]
    
    C[OAuth = Delegated Authorization<br/>Grant limited permissions without sharing password]
    
    style A fill:#3498DB,color:#fff
    style B fill:#9B59B6,color:#fff
    style C fill:#2ECC71,color:#fff
```

**The OAuth way:**
- User logs into Google (password stays with Google)
- User explicitly consents to specific permissions (contacts only)
- Google issues a token with limited scope
- Yelp uses token to access contacts
- User can revoke access anytime

---

# 2) OAuth 2.0 Terminology (Cutting Through the Jargon)

OAuth 2.0 uses a lot of confusing terms. Here's what they actually mean:

### Key Terms

| OAuth Term | Plain English |
| ---------- | ------------- |
| **Resource Owner** | You (the user who owns the data) |
| **Client** | The application requesting access (Yelp, etc.) |
| **Authorization Server** | Where you log in and grant permission (Google, Okta, etc.) |
| **Resource Server** | The API that holds the data (Google Contacts API, etc.) |
| **Authorization Grant** | Proof that you clicked "Yes, I consent" |
| **Redirect URI / Callback** | Where the user gets sent back after consent |
| **Access Token** | The key that lets the app access your data |

---

# 3) OAuth 2.0 Authorization Code Flow (The Most Common Flow)

This is the complete flow that happens when you click "Connect with Google":

```mermaid
flowchart TD
    A[User clicks<br/>Connect with Google] -->|Redirect to| B[Authorization Server<br/>accounts.google.com]
    B -->|User logs in| C[Login Form<br/>Email + Password]
    C -->|User consents| D[Consent Screen<br/>Allow Yelp to access contacts?]
    D -->|User clicks Yes| E[Redirect back with<br/>Authorization Code]
    E -->|Exchange code| F[Authorization Server<br/>Token Endpoint]
    F -->|Returns| G[Access Token]
    G -->|Use token| H[Resource Server<br/>contacts.google.com]
    
    style A fill:#3498DB,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#9B59B6,color:#fff
    style D fill:#F39C12,color:#fff
    style E fill:#E74C3C,color:#fff
    style F fill:#2ECC71,color:#fff
    style G fill:#F39C12,color:#fff
    style H fill:#2ECC71,color:#fff
```

---

## Step 1: Starting the Flow

The client redirects the user to the authorization server with these parameters:

```
https://accounts.google.com/o/oauth2/v2/auth?
  client_id=abc123&
  redirect_uri=https://yelp.com/callback&
  scope=profile contacts&
  response_type=code&
  state=foobar
```

**What each parameter means:**
- `client_id`: Identifies your application (public, not secret)
- `redirect_uri`: Where to send user after consent
- `scope`: What permissions you're asking for
- `response_type=code`: Request an authorization code (not token directly)
- `state`: Random value to prevent CSRF attacks

---

## Step 2: User Login and Consent

The user sees:
1. **Login screen** (email + password) - authenticating with Google
2. **Consent screen** - "Allow Yelp to access your public profile and contacts?"

The user can click:
- **Yes** → Flow continues
- **No** → Flow ends, redirects back with error

---

## Step 3: Authorization Server Redirects Back

If user clicks "Yes", the authorization server redirects back to the callback URL:

**Success:**
```
https://yelp.com/callback?
  code=oMsCeLvIaQm6bTrgtp7&
  state=foobar
```

**Error (if user denied):**
```
https://yelp.com/callback?
  error=access_denied&
  error_description=The user did not consent.
```

The authorization code is only useful for one thing: exchanging it for an access token.

---

## Step 4: Exchange Code for Access Token

The client makes a **server-to-server** request (back channel) to exchange the code for a token:

**Request:**
```
POST https://www.googleapis.com/oauth2/v4/token
Content-Type: application/x-www-form-urlencoded

code=oMsCeLvIaQm6bTrgtp7&
client_id=abc123&
client_secret=secret123&
grant_type=authorization_code
```

**Response:**
```json
{
  "access_token": "fFAGRNJru1FTz70BzhT3Zg",
  "expires_in": 3920,
  "token_type": "Bearer"
}
```

**Important:** This happens on the **back channel** (server-to-server), not in the browser. The `client_secret` is never exposed to the browser.

---

## Step 5: Use the Access Token

Now the client can use the access token to access the resource server:

**Request:**
```
GET https://api.google.com/contacts
Authorization: Bearer fFAGRNJru1FTz70BzhT3Zg
```

The resource server:
1. Validates the token (checks signature, expiration, etc.)
2. Checks the token's scope (does it allow reading contacts?)
3. Returns the data if valid

---

# 4) Front Channel vs Back Channel (Why Two Steps?)

## The Question: Why Code Then Token?

Why not just give the access token directly? Why the extra step of getting a code first, then exchanging it?

**Answer:** Security. We need both channels working together.

---

## Front Channel (Browser)

**Characteristics:**
- User's browser (visible to user, developer tools, etc.)
- Can see URLs in address bar
- Less secure (someone could look over your shoulder, see source code, etc.)

**What happens on front channel:**
- User redirected to authorization server
- User sees login and consent screens
- Authorization code returned in URL (query parameters)

```mermaid
flowchart LR
    A[Client] -->|Front Channel<br/>Browser Redirect| B[Authorization Server]
    B -->|Front Channel<br/>Authorization Code| A
    
    C[Front Channel = Browser<br/>Less Secure<br/>Visible to User]
    
    style A fill:#3498DB,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#E74C3C,color:#fff
```

---

## Back Channel (Server-to-Server)

**Characteristics:**
- Server-to-server communication (your server → Google's server)
- Not visible to browser
- Highly secure (HTTPS, encrypted, only you have access)

**What happens on back channel:**
- Exchange authorization code for access token
- Requires `client_secret` (only your server knows this)
- Access token used to call APIs

```mermaid
flowchart LR
    A[Client Server] -->|Back Channel<br/>HTTPS POST| B[Authorization Server]
    A -->|Back Channel<br/>Bearer Token| C[Resource Server]
    
    D[Back Channel = Server-to-Server<br/>Highly Secure<br/>Uses client_secret]
    
    style A fill:#3498DB,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#9B59B6,color:#fff
    style D fill:#2ECC71,color:#fff
```

---

## Why This Design?

**If someone steals the authorization code from the browser:**
- They still can't get the access token
- They don't have the `client_secret` (only your server has it)
- The code expires quickly (usually minutes)

**The flow uses the best of both:**
- **Front channel** = Great for user interaction (login, consent screens)
- **Back channel** = Great for secure token exchange (secret keys stay on server)

---

# 5) Scopes (Granular Permissions)

Scopes define **what permissions** the client is requesting.

**Example scopes:**
- `profile` - Basic user profile information
- `contacts` - Access to user's contacts
- `email` - User's email address
- `read` - Read-only access
- `write` - Write access

**In the request:**
```
scope=profile contacts
```

**On consent screen:**
> "Yelp is requesting access to:
> - Your public profile
> - Your contacts"

**In the access token:**
The token is **scoped** to only what was requested. If Yelp got `profile contacts`, they can't:
- Delete your contacts
- Access your calendar
- Read your email

They can only read your profile and contacts.

---

# 6) Client Registration (One-Time Setup)

Before your app can use OAuth, you need to register it with the authorization server.

**What you get:**
1. **Client ID** - Public identifier (can be in browser/URLs)
2. **Client Secret** - Secret key (ONLY on your server, never in browser)

**Example:**
```
Client ID: 194853530508-urd4bp97kjg9kc2ke7bh28g8e5kkra0h.apps.googleusercontent.com
Client Secret: (hidden, only on server)
```

**Where to register:**
- Google: [Google Cloud Console](https://console.cloud.google.com)
- Okta: [developer.okta.com](https://developer.okta.com)
- Other providers have their own registration portals

---

# 7) OAuth 2.0 Flows (Grant Types)

There are different "flows" (grant types) for different use cases:

## Authorization Code Flow (Most Secure)

- Uses both front channel and back channel
- Best for: Web apps with server backend, mobile apps
- Most secure option

## Implicit Flow (Front Channel Only)

- Token returned directly (no code exchange)
- Best for: Single Page Apps (SPA) without backend
- Less secure (token exposed to browser)

```mermaid
flowchart LR
    A[Client] -->|Front Channel Only| B[Authorization Server]
    B -->|Access Token Directly| A
    
    C[Implicit Flow = Front Channel Only<br/>Less Secure<br/>For SPAs without backend]
    
    style A fill:#3498DB,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#E74C3C,color:#fff
```

## Resource Owner Password Credentials Flow

- Back channel only
- Client sends username/password directly
- **Not recommended** for new applications
- Sometimes used to migrate legacy systems

## Client Credentials Flow

- Back channel only
- Machine-to-machine communication
- No user involved
- Service-to-service API access

---

# 8) The Problem: OAuth 2.0 for Authentication

OAuth 2.0 was designed for **authorization** (permissions), but people started using it for **authentication** (login) too.

**The problem:**
- OAuth 2.0 has **no standard way** to get user information
- Every implementation (Google, Facebook, Twitter) did it differently
- Not interoperable
- Confusing for developers

**Example:** After OAuth flow completes, how do you know:
- Who logged in? (email, name, user ID)
- When did they log in?
- How did they authenticate? (password, MFA, etc.)

OAuth doesn't answer these questions. It only gives you an access token for permissions.

---

# 9) OpenID Connect: The Authentication Layer

OpenID Connect is **not a separate protocol** - it's a thin layer (about 5-10%) on top of OAuth 2.0 that adds authentication.

```mermaid
flowchart TD
    A[OpenID Connect] --> B[OAuth 2.0]
    B --> C[HTTP]
    
    D[OpenID Connect = Authentication<br/>OAuth 2.0 = Authorization]
    
    style A fill:#F39C12,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#3498DB,color:#fff
    style D fill:#9B59B6,color:#fff
```

**What OpenID Connect adds:**
1. **ID Token** - Contains user information (who logged in)
2. **UserInfo Endpoint** - API to get more user information
3. **Standard set of scopes** - `openid`, `profile`, `email`, etc.
4. **Standardized implementation** - Same way everywhere

---

## OpenID Connect Flow (Same as OAuth, Plus ID Token)

The flow looks identical to OAuth 2.0, with one key difference:

**The request includes `openid` scope:**
```
scope=openid profile
```

**The response includes an ID token:**
```json
{
  "access_token": "fFAGRNJru1FTz70BzhT3Zg",
  "id_token": "eyJraWQiOiJ6VnBnVklDcEVNU2kt...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**That's it!** The only technical difference is adding `openid` scope and receiving an ID token.

---

# 10) ID Tokens (JWTs)

An **ID token** is a JSON Web Token (JWT) that contains user information.

## Anatomy of a JWT

A JWT has three parts separated by dots:

```
eyJraWQiOiJ6VnBnVklDcEVNU2kt... (Header)
.
eyJzdWIiOiIwMHU5bzFuaWtqdk9CZz... (Payload/Claims)
.
dv4Ek8B4BDee1PcQT_4zm7kxDEY1sR... (Signature)
```

### Header

Contains algorithm and key ID:
```json
{
  "typ": "JWT",
  "alg": "RS256",
  "kid": "zVpgVICpEMSi-MIOUnELHADNRFL4e0h0YvjSxPSf2sw"
}
```

### Payload (Claims)

Contains user information:
```json
{
  "sub": "you@gmail.com",
  "name": "Nate Barbettini",
  "aud": "s6BhdRkqt3",
  "exp": 1311281970,
  "iat": 1311280970,
  "auth_time": 1311280969,
  "iss": "https://accounts.google.com"
}
```

**Common claims:**
- `sub` (subject) - User ID or email
- `name` - User's name
- `email` - User's email
- `exp` - Token expiration time
- `iat` - Token issued at time
- `auth_time` - When user authenticated
- `iss` (issuer) - Who issued the token
- `aud` (audience) - Who the token is for

### Signature

Cryptographic signature to verify the token hasn't been tampered with.

**Why signatures matter:**
- You can verify the token without calling the authorization server
- Proves the token came from the right issuer
- Prevents tampering (user can't change their email in the token)

---

## Decoding a JWT

You can decode JWTs at [jsonwebtoken.io](https://jsonwebtoken.io) to see what's inside.

**Note:** JWTs are **encoded** (not encrypted). Anyone can decode them and see the contents. The signature just proves they're authentic.

---

## UserInfo Endpoint

If you need more user information than what's in the ID token, you can call the UserInfo endpoint:

**Request:**
```
GET https://www.googleapis.com/oauth2/v4/userinfo
Authorization: Bearer fFAGRNJru1FTz70BzhT3Zg
```

**Response:**
```json
{
  "sub": "you@gmail.com",
  "name": "Nate Barbettini",
  "profile_picture": "http://plus.g.co/123"
}
```

---

# 11) Which Flow Should I Use?

Here's a quick guide based on your application type:

| Application Type | Recommended Flow | Why |
| ---------------- | ---------------- | --- |
| **Web application with server backend** | Authorization Code Flow | Most secure, uses back channel |
| **Native mobile app** | Authorization Code Flow + PKCE | Secure, supports mobile |
| **JavaScript app (SPA) with API backend** | Implicit Flow or Authorization Code Flow with PKCE | No backend for token exchange (implicit) or use PKCE for better security |
| **Microservices and APIs** | Client Credentials Flow | Machine-to-machine, no user |

---

## Example: Web Application with Server Backend

**Use OpenID Connect Authorization Code Flow**

```mermaid
flowchart TD
    A[User clicks Login] -->|Redirect| B[Authorization Server<br/>Login with Google]
    B -->|Login & Consent| C[Authorization Code]
    C -->|Back Channel Exchange| D[ID Token + Access Token]
    D -->|Store in Session| E[Session Cookie]
    E -->|User Logged In| A
    
    style A fill:#3498DB,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#F39C12,color:#fff
    style D fill:#9B59B6,color:#fff
    style E fill:#E74C3C,color:#fff
```

**Benefits over simple forms authentication:**
- Authentication system is separate from your app
- You don't handle passwords, security, GDPR, etc.
- Can evolve authentication independently
- Standard protocol (works with any OpenID Connect provider)

---

## Example: Native Mobile App

**Use OpenID Connect Authorization Code Flow + PKCE**

```mermaid
flowchart TD
    A[User clicks Login] -->|AppAuth Library| B[Authorization Server]
    B -->|Login & Consent| C[Authorization Code]
    C -->|Exchange with PKCE| D[ID Token + Access Token]
    D -->|Store in Keychain| E[Protected Storage]
    E -->|Use Tokens| F[API Calls]
    
    style A fill:#3498DB,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#F39C12,color:#fff
    style D fill:#9B59B6,color:#fff
    style E fill:#E74C3C,color:#fff
    style F fill:#2ECC71,color:#fff
```

**PKCE (Proof Key for Code Exchange):**
- Extra security layer for mobile apps
- Prevents authorization code interception
- Required for mobile apps in modern implementations

**Recommended library:** [AppAuth](https://appauth.io) - Handles all the complexity for you

---

## Example: Single Page Application (SPA) with API Backend

**Use OpenID Connect Implicit Flow or Authorization Code Flow with PKCE**

```mermaid
flowchart TD
    A[User clicks Login] -->|Redirect| B[Authorization Server]
    B -->|Login & Consent| C[ID Token + Access Token<br/>In URL Fragment]
    C -->|Store Locally<br/>JavaScript| D[Memory or Session Storage]
    D -->|Use ID Token| E[Know Who User Is]
    D -->|Use Access Token| F[API Requests]
    
    G[Implicit Flow = Front Channel Only<br/>Store tokens with JavaScript<br/>Must prevent XSS]
    
    style A fill:#3498DB,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#F39C12,color:#fff
    style D fill:#9B59B6,color:#fff
    style E fill:#E74C3C,color:#fff
    style F fill:#2ECC71,color:#fff
    style G fill:#E74C3C,color:#fff
```

**Important security considerations:**
- Tokens stored in JavaScript (accessible to XSS attacks)
- Must sanitize inputs to prevent XSS
- Consider using Authorization Code Flow with PKCE instead (more secure)

---

# 12) OAuth 2.0 vs OpenID Connect (When to Use What)

**Use OAuth 2.0 for:**
- Granting access to your API
- Getting access to user data in other systems
- **Authorization** (permissions)

**Use OpenID Connect for:**
- Logging the user in
- Making your accounts available in other systems
- **Authentication** (who you are)

```mermaid
flowchart LR
    A[OAuth 2.0] -->|For| B[Authorization<br/>What can you do?]
    C[OpenID Connect] -->|For| D[Authentication<br/>Who are you?]
    
    style A fill:#3498DB,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#F39C12,color:#fff
    style D fill:#9B59B6,color:#fff
```

**Important:** OpenID Connect doesn't replace OAuth 2.0. They solve different problems:
- **OAuth 2.0** = Still the right tool for delegated authorization
- **OpenID Connect** = Replaces misusing OAuth 2.0 for authentication

---

# 13) Identity Use Cases: Then and Now

## Pre-2010

| Use Case | Solution |
| -------- | -------- |
| Simple login | Forms and cookies |
| Single sign-on (SSO) | SAML |
| Mobile app login | ??? (no good solution) |
| Delegated authorization | ??? (no good solution) |

## Pre-2014 (After OAuth 2.0)

| Use Case | Solution |
| -------- | -------- |
| Simple login | OAuth 2.0 (misused) |
| SSO | OAuth 2.0 (misused) |
| Mobile app login | OAuth 2.0 (misused) |
| Delegated authorization | OAuth 2.0 (correct use) |

**Problem:** OAuth 2.0 wasn't designed for authentication, but everyone used it that way.

## Today (After OpenID Connect)

| Use Case | Solution | Type |
| -------- | -------- | ---- |
| Simple login | OpenID Connect | Authentication |
| SSO | OpenID Connect | Authentication |
| Mobile app login | OpenID Connect | Authentication |
| Delegated authorization | OAuth 2.0 | Authorization |

**Solution:** Use the right tool for each job.

---

# 14) Single Sign-On (SSO) with Multiple Protocols

OpenID Connect can work alongside other protocols like SAML through an authorization server.

```mermaid
flowchart TD
    A[Your App] -->|OpenID Connect| B[Authorization Server<br/>Okta]
    B -->|SAML| C[SAML Provider<br/>saml.othersite.com]
    
    D[Your app only needs to support<br/>OpenID Connect<br/>Authorization server handles SAML]
    
    style A fill:#3498DB,color:#fff
    style B fill:#2ECC71,color:#fff
    style C fill:#F39C12,color:#fff
    style D fill:#9B59B6,color:#fff
```

**Benefit:** Your app only needs to implement OpenID Connect. The authorization server handles the complexity of SAML, legacy systems, etc.

---

## Final Mental Model (Remember This)

```
OAuth 2.0         -> Delegated authorization (permissions)
OpenID Connect    -> Authentication layer on top of OAuth 2.0
Authorization Code -> Most secure flow (front + back channel)
Implicit Flow     -> Front channel only (less secure, for SPAs)
ID Token          -> JWT with user information (who you are)
Access Token      -> Token for API access (what you can do)
Front Channel     -> Browser (less secure, visible)
Back Channel      -> Server-to-server (highly secure)
Scope             -> What permissions are requested
Client ID         -> Public identifier
Client Secret     -> Secret key (only on server)
```

If this makes sense, OAuth 2.0 and OpenID Connect have officially **clicked**.

---

## Helpful Resources

- **[oauth.com](https://oauth.com)** - Free OAuth 2.0 ebook with detailed explanations
- **[developer.okta.com](https://developer.okta.com)** - Free Okta developer account to try authorization servers
- **[oauthdebugger.com](https://oauthdebugger.com)** - Tool to test OAuth 2.0 requests
- **[oidcdebugger.com](https://oidcdebugger.com)** - Tool to test OpenID Connect requests
- **[jsonwebtoken.io](https://jsonwebtoken.io)** - Decode and inspect JWTs

---

## Glossary (Fast Reference)

* **OAuth 2.0** – Authorization framework that allows apps to access resources on behalf of users without sharing passwords
* **OpenID Connect (OIDC)** – Authentication layer built on top of OAuth 2.0. Provides identity information (who the user is) in addition to OAuth 2.0's authorization
* **Authorization Code Flow** – OAuth 2.0 flow that uses both front channel and back channel. Most secure flow, recommended for most applications
* **Implicit Flow** – OAuth 2.0 flow that uses front channel only. Less secure, used when no backend server is available
* **Authorization Grant** – Proof that the user has consented to the requested permissions
* **Authorization Code** – Temporary code returned by authorization server that can be exchanged for an access token
* **Access Token** – Token used to access protected resources (APIs). Short-lived, scoped to specific permissions
* **ID Token** – JWT containing user information (who logged in). Part of OpenID Connect
* **JWT (JSON Web Token)** – Standard token format with three parts: header, payload (claims), and signature. Self-contained and verifiable
* **Scope** – Permission label (e.g., `profile`, `contacts`, `openid`). Defines what the token allows
* **Client ID** – Public identifier for your application. Can be exposed in browser/URLs
* **Client Secret** – Secret key for your application. Must only exist on your server, never in browser
* **Resource Owner** – The user who owns the data and can grant access
* **Client** – The application requesting access to resources
* **Authorization Server** – Service that authenticates users and issues tokens (e.g., Google, Okta, Auth0)
* **Resource Server** – API that holds the protected resources (e.g., Google Contacts API)
* **Redirect URI / Callback** – URL where the user is sent after authorization. Must be registered with authorization server
* **Front Channel** – Browser-based communication. Less secure, visible to user
* **Back Channel** – Server-to-server communication. Highly secure, uses HTTPS
* **PKCE (Proof Key for Code Exchange)** – Security extension for mobile apps and SPAs. Prevents authorization code interception
* **UserInfo Endpoint** – OpenID Connect API endpoint to retrieve additional user information
* **Bearer Token** – Token sent in `Authorization: Bearer <token>` header. Whoever "bears" it can use it
* **State Parameter** – Random value sent in authorization request and returned in callback. Used to prevent CSRF attacks
* **SAML** – Older protocol for single sign-on, primarily used in enterprise. XML-based, more complex than OAuth 2.0

---

This guide explains OAuth 2.0 and OpenID Connect in plain English, making these protocols accessible to developers at all levels.

