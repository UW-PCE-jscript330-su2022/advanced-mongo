const { Router } = require("express");
const router = Router();

router.use("/movies", require("./movies"));
router.use("/comments", require("./movies"));
router.use("/", (req, res) => res.status(404).send("Route not found. Maybe you meant /movies or /comments"))
module.exports = router;
