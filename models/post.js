const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        //hmne yha to type m ye isliye likha h kyuki mongoose k schema me data object ki form me store hota h(bas batata hai data objetId type ka hai)
        type: mongoose.Schema.Types.ObjectId,
        //it is reffer to user schema that's why we write user in reffer(ref yeh batata hai kis model mein dhundhna hai)
        ref: 'User' 
    },
    //include the array of ids of all commentd in this post schema itself(taki hme ek post k andr sare comments mil jye alg alg na mile agr aisa ni krege to hme bhaut iterate krna pdega)
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    // jaise hmne comments ka array bnya tha vaise hi hm likes ka array bnyege
    likes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
        }
    ]
},{
    // timestamps means created and updated at(ye use hota h kyuki jb h create krege apna account tb create hoga aur update bhi hoga kyuki plhe to kuch ni tha bad m kuch na kuch value to hogi and updated at m update hoga jb bhi hm uska username change krege)
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;