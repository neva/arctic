const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILEMAIL,
      pass: process.env.MAILPASSWORD
    }
});

const sendEmail = (from, to, subject, text) => {
    return new Promise((resolve, reject) => {

        const mailOptions = {from, to, subject, text}

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) reject(error);
            resolve(info);
        })

    })  
}
const sendVerificationMail = async (email, verificationURL) => {
    
    const from = "paul.hanneforth.o@gmail.com";
    const subject = "Arctic Verification";
    const text = `To verify your Arctic Account, please follow this link: ` + verificationURL

    await sendEmail(from, email, subject, text);

}

module.exports = { sendVerificationMail }