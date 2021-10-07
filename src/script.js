
const DATA = [["Seconds","Value"]]
let options = {
    title: 'Arduino test',
    curveType: 'function',
    legend: { position: 'bottom' },
    vAxis: {title:'Valores',maxVal:1023,minVal:0}
  };

//let data = new google.visualization.DataTable();
readData()

async function run() {
    let results = await eel.worker()();
    return JSON.parse(results)
}

async function readData() {
    console.log("getting data...")
    const data_ = await run()
    //const raw_ = []
    for(d in data_ ){
        DATA.push([d,data_[d]])
    }
    

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}


function drawChart() {
    google.charts.load('current', {'packages':['corechart']});
    //data.addColumn('number', 'Seconds');
    //data.addColumn('number', 'Value');
    var data = google.visualization.arrayToDataTable(DATA);

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}


