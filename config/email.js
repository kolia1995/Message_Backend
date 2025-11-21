const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');

class Email {

    constructor() {
        this.transporter  = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendActivationCode(email) {
        try {
            const code =  uuidv4().replace(/-/g, '').slice(0, 6);

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: `${code}` 
            };

            await this.transporter.sendMail(mailOptions);
            return code;
        }
        catch (err) {
            console.error('❌ Email send error:', err);
        }
    };

};

module.exports = new Email();