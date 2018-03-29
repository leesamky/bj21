const express=require('express')
const app=express()
const PORT=9000
const path=require('path')
const bodyParser=require('body-parser')
const cors=require('cors')
const router=require('./public/router')


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

router(app)
app.all('/*',function(req,res){
    res.sendFile(path.join(__dirname,'public/index.html'))
})

app.listen(PORT,function(){
    console.log('Server is listening on PORT '+PORT)
})