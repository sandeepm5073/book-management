const express = require('express')
const router = express.Router()
const Middle = require("../middlewares/commonMiddle")
const UserController = require("../controllers/userController")
const BookController = require("../controllers/bookController")


//user
router.post("/register", UserController.createUser)
router.post("/login", UserController.loginUser)
//book
router.post("/books", Middle.authentication, BookController.createBooks)
router.get("/books", Middle.authentication, BookController.getBook)

module.exports = router