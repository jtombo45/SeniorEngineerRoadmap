# Quick Reference: Where to Find Things in AWS Console

This guide helps you quickly locate important IDs and URLs you'll need during setup and troubleshooting.

## Amazon Cognito

### User Pool ID
**Where to find it:**
1. Go to **AWS Console** → **Amazon Cognito** → **User Pools**
2. Click on your user pool name
3. The **User Pool ID** is displayed at the top of the page
   - Format: `us-east-2_uXboG5pAb` (region_randomId)
4. Copy this value to `js/config.js` → `cognito.userPoolId`

### App Client ID
**Where to find it:**
1. Go to **AWS Console** → **Amazon Cognito** → **User Pools**
2. Click on your user pool name
3. Click **App integration** tab (left sidebar)
4. Scroll down to **App clients and analytics**
5. Click on your app client name
6. The **Client ID** is displayed
   - Format: `25ddkmj4v6hfsfvruhpfi7n4hv` (long alphanumeric string)
7. Copy this value to `js/config.js` → `cognito.userPoolClientId`

**Note:** Make sure you're looking at the **Client ID**, not the **Client secret** (we don't use secrets for public clients).

---

## API Gateway

### Invoke URL
**Where to find it:**
1. Go to **AWS Console** → **API Gateway** → **APIs**
2. Click on your API name (e.g., `WildRydesAPI`)
3. Click **Stages** in the left sidebar
4. Click on your stage name (e.g., `dev`)
5. The **Invoke URL** is displayed at the top
   - Format: `https://abc123.execute-api.us-east-2.amazonaws.com/dev`
6. Copy this value to `js/config.js` → `api.invokeUrl`

**Full endpoint URL:**
- Your full endpoint is: `{invokeUrl}/ride`
- Example: `https://abc123.execute-api.us-east-2.amazonaws.com/dev/ride`

### API ID
**Where to find it:**
- Same location as Invoke URL
- The API ID is in the URL or displayed in the API details
- Format: `abc123def4` (alphanumeric)

---

## AWS Amplify

### Hosted App URL
**Where to find it:**
1. Go to **AWS Console** → **AWS Amplify** → **All apps**
2. Click on your app name
3. The **App URL** is displayed at the top
   - Format: `https://main.abc123.amplifyapp.com`
4. This is where your app is live

### App ID
**Where to find it:**
- Same location as App URL
- Displayed in the app details
- Format: `d1234567890` (alphanumeric)

---

## AWS Lambda

### Function Name
**Where to find it:**
1. Go to **AWS Console** → **Lambda** → **Functions**
2. Your function name is in the list
   - Example: `RequestUnicorn`

### Function ARN
**Where to find it:**
1. Click on your function name
2. Go to **Configuration** tab
3. Scroll to **General configuration**
4. The **ARN** is displayed
   - Format: `arn:aws:lambda:us-east-2:123456789012:function:RequestUnicorn`

### View Logs (CloudWatch)
**Where to find logs:**
1. Go to **AWS Console** → **Lambda** → **Functions**
2. Click on your function name
3. Click **Monitor** tab
4. Click **View CloudWatch logs** button
5. Or go directly to **CloudWatch** → **Log groups** → `/aws/lambda/RequestUnicorn`

**Pro tip:** Logs appear within seconds of function execution. Use them to debug errors!

---

## DynamoDB

### Table Name
**Where to find it:**
1. Go to **AWS Console** → **DynamoDB** → **Tables**
2. Your table name is in the list
   - Should be: `Rides`

### View Table Items
**Where to find data:**
1. Go to **AWS Console** → **DynamoDB** → **Tables**
2. Click on `Rides` table
3. Click **Explore table items** button
4. You'll see all ride records stored

### Table ARN
**Where to find it:**
1. Click on your table name
2. Go to **Additional info** tab
3. The **ARN** is displayed
   - Format: `arn:aws:dynamodb:us-east-2:123456789012:table/Rides`
   - Needed for IAM policies

---

## IAM

### Lambda Execution Role
**Where to find it:**
1. Go to **AWS Console** → **Lambda** → **Functions**
2. Click on your function name
3. Go to **Configuration** tab → **Permissions**
4. Click on the role name (under **Execution role**)
5. This opens IAM Console where you can view/edit policies

### Role ARN
**Where to find it:**
1. In IAM Console (from above)
2. The **ARN** is displayed at the top
   - Format: `arn:aws:iam::123456789012:role/lambda-execution-role`

---

## Region

### Current Region
**Where to find it:**
- Look at the top-right of AWS Console
- The region selector shows your current region
- Example: `us-east-2`, `us-west-2`, `eu-west-1`
- **Important:** All resources should be in the same region!

### Change Region
1. Click the region selector (top-right)
2. Select a different region
3. **Warning:** Resources are region-specific. If you change regions, you won't see resources from other regions.

---

## Common Tasks

### Test API Gateway Endpoint
1. Go to **API Gateway** → Your API → **Stages** → Your stage
2. Click on `/ride` resource
3. Click **POST** method
4. Click **TEST** button (or use the **Invoke URL** with a tool like Postman/curl)

### View Cognito Users
1. Go to **Cognito** → **User Pools** → Your pool
2. Click **Users** tab
3. See all registered users, verification status, etc.

### Check API Gateway Logs
1. Go to **API Gateway** → Your API → **Stages** → Your stage
2. Click **Logs** tab
3. Enable CloudWatch logs if not already enabled
4. View request/response logs

### Monitor Lambda Invocations
1. Go to **Lambda** → Your function → **Monitor** tab
2. See metrics: Invocations, Duration, Errors, Throttles
3. Click **View in CloudWatch** for detailed metrics

---

## Quick Checklist

Before deploying, make sure you have:
- [ ] Cognito User Pool ID
- [ ] Cognito App Client ID
- [ ] API Gateway Invoke URL
- [ ] AWS Region (same for all resources)
- [ ] All values copied to `js/config.js`

## Troubleshooting: "Where did I put that?"

- **Config file:** `js/config.js` (local) or Amplify environment variables (deployed)
- **Lambda code:** Lambda Console → Functions → Your function → Code tab
- **API Gateway settings:** API Gateway → Your API → Resources/Methods
- **Cognito settings:** Cognito → User Pools → Your pool → Various tabs
- **IAM policies:** IAM → Roles → Your role → Permissions tab

## Pro Tips

1. **Bookmark these pages** in your browser for quick access
2. **Use AWS Console search** (top bar) to quickly find resources by name
3. **Tag your resources** with a project tag (e.g., `Project: WildRydes`) to filter them
4. **Use AWS CLI** if you prefer command line: `aws cognito-idp list-user-pools`, etc.
5. **Save screenshots** of important IDs during setup (but don't commit them!)

