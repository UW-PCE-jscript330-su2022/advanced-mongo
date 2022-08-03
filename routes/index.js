const { Router } = require("express");
const router = Router();

router.use("/weather", require("./weather"));
router.use("/movies", require("./movies"));

router.use("/", (req, res) => res.status(404).send("Route not found. Maybe you meant /movies or /weather"))
module.exports = router;
