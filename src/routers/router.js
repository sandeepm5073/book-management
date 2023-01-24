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
router.put("/books/:bookId", Middle.authentication, BookController.updateBook)
router.get("/books/:bookId", Middle.authentication, BookController.getBookById)
router.delete("/books/:bookId", Middle.authentication, BookController.deleteBook );



router.all("/*", (req, res) => {
      res.status(400).send({ status: false, message: "invalid url" })
})

module.exports = router