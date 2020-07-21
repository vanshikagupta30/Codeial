const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');



module.exports.createSession = async function(request, response){
    
    try{
        // whenever a username and password is received then we need to find that user and generate the json token corresponding to that user
        let user = await User.findOne({email: request.body.email})
        
        // if the user is not found or password doesn't match then return 422 i.e. error
        if(!user || user.password != request.body.password){
            return response.json(422, {
                message: "Invalid username or password"
            });
        }
        // if we find the user then return 200 i.e. success
        return response.json(200, {
            message : "Sign in Successful, here is your token, please keep it safe!",
            // with msg there is token along side and pass on the token using jwt library
            data : {
                // The secret key used in password-jwt-strategy.js is 'codeial', the token below will set the token and send it to the user.
                ////hum sign in function me user ko pass kr rhe h or toJSON function ka use kr rhe h jisse vo JSON data me convert ho jaye or secret key codeial pass ki or expiry time de diya 
                
                // here we write the environment.js file path i.e. env.jwt_secret
                token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '100000'})
            }
        });

    }catch(error){
        console.log('$$$$$$$$$$$$$$$', error);
        return response.json(200, {
        message: "Internal Server Error"
        });
    }
}



//////jese hi token expire hoga user ki info destroy ho jayegi isliye destroy nhi bnaya user ka