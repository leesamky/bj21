const mongoose=require('mongoose')
const Schema=mongoose.Schema
mongoose.Promise=global.Promise
mongoose.connect('mongodb://localhost/blackjack',{
    useMongoClient:true
})

const blackjackSchema=Schema({
    options:{
        type:String,
        index:true ,
        required:true
    },
    result:{
        type:Array,
        required:true
    },
    hand:{
        type:Number,
        required:true
    }
})

module.exports.blackjack=mongoose.model('blackjack',blackjackSchema)
