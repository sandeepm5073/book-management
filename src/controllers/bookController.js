const { default: mongoose } = require("mongoose")
const { object } = require("webidl-conversions")
const BookModel = require("../models/bookModel")






const getBook = async (req, res) => {
      let query = req.query
      let filter = { idDeleted: false }
      const { userId, category, subCategory } = query

      if (Object.keys(query).length === 0) {
            let getBook = await BookModel.find({ query, isDeleted: false })
                  .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
                  .sort({ title: 1 })
            return res.status(200).send({ status: true, message: "Book list", data: getBook })
      }
      if(query.userId){
            if(!mongoose.Schema.Types.ObjectId(userId)){
            return res.status(400).send({ status: false, message: "Invalid userId in param"})
            }
      }
      if(userId){
            filter.userId = userId
      }
      if(category){
            filter.category = category
      }
      if(subCategory){
            filter.subCategory = subCategory
      }

      let filterBook = await BookModel.find({filter})
      .select({_id: 1, title: 1, excerpt: 1, userId: 1, category: 1, subcategory: 1, reviews: 1, releasedAt: 1})
      .sort({title:1})

      if(filterBook.length === 0){
            return res.status(404).send({ status: false, message: "No data found" })
      }
      return res.status(200).send({status:true, message:"Book list", data:filterBook})
}
// _id, title, excerpt, userId, category, releasedAt, reviews field.