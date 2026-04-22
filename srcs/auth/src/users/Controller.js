const   jwt = require("jsonwebtoken");

module.exports = {
    getToken: async (req, res) => {
        let token;
        
        if (!req.user)
            return res.status(401).send({msg: "Error: Authentication failed."});
        token = jwt.sign({userId: req.user.id}, "secretkey", {expiresIn: "1h"});

        return res.send({token});
    },
    ping: async (req, res) => {
        return res.send({pong: "pong"});
    }
}