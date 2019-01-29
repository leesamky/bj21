global.record={}

const RunAGame=require('../Blackjack').RunAGame
const SetUp=require('../Blackjack').SetUp
const GameOptions=require('../GameOptions')
const _=require('lodash')


function average(data){
    var sum = data.reduce(function(sum, value){
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
}

function LogREKO(RC,win){

    if(record[RC]===undefined){
        record[RC]={
            win:win,
            hand:1
        }

    }else{
        record[RC].win+=win
        record[RC].hand+=1
    }
}

function LogFELT(TC,win){

    if(record[TC]===undefined){
        record[TC]={
            win:win,
            hand:1
        }

    }else{
        record[TC].win+=win
        record[TC].hand+=1
    }
}

// function recordHiLo(TC,win){
//     if(record[TC]===undefined){
//         record[TC]={
//             win:win,
//             hand:1
//         }
//
//     }else{
//         record[TC].win+=win
//         record[TC].hand+=1
//     }
//     if(TC>0){
//
//     }
// }






function saveResult(options,numTrials,handsPerTrial){
    _.forEach(record,function(obj,key){
        record[key]=[obj.win/obj.hand,100*obj.hand/(numTrials*handsPerTrial)]

    })

    let arr=[]
    _.forEach(record,function(array,index){
        arr.push([Number(index),...array])
    })

    arr=_.orderBy(arr,function(a){
        return a[0]
    },['asc'])
    for(let i=0;i<arr.length;i++){
        let tmp=arr.slice(0,i)
        let sum=tmp.reduce(function(sum,value){
            return sum+value[2]
        },0)
        arr[i].push(sum)
    }
    console.log(arr)


    const ws=wb.addWorksheet('sheet 1')


    ws.cell(1,1).string('TC')
    ws.cell(1,2).string('EV')
    ws.cell(1,3).string('ODD')
    ws.cell(1,4).string('TOTAL')


    ws.cell(1,6).string('Total hands')
    ws.cell(1,7).number(numTrials*handsPerTrial/10000)
    let line=3
    _.forEach(gameOptions,function(o,k){
        ws.cell(line,6).string(k)
        ws.cell(line,7).string(o.toString())
        line++
    })


//
    ws.cell
    for(let i=2;i<arr.length+2;i++){
        ws.cell(i,1).number(arr[i-2][0])
        ws.cell(i,2).string(arr[i-2][1].toFixed(4))
        ws.cell(i,3).string(arr[i-2][2].toFixed(4))
        ws.cell(i,4).string(arr[i-2][3].toFixed(4))

    }



    wb.write('RC.xlsx')
}

function HouseEdge(numTrials,handsPerTrial,options){
    // Holds the aggregate result from each run of X hands



    var simulationResults = [];

// Snap the time
    console.time('PlayBlackJack');

    for (var trial = 0; trial < numTrials; trial++)
    {
        var runningTotal = 0;
        var totalBet=0

        for (var i = 0; i < handsPerTrial; i++)
        {
            // Here's where you control and can evaluation different options
            let result =RunAGame(options)

            // console.log(JSON.stringify(result,null,2))
            // LogPair(RC,result.win,result.players[0].playerHands[0][0].cards[0],result.dealer[0])
            // LogPair(result)
            LogFELT((result.RC),result.win)

            runningTotal += result.win;
            totalBet+=result.totalBet

        }

        simulationResults.push((((100 * runningTotal) ) / (totalBet)/(options.numberOfPlayer)));
    }
// console.log(simulationResults)
// Calculate stddev and average
    console.timeEnd('PlayBlackJack');
    // console.log(simulationResults)

    console.log("Average:" + average(simulationResults) + "%");
    // console.log("StdDev:" + standardDeviation(simulationResults) + "%");
    return simulationResults




}

let numTrials=50000
let handsPerTrial=10000
let OPTIONS={
    hitSoft17: false,
    surrender: 'early10',
    doubleRange:[9,11],
    doubleAfterSplit:true,
    resplitAces: false,
    offerInsurance: true,
    numberOfDecks: 8,
    maxSplitHands: 4,
    count: {system:'HiLo',trueCount:0,RC:0},
    // count:false,
    hitSplitedAce:false,
    EuropeanNoHoldCard:true,
    CSM:false,
    fiveDragon:false,//no yet
    charlie:false,
    blackjackPayout:1.5,
    backBet:false,
    rolling:0.01,
    numberOfPlayer:1,
    backBetRatio:0,
    adjust:true,
    cutCard:200,
    spread:false,
    betAmount:[10],
    BJpush21:false
}
OPTIONS.cutCard=Math.max(OPTIONS.cutCard,OPTIONS.numberOfPlayer*10)
if(OPTIONS.betAmount.length<OPTIONS.numberOfPlayer){
    let bet=[]
    for(let i=0;i<OPTIONS.numberOfPlayer;i++){
        bet.push(OPTIONS.betAmount[0])
    }
    OPTIONS.betAmount=bet
}
const gameOptions=GameOptions(OPTIONS)
console.log(gameOptions)
SetUp(OPTIONS)
console.log(numTrials*handsPerTrial/10000)
//
console.log(average(HouseEdge(numTrials,handsPerTrial,gameOptions)))
// console.log(record)
_.forEach(record,function(o,k){
    record[k]=[o.win/o.hand*100/OPTIONS.betAmount[0],o.hand*100/(numTrials*handsPerTrial)]
})
console.log(record)
