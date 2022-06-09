const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const searchSchema = new mongoose.Schema({
        userId:{
            type:String
        },
        productName:{
            type:String
        }
})

mongoose.model("Search", searchSchema)