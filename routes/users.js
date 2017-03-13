const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')

const User = require('../models/users')

router.post('/register', (req, res, next) => {
  let newUser = new User({
    name : req.body.name,
    email : req.body.email,
    userName : req.body.userName,
    password : req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({sucess: false, msg: 'Failed to register user'});
    }else {
      res.json({sucess: true, msg: 'User Registered'});
    }
  });
});

router.post('/authenticate', (req, res, next) => {
  const userName = req.body.userName;
  const password = req.body.password;

  User.getUserByUserName(userName, (err, user) => {
    if(err) throw err;
    if(!user){
      res.json({success: false , msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;

      if(isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 3600
        });

        res.json({
          success: true,
          token: 'JWT '+ token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            userName: user.UserName
          }
        });

      } else{
          res.json({success: false , msg: 'Wrong password'});
      }
    });
  });
  //res.send('Authenticate');
});

router.get('/profile', passport.authenticate('jwt',{session : false}), (req, res, next) => {
  res.json({user : req.user});
});


module.exports = router;
