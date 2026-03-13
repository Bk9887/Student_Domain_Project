require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log('--- Email Diagnostic Tool ---');
console.log('Testing with User:', process.env.EMAIL_USER);

transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Connection Failed:', error);
    } else {
        console.log('✅ Server is ready to take our messages');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self for testing
            subject: 'Test Email From App',
            text: 'If you see this, your email configuration is working!',
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('❌ Send Failed:', err);
            } else {
                console.log('✅ Email Sent Successfully:', info.response);
            }
        });
    }
});
