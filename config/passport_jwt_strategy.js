const passport = require('passport');
const env = require('./environment');
// const keys = require('dotenv').config();
// we use strategy bcoz one we are importing the strategy and second the module which will elp us to extract jWT from the header
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
// const env = require('./environment');

// hmne ye yha isliye likha bcoz we are using the user as the model for the authentication(whenever we are going to establish the identity of a user we will nedd the user model.That's why we require this user schema)
const User = require('../models/user');


let opts = {
    // extract from authorization header(jo API m tokens bn rahe h vo ye extract krke kam krega)
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    // key would be decripted using codeial boz when we are generating the token we are using codeial as the key 
    secretOrKey : env.jwt_secret
}

//hello?
// here done is the callback function(payload k pass user ki info hoti h jo encrypt hoti h jise hume decrypt krni hoti h  )
// hum jwtStrategy me vo token de rhe h or payload de rhe h jiske pass user ki info h
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){

    //(here user is already present in the JWT we are just fetching out the id from the payLoad and checking if the user is there or not) here I want to store complete users information using _id in the payload information
    // isme jo jwtPayLoad._id h vo user ka jo token h use token ki by id find krega
    User.findById(jwtPayLoad._id, function(error, user){
        if(error){
            console.log('Error in finding user from JWT');
            return;
        }
        // if the user is found then return done and error would be null(done function will contain user so it will return users information)
        if(user){
            return done(null, user);
        }else{
            // here false means that the user is not found(else statement return the false i.e. user is not found)
            return done(null, false);
        }
    });
}));

module.exports = passport;