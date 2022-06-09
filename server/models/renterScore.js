const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const renterScoreSchema = new mongoose.Schema({
        userId:{
            type:String,
            required:true
        },
        reviewsScore: {
            type:Number,
            default: 0
        },
        numofReviewers: {
            type:Number,
            default: 0
        },
        rentsRatio: {
            type:Number,
            default: 0
        },
        productsScore: {
            type:Number,
            default: 0
        },
        score:{
            type:Number,
            default: 0
        }
})

mongoose.model("RenterScore", renterScoreSchema)