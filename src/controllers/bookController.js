const BookModel = require("../models/bookModel")
const UserModel = require("../models/userModel")
const validator = require("../Validations/Validator");
const reviewModel = require("../models/reviewModel")

// create book
const createBooks = async function (req, res) {
    try {
        let data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (data.length == 0) {
            return res.status(400).send({ status: false, message: "please give some data to create a book" })
        }
        if (!title) {
            return res.status(400).send({ status: false, message: "title is mandatory" })
        }
        if (!excerpt) {
            return res.status(400).send({ status: false, message: "excerpt is mandatory" })
        }
        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is mandatory" })
        }
        if (!ISBN) {
            return res.status(400).send({ status: false, message: "ISBN is mandatory" })
        }
        if (!category) {
            return res.status(400).send({ status: false, message: "category is mandatory" })
        }
        if (!subcategory) {
            return res.status(400).send({ status: false, message: "subcategory is mandatory" })
        }

        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "releasedAt is mandatory" })
        }


        if (!excerpt.match(regexForString)) {
            return res.status(400).send({ status: false, message: "invalid excerpt" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Enter Valid user Id" })
        }

        if (!ISBN.match(regexForIsbn)) {
            return res.status(400).send({ status: false, message: "invalid ISBN" })
        }

        if (!category.match(regexForString)) {
            return res.status(400).send({ status: false, message: "invalid category type" })
        }

        if (!subcategory.match(regexForString)) {
            return res.status(400).send({ status: false, message: "invalid subcategory type" })
        }

        if (!releasedAt.match(regexForDate)) {
            return res.status(400).send({ status: false, message: "invalid date" })
        }

        let verifyTitle = await BookModel.findOne({ title: title })
        if (verifyTitle) {
            return res.status(400).send({ status: false, message: "title already exists" })
        }

        let verifyISBN = await BookModel.findOne({ ISBN: ISBN })
        if (verifyISBN) {
            return res.status(400).send({ status: false, message: " ISBN already exists" })
        }

        if (req.decode.userId !== userId) {
            res.status(401).send({ status: false, message: "Not Authorized" })
        }

        const newBook = await BookModel.create(data)
        return res.status(201).send({ status: true, message: "book created successfully", data: newBook })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// Get book by query
const getBook = async (req, res) => {
    try {

        let query = req.query
        if (Object.keys(query).length == 0) {
            let getBook = await BookModel.find({ query, isDeleted: false })
                .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, releasedAt: 1, reviews: 1 })
                .sort({ title: 1 })
            return res.status(200).send({ status: true, message: "Book list", data: getBook })
        }
        let filter = { isDeleted: false }

        const { category, subcategory, userId } = query

        if (category) {
            let verifyCategory = await BookModel.findOne({ category: category })
            if (!verifyCategory) {
                return res
                    .status(404)
                    .send({ status: false, message: "No books in this category" })
            }
        }
        if (subcategory) {
            let verifySubCategory = await BookModel.findOne({ subcategory: subcategory })
            if (!verifySubCategory) {
                return res
                    .status(404)
                    .send({ status: false, message: "No books in this subcategory" })
            }
        }
        if (userId) {
            let verifyUserId = await BookModel.findOne({ userId: userId })
            if (!verifyUserId) {
                return res
                    .status(404)
                    .send({ status: false, message: "No books in this userId" })
            }
        }
        filter = { ...query, ...filter }
        let queryData = await BookModel.findOne({ filter })

        if (queryData.length == 0) {
            return res
                .status(404)
                .send({ status: false, message: "No books found" })
        }
        else {
            return res
                .status(200)
                .send({ status: true, message: "Book list", data: queryData })
        }
    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// Get book by param
const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "Please Enter BookId" })

        if (!validator.isValidObjectId(bookId))
        return res.status(400).send({ status: false, message: "Please enter valid object id" })

        let book = await BookModel.findOne({ _id: bookId, isDeleted: false }).lean()
        
        if (!book) return res.status(404).send({ status: false, message: "Book doesn't exists" })
        
        //Authorization
        if (req.loginUserId !== book.userId.toString()) {
            return res.status(403).send({ status: false, message: "unathorised user" })
        }

        let reviewData = await reviewModel.find({ _id: bookId, isDeleted: false })

        book.review = reviewData;
        return res.status(200).send({ status: true, data: book })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

// update by param
const updateBook = async (req, res) => {
    try{
    let body = req.body
    let bookId = req.params.bookId
    if (!bookId) return res.status(400).send({ status: false, message: "Please Enter BookId" })
    if (!validator.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please enter valid object id" })

    //destructuring body
    const { title, excerpt, releasedAt, ISBN } = body

    //checking book presence
    let checkBook = await BookModel.findOne({ _id: bookId })
        
    if (!checkBook) {
        return res.status(404).send({ status: false, message: "book not found" })
    }
    if (checkBook.isDeleted == true) {
        return res.status(404).send({ status: false, message: "book id already deleted" })
    }

    if (title && !validator.isValid(title)) {
        return res.status(400).send({ status: false, message: "title should be in valid format" })
    }
    let checkTitle = await BookModel.findOne({ title: title, isDeleted: false })
    console.log(checkTitle);
    if (checkTitle) {
        return res.status(400).send({ status: false, message: "title is already  exist" })
    }
    //excerpt validation
    if (excerpt && !validator.isValid(excerpt)) {
        return res.status(400).send({ status: false, message: "excerpt should be in valid format" })
    }
    //releasedAt validation
    if (releasedAt && !validator.isValidReleasedAt(releasedAt)) {
        return res.status(400).send({ status: false, message: "enter valid release date in YYYY-MM-DD format..." })
    }
    // ISBN validation
    if (ISBN && !validator.isValidISBN(ISBN)) {
        return res.status(400).send({ status: false, message: "enter valid ISBN number" })
    }
    let checkIsbn = await BookModel.findOne({ ISBN: ISBN, isDeleted: false })
    if (checkIsbn) {
        return res.status(400).send({ status: false, message: "ISBN is already exist" })
    }
    //storing value on obj
    let updatedKey = {}

    if (title) {
        updatedKey.title = title
    }
    if (excerpt) {
        updatedKey.excerpt = excerpt
    }
    if (releasedAt) {
        updatedKey.releasedAt = releasedAt
    }
    if (ISBN) {
        updatedKey.ISBN = ISBN
    }
    if (req.loginUserId !== checkBook.userId.toString()) {
        return res.status(403).send({ status: false, message: "unathorised user" })
    }

    let updateBook = await BookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },
        { $set: updatedKey }, { new: true })
    return res.status(200).send({ status: true, message: "Success", data: updateBook })
}
catch(error){
    return res.status(500).send({status:false, message:error.message})
}
}

// delete by param
const deleteBook = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!bookId) {
            return res.status(400).send({ status: false, message: "please provide a bookId in params" });
        }
        if (!validator.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "bookId is not matched" }); }

        let checkBookId = await BookModel.findOne({ _id: bookId, isDeleted: false })

        if (!checkBookId) {
            return res.status(404).send({ status: false, message: "no book found" });
        }
        //Authorization
        if (req.loginUserId !== checkBookId.userId.toString()) {
            return res.status(403).send({ status: false, message: "unathorised user" })
        }

        let deletedBook = await BookModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true } },
            { new: true });
        return res.status(200).send({ status: true, message: "book sucessfully deleted", deletedBook });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};



module.exports = {createBooks, getBook, updateBook, deleteBook,getBookById}




