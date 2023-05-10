const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false // exclude from query results by default
    },
    role: {
        type: String,
        enum: ['user', 'instructor', 'admin'],
        default: 'user'
    },
    coursesTeach: [{
        course: { type: Schema.Types.ObjectId, ref: 'Course' } 
    }],
    coursesEnrolled: [{
        course: { type: Schema.Types.ObjectId, ref: 'Course' }
    }],
    revenue: [{
        money: Number
    }],
  date: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String, // token to be sent to the user's email
  resetPasswordExpires: Date // expiry date of the resetPasswordToken
  
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model('User', userSchema);
module.exports = { User, userSchema };
