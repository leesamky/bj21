const _=require('lodash')

module.exports=function(options){
    const RC=options.count.RC
    let spread=1
    if(options.count){
        if(_.includes(options.count.system,'REKO')){

            if((options.numberOfDecks>=4)&&(options.numberOfDecks<=6)){

                if(RC<-5){
                    options.backBet=false
                    options.backBetRatio=0
                }else {
                    options.backBet=true
                    options.backBetRatio=5
                }
                // if(RC<=0){
                //     spread=1
                // }else if(RC===1){
                //     spread=1.5
                // }else if(RC===2){
                //     spread=2
                // }else if(RC===3){
                //     spread=2.5
                // }
                // else if(RC===4){
                //     spread=3
                // }else if(RC===5){
                //     spread=3.5
                // }
                // else{
                //     spread=4
                // }



            }
        }
    }
    return spread
}