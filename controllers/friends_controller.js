const Users = require("../models/user");
const Friendships = require("../models/friendships");

module.exports.addFriend = async function(request , response){
    let deleted = false;
    console.log('req.user.id: ', request.user.id);
    console.log('req.query.id: ', request.query.id);
    let existingFriendship = await Friendships.findOne({
        from_user : request.user.id,
        to_user : request.query.id,
    });
    if(!existingFriendship){
        existingFriendship = await Friendships.findOne({
            to_user : request.user.id,
            from_user : request.query.id,        
        });
    }
    let user = await Users.findById(request.user.id);
    console.log("existing id", existingFriendship);
    if(existingFriendship){
        console.log("Present");
        user.friends.pull(existingFriendship._id);
        user.save();
        await Friendships.deleteOne({id: existingFriendship.id});
        deleted = true;
        console.log("deleted");
    }else{
        let friendship = await Friendships.create({
            to_user : request.query.id,
            from_user : request.user._id
        });
        user.friends.push(friendship);
        user.save();
    }

    if(request.xhr){
        return response.status(200).json({
            deleted : deleted, 
            message : "Request Successful"
        });
    }
     return response.redirect("back");
} 