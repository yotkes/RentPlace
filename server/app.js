const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5100
const {MONGOURI} = require('./keys')
const ejs = require('ejs')
const cloudinary = require('cloudinary')


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection.on('connected',()=>{
    console.log("connected to MongoDB !")
})

mongoose.connection.on('error',(err)=>{
    console.log("error connecting to MongoDB !",err)
})

require('./models/user')
require('./models/post')
require('./models/product')
require('./models/recommendation')
require('./models/reminder')
require('./models/renterScore')
require('./models/rentHistory')
require('./models/request')
require('./models/search')
require('./models/subcategory')
require('./models/global')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.set('view engine', 'ejs')

const { initSubCategory } = require('./routes/init')
const { initGlobal } = require('./routes/init')
const {categories} = require('../client/src/globals')
const SubCategory = mongoose.model("SubCategory");

cloudinary.config({ 
    cloud_name: 'dxgyy6a6u', 
    api_key: '644619933481987', 
    api_secret: 'ZexmXKJVpxzhJrAkbSsZ6bHn-Bs' 
  });

SubCategory.deleteMany({})
initSubCategory(categories)
initGlobal()


app.listen(PORT,()=> {
    console.log("server is running on", PORT)
})




