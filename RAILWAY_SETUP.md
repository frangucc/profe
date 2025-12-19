# Railway Deployment Setup

## Required Environment Variables

Add these in Railway Dashboard → Your Service → Variables:

### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_9vbxaQjAlty0@ep-lingering-waterfall-a4qvwrty-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 2. JWT_SECRET
```
profe_secret_key_change_in_production_2024
```

### 3. NODE_ENV (Railway auto-sets this, but verify)
```
production
```

---

## Steps to Deploy

1. **Go to Railway Dashboard**
   - Navigate to https://railway.app/dashboard
   - Select your `profe` project

2. **Add Environment Variables**
   - Click on your service
   - Go to **Variables** tab
   - Click **+ New Variable**
   - Add each variable above

3. **Redeploy**
   - Railway will auto-redeploy after saving variables
   - Or manually trigger: **Deployments** → **Deploy** (3 dots menu)

4. **Check Logs**
   - Go to **Deploy Logs** tab
   - Should see: ✅ Connected to Neon PostgreSQL database
   - Should see: 🚀 ProFe Server running on port XXXX

---

## Troubleshooting

### If you see "ECONNREFUSED ::1:5432"
- DATABASE_URL is missing or incorrect
- Make sure you saved the variables in Railway

### If you see "schema does not exist"
- Database migration hasn't run yet
- The migration runs automatically on first startup

### If build succeeds but deploy fails
- Check that `npm start` command works locally
- Verify all dependencies are in package.json (not devDependencies)

---

## After Successful Deploy

Your app will be available at:
```
https://profe-production.up.railway.app
```

The API will be at:
```
https://profe-production.up.railway.app/api
```

Health check:
```
https://profe-production.up.railway.app/api/health
```
