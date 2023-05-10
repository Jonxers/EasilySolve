const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: String,
    desc: String,
    videoId: String,
    price: Number,
    ownByTeacher: { type: Schema.Types.ObjectId, ref: 'User' },
    ownByStudent: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
    }],
    totalStudents: Number,
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;