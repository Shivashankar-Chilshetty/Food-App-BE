const nodemailer = require("nodemailer")

const mailHelper = async (options) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    const message = {
        from: "chilshetty@gmail.com", //(emails will generate from this address only) this value will be hardcoded from websites(we are using)
        to: 'mocajix542@glaslack.com',
        subject: options.subject,
        text: options.message,
    }

    let info = await transporter.sendMail(message);
    console.log('inside email helper',info)
}

module.exports = mailHelper;