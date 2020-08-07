const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    appId: String,
    thumbnail: String,
    appName : String
});

const User = mongoose.model('user', userSchema);

module.exports = User;