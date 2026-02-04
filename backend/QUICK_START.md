# 🚀 Backend Quick Start Guide

## Step-by-Step Setup (5 Minutes)

### Step 1: Verify Setup
```bash
cd backend
node verify-setup.js
```

**Expected Output:**
```
✅ ALL CHECKS PASSED!
🚀 Your backend is ready to run!
```

If you see errors, follow the instructions to fix them.

---

### Step 2: Install Dependencies (if needed)
```bash
npm install
```

---

### Step 3: Configure Environment
```bash
# Copy example env file
copy .env.example .env

# Edit .env file and set:
# MONGODB_URI=mongodb+srv://codrva:12345@cluster0.ucpmgj6.mongodb.net/
# JWT_SECRET=your-secret-key
# PORT=5002
```

---

### Step 4: Test Onboarding Backend
```bash
node test-onboarding.js
```

**Expected Output:**
```
✅ ALL TESTS PASSED! Onboarding backend is working correctly.
```

---

### Step 5: Start Backend Server
```bash
# Development mode (auto-reload)
npm run dev

# OR Production mode
npm start
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5002
📊 Environment: development
🔗 Health check: http://localhost:5002/health
```

---

### Step 6: Test API Endpoint
Open browser or use curl:
```bash
curl http://localhost:5002/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45,
  "environment": "development",
  "version": "1.0.0"
}
```

---

## ✅ Success Checklist

- [ ] `verify-setup.js` passes all checks
- [ ] `test-onboarding.js` completes successfully
- [ ] Backend server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] MongoDB connection successful
- [ ] Console shows "✅ MongoDB connected"

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed
```
❌ MongoDB connection error
```
**Fix:** Check MONGODB_URI in .env file

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5002
```
**Fix:** Change PORT in .env or kill process using port 5002

### Issue: Module Not Found
```
Error: Cannot find module 'express'
```
**Fix:** Run `npm install`

---

## 📞 Need Help?

1. Check `ONBOARDING_SETUP.md` for detailed guide
2. Run `node verify-setup.js` to diagnose issues
3. Check backend console logs for errors

---

## 🎯 Next Steps

Once backend is running:

1. Start frontend: `cd frontend && npm run dev`
2. Open browser: `http://localhost:3000`
3. Click "Sign in with LinkedIn"
4. Complete onboarding
5. Check backend logs for data save confirmation

---

*Setup Time: ~5 minutes*
*Difficulty: Easy*
