global.record={}


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






function saveResult(options,numTrials,handsPerTrial){
    _.forEach(record,function(obj,key){
        record[key]=[obj.win/obj.hand,100*obj.hand/(numTrials*handsPerTrial)]

    })

    let arr=[]
    _.forEach(record,function(array,index){
        arr.push([Number(index),...array])
    })

    arr=_.orderBy(arr,function(a){
        return a[0]
    },['asc'])
    for(let i=0;i<arr.length;i++){
        let tmp=arr.slice(0,i)
        let sum=tmp.reduce(function(sum,value){
            return sum+value[2]
        },0)
        arr[i].push(sum)
    }
    console.log(arr)


    const ws=wb.addWorksheet('sheet 1')


    ws.cell(1,1).string('TC')
    ws.cell(1,2).string('EV')
    ws.cell(1,3).string('ODD')
    ws.cell(1,4).string('TOTAL')


    ws.cell(1,6).string('Total hands')
    ws.cell(1,7).number(numTrials*handsPerTrial/10000)
    let line=3
    _.forEach(gameOptions,function(o,k){
        ws.cell(line,6).string(k)
        ws.cell(line,7).string(o.toString())
        line++
    })


//
    ws.cell
    for(let i=2;i<arr.length+2;i++){
        ws.cell(i,1).number(arr[i-2][0])
        ws.cell(i,2).string(arr[i-2][1].toFixed(4))
        ws.cell(i,3).string(arr[i-2][2].toFixed(4))
        ws.cell(i,4).string(arr[i-2][3].toFixed(4))

    }



    wb.write('RC.xlsx')
}