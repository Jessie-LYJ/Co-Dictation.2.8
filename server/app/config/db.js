const mongoose = require('mongoose')
const mongoUrl = 'mongodb://localhost:27017/codictation'
mongoose.set('useFindAndModify', false)

// 'mongodb+srv://admin:co-dictation@projectcluster.cv0jt.mongodb.net/codictation?retryWrites=true&w=majority'
// 'mongodb://localhost:27017/codictation'

module.exports = app =>{
mongoose.connect(mongoUrl,{useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log('mongodb connect')
})

}

