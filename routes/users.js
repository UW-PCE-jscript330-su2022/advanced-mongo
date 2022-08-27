const { Router } = require("express");
const router = Router();

const userData = require('../dataInterface/users');
 
// GET ALL USERS
// curl -sS http://localhost:5001/users/
router.get("/", async (req, res, next) => {
    let userList = await userData.getAll()
  
    if (userList) {
      res.status(200).send(userList)
    } else {
      // If userList is empty/null, something serious is wrong with the MongoDB connection.
      res.status(500).send({
        error: "Something went wrong. Please try again."
      })
    }
  });
  
//GET USERS BY EMAIL CREDENTIAL
// curl -X POST -H "Content-Type: application/json" -d '{"email":"ssmith41@gmail.com","name":"Sylvia Smith","password":"Password123!"}' http://localhost:5001/users/login
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
// REGISTER A USER
// curl -X POST -H "Content-Type: application/json" -d '{"name":"Sylvia Smith","email":"ssmith41@gmail.com","password":"Password123!"}' http://localhost:5001/users/register
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