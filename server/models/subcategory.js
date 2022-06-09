const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const subCategorySchema = new mongoose.Schema({
        name:{
            type:String
        },
        category:{
           type:String 
        }
})

mongoose.model("SubCategory", subCategorySchema)