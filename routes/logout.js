const express = require('express');
const router = express.Router();
const sessionMiddleware = require('../middlewares/sessionMiddleware');

router.use(sessionMiddleware);

router.post('/', function(req, res){
    req.logout(function(err) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;