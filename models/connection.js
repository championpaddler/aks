const mongoose = require('../../node_modules/mongoose');


mongoose.connect('mongodb://datadbadmin:admin123!!#123@162.214.74.247:27017/data?retryWrites=true&w=majority', { useMongoClient: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));