const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const rentHistorySchema = new mongoose.Schema({
        renterId:{
            type:String,
            required:true
        },
        renteeId:{
            type:String,
            required:true
        },
        productName: {
            type:String,
            required:true
        },
        subcategory: {
            type:String,
            required:true
        }
})

mongoose.model("RentHistory", rentHistorySchema)