const _=require('lodash')
const REKO=require('./REKO')
const HiLo=require('./HiLo')
const FELT=require('./FELT')

module.exports=function (playerCards, dealerCard, handValue, handCount, dealerCheckedBlackjack, options)
{
    // console.log(playerCards,dealerCard,handValue,handCount,dealerCheckedBlackjack,options)


    if(_.includes(options.count.system,'REKO')){
        let result=REKO(playerCards, dealerCard, handValue, handCount, dealerCheckedBlackjack, options)
        if(result!==null){
            if(global.verboseLog){
                console.log('new strategy:',result)
            }

            return result
        }
    }
    else if(_.includes(options.count.system,'HiLo')){
        let result=HiLo(playerCards, dealerCard, handValue, handCount, dealerCheckedBlackjack, options)
        if(result!==null){
            if(global.verboseLog){
                console.log('new strategy:',result)
            }
            return result
        }
    }else if(_.includes(options.count.system,'FELT')){
        let result=FELT(playerCards, dealerCard, handValue, handCount, dealerCheckedBlackjack, options)
        if(result!==null){
            if(global.verboseLog){
                console.log('new strategy:',result)
            }
            return result
        }
    }

    // var canSplit = (playerCards[0] === playerCards[1]) && (playerCards.length === 2) && (handCount < options.maxSplitHands);
    // var canDouble = ((playerCards.length === 2) && ((handCount === 1) || options.doubleAfterSplit)) &&
    //     ((handValue.total >= options.doubleRange[0]) && (handValue.total <= options.doubleRange[1]));
    // var canSurrender = ((_.includes(options.surrender,'early')) || (options.surrender === "late")) && (playerCards.length === 2) && (handCount === 1);
    //
    // if(options.count.system==='HiLo'){
    //     // We may take insurance!
    //     if(handValue.soft){
    //         return null
    //     }
    //
    //
    //     //Fab Four
    //
    //     else if(options.surrender==='late'){
    //         if(handValue.total===14){
    //             if((dealerCard===10)&&(options.count.trueCount>=3)){
    //                 return 'surrender'
    //             }
    //
    //         }else if(handValue.total===15){
    //             if((dealerCard===9)&&(options.count.trueCount>=2)){
    //                 return 'surrender'
    //             }else if((dealerCard===10)&&(options.count.trueCount<0)){
    //                 return 'hit'
    //             }else if((dealerCard===1)&&(options.count.trueCount>=2)){
    //                 return 'surrender'
    //             }
    //         }else if(handValue.total===16){
    //             if((dealerCard===9)&&(options.count.trueCount<0)){
    //                 return 'hit'
    //             }else if((dealerCard===10)&&(options.count.trueCount<-3)){
    //                 return 'hit'
    //             }else if((dealerCard===1)&&(options.count.trueCount<-2)){
    //                 return 'hit'
    //             }else if((dealerCard===8)&&(options.count.trueCount>=5)){
    //                 return 'surrender'
    //             }
    //         }
    //     }
    //
    //     else if(_.includes(options.surrender,'early')){
    //         if(dealerCard===9){
    //             if(handValue.total===15&&(options.count.trueCount>=2)){
    //                 return 'surrender'
    //             }else if(handValue.total===16&&(options.count.trueCount<0)){
    //                 return 'hit'
    //             }
    //         }else if(dealerCard===10){
    //             if(handValue.total===13&&(options.count.trueCount>=3)){
    //                 return 'surrender'
    //             }
    //             else if(handValue.total===14&&(options.count.trueCount)<0){
    //                 return 'hit'
    //             }
    //             else if(handValue.total===15&&(options.count.trueCount)<-2){
    //                 return 'hit'
    //             }
    //         }
    //         if(options.surrender==='earlyA'){
    //             if(dealerCard===1){
    //                 if(handValue.total===5&&(options.count.trueCount<0)){
    //                     return 'hit'
    //                 }else if(handValue.total===6&&(options.count.trueCount<-3)){
    //                     return 'hit'
    //                 }else if(handValue.total===7&&(options.count.trueCount<-3)){
    //                     return 'hit'
    //                 }
    //             }
    //         }
    //     }
    //
    //     //Illustrious 18
    //     else if ((handValue.total === 16) &&(dealerCard === 10) && (options.count.trueCount >= 0) &&(!canSurrender))
    //     {
    //         return "stand";
    //     }
    //
    //
    //     else if ((handValue.total === 15) && (dealerCard === 10) && (options.count.trueCount >=4) &&(!canSurrender))
    //     {
    //         return "stand";
    //     }
    //
    //
    //     else if (canSplit && (handValue.total === 20)&&(options.EuropeanNoHoldCard===false))
    //     {
    //         if ((dealerCard === 5) && (options.count.trueCount >= 5))
    //         {
    //             return "split";
    //         }
    //         else if ((dealerCard === 6) && (options.count.trueCount >= 4))
    //         {
    //             return "split";
    //         }
    //     }
    //     else if (canDouble && (handValue.total === 10) && (dealerCard === 10) && (options.count.trueCount >= 4) &&(options.EuropeanNoHoldCard===false))
    //     {
    //         return "double";
    //     }
    //
    //     else if ((handValue.total === 12) && (dealerCard === 3) && (options.count.trueCount >= 2))
    //     {
    //         return "stand";
    //     }
    //     else if ((handValue.total === 12) && (dealerCard === 2) && (options.count.trueCount >= 3))
    //     {
    //         return "stand";
    //     }
    //     else if (canDouble && (handValue.total === 11) && (dealerCard === 1) && (options.count.trueCount >= 1) &&(options.EuropeanNoHoldCard===false))
    //     {
    //         return "double";
    //     }
    //     else if (canDouble && (handValue.total === 9) && (dealerCard === 2) && (options.count.trueCount >= 1))
    //     {
    //         return "double";
    //     }
    //     else if (canDouble && (handValue.total === 10) && (dealerCard === 1) && (options.count.trueCount >= 4) && (options.EuropeanNoHoldCard===false))
    //     {
    //         return "double";
    //     }
    //     else if (canDouble && (handValue.total === 9) && (dealerCard === 7) && (options.count.trueCount >= 3))
    //     {
    //         return "double";
    //     }
    //     else if ((handValue.total === 16) && (dealerCard === 9) && (options.count.trueCount >= 5))
    //     {
    //         return "stand";
    //     }
    //     else if ((handValue.total === 13) && (dealerCard === 2) && (options.count.trueCount < -1))
    //     {
    //         return "hit";
    //     }
    //     else if ((handValue.total === 12) && (dealerCard === 4) && (options.count.trueCount < 0))
    //     {
    //         return "hit";
    //     }
    //     else if ((handValue.total === 12) && (dealerCard === 5) && (options.count.trueCount < -2))
    //     {
    //         return "hit";
    //     }
    //     else if ((handValue.total === 12) && (dealerCard === 6) && (options.count.trueCount < -1))
    //     {
    //         return "hit";
    //     }
    //     else if ((handValue.total === 13) && (dealerCard === 3) && (options.count.trueCount < -2))
    //     {
    //         return "hit";
    //     }
    // }
    // else if(options.count.system==='REKO'){
    //     if(options.count.RC>=2){
    //         if(canSurrender){
    //             if(options.surrender==='early10'){
    //                 if((dealerCard===10)&&(handValue.total===13)){
    //                     return 'surrender'
    //                 }
    //             }
    //             if(!handValue.soft){
    //                 if((dealerCard===9)&&(handValue.total===15)){
    //                     return 'surrender'
    //                 }else if((dealerCard===1)&&(handValue.total===15)){
    //                     return 'surrender'
    //                 }
    //                 else if((dealerCard===10)&&(handValue.total===16)&&(playerCards[0]===playerCards[1])){
    //                     return 'surrender'
    //                 }else if((dealerCard===10)&&(handValue.total===14)){
    //                     return 'surrender'
    //                 }
    //             }
    //         }
    //         if(canDouble){
    //             if(handValue.soft){
    //                 if((dealerCard===5)&&(handValue.total===19)){
    //                     return 'double'
    //                 }else if((dealerCard===6)&&(handValue.total===19)){
    //                     return 'double'
    //                 }
    //             }else{
    //                 if((handValue.total===11)&&(dealerCard===1)&&(!options.EuropeanNoHoldCard)){
    //                     return 'double'
    //                 }
    //                 else if((handValue.total===10)&&(dealerCard===1)&&(!options.EuropeanNoHoldCard)){
    //                     return 'double'
    //                 }
    //                 else if((handValue.total===10)&&(dealerCard===10)&&(!options.EuropeanNoHoldCard)){
    //                     return 'double'
    //                 }
    //                 else if((handValue.total===9)&&(dealerCard===2)){
    //                     return 'double'
    //                 }
    //                 else if((handValue.total===9)&&(dealerCard===7)){
    //                     return 'double'
    //                 }
    //                 else if((handValue.total===8)&&(dealerCard===5)){
    //                     return 'double'
    //                 }
    //                 else if((handValue.total===8)&&(dealerCard===6)){
    //                     return 'double'
    //                 }
    //             }
    //         }
    //         if(!handValue.soft){
    //             if((handValue.total===16)&&(dealerCard===10)){
    //                 return 'stand'
    //             }
    //             else if((handValue.total===15)&&(dealerCard===10)){
    //                 return 'stand'
    //             }
    //             else if((handValue.total===12)&&(dealerCard===2)){
    //                 return 'stand'
    //             }
    //             else if((handValue.total===12)&&(dealerCard===3)){
    //                 return 'stand'
    //             }
    //             else if((handValue.total===12)&&(dealerCard===4)&&(options.numberOfDecks!==8)){
    //                 return 'stand'
    //             }
    //         }
    //         if(options.numberOfDecks===1){
    //             if((handValue.total===17)&&(dealerCard===2)&&(handValue.soft)){
    //                 return 'double'
    //             }
    //             if(!handValue.soft){
    //                 if((handValue.total===13)&&(dealerCard===2)){
    //                     return 'stand'
    //                 }
    //                 else if((handValue.total===13)&&(dealerCard===3)){
    //                     return 'stand'
    //                 }
    //                 else if((handValue.total===12)&&(dealerCard===5)){
    //                     return 'stand'
    //                 }
    //                 else if((handValue.total===12)&&(dealerCard===6)){
    //                     return 'stand'
    //                 }
    //             }
    //         }
    //     }
    // }
    // else if(options.count.system==='FELT'){
    //     let TC=options.count.trueCount
    //     if(TC>=0){//investigate if 0 is include
    //         if(handValue.soft){
    //             return null
    //         }else{
    //             if(canSurrender){
    //                 if((dealerCard===10)&&(handValue.total===15)){
    //                     return 'surrender'
    //                 }else if((dealerCard===1)&&(handValue.total===15)){
    //                     return 'surrender'
    //                 }
    //             }
    //             if(canDouble){
    //                 if((handValue.total===9)&&(dealerCard===2)){
    //                     return 'double'
    //                 }
    //                 else if((handValue.total===11)&&(dealerCard===1)){
    //                     return 'double'
    //                 }
    //             }
    //             {
    //                 if((handValue.total===16)&&(dealerCard===10)){
    //                     return 'stand'
    //                 }
    //                 else if((handValue.total===13)&&(dealerCard===2)){
    //                     return 'stand'
    //                 }
    //                 else if((handValue.total===12)&&(dealerCard===4)){
    //                     return 'stand'
    //                 }
    //                 else if((handValue.total===12)&&(dealerCard===5)){
    //                     return 'stand'
    //                 }
    //                 else if((handValue.total===12)&&(dealerCard===6)){
    //                     return 'stand'
    //                 }
    //             }
    //         }
    //     }
    //     if(TC>=6){
    //         if(handValue.soft){
    //             return null
    //         }else{
    //             if(canSurrender){
    //                 if((dealerCard===9)&&(handValue.total===15)){
    //                     return 'surrender'
    //                 }else if((dealerCard===10)&&(handValue.total===14)){
    //                     return 'surrender'
    //                 }
    //             }
    //             if(canDouble){
    //                 if((handValue.total===9)&&(dealerCard===7)){
    //                     return 'double'
    //                 }
    //                 else if((handValue.total===8)&&(dealerCard===5)){
    //                     return 'double'
    //                 }
    //                 else if((handValue.total===8)&&(dealerCard===6)){
    //                     return 'double'
    //                 }
    //             }
    //             {
    //                 if((handValue.total===15)&&(dealerCard===10)){
    //                     return 'stand'
    //                 }
    //                 else if((handValue.total===12)&&(dealerCard===2)){
    //                     return 'stand'
    //                 }
    //                 else if((handValue.total===12)&&(dealerCard===3)){
    //                     return 'stand'
    //                 }
    //
    //             }
    //         }
    //     }
    // }



    // Nope, no adjustment
    return null;
}