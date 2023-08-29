
//import the mongoose inside db.js
const mongoose = require('mongoose')

//using mongoose define a connection string   [here not scscept call back so removed-,()=>{console log('connection succesul');})]
mongoose.connect('mongodb://localhost:27017/bank')


// //create model for project  [collection-model,is same]

const User = mongoose.model('User', {
    username: String,
    acno: Number,
    password: String,
    balance: Number,
    transaction: []
})

// //export model
module.exports = {
    User
}