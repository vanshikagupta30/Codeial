const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');


module.exports.create = async function(request, response){
    // console.log(request.body)
    try{
        let post = await Post.create({
            //content m jo bhi hm likhege text m content vo ayega
            content: request.body.content,
            // we write req.user._id bcoz agr login hoga tbhi dekhai dega content jo hm dalege
            user: request.user.id
        // },function(error, post){
        //     if(error){
        //         console.log('error is creating a post');
        //         return;
        //     }
        //     return response.redirect('back');
        });

        //ye hmne populate function isliye likha bcoz hmare code m jo hm post dal rahe the usme username and email undefined aa rha tha isse hm user vali schema se use fetch krva lege aur usme undefined ni ayega 
        await post.populate('user','-password').execPopulate();

        //(ye hmne refresh k liye lgaya h vo bar bar refresh ni hoga agr hm xhr request use krte h to)if the request if an ajax request & the type of ajax request is xml HTTP request(xhr) & xhr hmara without refresh kam krta h(and ye chize bs hm inspect k andr network m dekha rahe h HTTP request ki help se)
        if(request.xhr){
            // second method upr vale populate ko krne k liye
            // let post = await post.populate('user', 'name').execPopulate();
            return response.status(200).json({
                //// isme agr hm data:{post:post} likhege to hme home_post m use data.data.post likhna pdega lekin agr hm ise aise likhege post:post only then hme data.post likhna pdega
                data: {
                    post: post
                },
                // post: post,
                message: "Post Created!"
            });
        }
        request.flash('success', 'Post published!');
        return res.redirect('back');

//isse hme posts jb create hoga to usse flash msgs dekhege 
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
            // , function(error, post){});
            //.id means converting the object id into string(and this if statement means if the post user and current user(logged-in) are same)
            if(post.user == request.user.id){

                // delete the accociated likes for the post and all the comment's likes too
                // deleting the likes which are there in tis post and deleting the likes which is there in the comments(comments pr likes delete krne vali like isse next line h) post bcoz jb post delete hoga to uske sath saare likes and jo comments pr like h vo bhi khtm ho jyege 
                await Like.deleteMany({likeable: post, onModel: 'Post'});
                // 
                await Like.deleteMany({likeable: {$in: post.comments}});


                post.remove();

                //this function deleteMany delete all comments based on some query and in the funtion if there is an error it will through an error and it doesn't return any comment bcoz they have been deleted(comments).
                await Comment.deleteMany({post: request.params.id});
                    
                //if the request if an ajax request & the type of ajax request is xml HTTP request(xhr) & xhr hmara without refresh kam krta h(and ye chize bs hm inspect k andr network m dekha rahe h HTTP request ki help se)
                if(request.xhr){
                    
                    return response.status(200).json({
                        data: {
                            // yha pr hme request.params.id isliye pass ki bcoz hr user ki id unique hoti h and use uski unique id fetch krke delete krega ye(and params isliye lgya bcoz vo hmara bs 1 kam krta h but query hmara multiple kma krta h isliye params lgya hme 1 hi kam krvana h)
                            post_id: request.params.id
                        },
                        // post_id: request.params.id;
                        message: "Post Deleted"
                    });
                }
                request.flash('success', 'Post and associated comments destroyed');
            
                return response.redirect('back');
                
            //if the post.user(jisne post kiya h) and currnet user didn't match then it redirect into the page
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