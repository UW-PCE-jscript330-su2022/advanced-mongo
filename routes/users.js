const { Router } = require("express");
const router = Router();
const userData = require("../dataInterface/users");



router.post("/login", async (req, res, next) => {
    let resultStatus
    // what do i need to pass in the req.body?
    let result = await userData.findByCredentials(req.body)
    console.log("RESULT: ", result)
    if(result.error){
        resultStatus = 404
    }else{
        resultStatus = 200

    }

    res.status(resultStatus).send(result)

});

router.post("/register", async (req, res, next) => {
    let resultStatus
    let result = await userData.create(req.body)
    console.log("RESULT: ", result)

    if(result.error){
        resultStatus = 404
    }else{
        resultStatus = 200

    }

    res.status(resultStatus).send(result)

});


module.exports = router;
