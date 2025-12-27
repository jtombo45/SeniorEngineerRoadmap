# Wild Rydes - Serverless Web Application Tutorial

> **A complete serverless web application built with AWS services, perfect for learning cloud architecture and serverless patterns.**

## TL;DR

Wild Rydes is a unicorn ride-sharing web application that demonstrates a full-stack serverless architecture on AWS. Users can register, sign in, and request rides by clicking on a map. The app uses **AWS Amplify** for hosting, **Amazon Cognito** for authentication, **API Gateway** + **Lambda** for the backend API, and **DynamoDB** for data storage.

**What you'll learn:**
- How to build a serverless web application
- How AWS services integrate end-to-end
- Authentication and authorization patterns
- API design with API Gateway and Lambda
- NoSQL database operations with DynamoDB

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────────────────────────┐
│              AWS Amplify (Hosting)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ index.html│  │signin.html│  │ride.html │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└──────┬──────────────────────────────────────────────────┘
       │
       │ Auth Requests
       ▼
┌─────────────────────────────────────────────────────────┐
│           Amazon Cognito (User Pool)                     │
│  • User Registration                                     │
│  • Email Verification                                    │
│  • Sign In / Sign Out                                    │
│  • JWT Token Generation                                  │
└──────┬──────────────────────────────────────────────────┘
       │
       │ API Requests (with JWT)
       ▼
┌─────────────────────────────────────────────────────────┐
│         API Gateway (REST API)                           │
│  • /ride endpoint                                        │
│  • Cognito Authorizer (validates JWT)                    │
└──────┬──────────────────────────────────────────────────┘
       │
       │ Invokes
       ▼
┌─────────────────────────────────────────────────────────┐
│           AWS Lambda (Backend Logic)                      │
│  • Processes ride requests                               │
│  • Selects unicorn from fleet                            │
│  • Records ride in database                             │
└──────┬──────────────────────────────────────────────────┘
       │
       │ Writes
       ▼
┌─────────────────────────────────────────────────────────┐
│           DynamoDB (Rides Table)                         │
│  • Stores ride history                                   │
│  • RideId (Partition Key)                                │
└─────────────────────────────────────────────────────────┘

IAM Roles & Policies (not shown):
  • Lambda execution role (allows DynamoDB writes)
  • API Gateway authorizer (validates Cognito tokens)
```

## Prerequisites

- **AWS Account** with admin access (or permissions for: Amplify, Cognito, API Gateway, Lambda, DynamoDB, IAM)
- **GitHub Account** (for hosting the repository)
- **Basic knowledge** of:
  - HTML, CSS, JavaScript
  - AWS Console navigation
  - Git basics

## Setup Steps

### Step 1: Clone and Configure the Repository

1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd wildrydes-site
   ```

2. Copy the example configuration file:
   ```bash
   cp js/config.example.js js/config.js
   ```

3. **Do not commit `js/config.js`** - it will contain your AWS resource IDs.

### Step 2: Create Amazon Cognito User Pool

1. Go to **AWS Console** → **Amazon Cognito** → **User Pools** → **Create user pool**
2. Choose **Email** as the sign-in option
3. Configure password policy (or use defaults)
4. **Enable email verification** (users will receive verification codes)
5. Skip MFA for this tutorial (optional)
6. **Save the User Pool ID** (e.g., `us-east-2_uXboG5pAb`)
7. Create an **App Client**:
   - Go to **App integration** → **App clients** → **Create app client**
   - Name: `wildrydes-app-client`
   - **Uncheck** "Generate client secret" (we're using a public client)
   - **Save the App Client ID** (e.g., `25ddkmj4v6hfsfvruhpfi7n4hv`)

8. Update `js/config.js`:
   ```javascript
   cognito: {
       userPoolId: 'us-east-2_uXboG5pAb',  // Your User Pool ID
       userPoolClientId: '25ddkmj4v6hfsfvruhpfi7n4hv',  // Your App Client ID
       region: 'us-east-2'  // Your region
   }
   ```

### Step 3: Create DynamoDB Table

1. Go to **AWS Console** → **DynamoDB** → **Tables** → **Create table**
2. Table name: `Rides`
3. Partition key: `RideId` (type: String)
4. Use default settings (on-demand billing is fine for this tutorial)
5. Click **Create table**

### Step 4: Create Lambda Function

1. Go to **AWS Console** → **Lambda** → **Functions** → **Create function**
2. Choose **Author from scratch**
3. Function name: `RequestUnicorn`
4. Runtime: **Node.js 20.x** (or latest LTS)
5. Architecture: **x86_64**
6. Click **Create function**

7. **Add the function code** (see Lambda code below)
8. **Configure the execution role**:
   - Go to **Configuration** → **Permissions**
   - Click on the execution role name
   - In IAM, add an inline policy:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [{
         "Effect": "Allow",
         "Action": ["dynamodb:PutItem"],
         "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/Rides"
       }]
     }
     ```
   - Replace `REGION` and `ACCOUNT_ID` with your values

**Lambda Function Code:**
```javascript
import { randomBytes } from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

const fleet = [
    { Name: 'Angel', Color: 'White', Gender: 'Female' },
    { Name: 'Gil', Color: 'White', Gender: 'Male' },
    { Name: 'Rocinante', Color: 'Yellow', Gender: 'Female' },
];

export const handler = async (event, context) => {
    if (!event.requestContext.authorizer) {
        return errorResponse('Authorization not configured', context.awsRequestId);
    }

    const rideId = toUrlString(randomBytes(16));
    console.log('Received event (', rideId, '): ', event);

    const username = event.requestContext.authorizer.claims['cognito:username'];
    const requestBody = JSON.parse(event.body);
    const pickupLocation = requestBody.PickupLocation;

    const unicorn = findUnicorn(pickupLocation);

    try {
        await recordRide(rideId, username, unicorn);
        return {
            statusCode: 201,
            body: JSON.stringify({
                RideId: rideId,
                Unicorn: unicorn,
                Eta: '30 seconds',
                Rider: username,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, context.awsRequestId);
    }
};

function findUnicorn(pickupLocation) {
    console.log('Finding unicorn for ', pickupLocation.Latitude, ', ', pickupLocation.Longitude);
    return fleet[Math.floor(Math.random() * fleet.length)];
}

async function recordRide(rideId, username, unicorn) {
    const params = {
        TableName: 'Rides',
        Item: {
            RideId: rideId,
            User: username,
            Unicorn: unicorn,
            RequestTime: new Date().toISOString(),
        },
    };
    await ddb.send(new PutCommand(params));
}

function toUrlString(buffer) {
    return buffer.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function errorResponse(errorMessage, awsRequestId) {
    return {
        statusCode: 500,
        body: JSON.stringify({
            Error: errorMessage,
            Reference: awsRequestId,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };
}
```

**Note:** If using the inline code editor, you'll need to install the AWS SDK v3 packages. For a production setup, use a deployment package or Lambda layers.

### Step 5: Create API Gateway REST API

1. Go to **AWS Console** → **API Gateway** → **REST API** → **Build**
2. Choose **REST** (not REST API Private)
3. Protocol: **REST**
4. Create new API: **New API**
5. API name: `WildRydesAPI`
6. Endpoint type: **Regional**
7. Click **Create API**

8. **Create the `/ride` resource**:
   - Click **Actions** → **Create Resource**
   - Resource name: `ride`
   - Resource path: `ride`
   - Click **Create Resource**

9. **Create POST method**:
   - Select `/ride` resource
   - Click **Actions** → **Create Method** → **POST**
   - Integration type: **Lambda Function**
   - Lambda function: `RequestUnicorn`
   - Click **Save** → **OK** (to grant API Gateway permission)

10. **Create Cognito Authorizer**:
    - Click **Authorizers** in the left sidebar
    - Click **Create New Authorizer**
    - Name: `CognitoAuthorizer`
    - Type: **Cognito**
    - Cognito User Pool: Select your user pool
    - Token Source: `Authorization` (default)
    - Click **Create**

11. **Enable CORS**:
    - Select the `/ride` resource
    - Click **Actions** → **Enable CORS**
    - Access-Control-Allow-Origin: `*` (or your Amplify domain)
    - Click **Enable CORS and replace existing CORS headers**

12. **Deploy the API**:
    - Click **Actions** → **Deploy API**
    - Deployment stage: **New Stage** → Name: `dev`
    - Click **Deploy**
    - **Copy the Invoke URL** (e.g., `https://abc123.execute-api.us-east-2.amazonaws.com/dev`)

13. **Attach the authorizer to POST method**:
    - Select **POST** method under `/ride`
    - Click **Method Request**
    - Authorization: Select `CognitoAuthorizer`
    - Click the checkmark to save

14. Update `js/config.js`:
    ```javascript
    api: {
        invokeUrl: 'https://abc123.execute-api.us-east-2.amazonaws.com/dev'
    }
    ```

### Step 6: Deploy with AWS Amplify

1. **Push your code to GitHub** (make sure `js/config.js` is in `.gitignore`)

2. Go to **AWS Console** → **AWS Amplify** → **Hosting** → **New app** → **Host web app**

3. Choose **GitHub** and authorize AWS to access your repository

4. Select your repository and branch (usually `main` or `master`)

5. **Build settings** (Amplify should auto-detect, but verify):
   - Build command: (leave empty for static site)
   - Output directory: `/` (root)

6. Click **Save and deploy**

7. Once deployed, **update `js/config.js` in Amplify**:
   - Go to **App settings** → **Environment variables** (or use the Amplify Console's file editor)
   - Alternatively, you can set environment variables and use a build script to generate `config.js`

8. **Access your app** at the Amplify-provided URL (e.g., `https://main.abc123.amplifyapp.com`)

## Testing Checklist

### 1. User Registration
- [ ] Navigate to `/register.html`
- [ ] Enter email and password
- [ ] Submit registration
- [ ] Check email for verification code

### 2. Email Verification
- [ ] Navigate to `/verify.html`
- [ ] Enter email and verification code
- [ ] Verify successfully
- [ ] Should redirect to sign-in page

### 3. Sign In
- [ ] Navigate to `/signin.html`
- [ ] Enter verified email and password
- [ ] Sign in successfully
- [ ] Should redirect to `/ride.html`

### 4. Get Auth Token
- [ ] On `/ride.html`, click the "auth token" link
- [ ] Verify a JWT token is displayed
- [ ] Token should start with `eyJ...`

### 5. Request a Ride
- [ ] On `/ride.html`, click on the map to set pickup location
- [ ] Click "Request Unicorn"
- [ ] Verify a unicorn is assigned and displayed
- [ ] Check DynamoDB table for the new ride record

### 6. Verify DynamoDB
- [ ] Go to **DynamoDB Console** → **Tables** → **Rides** → **Explore table items**
- [ ] Verify ride records are being created

## Troubleshooting

### 401 Unauthorized
- **Cause:** Missing or invalid JWT token
- **Fix:**
  - Ensure user is signed in
  - Check that Cognito User Pool ID and App Client ID are correct in `config.js`
  - Verify the API Gateway authorizer is attached to the POST method

### 403 Forbidden
- **Cause:** API Gateway authorizer rejecting the token
- **Fix:**
  - Verify the Cognito User Pool in the authorizer matches your config
  - Check that the token source header is `Authorization`
  - Ensure the user pool and API Gateway are in the same region

### CORS Errors
- **Cause:** API Gateway not configured for CORS
- **Fix:**
  - Enable CORS on the `/ride` resource in API Gateway
  - Ensure `Access-Control-Allow-Origin` includes your Amplify domain (or `*` for testing)
  - Redeploy the API after CORS changes

### Lambda Execution Errors
- **Cause:** Missing permissions or DynamoDB table not found
- **Fix:**
  - Check Lambda execution role has `dynamodb:PutItem` permission
  - Verify DynamoDB table name is exactly `Rides` (case-sensitive)
  - Check CloudWatch Logs for detailed error messages

### Config Not Loading
- **Cause:** `config.js` missing or incorrect path
- **Fix:**
  - Ensure `js/config.js` exists (copy from `config.example.js`)
  - Verify all placeholder values are replaced
  - Check browser console for JavaScript errors

### Common Config Mistakes
- Using `userPoolId` instead of `userPoolClientId` (or vice versa)
- Missing `https://` in `invokeUrl`
- Incorrect region (must match where resources are created)
- Extra trailing slashes in URLs

## Cleanup

**Important:** Delete all resources to avoid ongoing charges.

1. **AWS Amplify App**:
   - Go to **Amplify Console** → Select app → **Actions** → **Delete app**

2. **API Gateway**:
   - Go to **API Gateway** → Select API → **Actions** → **Delete API**

3. **Lambda Function**:
   - Go to **Lambda** → Select function → **Delete**

4. **DynamoDB Table**:
   - Go to **DynamoDB** → **Tables** → Select `Rides` → **Delete table**

5. **Cognito User Pool**:
   - Go to **Cognito** → **User Pools** → Select pool → **Delete user pool**

6. **IAM Roles** (optional, but recommended):
   - Go to **IAM** → **Roles** → Find Lambda execution role → **Delete**

## Azure-to-AWS Mental Mapping

If you're coming from Azure, here's a quick reference:

| Azure Service | AWS Equivalent | Purpose |
|--------------|----------------|---------|
| Azure Static Web Apps | AWS Amplify | Host static frontend, CI/CD |
| Azure Active Directory (Entra ID) | Amazon Cognito | User authentication |
| Azure Functions | AWS Lambda | Serverless compute |
| Azure API Management | Amazon API Gateway | API gateway, routing |
| Azure Cosmos DB (NoSQL) | Amazon DynamoDB | NoSQL database |
| Azure Resource Manager | AWS CloudFormation / IAM | Infrastructure as code, permissions |

**Key Differences:**
- AWS uses IAM roles for service permissions (vs. managed identities in Azure)
- Cognito is more focused on user authentication than Azure AD (which includes directory services)
- API Gateway is simpler for REST APIs than API Management (which includes more enterprise features)

## Security Notes

**⚠️ Never commit secrets to this repository!**

- `js/config.js` is in `.gitignore` and should never be committed
- Use `js/config.example.js` as a template
- For production, consider using environment variables or AWS Secrets Manager
- See [SECURITY.md](SECURITY.md) for detailed security guidelines

## Deployment Notes (Amplify + GitHub CI/CD)

When you connect your GitHub repository to AWS Amplify:

1. **Automatic Deploys**: Every push to your main branch triggers a new deployment
2. **Build Settings**: Amplify auto-detects static sites, but you can customize in `amplify.yml`
3. **Environment Variables**: Set in Amplify Console → App settings → Environment variables
4. **Custom Domain**: Add your domain in Amplify Console → Domain management
5. **Branch Previews**: Amplify creates preview deployments for pull requests (optional)

**Generating config.js from environment variables** (optional):

Create `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "window._config = { cognito: { userPoolId: '$USER_POOL_ID', userPoolClientId: '$APP_CLIENT_ID', region: '$REGION' }, api: { invokeUrl: '$API_INVOKE_URL' } };" > js/config.js
  artifacts:
    baseDirectory: /
    files:
      - '**/*'
```

Then set environment variables in Amplify Console.

## Additional Resources

- [AWS Serverless Workshops](https://aws.amazon.com/serverless-workshops/)
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Amazon Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
