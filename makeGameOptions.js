// const gameOptions={
//     numberOfDecks:6,
//     hitSoft17:false,
//     doubleAfterSplit:true,
//     doubleRange:[0,21],
//     maxSplitHands:4,
//     resplitAces:true,
//     hitSplitedAce:false,
//     surrender:'late',
//     CSM:false,
//     backBet:false,
//     EuropeanNoHoldCard:true,
//     rolling:0
// }
const _=require('lodash')


const GameOptions=require('./GameOptions')
const decks=[6,8]
const hitS17s=[true,false]
const DASs=[true,false]
const doubleRanges=[[0,21]]
const maxSplitHands=[3,4]
const resplitAces=[true,false]
const hitSplitedAces=[]
const surrenders=['late','early10','earlyA',false]
const CSMs=[true,false]


const gameOptions=[]


const numTrials=1000
const handsPerTrial=10000

function makeGameOptions(numTrials,handsPerTrial){
    _.forEach(decks,deck=>{
        _.forEach(hitS17s,hitS17=>{
            _.forEach(DASs,DAS=>{
                _.forEach(doubleRanges,doubleRange=>{
                    _.forEach(maxSplitHands,maxSplitHand=>{
                        _.forEach(resplitAces,resplitAce=>{

                            _.forEach(surrenders,surrender=>{
                                _.forEach(CSMs,CSM=>{
                                    gameOptions.push([numTrials,handsPerTrial,GameOptions({
                                        numberOfDecks:deck,
                                        hitSoft17:hitS17,
                                        doubleAfterSplit:DAS,
                                        doubleRange:doubleRange,
                                        maxSplitHands:maxSplitHand,
                                        resplitAces:resplitAce,
                                        surrender:surrender,
                                        CSM:CSM
                                    })])
                                })
                            })

                        })
                    })
                })
            })
        })
    })

    return gameOptions
}

// console.log(makeGameOptions(1,1))

module.exports=makeGameOptions

