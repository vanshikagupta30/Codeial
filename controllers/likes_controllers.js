const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.toggleLike = async function(request, response){
    try{
        let likeable;
        let deleted = false;
        if(request.query.type == 'Post'){
            likeable = await Post.findById(request.query.id).populate("likes");
        }else{
            likeable = await  Comment.findById(request.query.id).populate("likes");
        }


        let exixtingLike = await Like.findOne({
            likeable: request.query.id,
            onModel:  request.query.type,
            user: request.user._id
        });


        // if a like already exist then delete it
        if(exixtingLike){
            likeable.likes.pull(exixtingLike._id);
            likeable.save();

            // and remove it from db
            exixtingLike.remove();
            deleted = true;
        }else{
            // else make a new like
            let newLike = await Like.create({
                user: request.user._id,
                likeable: request.query.id,
                onModel: request.query.type
            });

            // if we create like then we need to puch it into the array of likes that we create it into the post and comment schema
            likeable.likes.push(newLike._id);
            // and then we saved it into db
            likeable.save(); 

        }


        return response.json(200, {
            message: "Request Successful",
            data: {
                deleted: deleted,
                // type:request.query.type
            }
        })


    }catch(error){
        console.log(error);
        return response.json(500, {
            message: 'Internal Serber Error'
        });
    }
}