const HouseEdge=require('./Blackjack')
const async=require('async')
const request=require('request')

const _=require('lodash')


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

// console.log(HouseEdge(...[1000,10000,{"hitSoft17":false,"surrender":"late","doubleRange":[0,21],"doubleAfterSplit":true,"resplitAces":true,"offerInsurance":false,"numberOfDecks":6,"maxSplitHands":4,"count":false,"hitSplitedAce":false,"EuropeanNoHoldCard":false,"CSM":false,"fiveDragon":false,"charlie":false,"blackjackPayout":1.5,"backBet":false,"rolling":0,"numberOfPlayer":1,"backBetRatio":0}]))

let arg=[]




async.forever(
    function(next){
        let options={
            url:'http://localhost:9000/blackjack',
            json:{}
        }
        if(!_.isEmpty(arg)){
            let result=HouseEdge(...arg)
            options={
                url:'http://localhost:9000/blackjack',
                json:{
                    avg:average(result),
                    sd:standardDeviation(result)
                }
            }
        }
        request.post(options,function(error,response,body){
            if(body==='done'){
                next(body)
            }else{
                arg=body
                next()
            }
        })
    },
    function(error){
        console.log(error)
    })







