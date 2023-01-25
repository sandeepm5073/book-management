const reviewModel = require("../models/reviewModel")
const BookModel = require("../models/bookModel")
const {isValidObjectId} = require("../Validations/Validator")

const createReview = async function(req,res){
    let reviewData = req.body
    let bookId = req.params.bookId
    if(!isValidObjectId(bookId)) return res.status(400).send({status: false, msg: "BookId is not valid"})

    let checkBookId = await BookModel.findOne({ bookId, isDeleted: false })

    if (!checkBookId) {
        return res.status(404).send({ status: false, message: "Book Not Found" });
    }
    reviewData.bookId = checkBookId._id
    let savedData = await reviewModel.create(reviewData)

    let domy = await reviewModel.findOne({_id:savedData._id})
    
   
    let updatedBooks = await BookModel.findOneAndUpdate({_id: bookId}, {$inc: {reviews: +1}},{new:true}).lean()
    if(!updatedBooks) return res.status(400).send({status: false, msg: "Book Not Found"})

    let temp = checkBookId._doc
    temp.reviewsData = savedData

//     let WithReview = updatedBooks;
//     WithReview["reviewsData"] = domy

    return res.status(201).send({status: true, data: WithReview})
}

module.exports = {createReview}