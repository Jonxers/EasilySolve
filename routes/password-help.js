const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User } = require('../models/user');
require('dotenv').config();

router.get('/', function(req, res) {
  res.render('forgot-password');
});

router.post('/', function(req, res) {
  const email = req.body.email;
  User.findOne({ email: email })
    .then(function(user) {
      if (!user) {
        res.send('No user found with that email address');
      } else {
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // expire in 1 hour
        user.save()
          .then(function() {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
              },
              from: process.env.MAIL_USER,
            });
            const mailOptions = {
              to: user.email,
              from: process.env.MAIL_USER,
              subject: 'Password Reset Request',
              text: 'You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset-password/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions)
              .then(function() {
                res.send('Email sent');
              })
              .catch(function(err) {
                console.log(err);
                res.send('Error');
              });
          })
          .catch(function(err) {
            console.log(err);
            res.send('Error');
          });
      }
    })
    .catch(function(err) {
      console.log(err);
      res.send('Error');
    });
});

module.exports = router;

