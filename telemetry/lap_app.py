import requests
import json
import pandas as pd
import ctypes
import tkinter as tk
from tkinter import ttk

url = "https://cabreo-telemetry-test-f0ca387e08cd.herokuapp.com/onboard/data/"

def get_request():
    response = requests.get(url)

    if response.status_code == 200:
        # レスポンスのJSONデータを取得
        data = response.json()
        #print(data["results"][0])
        df = pd.DataFrame(data["results"])
        print(df)
        #with open('output.txt', 'w') as file:
        #    json.dump(data, file, indent=4)  # インデント付きで整形して書き込み
    else:
        print(f"Error: {response.status_code}")


if __name__ == "__main__":
    #set the system's DPI to app.
    ctypes.windll.shcore.SetProcessDpiAwareness(1)

    root = tk.Tk()
    button = tk.Button(
        text="Resolution Test"
    )
    column = ('rap_num', 'wh')
    tree = ttk.Treeview(root,height=30, columns=column)

    # 列の設定
    tree.column('#0',width=0, stretch='no')
    tree.column('rap_num', anchor='center', width=200)
    tree.column('wh',anchor='center', width=90)
    # 列の見出し設定
    tree.heading('#0',text='')
    tree.heading('rap_num', text='rap_num',anchor='center')
    tree.heading('wh', text='wh', anchor='center')

    button.pack()
    tree.pack(pady=10)
    root.mainloop()