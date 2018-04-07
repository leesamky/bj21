const _=require('lodash')
module.exports=function(playerCards, dealerCard, handValue, handCount, dealerCheckedBlackjack, options){
    const canSplit = (playerCards[0] === playerCards[1]) && (playerCards.length === 2) && (handCount < options.maxSplitHands);
    const canDouble = ((playerCards.length === 2) && ((handCount === 1) || options.doubleAfterSplit)) &&
        ((handValue.total >= options.doubleRange[0]) && (handValue.total <= options.doubleRange[1]));
    const canSurrender = ((_.includes(options.surrender,'early')) || (options.surrender === "late")) && (playerCards.length === 2) && (handCount === 1);
    const RC=options.count.RC
    let TC=options.count.trueCount
    if(TC>=0){//investigate if 0 is include
        if(handValue.soft){
            return null
        }else{
            if(canSurrender){
                if((dealerCard===10)&&(handValue.total===15)){
                    return 'surrender'
                }else if((dealerCard===1)&&(handValue.total===15)){
                    return 'surrender'
                }
            }
            if(canDouble){
                if((handValue.total===9)&&(dealerCard===2)){
                    return 'double'
                }
                else if((handValue.total===11)&&(dealerCard===1)){
                    return 'double'
                }
            }
            {
                if(!canSurrender){
                    if((handValue.total===16)&&(dealerCard===10)){
                        return 'stand'
                    }
                    else if((handValue.total===13)&&(dealerCard===2)){
                        return 'stand'
                    }
                    else if((handValue.total===12)&&(dealerCard===4)){
                        return 'stand'
                    }
                    else if((handValue.total===12)&&(dealerCard===5)){
                        return 'stand'
                    }
                    else if((handValue.total===12)&&(dealerCard===6)){
                        return 'stand'
                    }
                }

            }
        }
    }
    if(TC>=6){
        if(handValue.soft){
            return null
        }else{
            if(canSurrender){
                if((dealerCard===9)&&(handValue.total===15)){
                    return 'surrender'
                }else if((dealerCard===10)&&(handValue.total===14)){
                    return 'surrender'
                }
            }
            if(canDouble){
                if((handValue.total===9)&&(dealerCard===7)){
                    return 'double'
                }
                else if((handValue.total===8)&&(dealerCard===5)){
                    return 'double'
                }
                else if((handValue.total===8)&&(dealerCard===6)){
                    return 'double'
                }
            }
            {
                if(!canSurrender){
                    if((handValue.total===15)&&(dealerCard===10)){
                        return 'stand'
                    }
                    else if((handValue.total===12)&&(dealerCard===2)){
                        return 'stand'
                    }
                    else if((handValue.total===12)&&(dealerCard===3)){
                        return 'stand'
                    }
                }


            }
        }
    }

    return null

}