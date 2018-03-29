const strategy=require('./Suggestions')
const shuffle=require('knuth-shuffle').knuthShuffle
const fs=require('fs')
const _=require('lodash')
const GameOptions=require('./GameOptions')
const BackPlayer=require('./Back_player')

var deck=[]
var CSMDeck=[]
var hiLoCount=0


function Shuffle(){
    hiLoCount=0
    deck=_.shuffle(CSMDeck)
}
var initialBet=100






function Log(text){
    if(verboseLog){
        console.log(text+'\n')
    }
}

const HandTotal=require('./Points')


function DealCard(){
    let card=deck.pop()

    if((card>=2)&&(card<=6)){
        hiLoCount++
    }else if((card===1)||(card===10)){
        hiLoCount--
    }
    return card
}

function PrintHand(cards){
    let text=""
    for (let i=0;i<cards.length-1;i++){
        text+=`${cards[i]}, `
    }
    text+=`${cards[cards.length-1]}`

    return text
}

function InitializeDeck(numberOfDecks){
    deck=[]
    const cards=[1,2,3,4,5,6,7,8,9,10,10,10,10]
    for(let i=0;i<numberOfDecks;i++){
        for(let j=0;j<4;j++){
            deck.push(...cards)
        }
    }
    shuffle(deck)
    hiLoCount=0

}

function PlayDealerHand(dealerCards,options){
    let dealerTotal=HandTotal(dealerCards)

    while((dealerTotal.total<17)||((dealerTotal.total===17)&& (dealerTotal.soft) &&(options.hitSoft17))){
        dealerCards.push(DealCard())
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
                playerCards.push(DealCard())
                return 'double'
                break

            case 'hit':
                playerCards.push(DealCard())
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
                    playerHand[handCount].cards.push(DealCard())
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
            hand.cards.push(DealCard())
            playerHand[handCount].cards.push(DealCard())
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
    let betAmount=initialBet
    let trueCount=0
    

    //check if we need to reshuffle

    if(options.CSM){
        Shuffle()
        Log('Shuffle')
        Log('first ten cards in the deck:',deck.slice(0,10),deck.length)
    }else{
        if(deck.length<Math.max(25,13*options.numberOfDecks)){//was 13
            Log('Shuffle')
            Shuffle()
        }
    }


    //If using counting system, set up here
    if(options.count&&(options.count.system==='HiLo')) {
        trueCount = hiLoCount / (deck.length / 52)
        options.count.trueCount = trueCount
        Log(`True Count: ${trueCount.toFixed(2)}`)

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
        const dealerCards=[]

        dealerCards.push(DealCard())//only one card
        const players=[]



        // let dealerBlackjack=(HandTotal(dealerCards).total===21)

        let dealerNeedContinue=false
        for(let player=0;player<options.numberOfPlayer;player++){
            const playerHand=[]
            const hand={actingBet:betAmount,backBet:betAmount*options.backBetRatio,cards:[]}
            hand.cards.push(DealCard())
            hand.cards.push(DealCard())
            playerHand.push(hand)
            let playerBlackjack=(playerHand.length===1)&&(playerHand[0].cards.length===2)&&(HandTotal(playerHand[0].cards).total===21)

            Log(`inital two player cards:   -player ${playerHand[0].cards}, -dealer one card ${dealerCards} `)
            if(dealerCards[0]===1&&!playerBlackjack){
                if(options.offerInsurance&&options.count&&options.count.trueCount>=3){
                    playerHand[0].insurance=(playerHand[0].actingBet+playerHand[0].backBet)/2
                    Log('place insurance')
                }
            }


            let bust=true
            PlayThePlayer(playerHand,dealerCards[0],options)
            players.push(playerHand)

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

        }

        if(dealerNeedContinue){
            dealerCards.push(DealCard())//deal another card
            PlayDealerHand(dealerCards,options)

        }
        let win=0

        for(let player=0;player<options.numberOfPlayer;player++){
            win+=EvaluateHand(players[player],dealerCards,options)
        }

        return win









        //check if player has bj,surrender or bust, then dealer does not continue

    }else{
        //the order needs to be observed
        const dealerCards=[]
        dealerCards.push(DealCard())
        dealerCards.push(DealCard())

        let dealerBlackjack=(dealerCards.length===2)&&(HandTotal(dealerCards).total===21)
        const players=[]
        let dealerNeedContinue=true
        for(let player=0;player<options.numberOfPlayer;player++){
            const playerHand=[]
            const hand={actingBet:betAmount,backBet:betAmount*options.backBetRatio,cards:[]}
            hand.cards.push(DealCard())
            hand.cards.push(DealCard())
            playerHand.push(hand)
            let playerBlackjack=(playerHand.length===1)&&(playerHand[0].cards.length===2)&&(HandTotal(playerHand[0].cards).total===21)

            Log(`inital two cards:   -player ${playerHand[0].cards}, -dealer ${dealerCards} `)
            if(dealerCards[0]===1&&!playerBlackjack){//insurance
                if(options.offerInsurance&&options.count&&options.count.trueCount>=3){
                    playerHand[0].insurance=(playerHand[0].actingBet+playerHand[0].backBet)/2
                    Log('place insurance')
                }
            }

            let bust=true
            if(!playerBlackjack&&!dealerBlackjack){
                PlayThePlayer(playerHand,dealerCards[0],options)
            }



            players.push(playerHand)

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
        }

        if(dealerNeedContinue){
            PlayDealerHand(dealerCards,options)

        }
        let win=0

        for(let player=0;player<options.numberOfPlayer;player++){
            win+=EvaluateHand(players[player],dealerCards,options)
        }

        return win

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

    InitializeDeck(options.numberOfDecks)
    CSMDeck=_.clone(deck)

    var simulationResults = [];

// output file - if not defined we don't output
    var outputFile = process.argv.slice(2)[0];

// Snap the time
    console.time('PlayBlackJack');

    for (var trial = 0; trial < numTrials; trial++)
    {
        var runningTotal = 0;

        for (var i = 0; i < handsPerTrial; i++)
        {
            // Here's where you control and can evaluation different options
            runningTotal += RunAGame(options);
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
var  verboseLog=false

module.exports=HouseEdge





// HouseEdge(numTrials,handsPerTrial,gameOptions)

