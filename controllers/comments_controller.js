const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');


module.exports.create = async function(request, response){
    
    try{        
        let post = await Post.findById(request.body.post);
            if(post){
                let comment = await Comment.create({
                    content: request.body.content,
                    post: request.body.post,
                    user: request.user._id
                });

                post.comments.push(comment);
                post.save();
                comment = await comment.populate('user', '-password').execPopulate();
                let job = queue.create('email', comment).save(function(error){
                    if(error){
                        console.log("Error in creating a queue", error);
                        return;
                    }
                    console.log( "Job enqueued",job.id);
                });

                if(request.xhr){
                    return response.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: "Post created!"
                    });
                }
            }

            request.flash('success', 'Comment Published!');

            response.redirect('/');
        //  });
    }catch(error){
        request.flash('error', error);
        // console.log("Error", error);
        return;
    }
}


module.exports.destroy = async function(request, response){

    try{
        let comment = await Comment.findById(request.params.id);
        console.log('lvl1')
            
            if(comment.user == request.user.id){
                // console.log('lvl2')                
                
                let postId = comment.post;

                comment.remove();

                let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: request.params.id}});

                await Like.deleteMany({likable: comment, onModel: 'Comment'});

                if (request.xhr){
                    // console.log('xhr request',request.params.id)
                    return response.status(200).json({
                        data: {
                            comment_id: request.params.id
                        },
                        message: "Comment Deleted"
                    });
                }

                request.flash('success', 'Comment deleted!');
                return response.redirect('back');
                
            }else{
                request.flash('error', 'Unautorized');
                return response.redirect('back');
            }
    }catch(error){
        request.flash('error', error);
        // console.log("Error", error);
        return;
    }
};