const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');


module.exports.toggleLike = async function(request, response){
    try{

        // Likes/toogle/?id=abcdef&type=Post
        let likeable;
        // hmne ye boolean isliye likha starting m to hm kuch bhi delete ni kr rahe to ye false h,starting m to kuch bhi find ni kiya to delete kaise hoga
        let deleted = false;
        

        // finding Likable(if the request.query.type is post then likable is post otherwise it is comment)
        // here request.query.type isliye likha bcoz query likha kyuki hme yha pr 2 chize pas krvani thi one is the id and other is the type i.e. post or the comment and here the type is the post or the comment that's why we write in equals post or comment
        if(request.query.type == 'Post'){
            // here we find the post's ID jha pr like kiya gya h(jb likes dekhne hote h to hm uski id se dekhte h) 
            likeable = await Post.findById(request.query.id).populate("likes");
        }else{
            // here we find the comment's ID jhs pr like kiya gya h
            likeable = await  Comment.findById(request.query.id).populate("likes");
        }


        // check if a like already exists(find one is bcoz agr ek bhi use ne kiya ho to vo)
        let exixtingLike = await Like.findOne({
            // in likeable we do req.query.id bcoz likes ko find krne k liye hm ID ka use krege
            likeable: request.query.id,
            // in onModel we do req.query.type bcoz type means post or comment ko find krne k liye hm type (string) ka use krege
            onModel:  request.query.type,
            // and user se hme user ki ID ka pta chl jyega ki konsi user ki ID pr hua h  
            user: request.user._id
        });


        // if a like already exist then delete it
        if(exixtingLike){
            // if like is already exist the pull it and save it
            likeable.likes.pull(exixtingLike._id);
            likeable.save();

            // and remove it from db
            exixtingLike.remove();
            // delete true isliye kiya bcoz hmne ab delete kr diya like ko
            deleted = true;
        }else{
            // else make a new like
            let newLike = await Like.create({
                // new like bnane k liye user ki ID, like ki ID and type post h ya comment ye store krna pdta h
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
// chalao