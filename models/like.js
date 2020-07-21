const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    //(this defines the object id of the liked object)now we need to store two things i.e. the type on which the like has been placed & the object id(object id of the post or that comment) on which the like has been placed
    likeable: {
        // 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // we need to tell that it is the dynamic refrence(refpath is that we are place a path to some other field which is there & that field is defined on which type of the object the like has been placed)
        // refPath decides the other property i.e. the type of the object
        refPath: 'onModel'
    },
    //(this field is used for defining the type of the liked object science this is a dynamic refrence) a likable can be a post or a comment due to onModel 
    onModel: {
        type: String,
        required: true,
        // enum tells that value of onModel in each like can either post or comment, noothing other then that. We add here bcoz of surety that only there two model contains like in my db
        enum: ['Post', 'Comment']
    }

}, {
    timestamps: true
});


const Like = mongoose.model('Like', likeSchema);
module.exports = Like;