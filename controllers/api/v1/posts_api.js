// we require Post and Comment bcoz we use to see the post and delete the post and comments associated with the post
const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

// index is used when we want to list down something
module.exports.index = async function(request, response){

    // yha pr hm sari vo posts dekhyege 

    let posts = await Post.find({})
    // if we add this function sort then it will sorted our posts like plhe agr hm posts add krte the to vo last m add hoti thi but agr isko likhkr hm add krege posts to vo hmari upr dekhegi 
    .sort('-createdAt')
    // populate ka mtlb hota h data base se data nikalna for further use yha pr humne user ko populate kiya means jb b post find  ho to uske user ki saari details fetch ho jaaye sath me
    .populate('user', '-password')
    //isme hme aise chaiye comments aur kis user ka h comment tbhi hmne nesting ki ki plhe comment then kis user ka h vo comment 
    .populate({
        // user ka mtlb h ki comment wale schema me jaakr user ko utha laao mtlb user ki details ya jo bhi h uske bare m details le aayega
        path: 'comments',
        populate: {
            path: 'user'
        }
    });

    // whenever we want to send back json data then we do response.json and 200 means success
    return response.json(200, {
        message: "List of posts",
        // here we will give posts jo hmne upr diya hua h
        posts: posts
    });
}

// now we delete there posts using API

module.exports.destroy = async function(request, response){

    try{
        let post = await Post.findById(request.params.id);
            // , function(error, post){});
            //.id means converting the object id into string(and this if statement means if the post user and current user(logged-in) are same)
            if(post.user == request.user.id){
                post.remove();

                //this function deleteMany delete all comments based on some query and in the funtion if there is an error it will through an error and it doesn't return any comment bcoz they have been deleted(comments).
                await Comment.deleteMany({post: request.params.id});
                    
            
            
                return response.json(200, {
                    message: "Post and associated comments deleted successfully"
                });
                
            //if the post.user(jisne post kiya h) and currnet user didn't match then it redirect into the page
            }else{
                return response.json(401, {
                    message: "You cannot delete this post!"
                });
            }
    }catch(error){
        console.log('$$$$$$$$$$$$$$$', error);
        return response.json(200, {
            message: "Internal Server Error"
        });
    }
}