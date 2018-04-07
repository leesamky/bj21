const strategy=require('./Suggestions')
const shuffle=require('knuth-shuffle').knuthShuffle
const fs=require('fs')
const _=require('lodash')
const GameOptions=require('./GameOptions')
const BackPlayer=require('./Back_player')

var deck=[]
var CSMDeck=[]
var RC=0

function TakeInsurance(options){
    if(options.offerInsurance){
        if(options.count!==undefined){
            if(_.includes(options.count.system,'HiLo')){
                let TC=RC/(deck.length/52)
                if(TC>=3){
                    return true
                }
            }else if(_.includes(options.count.system,'REKO')){
                if((options.numberOfDecks===6)&&(RC>=3)){
                    return true
                }else if((options.numberOfDecks===8)&&(RC>=4)){
                    return true
                }
            }
            else if(_.includes(options.count.system,'FELT')){
                let TC=RC/(deck.length/52)
                if(TC>=6){
                    return true
                }
            }


        }
    }
    return false
}


function Shuffle(options){
    if(options.count!==undefined){
        if(_.includes(options.count.system,'REKO')){
            if(options.numberOfDecks===1){
                RC=-1
            }else if(options.numberOfDecks===2){
                RC=-5
            }else if(options.numberOfDecks===4){
                RC=-12
            }else if(options.numberOfDecks===6){
                RC=-20
            }else if(options.numberOfDecks===8){
                RC=-27
            }
        }else{
            RC=0
        }
    }

    deck=_.shuffle(CSMDeck)
}
var initialBet=100

const record={}
function saveRecord(dealer,player,result,trueCount){
    if(record[[dealer,player]]===undefined){
        record[[dealer,player]]={}
    }else{
        if(record[[dealer,player]][trueCount]===undefined){
            record[[dealer,player]][trueCount]={
                result:result,
                hand:1
            }
        }else{
            record[[dealer,player]][trueCount].result+=result
            record[[dealer,player]][trueCount].hand+=1

        }
    }
}




function Log(text){
    if(verboseLog){
        console.log(text+'\n')
    }
}

const HandTotal=require('./Points')


function DealCard(options,show=true){
    let card=deck.pop()
    if(show){
        if(options.count){
            if(_.includes(options.count.system,'HiLo')){
                if((card>=2)&&(card<=6)){
                    RC++
                }else if((card===1)||(card===10)){
                    RC--
                }
            }else if(_.includes(options.count.system,'REKO')){
                if((card>=2)&&(card<=7)){
                    RC++
                }else if((card===1)||(card===10)){
                    RC--
                }
            }
            else if(_.includes(options.count.system,'FELT')){
                if((card>=3)&&(card<=6)){
                    RC+=2
                }else if((card===1)||(card===10)){
                    RC-=2
                }else if((card===2)||(card===7)){
                    RC++
                }
            }
        }

    }

    return card
}

function AddRC(card,options){
    if(options.count){
        if(_.includes(options.count.system,'HiLo')){
            if((card>=2)&&(card<=6)){
                RC++
            }else if((card===1)||(card===10)){
                RC--
            }
        }else if(_.includes(options.count.system,'REKO')){
            if((card>=2)&&(card<=7)){
                RC++
            }else if((card===1)||(card===10)){
                RC--
            }
        }
        else if(_.includes(options.count.system,'FELT')){
            if((card>=3)&&(card<=6)){
                RC+=2
            }else if((card===1)||(card===10)){
                RC-=2
            }else if((card===2)||(card===7)){
                RC++
            }
        }
    }
}

function PrintHand(cards){
    let text=""
    for (let i=0;i<cards.length-1;i++){
        text+=`${cards[i]}, `
    }
    text+=`${cards[cards.length-1]}`

    return text
}

function InitializeDeck(options){
    // console.log('decks:',options.count)
    deck=[]
    const cards=[1,2,3,4,5,6,7,8,9,10,10,10,10]
    for(let i=0;i<options.numberOfDecks;i++){
        for(let j=0;j<4;j++){
            deck.push(...cards)
        }
    }
    shuffle(deck)
    if(options.count!==undefined){
        if(_.includes(options.count.system,'REKO')){

            if(options.numberOfDecks===1){
                RC=-1
            }
            else if(options.numberOfDecks===2){
                RC=-5
            }
            else if(options.numberOfDecks===4){
                RC=-12
            }
            else if(options.numberOfDecks===6){
                RC=-20
            }else if(options.numberOfDecks===8){
                RC=-27
            }
        }else{
            RC=0
        }
    }



}

function PlayDealerHand(dealerCards,options){
    let dealerTotal=HandTotal(dealerCards)

    while((dealerTotal.total<17)||((dealerTotal.total===17)&& (dealerTotal.soft) &&(options.hitSoft17))){
        dealerCards.push(DealCard(options))
        dealerTotal=HandTotal(dealerCards)
    }
    return dealerTotal
}

function PlayPlayerHand(playerCards,dealerCard,handCount,dealerCheckedBlackJack,dealerHasBlackJack,options){//function (playerCards,dealerCard,handCount,dealerCheckedBlackJack,dealerHasBlackJack,options)

    let suggestion=''
    while(true){
        suggestion=strategy(playerCards,dealerCard,handCount,dealerCheckedBlackJack,dealerHasBlackJack,options)
        // console.log(suggestion)

        switch(suggestion){
            case 'split':
                return 'split'
                break;

            case 'stand':
                return 'stand'
                break;

            case 'surrender':
                return 'surrender'
                break;

            case 'double':
                playerCards.push(DealCard(options))
                return 'double'
                break

            case 'hit':
                playerCards.push(DealCard(options))
                Log('hit the hand. The player hands now is '+playerCards+ ' player total:'+HandTotal(playerCards).total)
                if(HandTotal(playerCards).total>21){
                    return 'bust'
                }

                break;
            default:
                throw Error('unknown stretegy'+suggestion)
                break;
        }
    }
}

function PlayThePlayer(playerHand,dealerCard,options){

    let status

    for(let handCount=0;handCount<playerHand.length;handCount++){
        if(playerHand[handCount].splitAce){
            if(!options.hitSplitedAce){//splited ace only allow two cards
                if(!options.resplitAces||(playerHand[handCount].cards[0]!==playerHand[handCount].cards[1])){
                    Log('One card drawn to a split ace')
                    Log(`Player cards: ${PrintHand(playerHand[handCount].cards)} - dealer card: ${dealerCard} `)
                    continue
                }
                if(playerHand.length===options.maxSplitHands){
                    Log('You reached the max number of hands with those aces')
                    continue
                }
            }else{

                if(playerHand.length===options.maxSplitHands){
                    Log('You reached the max number of hands with those aces, hit on [A,A]')
                    playerHand[handCount].cards.push(DealCard(options))
                }
            }



        }

        status=PlayPlayerHand(playerHand[handCount].cards,dealerCard,playerHand.length,true,false,options)
        if(status==='split'){
            Log(`Player cards: ${PrintHand(playerHand[handCount].cards)} - dealer card: ${dealerCard} - ${status}`)

            // const hand={bet:initialBet,cards:[]}
            const hand={actingBet:playerHand[handCount].actingBet,backBet:0,cards:[]}

            if(playerHand[handCount].cards[0]===1){
                playerHand[handCount].splitAce=true
                hand.splitAce=true
            }
            if(options.backBet){
                if(BackPlayer(playerHand[handCount].cards,dealerCard,playerHand.length,true,false,options)){
                    hand.backBet=hand.actingBet*options.backBetRatio
                }
            }
            hand.cards.push(playerHand[handCount].cards.pop())
            hand.cards.push(DealCard(options))
            playerHand[handCount].cards.push(DealCard(options))
            playerHand.push(hand)

            //redo this hand in case continue to hit
            handCount--
            continue
        }
        else if(status==='double'){
            playerHand[handCount].actingBet=playerHand[handCount].actingBet*2
            playerHand[handCount].backBet=playerHand[handCount].backBet*2
        }
        else if(status==='surrender'){
            playerHand[handCount].surrender=true
        }

        //Log the status, for debugging
        Log(`Player cards: ${PrintHand(playerHand[handCount].cards)} - dealer card: ${dealerCard} - ${status}`)
    }
}

function EvaluateHand(playerHand, dealerCards, options){
    let hand
    let win=0
    let playerBlackjack=(playerHand.length===1)&&(playerHand[0].cards.length===2)&&(HandTotal(playerHand[0].cards).total===21)
    let dealerBlackjack=(dealerCards.length===2)&&(HandTotal(dealerCards).total===21)

    Log(`Dealer hand: ${PrintHand(dealerCards)}`)


    for(hand=0;hand<playerHand.length;hand++){
        if(playerHand[hand].insurance){
            if(dealerBlackjack){
                win+=playerHand[hand].insurance*2
                Log('insurance won')
            }else{
                win-=playerHand[hand].insurance
                Log('insurance lost')
            }
        }
        if(playerHand[hand].surrender){
            // win-=(playerHand[hand].bet/2)
            win-=(playerHand[hand].actingBet+playerHand[hand].backBet)/2
            if(options.rolling){
                win+=options.rolling*(playerHand[hand].actingBet+playerHand[hand].backBet)/2
            }
            Log('surrender')
        }else{
            let playerTotal=HandTotal(playerHand[hand].cards).total
            let dealerTotal=HandTotal(dealerCards).total
            Log(`playerTotal: ${playerTotal}, dealerTotal: ${dealerTotal}, dealerCards:${dealerCards}`)

            if(playerBlackjack){
                if(dealerBlackjack){
                    Log('Player and Dealer have black - push')
                }
                else{
                    Log('Player won by BlackJack')

                    win+=(playerHand[hand].actingBet+playerHand[hand].backBet)*options.blackjackPayout
                }
            }
            else if(dealerBlackjack){//assume dealer bj take split and double
                Log('Dealer has blackjack - you lost all the bet including split and double')
                win-=(playerHand[hand].actingBet+playerHand[hand].backBet)
                if(options.rolling){
                    win+=options.rolling*(playerHand[hand].actingBet+playerHand[hand].backBet)
                }
            }
            else if(playerTotal>21){//player bust
                Log('player bust')
                win-=(playerHand[hand].actingBet+playerHand[hand].backBet)
                if(options.rolling){
                    win+=options.rolling*(playerHand[hand].actingBet+playerHand[hand].backBet)
                }
            }
            else if(dealerTotal>21){
                Log('dealer bust')
                win+=(playerHand[hand].actingBet+playerHand[hand].backBet)
            }
            else if(dealerTotal>playerTotal){
                Log('dealer point higher than player - player lost')
                win-=(playerHand[hand].actingBet+playerHand[hand].backBet)
                if(options.rolling){
                    win+=options.rolling*(playerHand[hand].actingBet+playerHand[hand].backBet)
                }
            }
            else if(dealerTotal<playerTotal){
                Log('player points higher than dealer - player win')
                win+=(playerHand[hand].actingBet+playerHand[hand].backBet)
            }
            else if(dealerTotal===playerTotal){
                Log('Game push')
            }
        }

    }
    Log('Total outcome $'+win)
    return win
}

function RunAGame(options){


    let betAmount=[initialBet]//config the bet
    // console.log(betAmount)
    if(betAmount.length<options.numberOfPlayer){
        betAmount=[]
        for(let player=0;player<options.numberOfPlayer;player++){
            betAmount.push(initialBet)
        }
    }// if player more than one then put every one same bet as default

    let trueCount=0
    

    //check if we need to reshuffle

    if(options.CSM){
        Shuffle(options)
        Log('Shuffle')
        Log('first ten cards in the deck:',deck.slice(0,10),deck.length)
    }else{
        if(deck.length<options.cutCard){//was 13
            Log(deck.length)
            Log('Shuffle')
            Shuffle(options)
        }
    }


    //If using counting system, set up here
    if(options.count) {
        trueCount = RC / (deck.length / 52)
        options.count.trueCount = trueCount
        options.count.RC=RC
        Log(`True Count: ${trueCount.toFixed(2)}`)
        Log(`RC: ${RC}`)

    }
    //
    //
    //     //betting system set here
    //     if(trueCount>=4){
    //         betAmount*=4
    //     }else if(trueCount>=2){
    //         betAmount*=2
    //     }else if(trueCount<=3){
    //         betAmount/=2
    //     }
    // }


    if(options.EuropeanNoHoldCard){
        const obj={

            players:[]

        }
        if(options.count){
            obj.TC=RC / (deck.length / 52)
            obj.RC=RC
        }
        if(!options.CSM){
            obj.cardsLeft=deck.length
        }

        const dealerCards=[]

        dealerCards.push(DealCard(options))//only one card

        obj.dealer=dealerCards
        const players=[]



        // let dealerBlackjack=(HandTotal(dealerCards).total===21)

        let dealerNeedContinue=false

        for(let player=0;player<options.numberOfPlayer;player++){
            const playerHand=[]
            const hand={actingBet:betAmount[player],backBet:betAmount[player]*options.backBetRatio,cards:[]}
            hand.cards.push(DealCard(options))
            hand.cards.push(DealCard(options))

            playerHand.push(hand)
            players.push(playerHand)
        }

        for(let player=0;player<options.numberOfPlayer;player++){
            const playerObj={
                playerHands:[]
            }
            const playerHand=players[player]

            if(options.count){
                let TC=(RC / (deck.length / 52)).toFixed(4)
                playerObj.TC=TC
                playerObj.RC=RC
                options.count.trueCount=TC
                options.count.RC=RC
            }

            let playerBlackjack=(playerHand.length===1)&&(playerHand[0].cards.length===2)&&(HandTotal(playerHand[0].cards).total===21)



            Log(`inital two player cards:   -player ${playerHand[0].cards}, -dealer one card ${dealerCards} `)
            if(dealerCards[0]===1&&!playerBlackjack){
                if(options.offerInsurance){
                    if(TakeInsurance(options)){
                        playerHand[0].insurance=(playerHand[0].actingBet+playerHand[0].backBet)/2
                        Log('place insurance')
                    }

                }
            }


            let bust=true
            PlayThePlayer(playerHand,dealerCards[0],options)
            players[player]=playerHand
            playerObj.playerHands.push(playerHand)

            for(let hand=0;hand<playerHand.length;hand++){

                if(playerHand[hand].insurance||((HandTotal(playerHand[hand].cards).total<=21)&&(!playerHand[hand].surrender))){
                    bust=false
                }
            }
            if(bust){
                Log(`The ${player+1} all  hands bust`)
            }else{
                dealerNeedContinue=true
            }
            obj.players.push(playerObj)

        }

        if(dealerNeedContinue){
            dealerCards.push(DealCard(options))//deal another card
            PlayDealerHand(dealerCards,options)
            obj.dealer=dealerCards

        }
        let win=0

        for(let player=0;player<options.numberOfPlayer;player++){
            let gain=EvaluateHand(players[player],dealerCards,options)
            obj.players[player].win=gain
            win+=gain
        }
        obj.win=win
        // console.log(JSON.stringify(obj,null,2))
        return obj











    }else{
        //the order needs to be observed
        const obj={

            players:[]

        }
        if(options.count){
            obj.TC=RC / (deck.length / 52)
            obj.RC=RC
        }
        Log(JSON.stringify(obj,null,2))
        if(!options.CSM){
            obj.cardsLeft=deck.length
        }
        const dealerCards=[]
        dealerCards.push(DealCard(options))

        dealerCards.push(DealCard(options,false))

        //
        obj.dealer=dealerCards

        let dealerBlackjack=(dealerCards.length===2)&&(HandTotal(dealerCards).total===21)
        const players=[]

        let dealerNeedContinue=false

        for(let player=0;player<options.numberOfPlayer;player++){
            const playerHand=[]
            const hand={actingBet:betAmount[player],backBet:betAmount[player]*options.backBetRatio,cards:[]}
            hand.cards.push(DealCard(options))
            hand.cards.push(DealCard(options))

            playerHand.push(hand)
            players.push(playerHand)
        }




        for(let player=0;player<options.numberOfPlayer;player++){
            //
            const playerObj={
                playerHands:[]
            }
            const playerHand=players[player]


            if(options.count){

                let TC=(RC / (deck.length / 52)).toFixed(4)
                playerObj.TC=TC
                playerObj.RC=RC
                options.count.trueCount=TC
                options.count.RC=RC
            }

            let playerBlackjack=(playerHand.length===1)&&(playerHand[0].cards.length===2)&&(HandTotal(playerHand[0].cards).total===21)

            Log(`inital two cards:   -player ${playerHand[0].cards}, -dealer ${dealerCards} `)
            if(dealerCards[0]===1&&!playerBlackjack){//insurance
                if(TakeInsurance(options)){
                    playerHand[0].insurance=(playerHand[0].actingBet+playerHand[0].backBet)/2
                    Log('place insurance')
                }

            }

            let bust=true
            if(!playerBlackjack&&!dealerBlackjack){
                PlayThePlayer(playerHand,dealerCards[0],options)

            }



            players[player]=playerHand
            playerObj.playerHands.push(playerHand)

            for(let hand=0;hand<playerHand.length;hand++){

                if((playerHand[hand].insurance!==undefined)||((HandTotal(playerHand[hand].cards).total<=21)&&(!playerHand[hand].surrender))){
                    bust=false
                }
            }
            if(bust){
                Log(`The ${player+1} all  hands bust or surrender`)
            }else{
                dealerNeedContinue=true
            }
            obj.players.push(playerObj)
        }

        if(dealerNeedContinue){
            AddRC(dealerCards[1],options)


            PlayDealerHand(dealerCards,options)
            obj.dealer=dealerCards

        }
        let win=0

        for(let player=0;player<options.numberOfPlayer;player++){
            let gain=EvaluateHand(players[player],dealerCards,options)
            obj.players[player].win=gain
            win+=gain
        }
        obj.win=win

        Log(JSON.stringify(obj,null,2))

        // console.log(JSON.stringify(obj,null,2))

        return obj

    }






}


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


function HouseEdge(numTrials,handsPerTrial,options){
    // Holds the aggregate result from each run of X hands

    InitializeDeck(options)
    // console.log(RC)
    CSMDeck=_.clone(deck)

    var simulationResults = [];

// Snap the time
    console.time('PlayBlackJack');

    for (var trial = 0; trial < numTrials; trial++)
    {
        var runningTotal = 0;

        for (var i = 0; i < handsPerTrial; i++)
        {
            // Here's where you control and can evaluation different options
            runningTotal += RunAGame(options).win;
            Log("Running total " + runningTotal);
            Log("");
        }

        simulationResults.push((((100 * runningTotal) / handsPerTrial) / (initialBet+initialBet*options.backBetRatio)/(options.numberOfPlayer)));
    }
// console.log(simulationResults)
// Calculate stddev and average
    console.timeEnd('PlayBlackJack');
    return simulationResults
    console.log("Average:" + average(simulationResults) + "%");
    console.log("StdDev:" + standardDeviation(simulationResults) + "%");




}
global.verboseLog=false

// module.exports=HouseEdge

let numTrials=10000
let handsPerTrial=500
let OPTIONS={
    hitSoft17: false,
    surrender: 'late',
    doubleRange:[0,21],
    doubleAfterSplit: true,
    resplitAces: true,
    offerInsurance: true,
    numberOfDecks: 6,
    maxSplitHands: 4,
    count: {system:'REKO',trueCount:0,RC:0},
    // count:false,
    hitSplitedAce:false,
    EuropeanNoHoldCard:false,
    CSM:false,
    fiveDragon:false,//no yet
    charlie:false,
    blackjackPayout:1.5,
    backBet:false,
    rolling:0,
    numberOfPlayer:1,
    backBetRatio:0,
    adjust:true,
    cutCard:30,
}
OPTIONS.cutCard=Math.max(OPTIONS.cutCard,OPTIONS.numberOfPlayer*10)
const gameOptions=GameOptions(OPTIONS)
console.log(gameOptions)

console.log(average(HouseEdge(numTrials,handsPerTrial,gameOptions)))
// console.log(record)

// _.forEach(record,function(obj,key){
//     _.forEach(obj,function(v,k){
//         record[key][k]=v.result/v.hand
//     })
//
// })

// console.log(record)

