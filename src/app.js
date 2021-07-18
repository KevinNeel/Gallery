const express = require('express');
const app = express();
const path = require('path');
const route = require('./routes/route');
const multer = require('multer');
require('./db_conn/db_conn');
const gallery = require('./models/models');
const methodOverride = require('method-override');
const session = require('cookie-session')
const flash = require('express-flash')
var passport = require('passport');
const userAuth = require('./auth');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
var ObjectId = mongoose.Types.ObjectId;
app.use(flash())
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false
    }));
app.use(passport.initialize());

app.use(passport.session());
app.use(methodOverride('_method'))

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

// Setting the view engine
app.set('view engine', 'ejs');

//Setting the path 
app.use(express.static('./public'))
const views_Path = path.join(__dirname, '../public/views');
app.set('views', views_Path);


app.get('/', async (req, res) => {
    try {
        if (req.user) {
            const userDatas = await gallery.find();
            res.status(200).redirect(`/${req.user.id}`)
            
        } else {
            const userDatas = await gallery.find();
            const userid = '';
            res.status(200).render('index', { userDatas: userDatas, userid: userid })
        }

    } catch (error) {
        res.status(500).send('Invalid path name', error)
    }
})


app.get('/login', (req, res) => {
    res.status(200).render('login');
});

app.get('/register', (req, res) => {
    try {
        res.status(200).render('register');
    } catch (error) {
        res.status(500).redirect('register')
        console.log(error)
    }
})






app.post('/register', checkNotAuth, async (req, res) => {
    try {
        const newUserData = new gallery({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const userdata = await newUserData.save();
        res.status(200).redirect(`/${userdata.id}`);
    } catch (error) {
        res.status(500).send('Please fill the info')
        console.log(error)
    }
})



app.post('/login', checkNotAuth,
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
        failureFlash: true
    })
);

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('login')
})


app.get('/:id', chechAuth, async (req, res) => {
    try {
        const newuserid = req.params.id 
       
        const userDatas = await gallery.find();
        if(newuserid.match(/^[0-9a-fA-F]{24}$/)){
            const userid = await  gallery.findById( new ObjectId(newuserid));
            res.status(200).render('index', { userDatas: userDatas, userid: userid })
              } else{
                  res.send('error');
              }
    } catch (error) {
        res.status(500).redirect('index');
        console.log(error)
    }
})



function chechAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}

function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('index')
    }
    next()
}

app.use('/gallery', route)

app.listen(port, () => {
    console.log(`Server is running at port:${port}`);
})