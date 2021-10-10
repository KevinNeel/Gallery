const cloudinary = require('cloudinary');
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

module.exports = cloudinary;