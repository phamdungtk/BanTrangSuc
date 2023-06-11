const nodemailer = require('nodemailer');

async function sendEmail(to, subject, content) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your_email_address',
      pass: 'your_email_password'
    }
  });

  let info = await transporter.sendMail({
    from: 'your_email_address',
    to: to,
    subject: subject,
    html: content
  });

  console.log('Message sent: %s', info.messageId);
}

module.exports = sendEmail;
