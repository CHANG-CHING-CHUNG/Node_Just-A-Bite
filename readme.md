# Node Just A Bite 餐廳網站
* 這是 Lidemy 程式導師計劃第4期的作業
* [前台餐廳網站網址](https://just-a-bite.mentor4th-john.tw/)
![](https://i.imgur.com/jzHhcW4.jpg)

* [後台餐聽網站網址](https://just-a-bite.mentor4th-john.tw/admin)
![](https://i.imgur.com/pOWDYvH.png)

## 技術棧
* Node
JavaScript 的 runtime
* Express
建立 server 及 router
* Express-session
透過此套件建立 session ，可透過 req.session 存放數據在 server 端，用來達成狀態保存的目的。
* Express-formidable
透過此套件解析 multipart/form-data 檔案，將上傳的圖片存到 server 資料夾中。
* Ejs
模板引擎，用來建立 views，模版裡可插入程式碼，使用方式為 ```app.set('view engine', 'ejs')```，在 server 回傳檔案前會先解析 ejs 檔案並計算，最後將結果轉成 html 檔案回傳給客戶端。
* MySQL
存放會員資料、商品資料或常見問題等網站會使用到的會變動的資料。
* Sequelize
是物件關係對映(ORM)套件，將資料庫的 SQL 語法包成物件，使用者即可使用選定的程式語言的語法對資料庫做操作。
安裝後即可在 models 資料夾建立 table 的 model ，建好之後即可使用 migration 將變動跟資料庫做同步，同時 migrations 資料夾會出現帶有日期的 migration 檔案，並且在資料庫中記錄此更動以便後續追蹤管理。
* bcrybtjs
用來將使用者密碼加密，加密系統使用 hash 雜湊，雜湊值（Hash Value）具有不可逆的性質，因此可有效的保護密碼。
* connect-flash
使用此套件搭配 session 將一次性訊息存在 res.locals 並從 ejs 模板中提取該訊息並顯示，當訊息被顯示之後，flash 就會清掉該訊息。 

## 前台
### 抽獎功能
* 按下我要抽獎，系統會根據機率隨機抽一個獎項並將結果回傳
![](https://i.imgur.com/grlVkCi.jpg)
![](https://i.imgur.com/NE6u3R0.png)
### 點餐功能
* 按下加入購物車按紐會將選中物品資訊存入 cookie ，並將數量顯示在購物籃圖標，按下購物籃圖標會導向結帳頁面。
![](https://i.imgur.com/HM2tgtf.png)
![](https://i.imgur.com/o6N5gHr.png)

### 結帳功能
* 串接綠界科技金流 SDK 
* 信用卡測試卡號: 4311-9522-2222-2222
信用卡測試安全碼: 222
信用卡測試有效月年: 輸入的 MM/YYYY 請大於當下時間的月年，例如如果今天是 2020/12/11 那麼請輸入 01/2021(含)之後的有效月年
![](https://i.imgur.com/vXA8Rrw.png)
* 登入後輸入帳單資訊，姓名、電話、電子郵件及送餐地點按送出就會導向結帳頁面
![](https://i.imgur.com/fG9Wu4V.png)
* 輸入上方的信用卡測試卡號及手機號碼等資訊按下送出，會導向到手機認證碼頁面，輸入手機收到的認證碼並按下送出驗證
![](https://i.imgur.com/a28v2s0.png)
* 驗證成功後即會導向到結帳成功頁面，按下下方按鈕即可返回商店
![](https://i.imgur.com/kViu3Gz.png)
### 查詢訂單
* 查詢訂單功能必須登入才能使用
* 會列出使用者的訂單，包含已付款及未付款訂單
![](https://i.imgur.com/ljDdW26.png)
### 常見問題
* 列出商店常見問題清單，點擊標題可展開解答
![](https://i.imgur.com/2ffDN2P.png)
### 會員資料
* 可在此處簡單的更新姓名、密碼及電子信箱
![](https://i.imgur.com/GIcvJzT.png)
## 後台
### 獎項列表
* 列出目前的抽獎品項及機率
![](https://i.imgur.com/NByr75r.png)
### 管理獎項
* 此處可更新抽獎獎品名、圖片、描述以及機率，以及新增獎項。
* 更新獎項說明: 機率設定方式為按下重置鈕將所有獎項機率歸零，然後再一項一項設定機率並送出。注意，機率的總合必須是100% 
* 新增獎項說明: 預設機率為0新增完之後再從上面的更新獎項區塊設定你要的機率。 
![](https://i.imgur.com/q9SRDTX.png)
### 管理商品
* 此處可編輯更新商品以及新增商品。
* 編輯更新商品說明: 商品更新方式: 直接在輸入框更改內容直接在輸入框更改內容，改完後，按下送出即更新該筆內容。
* 新增商品說明: 填完內容按下送出即可。
![](https://i.imgur.com/xYf38SH.png)
### 管理常見問題
* 此處可編輯更新以及新增常見問題。
* 編輯更新常見問題說明: 直接在輸入框更改內容，改完後，按下送出即更新該筆內容。注意: 順序以數字表示。
* 新增常見問題說明: 填完標題、內容以及順序按下送出即可。
![](https://i.imgur.com/J0OOzt5.png)
### 管理訂單
* 此處可查看所有訂單並更改外送完畢的訂單狀態從 paid -> shipped。
* 有搜尋訂單功能，輸入訂單編號即可查詢該訂單狀態
![](https://i.imgur.com/xowVj4F.png)










