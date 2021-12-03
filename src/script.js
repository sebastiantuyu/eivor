
let pastN = 0
let pkgSize = 3
let avCache = []
let isReading = true 
let isLoading = false
let GLOBAL_POINTER = 0
let DATA = [["Seconds","Value"]]
let AV_DATA = [["Seconds","Value"]]
const errorMessage = document.querySelector("#error")
const biggest = document.querySelector("#biggest")
const smallest = document.querySelector("#smallest")


const init = () => {
    const pkgController = document.querySelector("#pkg-controller")
    const actionButton = document.querySelector("#start-controller")
    const stopperButton = document.querySelector("#stop-controller")
    const arValue = document.querySelector("#ar-value")
    const potZero = document.querySelector("#cb-pot-zero")
    const potOne = document.querySelector("#cb-pot-one")


    pkgController.addEventListener("change",(e) => {
        // Each time that the value is updated 
        // the worker is stopped
        isReading = false
        pkgSize = parseInt(e.target.value)
        arValue.innerHTML = pkgSize

    })

    actionButton.addEventListener("click",() => {
        isLoading = true
        isReading = true
        actionButton.disabled = true
        stopperButton.disabled = false
        readData()
    })

    stopperButton.addEventListener("click",() => {
        isReading = false
        actionButton.disabled = false
        stopperButton.disabled = true
    })

    potZero.addEventListener("click",(e) => switchMetrics(potOne,"zero"))

    potOne.addEventListener("click",(e) => switchMetrics(potZero,"one"))


}


// Autoinitlize function 
init()



async function run() {
    let results = await eel.worker(pkgSize)();
    if(results === null || results === undefined || results === []){
        errorMessage.innerHTML = "Arduino se desconecto!"
    }
    if(isLoading){ isLoading = false}
    return [JSON.parse(results)]
}

async function readData() {
    console.log("reading data...")
    google.charts.load('current', {'packages':['corechart']})
    let prevCounter = 0
    let triggerCounter = 0;
    while(isReading == true) {
        const [data_] = await run()

        if(!GLOBAL_POINTER) getBiggAndSmall(data_)

        for(d in data_ ){
            // avoid big numbers noise
            // If POT is poiting to ==> 0
            if(data_[d] > 1023) {
                
                if(data_[d] > 1023) {
                    DATA.push([prevCounter,1023])
                }
                // On any case add the 1023 to the MA
                computeAverage(1023)
            }
            else {
                
                DATA.push([prevCounter,data_[d]])
                
                if (!GLOBAL_POINTER) computeAverage(data_[d])
            }
            
            prevCounter+=1
        }

        google.charts.setOnLoadCallback(drawChart);
        DATA.splice(1,(DATA.length/2));
        AV_DATA.splice(1,(AV_DATA.length/2));
    }
    
}


function drawChart() {
    var data = google.visualization.arrayToDataTable(DATA);
    var dataAv = google.visualization.arrayToDataTable(AV_DATA);


    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    var avChart = new google.visualization.LineChart(document.getElementById('av_chart'));



    chart.draw(data,{
        title: 'Real-time, Potentiometer 1',
        curveType: 'function',
        legend: { position: 'bottom' },
        vAxis: {title:'Valores',maxVal:1023,minVal:0}
    });

    avChart.draw(dataAv,{
        title: `Moving Average: Potenciometro ${ GLOBAL_POINTER ? "Dos" : "Uno" }`,
        curveType: 'function',
        legend: { position: 'bottom' },
        vAxis: {title:'Valores',maxVal:1023,minVal:0}
    })
}


const computeAverage = (val) => {
    pastN+=1
    avCache.push(val)
    
    if(pastN > 20) {
        let av = avCache.reduce((a,b) => a + b, 0) / avCache.length;
        AV_DATA.push([AV_DATA.length+1,av])
        avCache.shift()
    }
}

const getBiggAndSmall = (d_) => {
    let arr_ = []
    for(let key in d_){
        if(d_[key] > 1023) arr_.push(1023)
        else arr_.push(d_[key])
    }
    
    biggest.innerHTML = Math.max(...arr_)
    smallest.innerHTML = Math.min(...arr_)
}

const switchMetrics = (target,to) => {
    DATA.splice(1,DATA.length)

    if(to === "zero"){
        target.checked = false;
        GLOBAL_POINTER = 0;
    }
    else if(to === "one"){
        target.checked = false;
        GLOBAL_POINTER = 1;
    }
}