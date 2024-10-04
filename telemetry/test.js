// JSONデータを取得するAPIのURL
var apiUrl = "https://cabreo-telemetry-test-f0ca387e08cd.herokuapp.com/onboard/data/latest";
var postUrl = "https://cabreo-telemetry-test-f0ca387e08cd.herokuapp.com/onboard/data/period"
window.setInterval(update_jud,1000)

var LapNo = 0;
var AllWh = 0;

function update_jud() {
    let checkbox = document.getElementById('check1');
    if(checkbox.checked){
        fetchData();
    }
}

// APIからJSONデータを取得する関数
function fetchData() {
    fetch(apiUrl)
        .then(response => {
        // レスポンスをJSONに変換
        return response.json();
        })
        .then(data => {
        // 取得したデータをコンソールに表示
        //console.log("取得したJSONデータ:", data);
        //console.log(data.record_num);
        latency(data)
        data = data_format(data)
        addrow(data);
        })
        .catch(error => {
        // エラー時の処理
        console.error("データを取得できませんでした:", error);
        });
}

function data_format(data){
    data.instrumentation_time = data.instrumentation_time.slice(11,23);
    data.registration_time = data.registration_time.slice(11,23);
    /*data.record_num = 
    data.registration_time =
    data.test_data_1 =
    data.test_data_2 =
    data.test_data_3 =
    data.test_data_4 =
    data.test_data_5 =*/
    return(data)
}

function latency(data){
    let now_date = new Date()
    let data_date = time_ser2fro(data.instrumentation_time);

    let diff_data = now_date.getTime() - data_date.getTime();
    let latency = document.getElementById('latency');
    let latency_unit = document.getElementById('latency_unit');
    if(diff_data < 1000){
        latency.textContent = diff_data;
        latency_unit.textContent = "ms";
    }else{
        latency.textContent = parseInt(diff_data / 1000);
        latency_unit.textContent = "s";
    }
}

/**
 * 引数のJSONデータをテーブルに追加する。
 * @param {*} data JSONデータ
 */
function addrow(data){
    let tbl = document.getElementById('tbl');
    tbl.deleteRow(tbl.rows.length-1)
    var newtr = tbl.insertRow(1);
    for(var i=0;i<5;i++){
        newtr.insertCell(newtr.cells.length);
    }
    console.log(tbl.rows[1].cells[0]);
    tbl.rows[1].cells[0].innerHTML = data.recordNum;
    tbl.rows[1].cells[1].innerHTML = data.instrumentation_time;
    tbl.rows[1].cells[2].innerHTML = data.registration_time;
    tbl.rows[1].cells[3].innerHTML = data.battery.voltage.measuredValue.value + " " + data.battery.voltage.measuredValue.unit;
    tbl.rows[1].cells[4].innerHTML = data.battery.current.measuredValue.value + " " + data.battery.current.measuredValue.unit;
}

function lap_update(){
    const btn = document.getElementById('lap_update_button');
    var startTime = document.getElementById('start_time').value;
    var endTime = document.getElementById('end_time').value;
    if(startTime && endTime){
        btn.textContent = '処理中';
        const payload = {
            "start_time": startTime.slice(0,19),
            "end_time": endTime.slice(0,19)
        }
        fetch(postUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // 送信するデータの形式を指定
            },
            body: JSON.stringify(payload) // JSONに変換してリクエストボディに設定
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
                btn.textContent = '更新';
            }
            return response.json(); // レスポンスをJSON形式に変換
        })
        .then(data => {
            console.log('Success:', data); // 受け取ったデータを表示
            lap_process(data,startTime,endTime);
            btn.textContent = '更新';
        })
        .catch(error => {
            console.error('Error:', error); // エラーハンドリング
            btn.textContent = '更新';
        });
    }
}

function lap_process(data,startTime,endTime){
    let fro_startTime = time_ser2fro(startTime);
    let fro_endTime = time_ser2fro(endTime);
    let lap_length = data.results.length - 1;
    // ラップタイム算出処理
    lap_time = formatTimeDifference(fro_endTime - fro_startTime);
    console.log(lap_time);
    // Wh算出処理
    var Wh = 0;
    for(var i=0;i<lap_length;i++){
        var vol = parseFloat(data.results[i].battery.voltage.measuredValue.value);
        var curr = parseFloat(data.results[i].battery.current.measuredValue.value);
        var watt = (vol * curr)/3600;
        Wh = Wh + watt;
    }
    // テーブル更新処理
    let tbl = document.getElementById('tbl2');
    var newtr = tbl.insertRow(1);
    for(var i=0;i<4;i++){
        newtr.insertCell(newtr.cells.length);
    }
    LapNo = LapNo + 1;
    AllWh = AllWh + Wh;
    tbl.rows[1].cells[0].innerHTML = LapNo;
    tbl.rows[1].cells[1].innerHTML = lap_time;
    tbl.rows[1].cells[2].innerHTML = Wh.toFixed(5);
    tbl.rows[1].cells[3].innerHTML = AllWh.toFixed(5);

}

function time_ser2fro(time){
    let year = time.slice(0,4);
    let month = time.slice(5,7);
    let day = time.slice(8,10);
    let hour = time.slice(11,13);
    let minute = time.slice(14,16);
    let second = time.slice(17,19);
    let milisecond = time.slice(20,23);
    let date = new Date(year,month-1,day,hour,minute,second,milisecond);
    return date
}

function formatTimeDifference(diffInMs) {

    // 差分を時間、分、秒、ミリ秒に変換
    const hours = Math.floor(diffInMs / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000).toString().padStart(2, '0');
    const milliseconds = (diffInMs % 1000).toString().padStart(3, '0'); // ミリ秒部分は3桁表示

    // hh:mm:ss.sss形式でフォーマットして返す
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function getCurrentFormattedTime(Date) {

    // 年、月、日、時間、分、秒、ミリ秒を取得
    const year = Date.getFullYear();
    const month = (Date.getMonth() + 1).toString().padStart(2, '0'); // 月は0始まりなので+1
    const day = Date.getDate().toString().padStart(2, '0');
    const hours = Date.getHours().toString().padStart(2, '0');
    const minutes = Date.getMinutes().toString().padStart(2, '0');
    const seconds = Date.getSeconds().toString().padStart(2, '0');
    const milliseconds = Date.getMilliseconds().toString().padStart(3, '0'); // ミリ秒は3桁表示

    // yyyy-mm-dd-hh:mm:ss.sss形式でフォーマット
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function lap_button(){
    let now_date = new Date()
    document.getElementById('start_time').value = document.getElementById('end_time').value;
    document.getElementById('end_time').value = getCurrentFormattedTime(now_date);

    lap_update()

}