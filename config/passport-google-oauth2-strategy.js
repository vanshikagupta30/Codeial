const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
//hm ni chaege ki hmara code/pasword logo ko na mile to hm use decript kr dete h
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');


// tell passport to use a new strategy to google login
passport.use(new googleStrategy({
        clientID: "148459152283-oivmojlvs1t5c7t1cpso3m366p2on4b5.apps.googleusercont6ent.com",
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url
    },

    // JWT is our accessToken being send in the header(similarly google also genetares accessToken and gives it to us),
    // refreshToken is that when our accessToken expires then we use the refresh token to get a new accessToken without asking the user to login again,
    // profile is for some profile information and profile contains users information so we are going to match user with tha email in the database
    function(accessToken, refreshToken, profile, done){

        //(this fn find a user)a user can have multiple emails(gmail accounts) so gmail gives all the gmails that we have.That's why we give an array of emails and I have checked for the first email value is exist in the db if it is not then I will create that user
// If a document does not have a value for the indexed field in a unique index, the index will store a null value for this document. Because of the unique constraint, MongoDB will only permit one document that lacks the indexed field. If there is more than one document without a value for the indexed field or is missing the indexed field, the index build will fail with a duplicate key error.
        //here emails userd bcoz ek user ki gmail pr bhaut sari id ho skti h and this oth index shows ki m ek hi gmail id se login kr skte h agr hm ye ni likhege to error dega
        User.findOne({email: profile.emails[0].value}).exec(function(error, user){
            // /value agr hm likhege to vo hme value ki type m dega
            console.log(profile.emails[0].value);
            if(error){
                console.log("Error in google strategy-passport", error);
                return;
            }
            console.log(accessToken, refreshToken);
            console.log(profile);

            if(user){
                //(if found then set this user as request.user) if we find the use then we call done without showing any error and pass user to it
                return done(null, user);
            }else{
                //(if not found then create the user and set it as request.user) if the user is not found then we create the user the same as we did in signing up
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    //crypto.randomBytes is a method to generate random string 
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