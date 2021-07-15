const express = require('express');
const route = express.Router();
const path = require('path')
const multer = require('multer');
const gallery = require('../models/models')
const mongoose = require('mongoose');
const { triggerAsyncId } = require('async_hooks');
route.use(express.urlencoded({ extended: false }))

var ObjectId = mongoose.Types.ObjectId;

var storage = multer.diskStorage({
  destination: './public/upload',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) { checkFIleType(file, cb) }
}
).single('imagefile');

function checkFIleType(file, cb) {
  const filetype = /jpeg|jpg|png|gif/;
  const imagetype = filetype.test(path.extname(file.originalname).toLocaleLowerCase());

  const mimetype = filetype.test(file.mimetype);

  if (imagetype && mimetype) {
    return cb(null, true);
  } else {
    cb("Enter the image");
  }

}

route.get('/edit', async (req, res) => {
  try {
    const userID = req.query.userId;

    if (userID.match(/^[0-9a-fA-F]{24}$/)) {
      const imageID = req.query.userimage;
      if (imageID.match(/^[0-9a-fA-F]{24}$/)) {
        let userDetails = new ObjectId(userID);
        let userimageDetails = new ObjectId(imageID);
        const imageIDdetails = await gallery.findOne(userDetails).select({ userimages: { $elemMatch: { _id: userimageDetails } } })
        res.status(200).render('edit', { imageID: imageIDdetails })
      }
    } else {
      res.send('error');
    }
  } catch (error) {
    console.log(error);
  }
})

route.get('/myprofile', async (req, res) => {
  try {
    const profileData = await gallery.findById(req.query.myprofileid);
    res.status(200).render('myprofile', { profileData: profileData });
  } catch (error) {
    console.log(error)
  }
})



route.get('/accountids', async (req, res) => {
  try {

    const accountid = req.query.accountid;
    const userid = req.query.userid;
    const newUserData = await gallery.findById(userid);
    res.render('new', {
      newUserData: newUserData,
      accountid: accountid
    })
  } catch (error) {
    console.log(error);
  }
})

route.get('/:id', async (req, res) => {
  try {
    const userPersonalId = req.params.id;
    const newUserData = await gallery.findById(userPersonalId);
    const accountid = '';
    res.status(200).render('new', { newUserData: newUserData, accountid: accountid })
  } catch (error) {
    console.log(error)
  }
})



route.get('/uploadd/:id', async (req, res) => {
  try {
    const usersID = gallery.findById(req.params.id);
    res.status(200).render('uploadd', { usersID: usersID });
  } catch (error) {
    console.log(error);
  }
})

route.get('/:id/create', async (req, res) => {
  try {
    res.status(200).render('create');
  }
  catch (error) {
    console.log(error);
  }
});

route.post('/edit', async (req, res) => {
  try {
    const userid = new ObjectId(req.query.userId);
    const userimage = req.query.userimage;

    upload(req, res, async function (err) {
      try {
        const editImage = await gallery.findOneAndUpdate({ _id: userid, userimages: { $elemMatch: { _id: userimage } } }, {
          $set: {
            'userimages.$.imagefile': `upload/${req.file.filename}`,
            'userimages.$.description': req.body.description
          }
        }, { new: true })
        res.redirect(`/gallery/myprofile?myprofileid=${editImage.id}`);
      } catch (error) {
        res.redirect(`/gallery/edit?userId=${userid}&userimage=${userimage}`);

      }
    })
  } catch (error) {
    res.redirect('/edit');
  }
})

route.post('/:id/create', async (req, res) => {
  try {
    upload(req, res, async function (err) {
      try {
        const newGallery = await gallery.findByIdAndUpdate({ _id: req.params.id }, {
          $push: {
            userimages: [{
              imagefile: `upload/${req.file.filename}`,
              description: req.body.description
            }]
          }
        });
        res.redirect(`/gallery/${newGallery.id}`);
      } catch (err) {
        console.log('++++')
        res.status(500).redirect('create')
      }
    })
  } catch (error) {
    res.status(500).redirect('/create')
  }
})

route.post('/uploadd/:id', async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.log(err, '++++')
      } else {
        let userImageUpload = await gallery.findByIdAndUpdate(`${req.params.id}`, {
          $push: {
            userimages: [{
              imagefile: `upload/${req.file.filename}`,
              description: req.body.description
            }]
          }
        }
        )
        const newImageData = await gallery.findById(`${req.params.id}`);
        res.redirect(`/gallery/myprofile?myprofileid=${userImageUpload.id}`)
      }
    })
  } catch (error) {
    console.log(error)
  }
})



route.delete('/:id', async (req, res) => {
  try {
    const imageDelete = await gallery.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
})

route.delete('/:userid/:imageid', async (req, res) => {
  try {
    const imageId = req.params.userid;
    const imageDelete = await gallery.findByIdAndUpdate({ _id: req.params.userid }
      ,
      {
        $pull: {
          userimages: { _id: req.params.imageid }
        }
      });

    res.redirect(`/gallery/myprofile?myprofileid=${imageId}`);
  } catch (error) {
    console.log(error);
  }
})


module.exports = route