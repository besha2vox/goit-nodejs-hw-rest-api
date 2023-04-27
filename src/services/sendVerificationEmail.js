const nodemailer = require('nodemailer');

const { emailVerificationTemplate } = require('../helpers');

require('dotenv').config();

const config = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
};

const transporter = nodemailer.createTransport(config);

const sendVerificationEmail = async (email, verificationToken) => {
    const mail = emailVerificationTemplate(verificationToken);
    const emailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email verification',
        text: mail,
        envelope: {
            from: process.env.EMAIL,
            to: email,
            messageId: `${Date.now()}@${process.env.EMAIL_DOMAIN}`,
        },
    };

    const response = await transporter.sendMail(emailOptions);
    console.log('response', response);
};

module.exports = sendVerificationEmail;
