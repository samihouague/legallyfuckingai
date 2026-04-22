const { User } = require("../users/Model");
const bcrypt = require("bcrypt");

module.exports = {
    signin: async (req, res, next) => {
        const { username, password } = req.body;

        if (!username && !password)
            return res.status(403).send({ msg: "Missing inputs" });
        
        const userExist = await User.findOne({where: { username }});
        if (userExist)
            return res.status(403).send({ msg: "Username already taken" });
        try {
            const user = User.build({
                username,
                password,
            });
            await user.save();
            req.user = user;
            next();
        } catch(e) {
            return res.status(500).send({ msg: "Signin failed.", e });
        }
    },
    signup: async (req, res, next) => {
        const { username, password } = req.body;
        const user = await User.findOne({where: { username }});
        
        if (!username && !password)
            return res.status(403).send({ msg: "Missing inputs" });
        if (user == null)
            return res.status(401).send({ msg: "Username does not exists" });
        else if (!bcrypt.compareSync(password, user.password))
            return res.status(401).send({ msg: "Invalid password" });
        req.user = user;
        next();
    },
}