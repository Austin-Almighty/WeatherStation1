# WeatherStation1

### 👤 陳昱仲（前端開發）
- 負責首頁 index.html 設計與互動功能。
- 串接後端氣象 API（/forecast、/obs-county），取得各縣市天氣與即時觀測資料。
- 設計台灣 SVG 地圖與天氣提示互動。
- 實作首頁的搜尋框與提示動畫。
- 製作 comingsoon.html 頁面作為導向未完成功能。
- 設計整體頁面響應式樣式，透過 media query 支援手機與桌面裝置瀏覽。


### 👤 廖祥廷（前後端串流）
- info.html 的資料呈現
- 串連API擷取各縣市天氣和預測的數據
- 用JS撰寫抓取未來五天預報的API
- 用CSS製作簡單的loading 動畫，用來爭取從API抓資料的時間
- 根據天氣不同，展示對應的圖示
- 顯示本地現在時間
- 建立FastAPI server


### 👤 邱景銘（傳送訊息至 Discord）
- Fetch API 資料並且整理資料型態
- 整理欲發送之訊息格式，使用 embed 樣式
- 欲發送之訊息包含前端網址 url 之超連結
- 使用 webhook 傳送訊息至 Discord 特定頻道
- 將寫好之 Python file 發送至 server，每日定時預報天氣資訊
