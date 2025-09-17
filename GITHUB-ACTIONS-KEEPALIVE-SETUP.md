# GitHub Actions Keep-Alive Setup

This guide shows you how to set up automatic Supabase keep-alive using GitHub Actions (like you did in your [jozef-markt repository](https://github.com/jozefmarkt/jozef-markt)).

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Update Your Vercel URL**
1. Open `.github/workflows/simple-keepalive.yml`
2. Replace `https://your-app.vercel.app` with your actual Vercel URL
3. Save the file

### **Step 2: Push to GitHub**
```bash
git add .
git commit -m "Add GitHub Actions keep-alive workflow"
git push
```

### **Step 3: Verify It's Working**
1. Go to your GitHub repository
2. Click **"Actions"** tab
3. You should see **"Simple Supabase Keep-Alive"** workflow
4. Click on it to see the runs

## 🔧 **How It Works**

The GitHub Actions workflow:
- **Runs every 4 hours** automatically
- **Pings your Vercel app** at `/api/keepalive`
- **Also pings** `/api/health` for monitoring
- **Keeps Supabase active** by making regular requests

## 📊 **Monitoring**

### **Check Workflow Status**
1. Go to **Actions** tab in your GitHub repo
2. Click on **"Simple Supabase Keep-Alive"**
3. You'll see all the runs and their status

### **Manual Testing**
1. Go to **Actions** tab
2. Click **"Simple Supabase Keep-Alive"**
3. Click **"Run workflow"** button
4. Click **"Run workflow"** to trigger it manually

## ⚙️ **Advanced Configuration**

### **Option 1: Change Frequency**
Edit `.github/workflows/simple-keepalive.yml`:
```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
  - cron: '0 */2 * * *'  # Every 2 hours
  - cron: '0 * * * *'    # Every hour
```

### **Option 2: Add Notifications**
Add this to your workflow:
```yaml
- name: Notify on failure
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      github.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: 'Keep-alive failed',
        body: 'The Supabase keep-alive workflow failed. Please check your Vercel deployment.'
      })
```

## 🧪 **Testing Locally**

Before pushing to GitHub, test your endpoints:

```bash
# Test keep-alive endpoint
curl https://your-app.vercel.app/api/keepalive

# Test health endpoint
curl https://your-app.vercel.app/api/health
```

## 🔍 **Troubleshooting**

### **Workflow Not Running**
1. Check if the workflow file is in `.github/workflows/`
2. Make sure you pushed the changes to GitHub
3. Check the **Actions** tab for any errors

### **Ping Failing**
1. Verify your Vercel URL is correct
2. Make sure your app is deployed and running
3. Check the Vercel function logs

### **Supabase Still Pausing**
1. Check if the workflow is actually running
2. Verify the endpoints are working
3. Make sure your Supabase credentials are set in Vercel

## 📈 **Benefits of GitHub Actions**

✅ **Free** - No cost for public repositories  
✅ **Reliable** - GitHub's infrastructure  
✅ **Easy to monitor** - Built-in logs and status  
✅ **Flexible** - Easy to modify and customize  
✅ **Integrated** - Works with your existing GitHub workflow  

## 🔄 **Migration from External Services**

If you were using external cron services before:
1. **Disable** your external cron jobs
2. **Set up** this GitHub Actions workflow
3. **Monitor** for a few days to ensure it's working
4. **Delete** the external service accounts

## 📚 **Reference**

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cron Syntax Guide](https://crontab.guru/)
- [Your Previous Setup](https://github.com/jozefmarkt/jozef-markt)

This approach is exactly what you used before and should work perfectly for keeping your Supabase project active!
