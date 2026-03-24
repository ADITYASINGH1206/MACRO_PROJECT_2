# Production Deployment Guide

Deploy your attendance system to production on multiple cloud platforms.

## Local to Production Checklist

Before deploying, verify:
- [ ] All environment variables configured
- [ ] Database schema created on Supabase
- [ ] Models downloaded to ml-service/models/
- [ ] .env files use production values
- [ ] No hardcoded secrets in code
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Backup strategy defined

## Deployment Options

### Option 1: Railway (Recommended - Easiest)

1. **Create Railway Account:** https://railway.app
2. **Connect GitHub:** Link your repository
3. **Create Services:**

**Backend Service:**
```
NAME: attendance-backend
ROOT: ./backend
BUILDPACK: Node.js
START: npm start

Environment:
NODE_ENV=production
SUPABASE_URL=your-url
SUPABASE_KEY=your-key
JWT_SECRET=your-secret
ML_SERVICE_URL=https://ml-service.railway.app
```

**Frontend Service:**
```
NAME: attendance-frontend
ROOT: ./frontend
BUILDPACK: Node.js
BUILD: npm run build
START: npm start

Environment:
REACT_APP_API_URL=https://attendance-backend.railway.app
```

**ML Service:**
```
NAME: attendance-ml
ROOT: ./ml-service
BUILDPACK: Python
START: gunicorn --bind 0.0.0.0:5001 app:app
```

4. **Deploy:** Railway auto-deploys on push to main

### Option 2: Vercel (Best for Frontend)

1. **Import project:** https://vercel.com/import
2. **Select frontend directory**
3. **Add Environment:**
   ```
   REACT_APP_API_URL=https://your-backend-url
   ```
4. **Deploy:** Automatic on push

### Option 3: Heroku (Still Popular)

```bash
# Login
heroku login

# Create apps
heroku create attendance-backend
heroku create attendance-frontend
heroku create attendance-ml

# Set environment
heroku config:set -a attendance-backend \
  SUPABASE_URL=your-url \
  SUPABASE_KEY=your-key \
  JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### Option 4: Azure (Enterprise)

```bash
# Create resource group
az group create --name attendance-rg --location eastus

# Create App Service Plan
az appservice plan create \
  --name attendance-plan \
  --resource-group attendance-rg \
  --sku B1 --is-linux

# Deploy backend
az webapp up \
  --name attendance-api \
  --resource-group attendance-rg \
  --plan attendance-plan \
  --runtime "NODE|18-lts"

# Deploy frontend to Static Web Apps
az staticwebapp create \
  --name attendance-web \
  --resource-group attendance-rg \
  --source https://github.com/your-user/repo
```

## Production Environment Setup

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your-production-key
JWT_SECRET=your-production-secret-min-32-chars
ML_SERVICE_URL=https://your-ml-service.railway.app
FRONTEND_URL=https://your-frontend-domain.com
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn@sentry.io/...
```

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENV=production
REACT_APP_SENTRY_DSN=optional-sentry-dsn
```

### Database Setup

1. Create Supabase project (production)
2. Run all SQL from 03-DATABASE.md
3. Enable backups: Settings → Backups
4. Configure RLS policies
5. Test connection from backend

## Monitoring & Logging

### Error Tracking (Sentry)

```javascript
// In server.js
const Sentry = require("@sentry/node");

Sentry.init({ 
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Health Checks

```bash
# Monitor backend
curl https://your-api/health

# Monitor ML service  
curl https://your-ml/health

# Supabase status
Check Supabase dashboard
```

### Log Aggregation

Connect to services:
- DataDog
- New Relic
- Splunk
- ELK Stack
- CloudWatch (AWS)

## Deployment Workflow

### 1. Local Testing
```bash
npm run build    # Frontend
npm test         # Backend
```

### 2. Pre-deployment
```bash
# Ensure .env has production values
# Ensure no secrets in code
# Run lint checks
npm run lint
```

### 3. Git Push
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### 4. Verify Deployment
```bash
# Test API
curl https://api.yoursite.com/health

# Test Frontend
https://yoursite.com

# Test ML
curl https://ml.yoursite.com/health
```

## Troubleshooting Deployments

### Backend fails to start
- Check logs: `railway logs` or `heroku logs`
- Verify environment variables set
- Check port is correct

### Frontend shows blank page
- Check REACT_APP_API_URL is correct
- Check browser console for errors
- Verify frontend build succeeded

### Database connection error
- Verify SUPABASE_URL format
- Check credentials in .env
- Verify Supabase project active

### ML service times out
- Check model file exists
- Verify timeout increased (120s+)
- Check available memory

## Scaling for Production

### Increase Resources

**Railway:**
- Increase CPU/RAM in service settings

**Heroku:**
- `heroku ps:type=Standard-2x`

**Vercel:**
- Upgrade to Pro plan

### Database Optimization

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM attendance 
WHERE date = '2024-01-15';

-- Add indexes if needed
CREATE INDEX idx_attendance_date ON attendance(date);
```

### Enable Caching

```javascript
// In backend API responses
res.set('Cache-Control', 'public, max-age=300'); // 5 min cache
```

## Backup & Recovery

### Automated Backups
- Supabase: Daily automated
- Railway: Snapshots available
- Heroku: Daily backups (paid)

### Manual Backup
```bash
# Supabase
Settings → Backups → Download

# PostgreSQL
pg_dump postgresql://... > backup.sql
```

### Restore
```bash
# Restore from Supabase backup
Settings → Backups → Restore

# Or via CLI
psql postgresql://... < backup.sql
```

## SSL/HTTPS Setup

- **Railway:** Automatic
- **Vercel:** Automatic
- **Heroku:** Via CloudFlare (free tier)
- **Azure:** Auto-provisioned

## Cost Estimation

| Service | Cost | Notes |
|---------|------|-------|
| Railway | $5-20/mo | Pay-as-you-go |
| Heroku | $7+/mo | Dyno costs |
| Vercel | Free-$20/mo | Frontend |
| Azure | Pay/use | Enterprise |
| Supabase | 0-50/100/mo | Database |

---

**Deployment Status:** ✅ Production Ready
**Supported Platforms:** 5+
**Last Updated:** 2024
