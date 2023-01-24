const { isValidObjectId } = require("mongoose")
const BookModel = require("../models/bookModel")
const UserModel = require("../models/userModel") 
const validator = require("../Validations/Validator");
const reviewModel = require("../models/reviewModel")



let regexForString=/^[\w ]+$/

let regexForIsbn=/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

let regexForDate=/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/




const createBooks=async function(req,res){
    try{
    let data=req.body
    const {title,excerpt,userId,ISBN ,category,subcategory,releasedAt}=data
    if(data.length==0){
        return res.status(400).send({status:false,msg:"please give some data to create a book"})
    }
    if(!title){
        return res.status(400).send({status:false,msg:"title is mandatory"})
    }
    if(!excerpt){
        return res.status(400).send({status:false,msg:"excerpt is mandatory"})
    }
    if(!userId){
        return res.status(400).send({status:false,msg:"userId is mandatory"})
    }
    if(!ISBN){
        return res.status(400).send({status:false,msg:"ISBN is mandatory"})
    }
    if(!category){
        return res.status(400).send({status:false,msg:"category is mandatory"})
    }
    if(!subcategory){
        return res.status(400).send({status:false,msg:"subcategory is mandatory"})
    }

    if(!releasedAt){
        return res.status(400).send({status:false,msg:"releasedAt is mandatory"})
    }


    if(!excerpt.match(regexForString)){
        return res.status(400).send({status:false,msg:"invalid excerpt"})
    }

    if(!isValidObjectId(userId)){
    return res.status(400).send({status :false , msg: "Enter Valid user Id" })
    }

    if(!ISBN.match(regexForIsbn)){
        return res.status(400).send({status:false,msg:"invalid ISBN"})
    }

    if(!category.match(regexForString)){
        return res.status(400).send({status:false,msg:"invalid category type"})
    }
    
    if(!subcategory.match(regexForString)){
        return res.status(400).send({status:false,msg:"invalid subcategory type"})
    }

    if(!releasedAt.match(regexForDate)){
        return res.status(400).send({status:false,msg:"invalid date"})
    }

     let verifyTitle=await BookModel.findOne({title:title})
    if(verifyTitle){
        return res.status(400).send({status:false,msg:"title already exists"})
    }

    let verifyISBN=await BookModel.findOne({ISBN:ISBN})
    if(verifyISBN){
        return res.status(400).send({status:false,msg:" ISBN already exists"})
    }

    if (req.decode.userId !== userId ) {
        res.status(401).send({ status: false, msg: "Not Authorized" })
    }

    const newBook=await BookModel.create(data)
    return res.status(201).send({status:true,msg:"book created successfully",data:newBook})
}
catch(error){
return res.status(500).send({status:false,msg:error.message})
}
}



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
    return res.status(500).send({status:false, message:error.message})
}
}

const getBookById = async function(req,res){
try {
    let bookId = req.params.bookId
    if(!bookId) return res.status(400).send({status:false , msg:"Please Enter BookId"})
    if(!isValidObjectId(bookId)) return res.status(400).send({status: false, msg: "Please enter valid object id"})

    let book = await BookModel.findOne({_id:bookId ,isDeleted:false}).lean()
    if (!book) return res.status(404).send({status:false,msg:"Book doesn't exists"})

    let reviewData = await reviewModel.find({_id: bookId, isDeleted:false})
    
    book.review = reviewData;
    return res.status(200).send({status: true, data: book})

} catch (error) {
     return res.status(500).send({status: false , msg : error.message})  
   } 

}


module.exports = {createBooks, getBook, getBookById}






