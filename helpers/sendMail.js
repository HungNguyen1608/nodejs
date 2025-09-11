const nodemailer = require("nodemailer");

module.exports.sendMail = (email,otp, html) => {
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Wrap in an async IIFE so we can use await.
    (async () => {
        const info = await transporter.sendMail({
            from: '"Hung understand" <hungunderstand@gmail.com>',
            to: email,
            subject: "OTP confirm",
            text: "Hello guy! ", 
            html: html, // HTML body
        });

        console.log("Message sent:", info.messageId);
    })();
}   