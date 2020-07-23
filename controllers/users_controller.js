const User = require('../models/user');
const fs = require('fs');
const ResetPasswordToken = require('../models/reset_password_token');
const Friendships = require("../models/friendships");
const path = require('path');
const resetPasswordMailer = require('../mailers/forgot_password');
const crypto = require('crypto');



module.exports.profile = function(request, response){
    User.findById(request.params.id, function(error, user){
        return response.render('user_profile', {
            title: 'User Profile',
            profile_user: user
    });
    });
}


// For forgot password
module.exports.forgotPassword = function(req,res){
    return res.render('forgot_password',{
        title:'Forgot password'
    });
}

// for reset password
module.exports.resetPassword = function(req,res){
    // Find user with the given email
    User.findOne({email: req.body.email},function(err,user){
        if(err){req.flash('error',err);return;}
        if(!user){
            // If user not present go to sign-up page
            req.flash('error',"This email id doens't exist!!!");
            return res.redirect('/users/sign-up');
        }else{
            // Else find the user in reset_password_token
            ResetPasswordToken.findOne({user:user, isValid:true},function(err,userRef){
                if(err){req.flash('error',err);return;}
                req.flash('success','Email Sent successfully');
                if(userRef){
                    // If user is present and id is valid then send the same accessToken
                    console.log('UserRef already present',userRef.accesstoken);
                    resetPasswordMailer.resetPassword(user,userRef.accesstoken);
                }else{
                    // Else create accessToken
                    let accesstokenCreated = crypto.randomBytes(20).toString('hex');
                    ResetPasswordToken.create({user:user,accesstoken:accesstokenCreated, isValid:true},function(err,newUserRef){
                        if(err){console.log('error in creating tokens',err);return;}
                        console.log('User Token created successfully',newUserRef);
                        resetPasswordMailer.resetPassword(user, newUserRef.accesstokenCreated);
                    });
                }
            });
            req.flash('success','Sent Mail Successfully');
            return res.redirect('back');
        }
    });
}

// reset password page
module.exports.resetPasswordPage = async function(req,res){
    let userRef = await ResetPasswordToken.findOne({accesstoken: req.params.id});
    return res.render('reset_password',{
        title:'Reset Password',
        accessToken: req.params.id,
        isValid: userRef.isValid
    });
}

// update password
module.exports.updatePassword = async function(req,res){
    console.log(req.params.id, req.body);
    console.log('Inside update password');
    if(req.body.password==req.body.confirm_password){
        // Check if password and confirm password is same, then find the user with access token
        // If found then reset password, else print Invalid token
        let userRef = await ResetPasswordToken.findOne({accesstoken:req.params.id, isValid:true});
        if(userRef){
            userRef = await userRef.populate('user').execPopulate();
            userRef.isValid = false;
            // imp
            userRef.user.password = req.body.password;
            userRef.save();
            userRef.user.save();
            req.flash('success','Password changed successfully!!!');
            return res.redirect('/users/sign-in');
        }else{
            req.flash('error','Invalid Access Token');
        }
    }else{
        // Else return passwords don't match
        req.flash('error','Passwords do not match!!!');
    }
    return res.redirect('back');
}


/////////////friends////////////////
module.exports.profile = async function(request , response){
        try{
            let user = await User.findById(request.params.id );

            let friendship1, friendship2, removeFriend = false;
            friendship1 = await Friendships.findOne({
                from_user : request.user , 
                to_user : request.params.id
            });

            friendship2 = await Friendships.findOne({
                from_user : request.params.id , 
                to_user : request.user
            });

            console.log(friendship1 , friendship2)
            if(friendship1 || friendship2){
                removeFriend = true;
            }
            return response.render("user_profile" , {
                title:"Codeial | Profile",
                profile_user : user,
                removeFriend : removeFriend
            });
        }catch(error){
            console.log("Error" , error);
            return;
        }
}



module.exports.update = async function(request, response){
    // if the current user is one being edited
    if(request.user.id == request.params.id){

        try{

            let user = await User.findById(request.params.id);

                User.uploadedAvatar(request, response, function(error){
                    if(error){
                        console.log('*******Multer Error: ', error)
                    }
                    
                    user.name = request.body.name; 
                    user.email = request.body.email; 
                    
                    console.log(request.file);

                    if(request.file){
                        if(user.avatar){                            
                            fs.existsSync(user.avatar);
                        }
                        user.avatar = User.avatarPath + '/' + request.file.filename;
                        console.log(user.avatar);
                    }
                    user.save();
                    return response.redirect('back');
                });
            

        }catch(error){
            request.flash('error', error);
            return response.redirect('back');
        }

    }else{
        request.flash('error', 'Unauthorized!');
        return response.status(401).send('Unauthorized');
    }
}


module.exports.signUp = function(request, response){
    //if user is signed-in then it will go to the /users/profile page
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }
    //otherwise it will go to the sign-up page
    return response.render('user_sign_up', {
        title: "codeial | sign Up"
    });
};

//render the signIn page
module.exports.signIn = function(request, response){
    //if user is signed-in then it will go to the /users/profile page
    if(request.isAuthenticated()){
        return response.redirect('/users/profile');
    }
    //otherwise it will go to the sign-up page
    return response.render('user_sign_in', {
        title: "codeial | sign In"
    });
};

//get the sign-up(new account) data
module.exports.create = function(request, response){
    //check the password and confirm password are equal or not bco if there is not equal then redirect to the sign-up page
    if( request.body.password != request.body.confirm_password){
        request.flash('error', 'Passwords do not match');
        return response.redirect('back');
    }
    
    User.findOne({email: request.body.email}, function(error, user){
        if(error){
            request.flash('error', err);
            // console.log('error in finding user in singing up mtlb vo email id already h isliye error diya');
            return;
        }
        //when user is not found then create a user
        if(!user){
            User.create(request.body, function(error, user){
                if(error){
                    console.log('error in creating user while singing up');
                    return
                }//if it is created then the user is send back to sign-in page
                return response.redirect('/users/sign-in'); 
            })
        }else{
            request.flash('success', 'You have signed up, login to continue!');
            return response.redirect('back');
        }
    });
}

//sign in and create a session for the user
module.exports.createSession = function(request, response){
    //here we use flash in succecs, if we submit the user name and pass then it will show these results
    request.flash('success', 'Logged in Successfully');
    return response.redirect('/');
}

module.exports.destroySession = function(request,response){
    request.flash('success', 'Logged out Successfully!!');
    //this request is already defined to passport library so we only set here is logout function
    request.logout();
    
    return response.redirect('/');
}
