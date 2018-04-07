const _=require('lodash')
module.exports=function(playerCards, dealerCard, handValue, handCount, dealerCheckedBlackjack, options){
    const canSplit = (playerCards[0] === playerCards[1]) && (playerCards.length === 2) && (handCount < options.maxSplitHands);
    const canDouble = ((playerCards.length === 2) && ((handCount === 1) || options.doubleAfterSplit)) &&
        ((handValue.total >= options.doubleRange[0]) && (handValue.total <= options.doubleRange[1]));
    const canSurrender = ((_.includes(options.surrender,'early')) || (options.surrender === "late")) && (playerCards.length === 2) && (handCount === 1);
    const RC=options.count.RC
    if(options.count.system==='REKO'){
        if(RC>=2){
            if(canSurrender&&handValue.soft===false){
                if((dealerCard===9)&&(handValue.total===15)){
                    return 'surrender'
                }
                else if((dealerCard===1)&&(handValue.total===15)){
                    return 'surrender'
                }
                else if((dealerCard===10)&&(handValue.total===16)&&(playerCards[0]===8)){
                    return 'surrender'
                }
                else if((dealerCard===10)&&(handValue.total===14)) {
                    return 'surrender'
                }
            }
            if(canDouble){
                if(handValue.soft){
                    if((dealerCard===5)&&(handValue.total===19)){
                        return 'double'
                    }else if((dealerCard===6)&&(handValue.total===19)){
                        return 'double'
                    }

                }else{
                    if((dealerCard===1)&&(handValue.total===11)){
                        return 'double'
                    }else if((dealerCard===1)&&(handValue.total===10)){
                        return 'double'
                    }
                    else if((dealerCard===10)&&(handValue.total===10)){
                        return 'double'
                    }else if((dealerCard===2)&&(handValue.total===9)){
                        return 'double'
                    }
                    else if((dealerCard===7)&&(handValue.total===9)){
                        return 'double'
                    }
                    else if((dealerCard===5)&&(handValue.total===8)){
                        return 'double'
                    }else if((dealerCard===6)&&(handValue.total===8)){
                        return 'double'
                    }
                }
            }
            {
                if(!canSurrender){
                    if(handValue.soft===false){
                        if((dealerCard===10)&&(handValue.total===16)){
                            return 'stand'
                        }else if((dealerCard===10)&&(handValue.total===15)){
                            return 'stand'
                        }
                        else if((dealerCard===2)&&(handValue.total===12)){
                            return 'stand'
                        }else if((dealerCard===3)&&(handValue.total===12)){
                            return 'stand'
                        }
                        else if((dealerCard===4)&&(handValue.total===12)){
                            return 'stand'
                        }
                    }
                }


            }
        }
    }else{
        //early surrender
        if((_.includes(options.surrender,'early'))&&(canSurrender)){
            if((dealerCard===10)&&(handValue.total===17)&&(RC>=8)){
                return 'surrender'
            }
            else if((dealerCard===10)&&(handValue.total===14)&&(RC>=-9)){
                return 'surrender'
            }
            else if((dealerCard===10)&&(handValue.total===13)&&(RC>=1)){
                return 'surrender'
            }
            else if((dealerCard===10)&&(handValue.total===12)&&(RC>=10)){
                return 'surrender'
            }
            else if((dealerCard===9)&&(handValue.total===16)&&(RC>=-5)){
                return 'surrender'
            }
            else if((dealerCard===9)&&(handValue.total===15)&&(RC>=1)){
                return 'surrender'
            }
            else if((dealerCard===9)&&(handValue.total===14)&&(RC>=7)){
                return 'surrender'
            }
        }

        if((options.numberOfDecks===8)&&(!options.hitSoft17)){//8Decks,S17
            if(canSurrender&&(handValue.soft===false)){
                if((dealerCard===9)&&(handValue.total===15)&&(RC>=1)){
                    return 'surrender'
                }else if((dealerCard===1)&&(handValue.total===15)&&(RC>=-1)){
                    return 'surrender'
                }
                else if((dealerCard===10)&&(handValue.total===16)&&(playerCards[0]===playerCards[1])&&(RC>=-1)){
                    return 'surrender'
                }else if((dealerCard===10)&&(handValue.total===14)&&(RC>=1)){
                    return 'surrender'
                }
            }
            if(canDouble){
                if(handValue.soft){
                    if((dealerCard===2)&&(handValue.total===18)&&(RC>=-7)){
                        return 'double'
                    }else if((dealerCard===2)&&(handValue.total===17)&&(RC>=-4)){
                        return 'double'
                    }
                    else if((dealerCard===5)&&(handValue.total===19)&&(RC>=-3)){
                        return 'double'
                    }else if((dealerCard===6)&&(handValue.total===19)&&(RC>=-6)){
                        return 'double'
                    }
                }else{
                    if((dealerCard===2)&&(handValue.total===9)&&(RC>=-5)){
                        return 'double'
                    }else if((dealerCard===5)&&(handValue.total===8)&&(RC>=7)){
                        return 'double'
                    }
                    else if((dealerCard===6)&&(handValue.total===8)&&(RC>=-1)){
                        return 'double'
                    }else if((dealerCard===7)&&(handValue.total===9)&&(RC>=6)){
                        return 'double'
                    }
                    else if((dealerCard===10)&&(handValue.total===10)&&(RC>=8)){
                        return 'double'
                    }
                    else if((dealerCard===1)&&(handValue.total===11)&&(RC>=-4)){
                        return 'double'
                    }else if((dealerCard===1)&&(handValue.total===10)&&(RC>=5)){
                        return 'double'
                    }
                }
            }
            {
                if(handValue.soft===false){
                    if((dealerCard===2)&&(handValue.total===12)&&(RC>=3)){
                        return 'stand'
                    }else if((dealerCard===3)&&(handValue.total===12)&&(RC>=-2)){
                        return 'stand'
                    }
                    else if((dealerCard===4)&&(handValue.total===12)&&(RC<-10)){
                        return 'hit'
                    }else if((dealerCard===9)&&(handValue.total===16)&&(RC>=12)){
                        return 'stand'
                    }
                    else if((dealerCard===10)&&(handValue.total===16)&&(RC>=-10)){
                        return 'stand'
                    }
                    else if((dealerCard===1)&&(handValue.total===16)&&(RC>=18)){
                        return 'stand'
                    }else if((dealerCard===10)&&(handValue.total===15)&&(RC>=6)){
                        return 'stand'
                    }else if((dealerCard===10)&&(handValue.total===14)&&(RC>=16)){
                        return 'stand'
                    }
                }

            }
            if(canSplit){
                if(options.doubleAfterSplit){
                    if((dealerCard===4)&&(playerCards[0]===4)&&(RC>=5)){
                        return 'split'
                    }
                    else if((dealerCard===5)&&(playerCards[0]===10)&&(RC>=9)){
                        return 'split'
                    }
                    else if((dealerCard===6)&&(playerCards[0]===10)&&(RC>=8)){
                        return 'split'
                    }
                    else if((dealerCard===7)&&(playerCards[0]===9)&&(RC>=6)){
                        return 'split'
                    }
                }else{
                    if((dealerCard===2)&&(playerCards[0]===6)&&(RC>=-1)){
                        return 'split'
                    }
                    else if((dealerCard===5)&&(playerCards[0]===10)&&(RC>=9)){
                        return 'split'
                    }
                    else if((dealerCard===6)&&(playerCards[0]===10)&&(RC>=8)){
                        return 'split'
                    }
                    else if((dealerCard===7)&&(playerCards[0]===9)&&(RC>=15)){
                        return 'split'
                    }
                    else if((dealerCard===1)&&(playerCards[0]===9)&&(RC>=8)){
                        return 'split'
                    }
                }
            }
        }
        else if((options.numberOfDecks===6)&&(!options.hitSoft17)){//8Decks,S17
            if(canSurrender&&(handValue.soft===false)){
                if((dealerCard===9)&&(handValue.total===16)&&(RC>=-8)){
                    return 'surrender'
                }else if((dealerCard===9)&&(handValue.total===15)&&(RC>=1)){
                    return 'surrender'
                }
                else if((dealerCard===9)&&(handValue.total===14)&&(RC>=7)){
                    return 'surrender'
                }else if((dealerCard===10)&&(handValue.total===15)&&(RC>=-8)){
                    return 'surrender'
                }else if((dealerCard===10)&&(handValue.total===14)&&(RC>=2)){
                    return 'surrender'
                }
                else if((dealerCard===10)&&(handValue.total===13)&&(RC>=10)){
                    return 'surrender'
                }
                else if((dealerCard===10)&&(handValue.total===16)&&(RC>=-4)&&(playerCards[0]===playerCards[1])){
                    return 'surrender'
                }
                else if((dealerCard===1)&&(handValue.total===15)&&(RC>=0)){
                    return 'surrender'
                }
                else if((dealerCard===1)&&(handValue.total===14)&&(RC>=7)){
                    return 'surrender'
                }
            }
            if(canDouble){
                if(handValue.soft){
                    if((dealerCard===2)&&(handValue.total===18)&&(RC>=-7)){
                        return 'double'
                    }else if((dealerCard===2)&&(handValue.total===17)&&(RC>=-4)){
                        return 'double'
                    }
                    else if((dealerCard===5)&&(handValue.total===19)&&(RC>=-3)){
                        return 'double'
                    }else if((dealerCard===6)&&(handValue.total===19)&&(RC>=-6)){
                        return 'double'
                    }
                }else{
                    if((dealerCard===2)&&(handValue.total===9)&&(RC>=-5)){
                        return 'double'
                    }else if((dealerCard===5)&&(handValue.total===8)&&(RC>=7)){
                        return 'double'
                    }
                    else if((dealerCard===6)&&(handValue.total===8)&&(RC>=-1)){
                        return 'double'
                    }else if((dealerCard===7)&&(handValue.total===9)&&(RC>=6)){
                        return 'double'
                    }
                    else if((dealerCard===10)&&(handValue.total===10)&&(RC>=8)){
                        return 'double'
                    }
                    else if((dealerCard===1)&&(handValue.total===11)&&(RC>=-4)){
                        return 'double'
                    }else if((dealerCard===1)&&(handValue.total===10)&&(RC>=5)){
                        return 'double'
                    }
                }
            }
            {
                if(handValue.soft===false){
                    if((dealerCard===2)&&(handValue.total===12)&&(RC>=3)){
                        return 'stand'
                    }else if((dealerCard===3)&&(handValue.total===12)&&(RC>=-2)){
                        return 'stand'
                    }
                    else if((dealerCard===4)&&(handValue.total===12)&&(RC<-10)){
                        return 'hit'
                    }else if((dealerCard===9)&&(handValue.total===16)&&(RC>=12)){
                        return 'stand'
                    }
                    else if((dealerCard===10)&&(handValue.total===16)&&(RC>=-10)){
                        return 'stand'
                    }
                    else if((dealerCard===1)&&(handValue.total===16)&&(RC>=18)){
                        return 'stand'
                    }else if((dealerCard===10)&&(handValue.total===15)&&(RC>=6)){
                        return 'stand'
                    }else if((dealerCard===10)&&(handValue.total===14)&&(RC>=16)){
                        return 'stand'
                    }
                }

            }
            if(canSplit){
                if(options.doubleAfterSplit){
                    if((dealerCard===4)&&(playerCards[0]===4)&&(RC>=5)){
                        return 'split'
                    }
                    else if((dealerCard===5)&&(playerCards[0]===10)&&(RC>=9)){
                        return 'split'
                    }
                    else if((dealerCard===6)&&(playerCards[0]===10)&&(RC>=8)){
                        return 'split'
                    }
                    else if((dealerCard===7)&&(playerCards[0]===9)&&(RC>=6)){
                        return 'split'
                    }
                }else{
                    if((dealerCard===2)&&(playerCards[0]===6)&&(RC>=-1)){
                        return 'split'
                    }
                    else if((dealerCard===5)&&(playerCards[0]===10)&&(RC>=9)){
                        return 'split'
                    }
                    else if((dealerCard===6)&&(playerCards[0]===10)&&(RC>=8)){
                        return 'split'
                    }
                    else if((dealerCard===7)&&(playerCards[0]===9)&&(RC>=15)){
                        return 'split'
                    }
                    else if((dealerCard===1)&&(playerCards[0]===9)&&(RC>=8)){
                        return 'split'
                    }
                }
            }
        }
    }



    return null

}