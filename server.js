const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require( 'path' );
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public")); // use public folder
//Use bodyparser middleware to parse post requests
app.use(bodyParser.urlencoded({ extended: false }));

//Setup view engine
app.set('views', './views');
app.set('view engine', 'ejs');

// Set up middleware

const sessionMiddleware = require('./middlewares/sessionMiddleware');
app.use(sessionMiddleware);

const  passport = require('./middlewares/authMiddleware');
app.use(passport.initialize());
app.use(passport.session());

const userMiddleware = require('./middlewares/userMiddleware');
app.use(userMiddleware);

app.use(flash());

const { ensureAuthenticatedMiddleware } = require('./middlewares/ensureAuthenticatedMiddleware');


//Import database configuration
const db = require('./config/db');

//Import Mongoose Models
const User = require('./models/user');
const Course = require('./models/course');


// Import routes
const registerRoute = require('./routes/register');
const homeRoute = require('./routes/home');
const loginRoute = require('./routes/login');
const mainRoute = require('./routes/main');
const logoutRoute = require('./routes/logout');
const passwordHelpRoute = require('./routes/password-help');
const passwordResetRoute = require('./routes/reset-password');


// Use routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/main', ensureAuthenticatedMiddleware, mainRoute);
app.use('/', homeRoute);
app.use('/logout', logoutRoute);
app.use('/password-help', passwordHelpRoute);
app.use('/reset-password', passwordResetRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
