const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:127.0.0.1:27017/Gallery',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log("Connection is Successfull!")
}).catch((err)=>{
    console.log("Connection is Unsccessfull!", err)
});