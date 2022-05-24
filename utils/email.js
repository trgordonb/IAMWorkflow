const nodemailer = require('nodemailer')

const sendEmail = (message) => {
    return new Promise((res, rej) => {
        const transporter = nodemailer.createTransport({
            pool: true,
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_ACCOUNT,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    
        transporter.sendMail(message, function(err, info) {
            if (err) {
                rej(err)
            } else {
                res(info)
            }
        })
    })
}

const sendNotificationEmail = (userMessage, users) => {
    const message = {
      from: process.env.SMTP_ACCOUNT,
      to: users,
      subject: 'New records pending for approval',
      html: `
        <h3> Hello user </h3>
        <p>${userMessage}</p>
        <p>Regards</p>
        <p>IAM Legacy</p>
      `
    }
  
    return sendEmail(message);
}

module.exports = sendNotificationEmail