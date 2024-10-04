// JSONデータを取得するAPIのURL
var apiUrl = "https://cabreo-telemetry-test-f0ca387e08cd.herokuapp.com/onboard/data/latest";
//var apiUrl = "https://cabreo-telemetry-test-f0ca387e08cd.herokuapp.com/onboard/data/";
window.setInterval(update_jud,1000)

function update_jud() {
    let checkbox = document.getElementById('check1');
    if(checkbox.checked){
        fetchData(apiUrl);
    }
}

// APIからJSONデータを取得する関数
function fetchData(url) {
    fetch(url)
        .then(response => {
        // レスポンスをJSONに変換
        return response.json();
        })
        .then(data => {
        // 取得したデータをコンソールに表示
        console.log("取得したJSONデータ:", data);
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

    let year = data.instrumentation_time.slice(0,4);
    let month = data.instrumentation_time.slice(5,7);
    let day = data.instrumentation_time.slice(8,10);
    let hour = data.instrumentation_time.slice(11,13);
    let minute = data.instrumentation_time.slice(14,16);
    let second = data.instrumentation_time.slice(17,19);
    let milisecond = data.instrumentation_time.slice(20,23);
    let data_date = new Date(year,month-1,day,hour,minute,second,milisecond);

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

// 開始時刻と終了時刻を設定
const startTime = '2024-09-28T22:33:45';
const endTime = '2024-09-29T23:59:59';

const test_url = 'https://cabreo-telemetry-test-f0ca387e08cd.herokuapp.com/onboard/data/period';

const requestOptions = {
    method: 'POST', // 必要に応じて 'GET' ではなく 'POST' を使用
    headers: {
      'Content-Type': 'application/json',  // リクエストボディがJSON形式であることを示す
      'Accept': 'application/json'         // レスポンス形式もJSONであることを期待
    },
    body: JSON.stringify({
      start_time: startTime,
      end_time: endTime
    })
  };

function get_test(){
    fetch(test_url, requestOptions)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('取得したデータ:', data);
    })
    .catch(error => {
        console.error('データ取得エラー:', error);
    });
}
