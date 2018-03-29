const blackjack=require('./bj')
module.exports=function(app){
    app.use('/blackjack',blackjack)
}