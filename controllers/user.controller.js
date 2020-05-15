const User = require('../models/user.model.js');
const jwt = require('../node_modules/jsonwebtoken');
const auth = require('../utilities/auth');
const validatetoken = auth.validatetoken;
const bcrypt = require('../node_modules/bcrypt');
const saltRounds = 10;
const jwtconfig = require('../config/jwtkey.config');
const jwtKey = jwtconfig.jwtKey
const jwtExpirySeconds = jwtconfig.jwtExpirySeconds;
const messagebirdconfig = require('../config/messagebirdkey');
const messagebird = require('../node_modules/messagebird')(messagebirdconfig.key);

// Create and Save a new User
exports.login = async (req, res) => {
    try {
        let user = await User.findOne({ "mobile": req.body.mobile });
        if (user == null) {
            res.json({ "error": true, "login": false, "Status": "User Not Found" });
        }
        else {
            let response = await bcrypt.compare(req.body.password, user.password);
            if (response === true) {
                const userId = user._id;
                const token = await jwt.sign({ userId }, jwtKey, {
                    algorithm: 'HS256',
                    expiresIn: jwtExpirySeconds
                });
                res.json({ "token": token, "error": false, "login": "User Logged In Successfully" });
                res.end();
            } else {
                res.json({ "error": true, "login": "Login Unsuccessfull" });
            }
        }
    } catch (error) {
        res.send(error.message);
    }

};

// Signup new user
exports.signup = async (req, res) => {
    var query = { "mobile": req.body.mobile };
    try {
        let checkuserxistsUser = await User.findOne(query);
        console.log(checkuserxistsUser);
        if (checkuserxistsUser == null) {
            bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                if (!err) {
                    var user = new User();
                    user.mobile = req.body.mobile;
                    user.password = hash;
                    await user.save();
                    const userId = user._id;
                    const token = await jwt.sign({ userId }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                    });
                    res.json({ "token": token, "error": false, "status": "User Created Successfully" });
                    res.end();
                }
            });

        } else {
            res.json({ "status": "User Already Exists", "error": true })
                .status(200);
        }
    } catch (error) {
        res.json({ "status": error.message, "error": true })
    }
};

//Add New Contacts
exports.addcontact = async (req, res) => {
    if (req.headers.authorization != "" || req.headers.authorization != null) {
        const tokenValidate = await validatetoken(req, res);
        if (tokenValidate == true) {
            userId = await auth.getUid(req.headers.authorization);
            let user = await User.findById(userId);
            if (user == null) {
                res.json({ "status": "User Not Found", "error": true }).status(200);
            } else {
                if (user.contacts.indexOf(req.body.Contact) != -1) {
                    res.send({ "status": "Contact is Already Present", "error": true })
                } else {
                    messagebird.lookup.read(req.body.Contact, async function (err, response) {
                        if (err) {
                            if (err.statusCode === 401) {
                                res.send({ "status": "Message Bird Api Key Error", "error": true }).status(200);
                            }
                            if (err.statusCode === 400) {
                                res.send({ "status": "Phone Number is Invalid", "error": true }).status(200);
                            }
                        } else {
                            if (response != null) {
                                user.contacts.push(response.phoneNumber);
                                await user.save();
                                res.send({ "status": "Contact has been Saved Successfully", "error": true }).status(200);
                            } else {
                                res.send({ "status": "Contact is not Invalid", "error": true }).status(200);
                            }
                        }
                    });
                }

            }
        }
    } else {
        res.json({ "error": true, "status": "Token Not Found" });
    }
};

