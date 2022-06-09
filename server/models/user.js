const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        phone:{
            type:String
        },
        interests: mongoose.Schema.Types.Mixed,
        resetToken:String,
        expireToken:Date,
        cart:[{type:ObjectId,ref:"Post"}],
        photo:{
            type:String,
            default:"https://res.cloudinary.com/dxgyy6a6u/image/upload/v1652357179/defaultAvatar_bkjss3.png"
        },
        renterScore: {
            type:Number,
            default: 0
        },
        totalRents: {
            type:Number,
            default: 0
        },
        totalSearches: {
            type:Number,
            default: 0
        },
        numOfProducts: {
            type:Number,
            default: 0 
        }
        
})

mongoose.model("User", userSchema)