const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');


module.exports.create = async function(request, response){
    // console.log(request.body)
    try{
        let post = await Post.create({
            content: request.body.content,
            user: request.user.id
        });

        await post.populate('user','-password').execPopulate();

        if(request.xhr){
            return response.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created!"
            });
        }
        request.flash('success', 'Post published!');
        return res.redirect('back');

        request.flash('success', 'Post Created!');
        return response.redirect('back');
    }catch(error){
        // console.log("Error", error);
        // return;
        request.flash('error', error);
        console.log(error);
        return response.redirect('back');
    }
}


module.exports.destroy = async function(request, response){

    try{
        let post = await Post.findById(request.params.id);
        if(post.user == request.user.id){

               
                await Like.deleteMany({likeable: post, onModel: 'Post'});
                await Like.deleteMany({likeable: {$in: post.comments}});


                post.remove();

                await Comment.deleteMany({post: request.params.id});
                    
                if(request.xhr){
                    
                    return response.status(200).json({
                        data: {
                            post_id: request.params.id
                        },
                        message: "Post Deleted"
                    });
                }
                request.flash('success', 'Post and associated comments destroyed');
            
                return response.redirect('back');
                
            }else{
                request.flash('error', 'You cannot delete this post!');
                return response.redirect('back');
            }
    }catch(error){
        request.flash('error', error);
        // console.log("Error", error);
        // return;
        return response.redirect('back');
    }
}