const passport = require('passport');
//we also need to require local-passport library and specificaly strategy is the property which we want to require
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user') 

//..authentication using passport
//here we telling passport to use local-strategy where we defined the usernameFeild
passport.use(new LocalStrategy({
//bcoz this will be unique that's why we give email in that.. hmne isme password or name isliye ni liya bcoz vo same ho skte h but hm yha email ek rkh rahe h ki vo unique honi chaiye
        usernameField: 'email',
    // ye hmne isliye lgaya kyuki hmne user controller m flash msgs aise likha tha request.flash aur yha hmare call./back fn m request pass ni ho skta bcoz yha is function m 2 arguments h email,pass & agr hme yha request chlana h to passReqToCallback(pass request to call back) ko true krna pdega
        passReqToCallback: true
    },
    //here done is my callback function which is reporting back to the passport.js and we are finding the user using the email passed in to this function. so,whwnever passport is being called then email and passport auto being passed into it
    function(request ,email, password, done){
        //..find the user and establish the identity
        //if the email is found then it will give an error or user
        User.findOne({email: email}, function(error, user){
            if(error){
                request.flash('error', error);
                console.log('Error in finding user --> Passport');
                //dont take two arguments one is error and another is something 
                return done(error);
            }
            if(!user || user.password != password){
                request.flash('error', 'Invalid Username/ Password');
                console.log('Invalid Username/Password');
                //if we entered then we are going to the same page
                return done(null, false);
            }
            // agr koi error ni hoga and email find ho yegi to uski id retuen kraega ye
            return done(null, user);
        })
    }
));

//serialize the user i.e. when the user sign's in,we find id and send it to the cookie and the cookie send to the browser.Now,browser makes a request so we deserialize it and find the user again

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    //in this we want to store the users_id in the encripted format, this automatically encript it into the cookie and we write null bcoz error is not there
    done(null, user.id);
    //serializer is tored user_id in the session-cookie which is encripted using my express-session which is in index.js
})


//deserializing the user from the key in the cookies means isme hme pta chlega ki kis user ne sign-in kiya h jaise rofile page m hmne dekhyi thi uski details kis user ne sign-in kiya h 
passport.deserializeUser(function(id, done){
    User.findById(id, function(error, user){
        if(error){
            console.log('Error in finding user --> Passport');
            return done(error);
        }
        return done(null, user);
    });
});

// check if the user is authenticated(here we check user is signed-in or not)
passport.checkAuthentication = function(request,response,next){
    //this isAuthenticated checks if the user is signed in or not
    if(request.isAuthenticated()){
        //if the user is signed-in then pass on to the (page) request to the next function which is(controller's action)
        return next();
    }
    //if the user is not signed-in
    return response.redirect('/users/sign-in');
}

//if user is signed-in then we can do this
passport.setAutenticatedUser = function(request,response,next){
    if(request.isAuthenticated()){
        //request.user contains the signed in from the session cookie and we are just sending this to the locals for the views
        //whenever a user is signed in the users information is available in request.user
        response.locals.user = request.user;  
    }
    next();
}

//now we are exporting passport to use this that we did in this file
module.exports = passport;