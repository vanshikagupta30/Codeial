const nodeMailer = require('../config/nodemailer');

// whenever a new comment is made I jut need to call this mailer
// this is another way of exporting a method
exports.newComment = (comment) => {
    // console.log('inside new comment mailer', comment);
    // if we donot provide the extention i.e. ejs then it will through an error i.e. template file not found
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        // from is our dummy mail(ye jo hmari to m lika hua h comment.user.email usme hmari user ki ID jyegi jisne comment kiya h and koi bhi authenticated user jiski id real m ho vo agr comment krega to vo comment as a mail uski mail id pr chla kyega through vanshika30032001 vali mail)
        from: "mywebsite",
        // to hm hmne vo likha jis user ne comment kiya h uske pas jyega noty
        to: comment.user.email,
        subject: 'New Comment Published',
        // html: '<h1>Yup your comment is now published!</h1>'
        html: htmlString
    
    // (this is an error fn)this a callback function if there is an error the it catches and info caries the infomation about the request that has been sent
    // info means jab humne mail bhejne k liye request ki to uski information hume terminal pe show hogi that our mail is sent
    }, (error, info) => {
        if(error){
            // if there is an error then do console.log and the print the error 
            console.log("error in sending mail", error);
            return;
        }
        // if there is no error then print the info
        // console.log('Message sent', info);
        return;
    });
}
