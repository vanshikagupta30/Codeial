const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

passport.use(new googleStrategy({
        clientID: "148459152283-oivmojlvs1t5c7t1cpso3m366p2on4b5.apps.googleusercont6ent.com",
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url
    },

    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(error, user){
            console.log(profile.emails[0].value);
            if(error){
                console.log("Error in google strategy-passport", error);
                return;
            }
            console.log(accessToken, refreshToken);
            console.log(profile);

            if(user){
                return done(null, user);
            }else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString("hex")
                }, function(error, user){
                    if(error){
                        console.log("Error in creating use google strategy-passport", error);
                        return;
                    }
                    return done(null, user);
                });
            }
        });
    }
));



module.exports = passport;