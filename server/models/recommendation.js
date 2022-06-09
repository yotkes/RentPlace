const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const recommendationSchema = new mongoose.Schema({
        userId:{
            type:String
        },
        interestsScore: mongoose.Schema.Types.Mixed,
        searchesScore: mongoose.Schema.Types.Mixed,
        rentHistoryScore: mongoose.Schema.Types.Mixed,
        rentsofOthersScore: mongoose.Schema.Types.Mixed
})

mongoose.model("Recommendation", recommendationSchema)