const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user') 

passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function(request ,email, password, done){
        User.findOne({email: email}, function(error, user){
            if(error){
                request.flash('error', error);
                console.log('Error in finding user --> Passport');
                return done(error);
            }
            if(!user || user.password != password){
                request.flash('error', 'Invalid Username/ Password');
                console.log('Invalid Username/Password');
                return done(null, false);
            }
            return done(null, user);
        })
    }
));


passport.serializeUser(function(user, done){
    done(null, user.id);
})


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
    if(request.isAuthenticated()){
        return next();
    }
    return response.redirect('/users/sign-in');
}

//if user is signed-in then we can do this
passport.setAutenticatedUser = function(request,response,next){
    if(request.isAuthenticated()){
        response.locals.user = request.user;  
    }
    next();
}

module.exports = passport;