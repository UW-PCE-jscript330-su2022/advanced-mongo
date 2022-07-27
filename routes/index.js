const { Router } = require("express");
const router = Router();

router.use("/movies", require("./movies"));
router.use("/movies/:id/comments", require("./movies/:id/comments"));
router.use("/", (req, res) => res.status(404).send("Route not found. Maybe you meant /movies"))
module.exports = router;
