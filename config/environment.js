// we want to use our file in production mode means that our files used not only in one pc but used in multiple pc's

// bcz we are writing in the file system
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
// we will have to find that production logs is already exists or it should be create
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// if user is accessing my website
const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path: logDirectory
});


const development = {
    name: 'development',
    asset_path: './assets',
    // our session cookie is in the index.js file in line no 95
    session_cookie_key: 'blasomething',
    // our database name is in the mongoose.js file in line no 6
    db: 'codeial_development',
    smtp:{
        service: 'gmail',
        //search to get host 'gmail smtp settings'
        host: 'smtp.gmail.com',
        port: 587,
        // ye 3rd party p koi bhi apni chize na lgye
        secure: false,
        // we have that identity so that gmail tracks our identity
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
        // here mode is development
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}
// system variable me ek bar new key add kro, add usi name se kru jisse h plhe se?are
//bash ko band kro powershell open kru?kro

const production = {
    name: 'production',
    asset_path : process.env.CODEIAL_ASSET_PATH,
    // our session cookie is in the index.js file in line no 95
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    // our database name is in the mongoose.js file in line no 6
    // this the random secure key jo hmne (randomkeygen website se li h)
    db: process.env.CODEIAL_DB,
    smtp:{
        service: 'gmail',
        //search to get host 'gmail smtp settings'
        host: 'smtp.gmail.com',
        port: 587,
        // ye 3rd party p koi bhi apni chize na lgye
        secure: false,
        // we have that identity so that gmail tracks our identity
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_iD: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    // this the random secure key jo hmne (randomkeygen website se li h)
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}


// if it us undefined then we keep it as development if it is defined then it is this(this is for the production mode)
// module.exports = eval(process.env.CODEIAL_DEVELOPMENT) == undefined ? development : eval(process.env.CODEIAL_DEVELOPMENT) ;
module.exports = eval(process.env.CODEIAL_DEVELOPMENT) == undefined ? development : eval(process.env.CODEIAL_DEVELOPMENT) ;

////this is for the development mode
// module.exports = development;