const nodeMailer = require('../config/nodemailer');

exports.resetPassword = (user,accessToken) => {
    console.log('inside forgotPassword mailer',user,accessToken);

    let htmlString = nodeMailer.renderTemplate({user:user,accessToken},'/passwordReset/reset_password.ejs');

    nodeMailer.transporter.sendMail({
        from: 'frontendtest323@gmail.com',
        to: user.email,
        subject: 'Password Change link',
        html: htmlString
    },(err,info) => {
        if(err){console.log('Error in sending mail',err);return;}
        console.log('Message sent',info);
        return;
    });
} 