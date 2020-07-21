const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    //comment belongs to a user
    user: {
        //hmne yha to type m ye isliye likha h kyuki mongoose k schema me data object ki form me store hota h(bas batata hai data objetId type ka hai)
//aur hmne ye yha aur post m isliye likha kyuki objectId me ek unique id generate hoti jo privacy strong krti h nhi to koi b user ka data change kr dega simply name se
        type: mongoose.Schema.Types.ObjectId,
        //it is reffer to user schema that's why we write user in reffer(ref yeh batata hai kis model mein dhundhna hai)
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    // comments has likes that's why we add array of likes here
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps: true
});


const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;