const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendVerifyEmail = (email,tokenURL) => {
    sgMail.send({
        to: email,
        from: process.env.FROM_ADDRESS,
        subject: 'Verify your Email (User Management)',
        text: `Welcome to the user management app. To verify your email, copy the address below into the \
        address bar of your browser and click Enter \n\n${tokenURL}`,
        html: `<p>Welcome to the user management app.  To verify your email, click on the link below.\
        <\p><br><br><a href="${tokenURL}">Verify Email</a>`
    })
}

const sendPasswordResetEmail = (email, tokenURL) => {
    console.log("at 1: ", email, tokenURL)
    sgMail.send({
        to: email,
        from: process.env.FROM_ADDRESS,
        subject: 'Reset your User Management Password',
        text: `To reset your User Management password, copy the address below into the \
        address bar of your browser and click Enter \n\n${tokenURL}\n\nIf you did not request this\
password reset, please discard this email message.`,
        html: `<p>To reset your User Management password, click on the link below.\
        <\p><br><br><a href="${tokenURL}">Reset Password</a><p>f you did not request this\
password reset, please discard this email message.</p>`
    })
}

module.exports = {
    sendVerifyEmail,
    sendPasswordResetEmail
}
