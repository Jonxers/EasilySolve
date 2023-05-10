const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin-carl:wizard19216811@cluster0.xg80q.mongodb.net/easilySolveUserDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((error) => {
  console.log('MongoDB connection error: ', error.message);
});

module.exports = mongoose.connection;
