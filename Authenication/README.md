# Authentication & Authorization Flow

Perfect use case for a flow chart. Below are **two versions** you can use:

1. **Beginner-friendly flow (plain English)**
2. **Technical flow chart (architecture-aware, great for README / article)**

---

## 1. User Flow (Beginner-Friendly)

This explains **what the user experiences**, step by step, without technical jargon.

```mermaid
flowchart TD
    A[User opens the app] --> B[User clicks Login]
    B --> C[User is redirected to Okta login page]
    C --> D[User enters email + password and MFA if required]
    D --> E[Okta verifies the user]
    E --> F[User is redirected back to the app]
    F --> G[User lands on Dashboard]
    G --> H[User sees their credit applications]
    H --> I{User chooses an action}
    I --> J[View existing applications]
    I --> K[Create a new credit application]
    I --> L[Edit an existing application]
    I --> M[Admin only: View/manage all users & applications]
    J --> N[User submits changes]
    K --> N
    L --> N
    M --> N
    N --> O[App saves updates securely]
    O --> P[User sees updated data in the UI]
    
    style A fill:#e1f5ff
    style G fill:#d4edda
    style O fill:#d4edda
    style P fill:#d4edda
```

**Mental model for beginners:**

> "Login proves who you are → the app decides what you're allowed to do → data is shown or updated."

---

## 2. Technical Flow Chart (React + Okta + Node + DB)

This is the **"what's actually happening under the hood"** version.

```mermaid
flowchart TD
    A[User Browser] -->|1. Open React App| B[React Frontend]
    B -->|2. Login Request| C[Okta Hosted Login]
    C -->|3. Authenticate User password, MFA, etc.| D[Okta]
    D -->|4. Issue JWT ID Token / Access Token| B
    B -->|5. API Request with JWT Authorization: Bearer token| E[Node.js + Express API]
    E -->|6. Validate JWT issuer, signature, expiration| E
    E -->|7. Check authorization user vs admin| F[Business Logic Services]
    F -->|8. Read / Write Data| G[MongoDB Database]
    G -->|9. Return Data| E
    E -->|10. JSON Response| B
    B -->|11. Update UI| H[User Sees Results]
    
    style A fill:#e1f5ff
    style B fill:#fff4e6
    style D fill:#d4edda
    style E fill:#f8d7da
    style G fill:#e2e3e5
    style H fill:#d4edda
```

---

## 3. Admin vs Regular User Branch (Important for IAM Understanding)

This is **great for explaining authorization**.

```mermaid
flowchart TD
    A[User is authenticated] --> B{Does user have Admin role?}
    B -->|YES| C[Admin Dashboard]
    B -->|NO| D[User Dashboard]
    
    C --> C1[View all users]
    C --> C2[View all credit applications]
    C --> C3[Update application status]
    C --> C4[Manage user roles]
    
    D --> D1[View own applications]
    D --> D2[Create new application]
    D --> D3[Edit own application]
    
    style A fill:#d4edda
    style B fill:#fff3cd
    style C fill:#cce5ff
    style D fill:#e1f5ff
```

---

## 4. One-Liner Explanation

### Technical Version:

> **The user authenticates through Okta, receives a secure token, and every action they take is validated by the backend before data is read or written to the database.**

### Beginner Version:

> **Okta confirms who the user is, the backend decides what they're allowed to do, and the database stores the results.**

---

## Additional Notes

### Authentication vs Authorization

- **Authentication**: Verifies who the user is (Okta handles this)
- **Authorization**: Determines what the user can do (your backend handles this)

### Security Considerations

- JWT tokens are validated on every API request (issuer, signature, expiration)
- Role-based access control (RBAC) determines admin vs regular user permissions
- All sensitive operations require valid authentication and proper authorization

---

## Diagram Formats

These diagrams are created using **Mermaid syntax**, which renders automatically on:
- GitHub README files
- GitLab README files
- Many modern markdown viewers
- VS Code with Mermaid extensions

### Alternative Formats Available

If you need these diagrams in other formats, they can be converted to:
- **draw.io / Lucidchart-style layout** (XML or image format)
- **PlantUML** syntax
- **UI click-by-click walkthrough** ("User clicks X → backend does Y")
- **Detailed security callouts** (JWT validation, role checks, etc.)

