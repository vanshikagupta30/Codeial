const User = require('../models/user');
const fs = require('fs');
const ResetPasswordToken = require('../models/reset_password_token');
const Friendships = require("../models/friendships");
const path = require('path');
const resetPasswordMailer = require('../mailers/forgot_password');
const crypto = require('crypto');



module.exports.profile = function(request, response){
    //  params are like objects which contain information about request it could be id ya name  ya  email anything then hm yha kya send kr rahe h id ya name ya email
    User.findById(request.params.id, function(error, user){
        return response.render('user_profile', {
            title: 'User Profile',
            // isse hme pta chlega ki hmara current signed in user kon h aur hm access kr pyege apni user profile vale page pr ki kon konsa user loged in tha
            profile_user: user
    });
    // return res.render('user_profile', {
    //     title: 'User Profile'
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
    // hmne yha pr ek check authentication lga diya if the current loged-in user vohi hua jiski id h tbhi vo edit kr skta h name & email
//(iske andr hm puri body ko kr rahe h update i mean usme ye request.params.id likha hua h isme hme sari chize chaiye id ok first hum find krenge user by id agr mil jata hai toh rq.body me hmari updated details hai iske sath hm purani details replace kr denge)
    // if(request.user.id == request.params.id){
    //     User.findByIdAndUpdate(request.params.id, request.body, function(error, user){
    //         request.flash('success', 'Updated!!');
    //         return response.redirect('back');
    //     });
    // }else{
    //     request.flash('error', 'Unauthorized!');
    //     return response.status(401).send('Unauthorized!');
    // }


    // if the current user is one being edited
    if(request.user.id == request.params.id){

        try{

            let user = await User.findById(request.params.id);

                User.uploadedAvatar(request, response, function(error){
                    if(error){
                        console.log('*******Multer Error: ', error)
                    }
                    
                    user.name = request.body.name; //name update krna
                    user.email = request.body.email; //email update krna
                    
                    // bcoz the request contains the file(ye he terminal pr sari chize dekhyega jo us file m h like destination,size,fieldname)
                    console.log(request.file);

                    // if request has a file(hmne ye isliye kiya bcz hr time koi apni file to ni na krega. so in that case we have put a check if the user is not updating/uploading the file then we are going to check for it and we are updating it only when user is sending the file)
                    // if the file is already is there then I'll check that user had already avatar assiciated with him,if it is present then I remove that avatar and upload a new one
                    if(request.file){
                        if(user.avatar){
                            // agr hm unlinkSync lgate h to isse hmri storae ni increase hoti isse hmara to user already upload kr chuka h uski file delete kr deta h apne ap and new file upload kr deta h(and vo error isliye de rha tha isme bcoz hm agr un avatar ko uploads se delete kr dege to vo hmari db m to hoge na aur jb hm unhe scratch se upload krege to une  )
                            // fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                            
                            // hmne ye user.avatar isliye diya bcoz vo ab error ni dega agr uploads vale folder m ek bhi file na ho to bcoz vo ab vha new file upload kra dega(fs. existsSync() method is used to synchronously check if a file already exists in the given path or not)
                            fs.existsSync(user.avatar);
                        }
                    // //we give avatarPath in user.js file taki vo path kahi bhi use kr sake(this is saving the path of the uploaded file into the avatar field in the user)
                    // //user is the current user for whome I m saving this, avatarPath is the static variable which was which making the AVATAR_PATH path making the public and at last the filename
                    
                    
                        // isme hme new file ka path dekr file ko db m store kr rahe h
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

// module.exports.profile = function(request, response){
//     //i'll check in my cookie user id is present or not
//     if(request.cookies.user_id){
//         //if there is a user id then findOne or findById
//         User.findById(request.cookies.user_id, function(error, user){
//             //if user is found then redirect to profile page
//             if(user){
//                 return response.render('user_profile',{
//                     title: "User Profile",
//                     user: user 
//                 });
//             }else{
//             //if not found then redirect to sign-in page,we can't go back to profile page we restricted that
//             return response.redirect('/users/sign-in');
//             }
//         });
//     //agr cookie ni mili to vapis sign-in page p chle jyege
//     //ithr hm bs ye vala else likhege upr vala ni likhege to bhi sahi work krega bcoz jb hm callback function lgate h to vo asynchronously work krta h but jb vo if condition krega uske bad niche ayeaga to vo sidha else statement execute krega synchronously
//     }else{
//         console.log(request.cookies);
//         return response.redirect('/users/sign-in')
//     }
//     // response.end('<h1>Codeial/page</h1>');
//     // return response.render('user_profile', {
//     //     title : "User Profile"    
//     // });
// };

//render or returning the signUp page
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
        // jb hm create krege account tb pass match ni hua to flasg msg sow krega
        request.flash('error', 'Passwords do not match');
        return response.redirect('back');
    }
    //agr pass same oge to hm find krege ki koi email same user id p to ni h bcoz the email has to be unique, agr vo 
    //exists krti h to hm create ni krege agr ni krti exists to krege create
    User.findOne({email: request.body.email}, function(error, user){
        if(error){
            // error tk ayega jb hmara koi user already ni milega
            request.flash('error', err);
            // console.log('error in finding user in singing up mtlb vo email id already h isliye error diya');
            return;
        }//when user is not found then create a user
        if(!user){
            User.create(request.body, function(error, user){
                if(error){
                    console.log('error in creating user while singing up');
                    return
                }//if it is created then the user is send back to sign-in page
                return response.redirect('/users/sign-in'); 
            })
        // agr user id mil gyi to uski id create ni kregi bs  back chle jyege 
        }else{
            // agr user mil jyega uski existing id h to ye flas msg dekhyega
            request.flash('success', 'You have signed up, login to continue!');
            return response.redirect('back');
        }
    });
}

//sign in(already h) and create a session for the user
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


// //..sign in(already h) and create a session for the user
// module.exports.createSession = function(request, response){
// //..we check wheather the user exists if it exists,we check wheather the password entered is correct and check user exist using the username
// //..which is the email then check the password entered to form into the db if those passwords match then we store the identity in the cookie and send it to the browser
//     //..steps to authenticate
//     //..find the user
//     User.findOne({email: request.body.email}, function(error, user){
//         if(error){
//             console.log('error in finding user in singing in');
//             return
//         }
//         //..if user found,handel it
//         if(user){

//             //..if found,handel password which doesn't match
//             if(user.password != request.body.password){
//                 return response.redirect("back");
//             }
//             //..handel session creation
//             response.cookie('user_id', user.id);
//             return response.redirect('/users/profile');
//         }else{
//             //..if user not found,handel it
//             return response.redirect('back');
//         }
//     });
// }