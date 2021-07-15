var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const userRegistration = require('./models/models');
const bcrypt = require('bcrypt');


passport.use(new LocalStrategy({
  usernameField: 'email'
},
  async function (email, password, done) {
    const user = await userRegistration.findOne({ email: email });
    if (user == null) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    try {      
      bcrypt.compare(password, user.password, (err, isMatch) => {
        console.log(isMatch)
        if (err) return done(err);
        console.log(err, 'err1')
        if (isMatch) {
          return done(null, user);
        } else {
          console.log(err, 'err2')
  
          return done(null, false, { message: 'Incorrect Password' });
        }
      })
    } catch (error) {
      console.log(error);
    }
 

  }
));
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  userRegistration.findById(id, function (err, user) {
    done(err, user);
  });
});

