const mongoose = require('mongoose');

// create a schema
const users = new mongoose.Schema({
  
});

// compile the schema into a model which gives a class
mongoose.model('User', users);