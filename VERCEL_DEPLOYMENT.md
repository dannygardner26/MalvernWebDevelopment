# 🚀 Vercel Deployment Guide for MWD

##  Current Status
-  **Dependencies installed** (`npm install` completed)
-  **Local server running** at `http://localhost:3001`
-  **Serverless function created** (`/api/contact.js`)
-  **Vercel config ready** (`vercel.json`)
-  **Profile pictures added** (Danny & Zack)

## 📧 Step 1: Set Up Gmail App Password

### A. Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. This is required for App Passwords

### B. Generate App Password
1. Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select **"Mail"** from dropdown
3. Select **"Other (custom name)"** and type: `MWD Website`
4. Click **"Generate"**
5. **Copy the 16-character password** (format: `xxxx xxxx xxxx xxxx`)

### C. Test Gmail Credentials
1. Edit `.env` file:
   ```
   GMAIL_USER=malvernwebdev@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```
2. Restart server: `npm start`
3. Test form at `http://localhost:3001`

## 🌐 Step 2: Deploy to Vercel

### A. Install Vercel CLI
```bash
npm install -g vercel
```

### B. Login to Vercel
```bash
vercel login
```

### C. Deploy Project
```bash
# From project directory
vercel

# Follow prompts:
# - Link to existing project? NO
# - Project name: malvern-web-development
# - Directory: ./
# - Override settings? NO
```

### D. Add Environment Variables
```bash
# Set Gmail credentials in Vercel
vercel env add GMAIL_USER
# Enter: malvernwebdev@gmail.com

vercel env add GMAIL_APP_PASSWORD
# Enter: your-16-character-app-password

vercel env add NODE_ENV
# Enter: production
```

### E. Deploy to Production
```bash
vercel --prod
```

## 🔧 Step 3: Configure Domain (Optional)

### A. Add Custom Domain
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Domains**
4. Add your domain: `malvernwebdev.com`

### B. Update DNS Records
Point your domain's DNS to Vercel:
- **A Record**: `76.76.19.61`
- **CNAME**: `cname.vercel-dns.com`

## 📧 Email System Features

### What Users Get:
1. **Instant confirmation email** with:
   - Professional MWD branding
   - Next steps explanation
   - Links to your portfolios
   - 24-hour response promise

### What You Get:
1. **Detailed lead notification** with:
   - All contact information
   - Project requirements
   - Quick action buttons (email/call)
   - Professional formatting

## 🧪 Testing Checklist

### Local Testing:
- [ ] Server starts without errors
- [ ] Contact form loads
- [ ] Form validation works
- [ ] Emails send successfully
- [ ] Both confirmation emails received

### Production Testing:
- [ ] Vercel deployment successful
- [ ] Environment variables set
- [ ] Contact form works on live site
- [ ] Emails deliver in production
- [ ] Mobile responsiveness works

## 📱 Current Project Structure

```
malvernwebdevelopment/
├── api/
│   └── contact.js          # 📧 Vercel serverless function
├── assets/
│   └── images/
│       ├── danny-profile.jpg   # 👤 Danny's photo
│       ├── ZackProfile.jpg     # 👤 Zack's photo
│       └── portfolio/          # 📁 Project screenshots
├── index.html              # 🏠 Main website
├── styles.css              # 🎨 Styling
├── script.js               #  JavaScript
├── server.js               # 🖥️ Local development server
├── package.json            # 📦 Dependencies
├── vercel.json             #  Vercel configuration
├── .env                    # 🔐 Local environment variables
└── .env.example            # 📝 Environment template
```

## 🚨 Troubleshooting

### Email Issues:
- Check App Password is exactly 16 characters
- Verify 2FA is enabled on Gmail
- Check Vercel environment variables
- Look at Function logs in Vercel dashboard

### Deployment Issues:
- Ensure `vercel.json` is in root directory
- Check Node.js version compatibility
- Verify all files are committed to Git
- Review Vercel function logs

### Form Issues:
- Check API endpoint URL in JavaScript
- Verify CORS headers in serverless function
- Test with browser dev tools network tab

## 🎯 Next Steps After Deployment

1. **Test Everything**: Submit test form, check both emails
2. **Share the Site**: Send link to friends/family for feedback
3. **Monitor Performance**: Check Vercel analytics
4. **Collect Leads**: Start marketing to local businesses!

## 📞 Support

If you run into issues:
- Check Vercel function logs
- Review this guide step-by-step
- Test locally first, then deploy
- Verify all environment variables are set

---

**🎉 You're ready to launch MWD and start getting leads!**