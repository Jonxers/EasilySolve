const flash = require('connect-flash');

module.exports = (req, res, next) => {
  req.flash = (type, message) => {
    req.session.flash = {
      type,
      message
    };
  };

  res.locals.flash = () => {
    const flash = req.session.flash;
    delete req.session.flash;
    return flash;
  };

  next();
};



