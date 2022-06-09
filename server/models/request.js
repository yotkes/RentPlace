const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const requestSchema = new mongoose.Schema({
        productName:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        subcategory:{
            type:String,
            required:true
        },
        numOfRequests:{
            type:Number,
            required:true
        }

})

mongoose.model("Request", requestSchema)