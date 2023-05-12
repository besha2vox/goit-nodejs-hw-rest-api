const API_HOST = 'http://localhost:3000/';

const emailVerificationTemplate = (verificationToken) => `Wellcome to my app!\n
To confirm your email, click on this link ${API_HOST}users/verify/${verificationToken}\n
Thank you for your time and attention.`;

module.exports = emailVerificationTemplate;
