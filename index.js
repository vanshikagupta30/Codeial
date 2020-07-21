// routes part will be storing our destination from the browser like /home, /profile which function or controller needs to be called
// after this when we use app.get those function would be all stored in controllers mapped in different files and modals are schemas
// and views contains html files , css files  and the config would hold all the configuration e.g. we set up our database or mongodb
// in our contact list. So, mongodb settings would be stored inside this config folder or any other settings we would be using is 
// inside this folder

// we write const bcoz we donot want that any variable donot over-ridden by anyone else
const express = require('express');
const env = require('./config/environment');
// Morgan is a HTTP request logger middleware for Node. js. It simplifies the process of logging requests to your application. We might think of Morgan as a helper that generates request logs.
const logger = require('morgan');


// cookie gives us a unique id
const cookieParser = require('cookie-parser');
const app = express();
// this is for view_helpers and we write app bcoz it uses express app
require('./config/view_helpers')(app);
const port = 7000;
//comment.. in this we require 'express-ejs-layouts'
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookie
const session = require('express-session');
//used for authentication passport
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

// we use JWT(JSON web token) bcoz 
const passportJWT = require('./config/passport_jwt_strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//we require connect-mongo to connect our session to db (and we use session as argument here bcoz we need to store information of session)to store cookies or user id (when user sign-out then it will remore the cookie, if we kill the server then it'll not loged-out when we use db )
const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');
// ye jb user loged-in,loged-out, comments delete ye sb hoga tb vo dekhega thoda impressive bnane k liye(ye flash ko session-cookie se connect krta h, jaise session cookie store ho jati h ek bar login krne k bad refresh krne k bad ni jati vaise hi ye bhi isi k sath store ho jyega hme bar bar ni dekhega)
const flash = require('connect-flash');
// we will write customMware bcoz er need to setup the flash msgs from config folder(middleware.js file)
const customMware = require('./config/middleware');

// here we setup the chat server to be used with soket.io 
// we require an inbuilt module i.e. http and we pass on app which is the express app
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000); 
console.log('chat server is listening on post 5000');
const path = require('path');
const environment = require('./config/environment');


// only in development mode this sassmiddleware is running that's why we do ki jb bhi ye run ho sirf development mode m hoga
if(env.name == 'development'){
    app.use(sassMiddleware({
        //sourse is from where do I pickup the SCSS file to convert it into CSS
        // src: './assets/scss',
        src: path.join(__dirname, env.asset_path, 'scss'),

        //destination is where do I put my CSS files
        // dest: './assets/css',
        dest: path.join(__dirname, env.asset_path, 'css'),
        //debug is whatever information that you see while the server is running in the terminal, do I displey some errors that are in the files during compilation when they are not able to convert the file 
        debug: true,
        //outputStye means do I want everything in single line or multiple lines
        outputStyle:'extended',
        //Jab hum server run krte h Tab scss se convert hoke css file banti h Jo css vale folder me stored hoti h Aur vahi execute bhi hoti h
        prefix: '/css'
}));
}

//urlencoded()jo hm form k andr post get send krte h actions m uske content(form) ko pass krne k liye
app.use(express.urlencoded());

app.use(cookieParser());

//comment//we need to put layouts before our routes bcoz routes m views mtlb hmari ejs file render hogi So, before that we need 
//to tell all the views whaich is to be rendered belong to some sort of layout
app.use(expressLayouts);


//extract style and scripts from sub pages into the layouts i.e. jb hm alg se files bnate h individual ejs files ki
//to vo hme yha se extract krle mtlb jo hmne style tag likha h lauout m vo aur ye property already h express-ejs-layouts m
//this means whenever we are using layouts extract styles and sripts 
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

// ithr hmne apni css files use krni h to ye lga diya(now we want to use our file in producrtion mode means that our file used in thousands of pc's. That's why we use env extention)
app.use(express.static(env.asset_path));

// make the uploads path availabe to the browser (if we don't do this then the picture we will upload that will not see in the page(we did in this is plhe hmne path diya ki uploads vale module m h then find the folder using express.static then will will take the current directory in which we are + uploads ki directory krdege))
app.use('/uploads', express.static(__dirname + '/uploads'));

// here we use logger
app.use(logger(env.morgan.mode, env.morgan.options)); 

// hmne ye dono lines router se plhe isliye likhi bcoz plhe hme ejs files dekhani h then hme ye btana h views folder kha h tbhi to router call hoge
// set up the view engine or ejs file: ye hmara ejs files k liye h 
app.set('view engine', 'ejs');
// and to look at where it is , it is in the views folder: ye views folder dekhane k liye ki kha hmari ejs files h
app.set('views', './views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: "codeial",
    //TODO change the secret befire deployment in production mode means whenever encription happens there is a key of encoded & decoded.now, to encode it we need to use a key
    secret: env.session_cookie_key,
    //a session which is not initilized means when the user is not logged in then identity is not established then we donot want to save the extra data in the cookie that's why we give the value to be FALSE
    saveUninitialized: false,
    //in this when the identity is establish or some sort of data is present in the session-data(users info)it is being stored then we donot want to write same thing that is already written,we donot want to write/save one thign again and again
    resave: false,
    //we need to give an age to the cookie for how long should this be valid after that, that session-cookies expires
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    //MongoStore is user to store the session information even when the server restarts it remains in the memory(database).So that signed in user's don't get reset in case the server restarts that information doesn't get lost
    store: new MongoStore(
        {
            mongooseConnection: db,
            //autoremove funtion is disabled
            autoRemove: 'disabled'
        },
        //we add a callback function if there is an error in connecting to db
        function(error){
            console.log(error || 'connect mongo db setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

//for this we see the user view the page or not
app.use(passport.setAutenticatedUser);

// we used flash after the session-cookie is being used bcoz this uses session-cookies.So this need the flash msgs will be set up in the cookies which stores the session information
app.use(flash());
// and yha customMware ko use krne k liye
app.use(customMware.setFlash);

//use express router(here we use '/' bcoz jb m routes pr jyege to vo hmne backslash krke dekhyega na agr hm ye use ni krege to vo hme us route pr ni lejyega)
app.use('/', require('./routes'));


app.listen(port,function(error){
    if(error){
        // console.log('Error: ',error); 
        //comment// or we can write like this & this is known as interpolation
        console.log(`Error in running the server : ${error}`);
     }
    console.log(`Server is running on port: ${port}`);
    //comment// it just inalize when this dolar and curly braces started that the thing after this is something to be evaluated and
    //$ m hm kuch bhi likhege to vo uski value lekr use print krva dega 
    // If i do in place of port 2+2 even it is running
    // console.log(`Server is running on port : ${2+2}`);
    //git bash open kro usme yahi folder pe aao git add ho togya uski age ki commands de open krokr dekho chl ni rhaok
});