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
      // If movieList is empty/null, something serious is wrong with the MongoDB connection.
      res.status(500).send({
        error: "Something went wrong. Please try again."
      })
    }
  });
  
//GET USERS BY EMAIL CREDENTIAL
// curl -X POST -H "Content-Type: application/json" -d '{"email":"ssmith26@email.com"}' http://localhost:5001/users/login

router.post("/login", async (req, res, next) => {
  let resultStatus;

  let result = await userData.findByCredentials(req.body)
  // console.log("RESULT: ", result)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});

// CREATE/REGISTER A NEW USER
// curl -X POST -H "Content-Type: application/json" -d '{"name":"Sylvia Smith", "email":"ssmith29@email.com"}' http://localhost:5001/users/register
// curl -X POST -H "Content-Type: application/json" -d '{"name":"Sylvia Smith", "email":"ssmith27@email.com", "password":"password123"}' http://localhost:5001/users/register

router.post("/register", async (req, res, next) => {
  let resultStatus;

  let result = await userData.create(req.body)
  console.log("RESULT: ", result)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

module.exports = router; 
