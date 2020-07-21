const Post = require('../models/post');
const User = require('../models/user')


//.. hmne yha asnyc function isliye lgya bcoz yha bhaut sare callback function h and async ka mtlb h alg alg execute krta hr line ko asynchronously and await ka mtlb h ki line by line execute kr rha h vo and jb hm await function lgyege vo use ache se read krega wait krke then age bdhega
module.exports.home = async function(request, response){
    // return response.end('<h1>Express is up for Codeial</h1>');
    // console.log(request.cookies);
    // if I want to change the cookie value then we do like this, cookie is comming in the req but going back as a response
    // response.cookie('user_id', 15);

    //isse hm home page pr posts dekha skte h isme bs content dekhega jo hm post krege
        // Post.find({},function(error, posts){
        //     return response.render('home',{
        //     title : "Codeial | Home",
        //     posts : posts
        // });
    // // return response.render('home',{
    // //     title : "Home"    
    // });

    // here we use try and catch to try and catch the error if it is the error
    try{
        //populate the user of each post(populate schema  id fetch krta h mtlb jo hmne user likha h uske andr vo user ki schema m jakr uske object ki id fetch krega bcoz vo post vali schema m to ni h na user ki id isliye hmne vha se fetch krvai)
        //and ye is kam bhi ata h jaise FB m hota h hm ek frnd ki id m jakr uski post dekhte h uske bhi ek trh se kama ata h abhi to bs ek hi post h but age aur bhi posts hogi usme kam ayega nested posts main
        let posts = await Post.find({})
        // if we add this function sort then it will sorted our posts like plhe agr hm posts add krte the to vo last m add hoti thi but agr isko likhkr hm add krege posts to vo hmari upr dekhegi 
        .sort('-createdAt')
        // populate ka mtlb hota h data base se data nikalna for further use yha pr humne user ko populate kiya means jb b post find  ho to uske user ki saari details fetch ho jaaye sath me
        .populate('user')
        //isme hme aise chaiye comments aur kis user ka h comment tbhi hmne nesting ki ki plhe comment then kis user ka h vo comment 
        .populate({
            // user ka mtlb h ki comment wale schema me jaakr user ko utha laao mtlb user ki details ya jo bhi h uske bare m details le aayega
            //  populate the likes of each post and comment
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes');

        // await means function jb yha pr ayega to vo thoda wait krega and jb ye function execute ho jyega to vo dusre function ko pass kr dega aur isme hm callback function ni lgate
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

        // then if the user if found the this return function is executed
        return response.render('home', {
            title: "Codeial | Home",
            posts : posts,
            // ye all users hme users dekhyega jo bhi loged in the ya h
            all_users: users
        });
 
    // if there is an error in TRY block then it will go to CATCH block 
    }catch(error){
        console.log('Error : ', error);
        return;
    }


    // .exec(function(error, posts){

    //     User.find({}, function(error, users){
    //         return response.render('home', {
    //             title: "Codeial | Home",
    //             posts : posts,
    //             all_users: users
    //         });

    //         // return response.render('home', {
    //         // title: "Codeial | Home",
    //         // posts : posts
    //     });
    // })
};


//module.exports.actionName = function(request, response){}

// using then
// Post.find({}.populate('comments').then(function()));

// we will use promises here
// let posts = Post.find({}).populate('comments').exec();

// posts.then() 




