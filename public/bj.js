
const express=require('express')
const _=require('lodash')
const app=express()
const fs=require('fs')
const GameOptions=require('../GameOptions')
const numTrials=1000
const handsPerTrial=10000
const MakeGameOptions=require('../makeGameOptions')

function standardDeviation(values){
    var avg = average(values);

    var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function average(data){
    var sum = data.reduce(function(sum, value){
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
}

const target=50000000// 1yi
const args=MakeGameOptions(numTrials,handsPerTrial)
let results=[]
try{
     results=fs.readFileSync('results.txt',{encoding:'utf-8'})
}catch(e){
     results=[]
}



let arg=args.pop()

let argArr=[]
const round=(target/numTrials/handsPerTrial)

for(let i=0;i<round;i++){
    argArr.push(arg)
}
console.log(argArr.length)

let avg=[]
let sd=[]
//args are set of arg to do, when arg is over, then pop args
app.post('/',function(req,res){
    if(_.isEmpty(req.body)){
        res.send(arg)
    }else{
        avg.push(req.body.avg)
        sd.push(req.body.sd)
        if(argArr.length){
            console.log(`${argArr.length} remaining in argArr`)

            res.send(argArr.pop())
        }
        else{
            results.push({
                avg:average(avg),
                sd:standardDeviation(sd),
                options:arg[2],
                hands:target/10000
            })
            fs.writeFileSync('results.txt',JSON.stringify(results,null,2),{encoding:'utf-8'})
            console.log('write to disk')
            if(args.length){
                console.log(`remaining args: ${args.length}`)
                arg=args.pop()
                for(let i=0;i<round;i++){
                    argArr.push(arg)
                }
                res.send(argArr.pop())
            }else{
                console.log('done')
                res.send('done')
            }


        }
    }

})


app.get('/',function(req,res){
    res.send(arg)
})


// const result={}
// const avg=[]
// const target=1000000000
// app.post('/',function(req,res){
//     if(avg.length<target/req.body.hand){
//         console.log(avg.length)
//         avg.push(average(req.body.result))
//         result[req.body.options]=avg
//         fs.writeFileSync('result.txt',JSON.stringify(result,null,2))
//         res.send('continue')
//     }else{
//         avg.push(average(req.body.result))
//         result[req.body.options]=avg
//         fs.writeFileSync('result.txt',JSON.stringify(result,null,2))
//         console.log(average(avg).toString())
//         res.send(average(avg).toString())
//     }
//
// })

module.exports=app