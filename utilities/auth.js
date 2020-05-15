const jwt = require('../node_modules/jsonwebtoken');

const jwtconfig = require('../config/jwtkey.config');
const jwtKey = jwtconfig.jwtKey

// function to validate token
async function validatetoken(req, res) {
    if (req.headers.authorization != "" || req.headers.authorization != null) {
        var payload = '';
        try {
            payload = await jwt.verify(req.headers.authorization, jwtKey);
            if (payload.userId != "" && payload.userId != null) {
                return true;
            } else {
                res.send("Invalid Token");
            }
        } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                return res.status(401).end();
            }
            return res.status(400).end();
        }
    } else {
        res.send("Token Not Set");
    }
}
module.exports.validatetoken = validatetoken;

async function getUid(token) {

    const payload = await jwt.verify(token, jwtKey);
    if (payload.userId != "" && payload.userId != null) {
        return payload.userId;
    }
}

module.exports.getUid = getUid;

