const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const reminderSchema = new mongoose.Schema({
        userIds:[{
            type:String,
            required:true
        }],
        post:{
            type:ObjectId,
            ref:"Post",
            required:true
        },
        productId:{
            type:String,
            required:true
        }
})

mongoose.model("Reminder", reminderSchema)