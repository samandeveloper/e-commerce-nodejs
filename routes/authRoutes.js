const express = require('express')
const router = express.Router()
const {register,login,logout} = require('../controllers/authController')  //get the object routes from controllers


router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

module.exports = router;