const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Gallery',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log("Connection is Successfull!")
}).catch((err)=>{
    console.log("Connection is Unsccessfull!", err)
});