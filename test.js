// JSONデータを取得するAPIのURL
var apiUrl = "https://cabreo-telemetry-test-f0ca387e08cd.herokuapp.com/test/latest";

// APIからJSONデータを取得する関数
function fetchData() {

    fetch(apiUrl)
        .then(response => {
        // レスポンスをJSONに変換
        return response.json();
        })
        .then(data => {
        // 取得したデータをコンソールに表示
        console.log("取得したJSONデータ:", data);
        console.log(data.record_num);
        addrow(data);
        })
        .catch(error => {
        // エラー時の処理
        console.error("データを取得できませんでした:", error);
        });
}

function addrow(data){
    let tbl = document.getElementById('tbl');
    tbl.deleteRow(tbl.rows.length-1)
    var newtr = tbl.insertRow(1);
    for(var i=0;i<8;i++){
        newtr.insertCell(newtr.cells.length);
    }
    console.log(tbl.rows[1].cells[0]);
    tbl.rows[1].cells[0].innerHTML = data.instrumentation_time;
    tbl.rows[1].cells[1].innerHTML = data.record_num;
    tbl.rows[1].cells[2].innerHTML = data.registration_time;
    tbl.rows[1].cells[3].innerHTML = data.test_data_1;
    tbl.rows[1].cells[4].innerHTML = data.test_data_2;
    tbl.rows[1].cells[5].innerHTML = data.test_data_3;
    tbl.rows[1].cells[6].innerHTML = data.test_data_4;
    tbl.rows[1].cells[7].innerHTML = data.test_data_5;
}