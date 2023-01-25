const reviewModel = require("../models/reviewModel")
const BookModel = require("../models/bookModel")
const {isValidObjectId} = require("../Validations/Validator")

const createReview = async function(req,res){
    let reviewData = req.body
    let bookId = req.params.bookId
    if(!isValidObjectId(bookId)) return res.status(400).send({status: false, msg: "BookId is not valid"})

    let checkBookId = await BookModel.findOne({ _id: bookId, isDeleted: false })

    if (!checkBookId) {
        return res.status(404).send({ status: false, message: "Book Not Found" });
    }
    // if (req.loginUserId !== checkBookId.userId.toString()) {
    //     return res.status(403).send({ status: false, message: "Unauthorized User" })
    // }
    let savedData = await reviewModel.create(reviewData)

    // let reviewDetails = await reviewModel.find().select({review: 1, rating: 1, })

    let updatedBooks = await BookModel.findOneAndUpdate({_id: bookId}, {$inc: {reviews: +1}},{new:true}).lean()
    if(!updatedBooks) return res.status(400).send({status: false, msg: "Book Not Found"})

    return res.status(201).send({status: true, data: savedData})
}

module.exports = {createReview}