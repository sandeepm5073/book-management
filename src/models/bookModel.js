const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
      title:{
            type:String,
            required:true,
            unique:true
      },
      excerpt:{
            type:String,
            required:true
      },
      userId:{
            type:objectId,
            ref:"userModel"
      },
      ISBN:{
            type:String,
            required:true,
            unique:true
      },
      category:{
            type:String,
            required:true
      },
      subCategory:{
            type:String,
            required:true
      },
      reviews:{
            type:Number,
            default:0
      },
      isDeletedAt:{
            type:Date
      },
      isDeleted:{
            type:Boolean,
            default:false
      },
      releasedAt:{
            type:Date,
            required:true
      },

},{timestamps:true})

module.exports = mongoose.model("bookModel", bookSchema)