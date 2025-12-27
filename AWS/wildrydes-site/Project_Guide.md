# AWS-Projects
- Project: Build a Full End-to-End Web App with 7 Services | Step-by-Step Tutorial
    - Setup
    - Services
        - GitHub
        - AWS Identity & Access Management (IAM)
            - Controls who can access what
            - Similair to Azure Active Directory (Azure AD/ Entra ID)
        - AWS Amplify 
            - Host frontend (React, Vue, etc) and handles deployment from GitHub
            - Eqvt to Azure State Web Apps 
        - Amazon Cognito
            - User sign-up / sign-in
            - Login, logout, password reset
            - Social logins (Google, Microsoft, etc.)
                - Auth system for real users (not developers)
        - AWS Lambda
            - Runs backend code without managing servers, executes when triggered
            - Eqvt to Azure Functions
        - Amazon API Gateway
            - Exposes backend endpoints (/api/users)
            - Routes requests to backend logic
                - Front door for your backend
            - Azure eqvt to Azure API Management
        - Amazon DynamoDB
            - Stores application data
            - Fast, scalable, schema-flexible
                - Database that grows with your app
            - Azure eqvt to Azure Cosmos DB (NoSQL API)
    - Project Detail: A uber like app called Wild Rydes
- What Do You Need
    - A text editor or somewhere to keep notes
    - An AWS account, logged into Console with admin access
    - Basic knowledge of AWS
    - A GitHub account

 AWS
 - Create a new AWS Account
    - Email
    - Username
    - Password
- Login as a Root user

What Do We Need
- A way to store/update/pull code
- A place to host website and make updates
- A way for users to register and log in
- A way to do ride sharing functionality
- Somewhere to store/return ride results
- A way to invoke ride sharing functionality

Steps
- The code is in my TTT GitHub repo (HTML, CSS, JavaScript, etc.)
- Your GitHub Repo (HTML, CSS, JavaScript, etc.)
