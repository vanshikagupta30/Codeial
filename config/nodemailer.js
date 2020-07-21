const nodeMailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

// this is the part which sends the emails(in this path will decide how this communication will take place)
// 'transporter' me vo id add krni hoti h jiska use krke mail send krni h or 'from' me bhi behtar hota h ki transporter wali id hi add kre
let transporter = nodeMailer.createTransport(env.smtp);


// in this we want to define that we are using ejs or template rendring engine
// this defines whenever we are doung to send an HTML emails where the files would be placed inside views and te mailer folder
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        // this mailers carry all the email templates and the relativePat is the place from where this fn being called
        path.join(__dirname, '../views/mailers', relativePath),
        // data is the context that we pass to the ejs like name
        data,
        // template is what is composed of uper two
        function(error, template){
            if(error){
                console.log("error in rendering template", error);
                return;
            }
            // if there is no error then mailHTML is template
            mailHTML = template;
        }
    )
    // we return mailHTML outside of this bcoz we want that let the process complete, incase if there is other error then we are able to catch inside of this render template 
    return mailHTML;
}


// we defines there two properties we are going to export it
module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}