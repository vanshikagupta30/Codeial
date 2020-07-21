const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');


module.exports.create = async function(request, response){
    
    try{
        //..hm isme post find krege id se and hmne req.body.post isliye kiya kyuki hmne home.ejs k andr post vale section m input diya tha post k liye to uska NAME POST tha, if we donot find the post ten it will give an error aur agr kr liya find then agr bdega
        
        let post = await Post.findById(request.body.post);
            //  function(error, post){
            // // if(error){
            // //     console.log('error in finding post',error)
            // //     return;
            // // }
            // console.log(request.body)
            // console.log(post);
            if(post){
                // post found hone k bad usme comment create krege
                let comment = await Comment.create({
                    content: request.body.content,
                    post: request.body.post,
                    user: request.user._id
                });

                post.comments.push(comment);
                post.save();
                
                // console.log(post);
                //ye hmne populate function isliye likha bcoz hmare code m jo hm post dal rahe the usme username and email undefined aa rha tha isse hm user vali schema se use fetch krva lege aur usme undefined ni ayega 
                comment = await comment.populate('user', '-password').execPopulate();
                
                // whenever a new comment is created then the mail or msg will give that user jiski post pr kiya h comment
                // commentsMailer.newComment(comment);
                // console.log(comment);

                //(the job id is printed over here and hmne yha job name isliye diys bcoz jo sare task ho rahe h vo job hi to h) here we write emails bcos hm isi ki to queue create kr rhe h in comment_email_worker.js file then the comments jisme hm apna email send krna chate h
                // inside a queue we create a new job,if there is no job inside te queue that queue doesn't exists then a new queue will be created and if queue already exists then I'll puch in my jobs
                let job = queue.create('email', comment).save(function(error){
                    if(error){
                        console.log("Error in creating a queue", error);
                        return;
                    }
                    // agr hmara job create ho chuka h to job k andr ek id store ho jyegi upr hi
                    console.log( "Job enqueued",job.id);
                });

                if(request.xhr){
                    // Similar for comments to fetch the user's id!
                    // comment = await comment.populate('user', 'name').execPopulate();
                    // console.log(comment);
                    return response.status(200).json({
                        data: {
                            comment: comment
                        },
                        message: "Post created!"
                    });
                }

                // }, function(error, comment){
                //     //..handel error
                //     // if(error){
                //     //     console.log('eroor in cmnt craetion',error);
                //     //     return;
                //     // }
                    
                //     //..agr error ni ayega to iska mtlb h post k andr jo hmne comments ka array bnya h usme hm push krde vo comments jo create ho rahe h
                //     post.comments.push(comment);
                //     //..save is the final version so lock it or save it
                //     post.save();
                //     return response.redirect('/');
                // });
            }

            //// hm new noty bnakr bhi dekha skte h noty msgs
            // new Noty({
            //     theme:'relax',
            //     text: 'Comment Created',
            //     // we can change the color of this success to whatever we want just go though to the noty js
            //     type: 'success',
            //     layout: 'topRight',
            //     timeout: 1500
            // }).show();
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
        //in this we find the comment by id to delete the Comments
        let comment = await Comment.findById(request.params.id);
        console.log('lvl1')
            // , function(error, comment){
            // agr jiska comment h vo equal mil jata h uske jo login h user to delete kr dege comment
            if(comment.user == request.user.id){
                // console.log('lvl2')                
                // before deleting the comment we need to fetch the post id of the comment bcoz we need to go inside that post and find that comment and delete it
                // postId se post ki id mil jyegi and comment.post se hme vo user mil jyega jiski post pr se comment delet krna h 
                let postId = comment.post;

                comment.remove();

                // pull comments ke array se nikal dega jo bhi hme delete krna h comment and req.params.id uske age k comments ko uski upr ki position pr le ayega (ithr hm posts find krege comments find krne k bad isme ye comment id ko pull krega jo database se delete ho chuki h)
                let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: request.params.id}});
                    //ye await to lgaya hi nhi tha req aage kaise jaegi

                // destroy the associated likes for this comment (jb comment delete hoga to uske sath sare likes bhi khtm ho jyege) 
                await Like.deleteMany({likable: comment, onModel: 'Comment'});

                // send the comment id which was deleted back to the views
                if (request.xhr){
                    // console.log('xhr request',request.params.id)
                    return response.status(200).json({
                        data: {
                            // yha pr hme request.params.id isliye pass ki bcoz hr user ki id unique hoti h and use uski unique id fetch krke delete krega ye
                            comment_id: request.params.id
                        },
                        // post_id: request.params.id;
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