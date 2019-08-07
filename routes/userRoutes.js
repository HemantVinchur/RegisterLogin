const router = require('express').Router();
const jwt = require('jsonwebtoken')
const validator = require('../validators/registerValidator')
const services = require('../services/userServices')



console.log("userRoutes....................")
//Registration

router.post('/signup', validator.registerReqValidator,(req, res) => {
     console.log("Register.......")
    services.userRegister(req, res);
   
})

//Login

router.post('/login', validator.loginReqValidator, (req, res) => {
    services.userLogin(req, res);
})

//Token
router.get('/', (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 's3cr3t', (err, decoded) => {
        if (err) {
            console.log(err)
            throw err;
        }
        console.log(decoded)
    });
    return res.json({
        statusCode: 200,
        message: "Hello",
        data: token
    })
})
//get data

router.get('/get', (req, res) => {
    services.userGet(req, res);
})


//Logout

router.post('/logout', validator.logoutReqValidator, (req, res) => {
    services.userLogout(req, res);
})


module.exports = router;