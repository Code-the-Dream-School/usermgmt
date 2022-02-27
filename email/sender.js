const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendVerifyEmail = (email,tokenURL) => {
    sgMail.send({
        to: email,
        from: process.env.FROM_ADDRESS,
        subject: 'Verify your Email (User Management)',
        // text: `Welcome to the user management app. To verify your email, copy the address below into the \
        // address bar of your browser and click Enter \n\n${tokenURL}`,
        text: `Welcome to the user management app. To verify your email, copy the address below into the \
        address bar of your browser and click Enter \n\nlink to appear here.`,
        // html: `<p>Welcome to the user management app.  To verify your email, click on the link below.\
        // <\p><br><br><a href="${tokenURL}">Verify Email</a>`
        html: `<p>Welcome to the user management app.  To verify your email, click on the link below.\
        <\p><br><br>link to appear here`
    })
}

const sendPasswordResetEmail = (email, tokenURL) => {
  //add your code here
}

module.exports = {
    sendVerifyEmail,
    sendPasswordResetEmail
}
