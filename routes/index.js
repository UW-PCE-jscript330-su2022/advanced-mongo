const { Router } = require("express");
//const bodyParser = require("body-parser");
const router = Router();
// use body-parser middleware
//router.use(bodyParser.urlencoded({ extended: false }));
//router.use(bodyParser.json());

router.use("/movies", require("./movies"));
router.use("/users", require("./users"));
router.use("/weather", require("./weather"));
router.use("/", (req, res) => res.status(404).send("Route not found. Maybe you meant /movies"))
module.exports = router;
