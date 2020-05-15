const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routes/users.routes');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const dbconfig = require('./config/database.config.js');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbconfig.dburl, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//Listening for Users Endpoint;
user(app);

app.get('*', function(req, res){
    res.status(404).send('404 Not Found');
});
// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});