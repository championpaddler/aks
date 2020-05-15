const mongoose = require('mongoose');

const User = mongoose.Schema({
    mobile: String,
    password: String,
    contacts: Array
}, {
    usePushEach : true
});

module.exports = mongoose.model('User', User);