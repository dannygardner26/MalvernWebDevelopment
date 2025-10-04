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
    return nodemailer.createTransport({
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
        subject: 'Thanks for reaching out to Malvern Web Development',
        html: `
            <table role="presentation" style="width: 100%; background: #f4f6fb; padding: 0; margin: 0;">
                <tr>
                    <td align="center" style="padding: 30px 15px;">
                        <table role="presentation" style="width: 100%; max-width: 620px; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08); font-family: 'Segoe UI', Arial, sans-serif;">
                            <tr>
                                <td style="background: linear-gradient(135deg, #0f172a, #1d4ed8); padding: 28px 32px;">
                                    <h1 style="margin: 0; font-size: 24px; line-height: 32px; color: #f8fafc;">Malvern Web Development</h1>
                                    <p style="margin: 6px 0 0 0; font-size: 16px; color: rgba(248, 250, 252, 0.8);">We received your message.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 32px;">
                                    <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #0f172a;">Hi ${name},</p>
                                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #334155;">
                                        Thanks for connecting with Malvern Web Development. Our team is reviewing the details you shared about ${business}, and we'll be in touch within one business day.
                                    </p>
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 28px 0;">
                                        <tr>
                                            <td style="background: #f8fafc; border-radius: 10px; padding: 20px 24px;">
                                                <h2 style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px; color: #1d4ed8;">What happens next</h2>
                                                <ol style="margin: 0; padding-left: 20px; font-size: 15px; line-height: 24px; color: #334155;">
                                                    <li>We confirm your project goals and timeline.</li>
                                                    <li>We schedule a quick call to align on scope and budget.</li>
                                                    <li>We send a tailored proposal with clear next steps.</li>
                                                </ol>
                                            </td>
                                        </tr>
                                    </table>
                                    <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px;">
                                        <h2 style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px; color: #1d4ed8;">Your submission</h2>
                                        <p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong style="color: #0f172a;">Business</strong>: ${business}</p>
                                        <p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong style="color: #0f172a;">Email</strong>: ${email}</p>
                                        ${phone ? `<p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong style="color: #0f172a;">Phone</strong>: ${phone}</p>` : ''}
                                        ${projectType ? `<p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong style="color: #0f172a;">Project Type</strong>: ${projectType}</p>` : ''}
                                        ${message ? `<div style="margin-top: 14px;"><strong style="display: block; margin-bottom: 6px; font-size: 14px; color: #0f172a;">Message</strong><div style="background: #f8fafc; border-radius: 8px; padding: 16px; color: #334155; font-size: 15px; line-height: 24px;">${message.replace(/\n/g, '<br>')}</div></div>` : ''}
                                    </div>
                                    <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 24px; color: #334155;">
                                        Have something new to add? Reply to this email or call us at <a href="tel:14848856284" style="color: #1d4ed8; text-decoration: none;">(484) 885-6284</a>.
                                    </p>
                                    <table role="presentation" style="width: 100%; margin: 0 0 12px 0;">
                                        <tr>
                                            <td style="text-align: left;">
                                                <a href="https://dannygardner.me" style="display: inline-block; margin-right: 12px; padding: 12px 20px; border-radius: 8px; border: 1px solid #1d4ed8; color: #1d4ed8; font-size: 14px; font-weight: 600; text-decoration: none;">View Danny's work</a>
                                                <a href="https://skyshotaerial.com" style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #1d4ed8; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none;">View Zack's work</a>
                                            </td>
                                        </tr>
                                    </table>
                                    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #64748b;">Talk soon,<br>Malvern Web Development</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="background: #0f172a; color: rgba(226, 232, 240, 0.7); text-align: center; padding: 20px 24px; font-size: 13px;">
                                    <p style="margin: 0 0 6px 0;">Malvern Web Development</p>
                                    <p style="margin: 0;"><a href="mailto:malvernwd@gmail.com" style="color: rgba(96, 165, 250, 0.9); text-decoration: none;">malvernwd@gmail.com</a> | (484) 885-6284</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
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

