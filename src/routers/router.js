const express = require('express')
const router = express.Router()
const UserController=require("../controllers/userController")
const bookController=require("../controllers/bookController")

router.post ("/register",UserController.createUser)
router.post ("/login",UserController.loginUser)

router.post ("/books",bookController.createBooks)
router.get ("/books",bookController.getBook)

module.exports = router