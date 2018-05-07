const RunAGame=require('../Blackjack').RunAGame
const SetUp=require('../Blackjack').SetUp
const GameOptions=require('../GameOptions')


function average(data){
    var sum = data.reduce(function(sum, value){
        return sum + value;
    }, 0);

    var avg = sum / data.length;
    return avg;
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
            // LogREKO(result.RC,result.win)

            runningTotal += result.win;
            totalBet+=result.totalBet

        }

        simulationResults.push((((100 * runningTotal) ) / (totalBet)/(options.numberOfPlayer)));
    }
// console.log(simulationResults)
// Calculate stddev and average
    console.timeEnd('PlayBlackJack');
    // console.log(simulationResults)
    return simulationResults
    console.log("Average:" + average(simulationResults) + "%");
    console.log("StdDev:" + standardDeviation(simulationResults) + "%");




}

let numTrials=300
let handsPerTrial=10000
let OPTIONS={
    hitSoft17: false,
    surrender: 'early10',
    doubleRange:[9,11],
    doubleAfterSplit:true,
    resplitAces: false,
    offerInsurance: true,
    numberOfDecks: 6,
    maxSplitHands: 3,
    count: {system:'REKO',trueCount:0,RC:0},
    // count:false,
    hitSplitedAce:false,
    EuropeanNoHoldCard:true,
    CSM:false,
    fiveDragon:false,//no yet
    charlie:false,
    blackjackPayout:1.5,
    backBet:false,
    rolling:0,
    numberOfPlayer:1,
    backBetRatio:0,
    adjust:true,
    cutCard:120,
    spread:false,
    betAmount:[10]
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