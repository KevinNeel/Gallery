const mongose = require('mongoose');
const bcrypt = require('bcrypt');

const gallery_Schema = new mongose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    userimages:[{
        imagefile:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}],
});


gallery_Schema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

const gallery = new mongose.model('galleryImage', gallery_Schema);

module.exports = gallery;