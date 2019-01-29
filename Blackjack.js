const strategy=require('./Suggestions')
const shuffle=require('knuth-shuffle').knuthShuffle
const fs=require('fs')
const _=require('lodash')
const GameOptions=require('./GameOptions')
const BackPlayer=require('./Back_player')
const Spread=require('./Spread')
var deck=[]
var CSMDeck=[]
var RC=0
const xl=require('excel4node')
const wb=new xl.Workbook()

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


const record={

}
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

function LogPair(obj){
    const hands=obj.players[0].playerHands[0].length
    if(hands>1){
        const RC=obj.RC
        const dealerCard=obj.dealer[0]
        const playerCard=obj.players[0].playerHands[0][0].cards[0]
        const win=obj.win
        if(record[[playerCard,playerCard,dealerCard]]===undefined){
            record[[playerCard,playerCard,dealerCard]]={}
        }else{
            if(record[[playerCard,playerCard,dealerCard]][RC]===undefined){
                record[[playerCard,playerCard,dealerCard]][RC]={
                    win:win,
                    hand:1
                }
            }else{
                record[[playerCard,playerCard,dealerCard]][RC].win+=win
                record[[playerCard,playerCard,dealerCard]][RC].hand+=1
            }

            if(record[[playerCard,playerCard,dealerCard]].total===undefined){
                record[[playerCard,playerCard,dealerCard]].total={
                    win:win,
                    hand:1
                }
            }else{
                record[[playerCard,playerCard,dealerCard]].total.win+=win
                record[[playerCard,playerCard,dealerCard]].total.hand+=1
            }
        }
        // console.log(RC,dealerCard,playerCard)
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
            else if(_.includes(options.count.system,'OWN')){
                if(card===1){
                    RC-=2
                }else if((card===4)||(card===5)){
                    RC+=1
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
                if(options.BJpush21&&playerTotal===21){
                    Log('dealer BJ pushes player 21')

                }else{
                    Log('Dealer has blackjack - you lost all the bet including split and double')
                    win-=(playerHand[hand].actingBet+playerHand[hand].backBet)
                    if(options.rolling){
                        win+=options.rolling*(playerHand[hand].actingBet+playerHand[hand].backBet)
                    }
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


    // let betAmount=[initialBet]//config the bet
    // // console.log(betAmount)
    // if(betAmount.length<options.numberOfPlayer){
    //     betAmount=[]
    //     for(let player=0;player<options.numberOfPlayer;player++){
    //         betAmount.push(initialBet)
    //     }
    // }// if player more than one then put every one same bet as default


    

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


    //TC,RC for Betting
    if(options.count) {
        trueCount = RC / (deck.length / 52)
        options.count.trueCount = trueCount
        options.count.RC=RC
        Log(`True Count: ${trueCount.toFixed(2)}`)
        Log(`RC: ${RC}`)

    }

    //betting system set here
    let betAmount=_.clone(options.betAmount)
    Log(`betAmount ${betAmount}`)
    if(options.spread){//todo
        let spread=Spread(options)
        Log(`spread ${spread}`)
        if(spread!==1){
            for (let i=0;i<betAmount.length;i++){
                betAmount[i]*=spread
            }
        }
        Log(`betAmount ${betAmount}`)

    }





    if(options.EuropeanNoHoldCard){
        const obj={

            players:[],
            totalBet:0


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
            obj.totalBet+=(hand.actingBet+hand.backBet)
            hand.cards.push(DealCard(options))
            hand.cards.push(DealCard(options))

            playerHand.push(hand)
            players.push(playerHand)
        }

        // console.log(players[0][0].cards)



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

            players:[],
            totalBet:0


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
            obj.totalBet+=(hand.actingBet+hand.backBet)
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
                if(options.offerInsurance){
                    if(TakeInsurance(options)){
                        playerHand[0].insurance=(playerHand[0].actingBet+playerHand[0].backBet)/2
                        Log('place insurance')
                    }
                }


            }

            let bust=true
            if(!playerBlackjack&&!dealerBlackjack){
                PlayThePlayer(playerHand,dealerCards[0],options)

            }



            players[player]=playerHand
            playerObj.playerHands.push(playerHand)

            for(let hand=0;hand<playerHand.length;hand++){

                if((playerHand[hand].insurance!==undefined)||(!playerBlackjack&&(HandTotal(playerHand[hand].cards).total<=21)&&(!playerHand[hand].surrender))){
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
global.verboseLog=false

module.exports.RunAGame=RunAGame
module.exports.SetUp=function(options){
    InitializeDeck(options)

    CSMDeck=_.clone(deck)
}


// function HouseEdge(numTrials,handsPerTrial,options){
//     // Holds the aggregate result from each run of X hands
//
//     InitializeDeck(options)
//     // console.log(RC)
//     CSMDeck=_.clone(deck)
//
//     var simulationResults = [];
//
// // Snap the time
//     console.time('PlayBlackJack');
//
//     for (var trial = 0; trial < numTrials; trial++)
//     {
//         var runningTotal = 0;
//         var totalBet=0
//
//         for (var i = 0; i < handsPerTrial; i++)
//         {
//             // Here's where you control and can evaluation different options
//             let result =RunAGame(options)
//
//             // console.log(JSON.stringify(result,null,2))
//             // LogPair(RC,result.win,result.players[0].playerHands[0][0].cards[0],result.dealer[0])
//             LogPair(result)
//             // LogREKO(result.RC,result.win)
//
//             runningTotal += result.win;
//             totalBet+=result.totalBet
//             Log("Running total " + runningTotal);
//             Log("");
//         }
//
//         simulationResults.push((((100 * runningTotal) ) / (totalBet)/(options.numberOfPlayer)));
//     }
// // console.log(simulationResults)
// // Calculate stddev and average
//     console.timeEnd('PlayBlackJack');
//     // console.log(simulationResults)
//     return simulationResults
//     console.log("Average:" + average(simulationResults) + "%");
//     console.log("StdDev:" + standardDeviation(simulationResults) + "%");
//
//
//
//
// }
//
//
// // module.exports=HouseEdge
//
// let numTrials=300000
// let handsPerTrial=10000
// let OPTIONS={
//     hitSoft17: false,
//     surrender: 'early10',
//     doubleRange:[9,11],
//     doubleAfterSplit:true,
//     resplitAces: false,
//     offerInsurance: true,
//     numberOfDecks: 6,
//     maxSplitHands: 3,
//     count: {system:'REKO',trueCount:0,RC:0},
//     // count:false,
//     hitSplitedAce:false,
//     EuropeanNoHoldCard:true,
//     CSM:false,
//     fiveDragon:false,//no yet
//     charlie:false,
//     blackjackPayout:1.5,
//     backBet:false,
//     rolling:0.01,
//     numberOfPlayer:1,
//     backBetRatio:0,
//     adjust:true,
//     cutCard:120,
//     spread:true,
//     betAmount:[10]
// }
// OPTIONS.cutCard=Math.max(OPTIONS.cutCard,OPTIONS.numberOfPlayer*10)
// if(OPTIONS.betAmount.length<OPTIONS.numberOfPlayer){
//     let bet=[]
//     for(let i=0;i<OPTIONS.numberOfPlayer;i++){
//         bet.push(OPTIONS.betAmount[0])
//     }
//     OPTIONS.betAmount=bet
// }
// const gameOptions=GameOptions(OPTIONS)
// console.log(gameOptions)
// // console.log(numTrials*handsPerTrial/10000)
// //
// // console.log(average(HouseEdge(numTrials,handsPerTrial,gameOptions)))
//
// ROR(1000,10000,gameOptions)
// function recordResult(options,numTrials,handsPerTrial){
//     _.forEach(record,function(obj,key){
//         record[key]=[obj.win/obj.hand,100*obj.hand/(numTrials*handsPerTrial)]
//
//     })
//
//     let arr=[]
//     _.forEach(record,function(array,index){
//         arr.push([Number(index),...array])
//     })
//
//     arr=_.orderBy(arr,function(a){
//         return a[0]
//     },['asc'])
//     for(let i=0;i<arr.length;i++){
//         let tmp=arr.slice(0,i)
//         let sum=tmp.reduce(function(sum,value){
//             return sum+value[2]
//         },0)
//         arr[i].push(sum)
//     }
//     console.log(arr)
//
//
//     const ws=wb.addWorksheet('sheet 1')
//
//
//     ws.cell(1,1).string('TC')
//     ws.cell(1,2).string('EV')
//     ws.cell(1,3).string('ODD')
//     ws.cell(1,4).string('TOTAL')
//
//
//     ws.cell(1,6).string('Total hands')
//     ws.cell(1,7).number(numTrials*handsPerTrial/10000)
//     let line=3
//     _.forEach(gameOptions,function(o,k){
//         ws.cell(line,6).string(k)
//         ws.cell(line,7).string(o.toString())
//         line++
//     })
//
//
// //
//     ws.cell
//     for(let i=2;i<arr.length+2;i++){
//         ws.cell(i,1).number(arr[i-2][0])
//         ws.cell(i,2).string(arr[i-2][1].toFixed(4))
//         ws.cell(i,3).string(arr[i-2][2].toFixed(4))
//         ws.cell(i,4).string(arr[i-2][3].toFixed(4))
//
//     }
//
//
//
//     wb.write('RC.xlsx')
// }
//
// function recordPairByRC(){
//     _.forEach(record,function(obj,name){
//         let ws=wb.addWorksheet(name)
//         ws.cell(1,1).string('RC')
//         ws.cell(1,2).string('WIN')
//         ws.cell(1,3).string('HAND')
//         ws.cell(1,4).string('EV')
//         let row=2
//         _.forEach(obj,function(result,RC){
//             // console.log(RC)
//             ws.cell(row,1).string(RC)
//             ws.cell(row,2).number(result.win)
//             ws.cell(row,3).number(result.hand)
//             ws.cell(row,4).string((result.win/result.hand).toFixed(4))
//             row++
//         })
//
//
//     })
//     wb.write('NDAS.xlsx')
//     console.log('write to test.xlsx')
// }
//
//
// // recordPairByRC()
//
// // console.log(record)
//
//
// recordResult(gameOptions,numTrials,handsPerTrial)
//
//
// function ROR(rounds,bankroll,options){
//
//     const target=bankroll*2
//     console.log(target)
//     // console.log(RC)
//     CSMDeck=_.clone(deck)
//     const results={
//         win:0,
//         lose:0,
//         hands:[]
//     }
//
//     for(let round=0;round<rounds;round++){
//         InitializeDeck(options)
//         CSMDeck=_.clone(deck)
//         let bankRoll=bankroll
//         let hand=0
//         while((bankRoll<=target)&&(bankRoll>0)){
//             let result=RunAGame(options)
//             LogREKO(result.RC,result.win)
//             bankRoll+=result.win
//             hand+=options.numberOfPlayer
//             // console.log(bankRoll)
//         }
//         if(bankRoll<=0){
//             results.lose+=1
//
//         }else{
//             results.win+=1
//         }
//         results.hands.push(hand)
//
//     }
//     results.win=results.win/rounds
//     results.lose=results.lose/rounds
//     results.hands=average(results.hands)
//     console.log(results)
// }
//
//
//
//
