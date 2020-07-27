const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const app = express();
require('./config/view_helpers')(app);
const port = 7000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const passportJWT = require('./config/passport_jwt_strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000); 
console.log('chat server is listening on post 5000');

const path = require('path');
const environment = require('./config/environment');


if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle:'extended',
        prefix: '/css'
}));
}

app.use(express.urlencoded({extended : false}));

app.use(cookieParser());

app.use(expressLayouts);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use(express.static(path.join(__dirname , env.asset_path)));

app.use('/uploads', express.static(__dirname + '/uploads'));

// here we use logger
app.use(logger(env.morgan.mode, env.morgan.options)); 

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: "codeial",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(error){
            console.log(error || 'connect mongo db setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAutenticatedUser);

app.use(flash());

app.use(customMware.setFlash);

app.use('/', require('./routes'));


app.listen(port,function(error){
    if(error){
        console.log(`Error in running the server : ${error}`);
     }
    console.log(`Server is running on port: ${port}`);
});