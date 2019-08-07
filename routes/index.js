const router = require('express').Router();
const userRoutes = require('./userRoutes')
console.log("Routes..............")
router.use('/admin', userRoutes)
module.exports = router;