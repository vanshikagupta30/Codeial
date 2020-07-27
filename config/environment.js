
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path: logDirectory
});


const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blasomething',
    db: 'codeial_development',
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: "vanshika30032001@gmail.com",
            pass: "nmsjemsyuwblyany"
        }
    },
    google_client_iD: "148459152283-oivmojlvs1t5c7t1cpso3m366p2on4b5.apps.googleusercontent.com",
    google_client_secret: "QYEWBaqlHyEeIKMie-RS3bya",
    google_call_back_url: "http://localhost:7000/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path : process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_iD: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}


console.log(process.env.CODEIAL_DEVELOPMENT)
module.exports = eval(process.env.CODEIAL_DEVELOPMENT) == undefined ? development : eval(process.env.CODEIAL_DEVELOPMENT) ;

////this is for the development mode
// module.exports = development;