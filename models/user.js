const mongoose = require('mongoose');

// we import multer bcoz we need to add some attachment like file atachment(and hmne ye chiz config folder m na krke hm yha(user page m) isliye kr rahe h kyuki hmne ye )file specific user k liye krni h or kuch specific setting isliye hme jha pr avatar/ multer ki need hogi m vha pr individually use krege)
const multer = require('multer');
// we also require the path of multer bcoz we'll be setting up the path where the fle will be stored
const path = require('path');
// and we define which path and path.join krke m path usme add kr dete h(ye vo path h jha hmari sari files save hogi jo hm send krege)
const AVATAR_PATH = path.join('/uploads/users/avatars'); 

const userSchema = new mongoose.Schema({
    email: //we dont write here only string bcoz we need to define more properties, email has to be unique inside our database means one email corresponds to one user
    {
        type: String,
        required: true, //required means withput having an email value user wont be created in the database means mongoose through an error that you have not passed an email
        unique: true    // email is unique that's why we write unique: true here
    },
    password: {
        type:String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    // hmne ye avatar yha user schema m isliye lika bcoz hme bs ye user m chaiye bs to use lene k liye user schema se likha h
    avatar: {
        type: String
    },
    friends: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }]
}, {
    // timestamps means created and updated at(ye use hota h kyuki jb h create krege apna account tb create hoga aur update bhi hoga kyuki plhe to kuch ni tha bad m kuch na kuch value to hogi and updated at m update hoga jb bhi hm uska username change krege)
    timestamps: true
});

// discStorage mtlb(local storage) hmare system me jo hard drive h Usme store ho rha h
let storage = multer.diskStorage({
    // here we guve 3 arguments one is request,2nd one is file from that request and then 'cb' is the callback function
    destination: function (request, file, cb) {
        // for this callback fn first argu is null and the second one is the excat path where the file needs to be stored(it would be the current directory i.e. path.join and how do I find the current one i.e. __dirname(ye hme bta dega ki hm abhi kha pr h i.e. modals vale flder m h ) as we did in the terminal to find ki hm konsi file directory m h)
        // ".." means one step above(vo jis bhi folder m h usse bhr nikalne k liye) bhr niklne k bad uploads uske neighbour(ek jaisa jha sare folders h vha vo bhi h) m h
        // line no 41 will create like this (models/.. + ".." + /uploads/users/avatars)(models/.. isliye likha hm models k one step back aa gye which is till models & above that there is neighbour of models) ithr hmne models likha h isliye kuiki hmne directory name likhna tha na ki file name jo hm user.js likhe
        cb(null, path.join(__dirname, "..", AVATAR_PATH));
    },
    // filename as the name says what will be the name of the file
    filename: function (req, file, cb) {
        // file vo h jo hm kra rahe h and fieldname is avatar in which we are storing So every file that I upload in this field that will be avatar - date.now
        cb(null, file.fieldname + '-' + Date.now());
        // console.log(file.fieldname);
    }
});


// STATIC METHODS OR function (it is that which can be called overall on the whole class) 
// .single('avatar') says that only one instance only file file will be uploaded for the fieldname avatar not uploading multiple files
//  statics ka mtlb hota h that is available for the entire class ya collection not just a single document or object, UploadedAvatar fn ka name h Jo hum multer use krne ke liye use krneege Storage hmne upar in line 35 define kiya h to ye bs use point kr rha h Jisme destination folder aur file name h
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
// I just need this avatarPath(AVATAR_PATH) to be available publically for the user model
userSchema.statics.avatarPath = AVATAR_PATH;


const User = mongoose.model('User', userSchema);

module.exports = User;