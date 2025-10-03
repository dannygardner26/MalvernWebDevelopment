# MWD Website Setup Guide

## 📧 Gmail Integration Setup

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled
3. This is required for App Passwords

### Step 2: Generate Gmail App Password
1. Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" from the dropdown
3. Select your device/computer
4. Click "Generate"
5. Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your actual credentials:
   ```
   GMAIL_USER=malvernwebdev@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-password-here
   PORT=3001
   ```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Run the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start

# Or serve frontend only (for testing)
npm run frontend
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Add environment variables in Vercel dashboard
4. Deploy with `vercel --prod`

### Option 2: Netlify
1. Build for static: Use `npm run frontend`
2. For serverless functions, create `netlify/functions/` directory
3. Move server logic to serverless functions

### Option 3: Traditional Hosting
1. Upload files to your hosting provider
2. Set up Node.js environment
3. Configure environment variables
4. Start with `npm start`

## 📧 Email Configuration Details

### What the system does:
1. **Team Notification**: Sends detailed form submission to `malvernwebdev@gmail.com`
2. **Customer Confirmation**: Sends professional thank you email to the customer
3. **Automatic Processing**: Validates, formats, and delivers emails instantly

### Email Features:
- Professional HTML email templates
- Form validation and sanitization
- Error handling and user feedback
- Mobile-responsive email design
- Automatic timestamps and formatting

### Team Email Contents:
- Contact details (name, business, email, phone)
- Project type selection
- Full message content
- Submission timestamp
- Professional formatting

### Customer Confirmation Email Contents:
- Personalized greeting
- Next steps explanation
- Contact summary
- Links to portfolios
- Professional branding

## 🔧 Testing the Contact Form

### Local Testing:
1. Start server: `npm run dev`
2. Visit: `http://localhost:3001`
3. Fill out contact form
4. Check both email addresses for delivery

### Production Testing:
1. Deploy to your hosting platform
2. Test form submission
3. Verify email delivery
4. Check spam folders if needed

## Security Notes

- App passwords are more secure than regular passwords
- Environment variables keep credentials safe
- Input validation prevents malicious submissions
- CORS configured for security
- Error handling prevents information leakage

## 📱 Mobile Responsiveness

The contact form and entire website are fully responsive:
- Mobile-first design approach
- Touch-friendly form inputs
- Responsive email templates
- Cross-device compatibility

## 🐛 Troubleshooting

### Email Not Sending:
1. Check environment variables in `.env`
2. Verify App Password is correct (16 characters)
3. Check if 2FA is enabled on Gmail
4. Look at server logs for error messages

### Form Validation Issues:
1. Required fields: name, business, email, message
2. Email format validation
3. Check browser console for JavaScript errors

### Server Issues:
1. Check if port 3001 is available
2. Verify Node.js version (16+)
3. Run `npm install` to ensure dependencies
4. Check firewall settings

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics for website traffic
- Form submission tracking
- Email delivery confirmation
- Error monitoring (Sentry, LogRocket)

## 🔄 Future Enhancements

Planned features:
- [ ] File upload capability for project briefs
- [ ] Calendar integration for consultation booking
- [ ] CRM integration (HubSpot, Pipedrive)
- [ ] Automated follow-up email sequences
- [ ] Live chat integration
- [ ] Payment processing for deposits