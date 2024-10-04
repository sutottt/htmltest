
import requests

# 辞書型のデータ
payload = {
    "start_time": "2024-10-04T18:23:23",
    "end_time": "2024-10-04T18:23:30"
}

# APIのエンドポイントURLを指定
url = 'https://cabreo-telemetry-test-f0ca387e08cd.herokuapp.com/onboard/data/period'

# リクエストを送信
response = requests.get(url, json=payload)

# レスポンスを確認
if response.status_code == 200:
    print('Success:', response.json())
else:
    print('Failed:', response.status_code, response.text)