
let pastN = 0
let pkgSize = 3
let avCache = []
let isReading = true 
let isLoading = false
const DATA = [["Seconds","Value"]]
const AV_DATA = [["Seconds","Value"]]
const errorMessage = document.querySelector("#error")

const init = () => {
    const pkgController = document.querySelector("#pkg-controller")
    const actionButton = document.querySelector("#start-controller")
    const stopperButton = document.querySelector("#stop-controller")
    const arValue = document.querySelector("#ar-value")


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
}


// Autoinitlize function 
init()



async function run() {
    let results = await eel.worker(pkgSize)();
    if(results === null || results === undefined || results === []){
        errorMessage.innerHTML = "Arduino se desconecto!"
    }
    if(isLoading){ isLoading = false}
    return JSON.parse(results)
}

async function readData() {
    console.log("reading data...")
    google.charts.load('current', {'packages':['corechart']});
    while(isReading == true) {
        const data_ = await run()
        for(d in data_ ){
            // avoid big numbers noise

            if(data_[d] > 1023) {
                DATA.push([d,1023])
                computeAverage(1023)
            }else {
                DATA.push([d,data_[d]])
                computeAverage(data_[d])
            }
        }
        //Array.from(data_).forEach((val,idx) => DATA.push([idx,val]))
        console.table(data_)
        google.charts.setOnLoadCallback(drawChart);
    }
    
}


function drawChart() {
    var data = google.visualization.arrayToDataTable(DATA);
    var dataAv = google.visualization.arrayToDataTable(AV_DATA);


    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    var avChart = new google.visualization.LineChart(document.getElementById('av_chart'));


    chart.draw(data,{
        title: 'Real-time',
        curveType: 'function',
        legend: { position: 'bottom' },
        vAxis: {title:'Valores',maxVal:1023,minVal:0}
    });


    avChart.draw(dataAv,{
        title: 'Moving Average',
        curveType: 'function',
        legend: { position: 'bottom' },
        vAxis: {title:'Valores',maxVal:1023,minVal:0}
    })
}


const computeAverage = (val) => {
    pastN+=1
    avCache.push(val)
    
    if(pastN > 200) {
        let av = avCache.reduce((a,b) => a + b, 0) / avCache.length;
        AV_DATA.push([AV_DATA.length+1,av])
        avCache.shift()
        
    }
}