const { default: mongoose } = require("mongoose")
const { object } = require("webidl-conversions")
const BookModel = require("../models/bookModel")
const UserModel = require("../Models/UserModel")




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

     let verifyTitle=await BookModel.findOne({title:title})
    if(verifyTitle){
        return res.status(400).send({status:false,msg:"title already exists"})
    }

    let verifyISBN=await BookModel.findOne({ISBN:ISBN})
    if(verifyISBN){
        return res.status(400).send({status:false,msg:" ISBN already exists"})
    }
    const newBook=await BookModel.create(data)
    return res.status(201).send({status:true,msg:"book created successfully",data:newBook})
}
catch(error){
return res.status(500).send({status:false,msg:error.message})
}
}



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

module.exports.createBooks=createBooks

module.exports.getBook=getBook
