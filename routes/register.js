const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const flash = require('connect-flash');

router.use(flash());

// A list of banned usernames
const bannedUsernames = ['admin', 'root', 'superuser'];

router.get('/', (req, res) => {
  res.render('register', {flash: req.flash()});
});

router.post('/', async (req, res) => {
  const { name, username, email, password, password2 } = req.body;

  // Validate name
  if (!name) {
    req.flash('error','Name is required.');
    return res.redirect('/register');
  } else if (name.length < 2) {
    req.flash('error','Name must be at least 2 characters long.');
    return res.redirect('/register');
  } else if (name.length > 50) {
    req.flash('error','Name must be no longer than 50 characters.');
    return res.redirect('/register');
  } else if (!/^[a-zA-Z\s]*$/.test(name)) {
    req.flash('error','Name can only contain letters and spaces.');
  return res.redirect('/register');
  }


  // Validate email
  if (!email) {
    req.flash('error','Email is required.');
    return res.redirect('register');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    req.flash('error','Invalid email format.');
    return res.redirect('/register');
  }

  // Validate username
  if (!username) {
    req.flash('error','Username is required.');
    return res.redirect('/register');
  } else if (bannedUsernames.includes(username.toLowerCase())) {
    req.flash('error','Username is not allowed.');
    return res.redirect('/register');
  } else if (username.length < 6) {
    req.flash('error','Username must be at least 6 characters long.');
    return res.redirect('/register');
  }

  // Validate password
  if (!password) {
    req.flash('error','Password is required.');
    return res.redirect('/register');
  } else if (password.length < 8) {
    req.flash('error','Password must be at least 8 characters long.');
    return res.redirect('/register');
  } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    req.flash('error','Password must contain at least one letter and one digit.');
    return res.redirect('/register');
  }else if(password != password2){
    req.flash('error','The passwords you have typed in does not match.');
    return res.redirect('/register');
  }

  try {
    const user = new User({ name, username, email, password });
    await User.register(user,password);
    req.flash('success', 'Registration successful! Please log in.');
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      req.flash('error', 'This email already exists.');
    } else if (err.toString().includes("UserExistsError")) {
      req.flash('error', 'This username is already taken.');
    } else {
      req.flash('error', 'An error occurred while registering. Please try again later.');
    }
    return res.redirect('/register');
  }
});


module.exports = router;


