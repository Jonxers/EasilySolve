const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const flash = require('connect-flash');
require('dotenv').config();

router.use(flash());

router.get('/:token', function(req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
    .then(function(user) {
      if (!user) {
        res.send('Password reset token is invalid or has expired');
      } else {
        res.render('reset-password', { token: req.params.token, flash: req.flash() });
      }
    })
    .catch(function(err) {
      console.log(err);
      res.send('Error');
    });
});

router.post('/:token', function(req, res, next) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  })
    .then(function(user) {
      if (!user) {
        return res.send('Password reset token is invalid or has expired');
      }

      // Validate password
      if (!req.body.password) {
        req.flash('error', 'Password is required.');
        return res.redirect('/reset-password/' + req.params.token);
      } else if (req.body.password.length < 8) {
        req.flash('error', 'Password must be at least 8 characters long.');
        return res.redirect('/reset-password/' + req.params.token);
      } else if (!/\d/.test(req.body.password) || !/[a-zA-Z]/.test(req.body.password)) {
        req.flash('error', 'Password must contain at least one letter and one digit.');
        return res.redirect('/reset-password/' + req.params.token);
      } else if (req.body.password !== req.body.password2) {
        req.flash('error', 'The passwords you have typed in does not match.');
        return res.redirect('/reset-password/' + req.params.token);
      }

      user.setPassword(req.body.password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

        user.save()
          .then(function() {
            req.flash('success', 'Password change successful.');
            return res.redirect('/login');
          })
          .catch(function(err) {
            console.log(err);
            return res.send('Error');
          });
    })
    .catch(function(err) {
      console.log(err);
      return res.send('Error');
    });
});

module.exports = router;


