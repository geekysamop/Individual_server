const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    }
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;