const _=require('lodash')

module.exports=function (playerCards, dealerCard, handValue, handCount, dealerCheckedBlackjack, options)
{
    // console.log(playerCards,dealerCard,handValue,handCount,dealerCheckedBlackjack,options)

    var canSplit = (playerCards[0] === playerCards[1]) && (playerCards.length === 2) && (handCount < options.maxSplitHands);
    var canDouble = ((playerCards.length === 2) && ((handCount === 1) || options.doubleAfterSplit)) &&
        ((handValue.total >= options.doubleRange[0]) && (handValue.total <= options.doubleRange[1]));
    var canSurrender = ((_.includes(options.surrender,'early')) || (options.surrender === "late")) && (playerCards.length === 2) && (handCount === 1);


    // We may take insurance!
    if(handValue.soft){
        return null
    }


    //Fab Four

    else if(options.surrender==='late'){
        if(handValue.total===14){
            if((dealerCard===10)&&(options.count.trueCount>=3)){
                return 'surrender'
            }

        }else if(handValue.total===15){
            if((dealerCard===9)&&(options.count.trueCount>=2)){
                return 'surrender'
            }else if((dealerCard===10)&&(options.count.trueCount<0)){
                return 'hit'
            }else if((dealerCard===1)&&(options.count.trueCount>=2)){
                return 'surrender'
            }
        }else if(handValue.total===16){
            if((dealerCard===9)&&(options.count.trueCount<0)){
                return 'hit'
            }else if((dealerCard===10)&&(options.count.trueCount<-3)){
                return 'hit'
            }else if((dealerCard===1)&&(options.count.trueCount<-2)){
                return 'hit'
            }else if((dealerCard===8)&&(options.count.trueCount>=5)){
                return 'surrender'
            }
        }
    }

    else if(_.includes(options.surrender,'early')){
        if(dealerCard===9){
            if(handValue.total===15&&(options.count.trueCount>=2)){
                return 'surrender'
            }else if(handValue.total===16&&(options.count.trueCount<0)){
                return 'hit'
            }
        }else if(dealerCard===10){
            if(handValue.total===13&&(options.count.trueCount>=3)){
                return 'surrender'
            }
            else if(handValue.total===14&&(options.count.trueCount)<0){
                return 'hit'
            }
            else if(handValue.total===15&&(options.count.trueCount)<-2){
                return 'hit'
            }
        }
        if(options.surrender==='earlyA'){
            if(dealerCard===1){
                if(handValue.total===5&&(options.count.trueCount<0)){
                    return 'hit'
                }else if(handValue.total===6&&(options.count.trueCount<-3)){
                    return 'hit'
                }else if(handValue.total===7&&(options.count.trueCount<-3)){
                    return 'hit'
                }
            }
        }
    }

    //Illustrious 18
    else if ((handValue.total === 16) &&(dealerCard === 10) && (options.count.trueCount >= 0) &&(!canSurrender))
    {
        return "stand";
    }


    else if ((handValue.total === 15) && (dealerCard === 10) && (options.count.trueCount >=4) &&(!canSurrender))
    {
        return "stand";
    }


    else if (canSplit && (handValue.total === 20)&&(options.EuropeanNoHoldCard===false))
    {
        if ((dealerCard === 5) && (options.count.trueCount >= 5))
        {
            return "split";
        }
        else if ((dealerCard === 6) && (options.count.trueCount >= 4))
        {
            return "split";
        }
    }
    else if (canDouble && (handValue.total === 10) && (dealerCard === 10) && (options.count.trueCount >= 4) &&(options.EuropeanNoHoldCard===false))
    {
        return "double";
    }

    else if ((handValue.total === 12) && (dealerCard === 3) && (options.count.trueCount >= 2))
    {
        return "stand";
    }
    else if ((handValue.total === 12) && (dealerCard === 2) && (options.count.trueCount >= 3))
    {
        return "stand";
    }
    else if (canDouble && (handValue.total === 11) && (dealerCard === 1) && (options.count.trueCount >= 1) &&(options.EuropeanNoHoldCard===false))
    {
        return "double";
    }
    else if (canDouble && (handValue.total === 9) && (dealerCard === 2) && (options.count.trueCount >= 1))
    {
        return "double";
    }
    else if (canDouble && (handValue.total === 10) && (dealerCard === 1) && (options.count.trueCount >= 4) && (options.EuropeanNoHoldCard===false))
    {
        return "double";
    }
    else if (canDouble && (handValue.total === 9) && (dealerCard === 7) && (options.count.trueCount >= 3))
    {
        return "double";
    }
    else if ((handValue.total === 16) && (dealerCard === 9) && (options.count.trueCount >= 5))
    {
        return "stand";
    }
    else if ((handValue.total === 13) && (dealerCard === 2) && (options.count.trueCount < -1))
    {
        return "hit";
    }
    else if ((handValue.total === 12) && (dealerCard === 4) && (options.count.trueCount < 0))
    {
        return "hit";
    }
    else if ((handValue.total === 12) && (dealerCard === 5) && (options.count.trueCount < -2))
    {
        return "hit";
    }
    else if ((handValue.total === 12) && (dealerCard === 6) && (options.count.trueCount < -1))
    {
        return "hit";
    }
    else if ((handValue.total === 13) && (dealerCard === 3) && (options.count.trueCount < -2))
    {
        return "hit";
    }


    // Nope, no adjustment
    return null;
}