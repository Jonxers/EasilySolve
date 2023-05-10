const express = require('express');
const router = express.Router();
const passport = require('../middlewares/authMiddleware');
const flash = require('connect-flash');


router.use(flash());

router.get('/', (req, res) => {
  const successMessage = req.flash('success');
  res.render('login', { flashMessage: req.flash('error'),successMessage});
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/main',
  failureRedirect: '/login',
  failureFlash: true
}));

module.exports = router;



