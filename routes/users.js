const { Router } = require("express");
const router = Router();

const userData = require('../dataInterface/users');

// curl -X POST -H "Content-Type: application/json" -d '{"email":"ca278@uw.edu","name":"cheri","password":"secrets!"}' http://localhost:5000/users/login
router.post("/login", async (req, res, next) => {
  let resultStatus;

  let result = await userData.findByCredentials(req.body)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});

// curl -X POST -H "Content-Type: application/json" -d '{"email":"ca278@uw.edu","password":"secrets!"}' http://localhost:5000/users/register
router.post("/register", async (req, res, next) => {
  let resultStatus;

  let result = await userData.create(req.body)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

module.exports = router;