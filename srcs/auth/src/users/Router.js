const router = require("express").Router();
const { signin, signup } = require("../middleware/Auth");
const { getToken, ping } = require("./Controller");

router.post("/signup", signin, getToken);
router.post("/signin", signup, getToken);
router.get("/ping", ping);

module.exports = router;