const mongoose = require('mongoose')

const globalSchema = new mongoose.Schema({
    totalRentsAll: {
        type: Number
    },
    totalRemindersAll: {
        type: Number
    },
    totalSearchesAll: {
        type: Number
    },
    totalProductsAll: {
        type: Number
    },
    rentsHistoryDict: {
        type: mongoose.Schema.Types.Mixed
    }
})

mongoose.model("Global", globalSchema)