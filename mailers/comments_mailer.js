const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    // console.log('inside new comment mailer', comment);
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: "mywebsite",
        to: comment.user.email,
        subject: 'New Comment Published',
        html: htmlString
    
    
    }, (error, info) => {
        if(error){
            console.log("error in sending mail", error);
            return;
        }
        // console.log('Message sent', info);
        return;
    });
}
