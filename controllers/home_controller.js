const Post = require('../models/post');
const User = require('../models/user')

module.exports.home = async function(request, response){
    
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes');
        let users = await User.find({});
        
        ////////////friends/////////////
        let user;
        if(request.user){
              user = await User.findById(request.user._id)
             .populate({
                     path : "friends",
                     populate : {
                        path : "from_user",
                    }
                 })
                 .populate({
                    path : "friends",
                    populate : {
                       path : "to_user"
                   }
                });
        }

        return response.render('home', {
            title: "Codeial | Home",
            posts : posts,
            all_users: users
        });
 
    }catch(error){
        console.log('Error : ', error);
        return;
    }
};