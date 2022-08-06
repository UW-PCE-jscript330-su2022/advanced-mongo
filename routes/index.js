const { Router } = require("express");
const router = Router();

router.use("/movies", require("./movies"));
router.use("/weather", require("./weather"));
router.use("/", (req, res) => res.status(404).send("Route not found."))
module.exports = router;
