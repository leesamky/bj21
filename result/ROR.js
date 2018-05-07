const RunAGame=require('../Blackjack').RunAGame
const SetUp=require('../Blackjack').SetUp
const GameOptions=require('../GameOptions')
const average=require('./average')
const standardDeviation=require('./standardDeviation')

function ROR(rounds,bankroll,options){

    const target=bankroll*2
    // console.log(target)
    // console.log(RC)
    const results={
        win:0,
        lose:0,
        hands:[]
    }

    for(let round=0;round<rounds;round++){
        SetUp(options)
        let bankRoll=bankroll
        let hand=0
        while((bankRoll<=target)&&(bankRoll>0)){
            let result=RunAGame(options)
            // LogREKO(result.RC,result.win)
            bankRoll+=result.win
            hand+=options.numberOfPlayer
            // console.log(bankRoll)
        }
        if(bankRoll<=0){
            results.lose+=1

        }else{
            results.win+=1
        }
        results.hands.push(hand)
        // console.log(results)

    }
    results.win=results.win/rounds
    results.lose=results.lose/rounds
    results.hands=average(results.hands)
    console.log(results)
}

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
    rolling:0.01,
    numberOfPlayer:4,
    backBetRatio:0,
    adjust:true,
    cutCard:100,
    spread:true,
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
//
ROR(30000,10000,gameOptions)