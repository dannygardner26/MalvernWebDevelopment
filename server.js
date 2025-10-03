const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Gmail configuration with App Password
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // Your Gmail address
            pass: process.env.GMAIL_APP_PASSWORD // Your Gmail App Password
        }
    });
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, business, email, phone, projectType, message } = req.body;

        // Validate required fields
        if (!name || !business || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, business, email, and message are required.'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address format.'
            });
        }

        const transporter = createTransporter();

        // Email to MWD team
        const teamEmailOptions = {
            from: process.env.GMAIL_USER,
            to: 'malvernwd@gmail.com',
            subject: `New Contact Form Submission - ${business}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                        <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">Malvern Web Development</p>
                    </div>

                    <div style="padding: 30px; background: #f9fafb;">
                        <h2 style="color: #2563eb; margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Contact Details</h2>

                        <div style="margin-bottom: 15px;">
                            <strong style="color: #374151;">Name:</strong>
                            <span style="color: #6b7280; margin-left: 10px;">${name}</span>
                        </div>

                        <div style="margin-bottom: 15px;">
                            <strong style="color: #374151;">Business:</strong>
                            <span style="color: #6b7280; margin-left: 10px;">${business}</span>
                        </div>

                        <div style="margin-bottom: 15px;">
                            <strong style="color: #374151;">Email:</strong>
                            <a href="mailto:${email}" style="color: #2563eb; margin-left: 10px; text-decoration: none;">${email}</a>
                        </div>

                        ${phone ? `
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #374151;">Phone:</strong>
                            <a href="tel:${phone}" style="color: #2563eb; margin-left: 10px; text-decoration: none;">${phone}</a>
                        </div>
                        ` : ''}

                        ${projectType ? `
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #374151;">Project Type:</strong>
                            <span style="color: #6b7280; margin-left: 10px;">${projectType}</span>
                        </div>
                        ` : ''}

                        <div style="margin-top: 25px;">
                            <strong style="color: #374151;">Message:</strong>
                            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; margin-top: 10px;">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>

                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                Submitted on ${new Date().toLocaleString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    <div style="background: #374151; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
                        <p style="margin: 0; font-size: 14px;">Malvern Web Development | Building Digital Solutions for Local Businesses</p>
                    </div>
                </div>
            `
        };

        // Confirmation email to customer
        const customerEmailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Malvern Web Development!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Thank You!</h1>
                        <p style="color: white; margin: 5px 0 0 0; opacity: 0.9;">We've received your message</p>
                    </div>

                    <div style="padding: 30px; background: #f9fafb;">
                        <h2 style="color: #2563eb; margin-bottom: 20px;">Hi ${name},</h2>

                        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                            Thank you for reaching out to Malvern Web Development! We're excited to learn about ${business} and how we can help you grow your business online.
                        </p>

                        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
                            <h3 style="color: #10b981; margin: 0 0 10px 0; font-size: 18px;">What happens next?</h3>
                            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.6;">
                                <li>We'll review your project requirements within 24 hours</li>
                                <li>One of our developers (Danny or Zack) will reach out to discuss your needs</li>
                                <li>We'll provide a detailed proposal and timeline for your project</li>
                                <li>If you approve, we'll start building your digital solution!</li>
                            </ul>
                        </div>

                        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                            <h3 style="color: #2563eb; margin: 0 0 15px 0; font-size: 18px;">Your submission summary:</h3>
                            <div style="color: #374151;">
                                <p><strong>Business:</strong> ${business}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                                ${projectType ? `<p><strong>Project Type:</strong> ${projectType}</p>` : ''}
                            </div>
                        </div>

                        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                            In the meantime, feel free to check out our portfolios to see examples of our work:
                        </p>

                        <div style="text-align: center; margin: 25px 0;">
                            <a href="https://dannygardner.me" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 0 10px; font-weight: bold;">Danny's Portfolio</a>
                            <a href="https://skyshotaerial.com" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 0 10px; font-weight: bold;">Zack's Portfolio</a>
                        </div>

                        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                            If you have any urgent questions, feel free to reply to this email or call us at (484) 885-6284. We're here to help!
                        </p>
                    </div>

                    <div style="background: #374151; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
                        <p style="margin: 0 0 10px 0; font-weight: bold;">Malvern Web Development</p>
                        <p style="margin: 0; font-size: 14px; opacity: 0.8;">Building Digital Solutions for Local Businesses</p>
                        <p style="margin: 10px 0 0 0; font-size: 14px;">
                            <a href="mailto:malvernwd@gmail.com" style="color: #60a5fa; text-decoration: none;">malvernwd@gmail.com</a> | (484) 885-6284
                        </p>
                    </div>
                </div>
            `
        };

        // Send both emails
        await transporter.sendMail(teamEmailOptions);
        await transporter.sendMail(customerEmailOptions);

        res.json({
            success: true,
            message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again or contact us directly at malvernwd@gmail.com.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 MWD Server running on http://localhost:${PORT}`);
    console.log(`📧 Gmail integration: ${process.env.GMAIL_USER ? 'Configured' : 'Not configured'}`);
});

module.exports = app;