// Vercel Serverless Function for Contact Form
const nodemailer = require('nodemailer');

// Helper function to create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
};

// Helper function to validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const parseRequestBody = async (req) => {
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
        return req.body;
    }

    if (Buffer.isBuffer(req.body)) {
        const bodyString = req.body.toString('utf8');

        if (!bodyString) {
            return {};
        }

        try {
            return JSON.parse(bodyString);
        } catch (error) {
            throw new Error('Invalid JSON payload');
        }
    }

    if (typeof req.body === 'string' && req.body.trim() !== '') {
        try {
            return JSON.parse(req.body);
        } catch (error) {
            throw new Error('Invalid JSON payload');
        }
    }

    return await new Promise((resolve, reject) => {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;

            if (data.length > 1e6) {
                req.destroy();
                reject(new Error('Payload too large'));
            }
        });

        req.on('end', () => {
            if (!data) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(new Error('Invalid JSON payload'));
            }
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
};


module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed. Please use POST.'
        });
    }

    try {
        let body;

        try {
            body = await parseRequestBody(req);
        } catch (parseError) {
            console.error('Request body parsing failed:', parseError);
            return res.status(400).json({
                success: false,
                message: 'Invalid request payload.'
            });
        }

        const { name, business, email, phone, projectType, message } = body;

        // Validate required fields
        if (!name || !business || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, business, email, and message are required.'
            });
        }

        // Email validation
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address format.'
            });
        }

        // Check environment variables
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.error('Missing Gmail credentials');
            return res.status(500).json({
                success: false,
                message: 'Email service not configured. Please contact us directly at malvernwd@gmail.com.'
            });
        }

        const transporter = createTransporter();

        // Email to MWD team
        const teamEmailOptions = {
            from: process.env.GMAIL_USER,
            to: 'malvernwd@gmail.com',
            subject: `🚀 New MWD Lead - ${business}`,
            html: `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px; background: #ffffff;">
                    <div style="background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%); padding: 30px 20px; border-radius: 16px 16px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎯 New Lead Alert!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Malvern Web Development</p>
                    </div>

                    <div style="padding: 30px; background: #f8fafc;">
                        <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #2563eb;">
                            <h2 style="color: #2563eb; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📋 Contact Information</h2>

                            <div style="display: grid; gap: 12px;">
                                <div style="display: flex; align-items: center;">
                                    <span style="background: #dbeafe; color: #2563eb; padding: 6px 12px; border-radius: 6px; font-weight: 600; min-width: 80px; text-align: center; margin-right: 15px;">👤</span>
                                    <div>
                                        <strong style="color: #374151;">Name:</strong>
                                        <span style="color: #6b7280; margin-left: 8px; font-size: 16px;">${name}</span>
                                    </div>
                                </div>

                                <div style="display: flex; align-items: center;">
                                    <span style="background: #dbeafe; color: #2563eb; padding: 6px 12px; border-radius: 6px; font-weight: 600; min-width: 80px; text-align: center; margin-right: 15px;">🏢</span>
                                    <div>
                                        <strong style="color: #374151;">Business:</strong>
                                        <span style="color: #6b7280; margin-left: 8px; font-size: 16px;">${business}</span>
                                    </div>
                                </div>

                                <div style="display: flex; align-items: center;">
                                    <span style="background: #dbeafe; color: #2563eb; padding: 6px 12px; border-radius: 6px; font-weight: 600; min-width: 80px; text-align: center; margin-right: 15px;">📧</span>
                                    <div>
                                        <strong style="color: #374151;">Email:</strong>
                                        <a href="mailto:${email}" style="color: #2563eb; margin-left: 8px; text-decoration: none; font-weight: 500;">${email}</a>
                                    </div>
                                </div>

                                ${phone ? `
                                <div style="display: flex; align-items: center;">
                                    <span style="background: #dbeafe; color: #2563eb; padding: 6px 12px; border-radius: 6px; font-weight: 600; min-width: 80px; text-align: center; margin-right: 15px;">📱</span>
                                    <div>
                                        <strong style="color: #374151;">Phone:</strong>
                                        <a href="tel:${phone}" style="color: #2563eb; margin-left: 8px; text-decoration: none; font-weight: 500;">${phone}</a>
                                    </div>
                                </div>
                                ` : ''}

                                ${projectType ? `
                                <div style="display: flex; align-items: center;">
                                    <span style="background: #dbeafe; color: #2563eb; padding: 6px 12px; border-radius: 6px; font-weight: 600; min-width: 80px; text-align: center; margin-right: 15px;">🛠️</span>
                                    <div>
                                        <strong style="color: #374151;">Project:</strong>
                                        <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; margin-left: 8px; font-size: 14px; font-weight: 500;">${projectType}</span>
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        </div>

                        <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px;">
                            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">💬 Message:</h3>
                            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; font-size: 15px; line-height: 1.6; color: #374151;">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>

                        <div style="background: #eff6ff; padding: 20px; border-radius: 12px; text-align: center; border: 2px dashed #2563eb;">
                            <p style="color: #2563eb; font-weight: 600; margin: 0 0 10px 0; font-size: 16px;">Quick Actions</p>
                            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                                <a href="mailto:${email}" style="background: #2563eb; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;">Reply to ${name}</a>
                                ${phone ? `<a href="tel:${phone}" style="background: #10b981; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 14px;">Call ${phone}</a>` : ''}
                            </div>
                        </div>
                    </div>

                    <div style="background: #374151; color: white; padding: 20px; border-radius: 0 0 16px 16px; text-align: center;">
                        <p style="margin: 0 0 5px 0; font-weight: 600;">📅 ${new Date().toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                        <p style="margin: 0; font-size: 14px; opacity: 0.8;">Malvern Web Development | Building Digital Solutions</p>
                    </div>
                </div>
            `
        };

        // Confirmation email to customer
        const customerEmailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: '🚀 Thanks for contacting MWD! We\'ll be in touch soon.',
            html: `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 16px; background: #ffffff;">
                    <div style="background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%); padding: 30px 20px; border-radius: 16px 16px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎉 Message Received!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">We're excited to work with you!</p>
                    </div>

                    <div style="padding: 30px; background: #f8fafc;">
                        <h2 style="color: #2563eb; margin-bottom: 20px; font-size: 22px;">Hi ${name}! 👋</h2>

                        <p style="color: #374151; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
                            Thank you for reaching out to <strong>Malvern Web Development</strong>! We're thrilled to learn about <strong>${business}</strong> and how we can help you grow your business online.
                        </p>

                        <div style="background: white; padding: 25px; border-radius: 12px; border-left: 4px solid #10b981; margin-bottom: 25px;">
                            <h3 style="color: #10b981; margin: 0 0 15px 0; font-size: 18px;">What happens next?</h3>
                            <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
                                <li><strong>Within 24 hours:</strong> Danny or Zack will personally review your requirements</li>
                                <li><strong>Initial contact:</strong> We'll reach out via ${phone ? `phone (${phone}) or ` : ''}email to discuss your vision</li>
                                <li><strong>Free consultation:</strong> We'll provide recommendations and a detailed proposal</li>
                                <li><strong>Project kickoff:</strong> Once approved, we'll start building your solution!</li>
                            </ul>
                        </div>

                        <div style="background: #eff6ff; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #2563eb;">
                            <h3 style="color: #2563eb; margin: 0 0 15px 0; font-size: 18px;">📋 Your submission summary:</h3>
                            <div style="color: #374151; line-height: 1.6;">
                                <p style="margin: 8px 0;"><strong>Business:</strong> ${business}</p>
                                <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                                ${phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
                                ${projectType ? `<p style="margin: 8px 0;"><strong>Project Type:</strong> <span style="background: #2563eb; color: white; padding: 2px 8px; border-radius: 12px; font-size: 14px;">${projectType}</span></p>` : ''}
                            </div>
                        </div>

                        <div style="background: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
                            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
                                While you wait, check out our recent work and get inspired! 🎨
                            </p>

                            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                                <a href="https://dannygardner.me" style="display: inline-block; background: #2563eb; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">👨‍💻 Danny's Portfolio</a>
                                <a href="https://zackyonker.com" style="display: inline-block; background: #10b981; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">👨‍💻 Zack's Portfolio</a>
                            </div>
                        </div>

                        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
                            <p style="color: #92400e; font-weight: 600; margin: 0 0 8px 0; font-size: 16px;">Quick Questions?</p>
                            <p style="color: #92400e; line-height: 1.6; margin: 0; font-size: 14px;">
                                Feel free to reply to this email or contact us directly at <a href="mailto:malvernwd@gmail.com" style="color: #92400e; font-weight: 600;">malvernwd@gmail.com</a>. We're here to help!
                            </p>
                        </div>
                    </div>

                    <div style="background: #374151; color: white; padding: 20px; border-radius: 0 0 16px 16px; text-align: center;">
                        <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px;">Malvern Web Development</p>
                        <p style="margin: 0 0 8px 0; font-size: 14px; opacity: 0.9;">Building Digital Solutions for Local Businesses</p>
                        <p style="margin: 0; font-size: 14px;">
                            <a href="mailto:malvernwd@gmail.com" style="color: #60a5fa; text-decoration: none; font-weight: 500;">malvernwd@gmail.com</a>
                        </p>
                    </div>
                </div>
            `
        };

        // Send both emails
        console.log('Sending emails...');
        await Promise.all([
            transporter.sendMail(teamEmailOptions),
            transporter.sendMail(customerEmailOptions)
        ]);

        console.log('Emails sent successfully');

        res.status(200).json({
            success: true,
            message: 'Thank you for your message! We\'ve sent you a confirmation email and will get back to you within 24 hours.'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again or contact us directly at malvernwd@gmail.com.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
