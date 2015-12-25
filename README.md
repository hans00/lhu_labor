# 自動搶龍華勞作程式
造福龍華同學
並且 DDoS 學校系統（誤

# 說明
1. 本程式只是輔助作用，無法保證一定成功。
2. 此程式之運作方式為 JavaScript 嵌入原資訊系統網頁並加以自動控制，會消耗網路流量。
3. 使用本程式前必須先登入龍華學生資訊系統。
4. 在程式尚未重新載入之前，若有已報名成功的勞作人為取消，程式不會自動重新排入清單。
5. 本專案歡迎改作，不過請遵守「[Apache License 2.0](http://www.openfoundry.org/tw/legal-column-list/8950-obligations-of-apache-20)」的規則。

# 使用方法
1. 登入龍華學生資訊系統
2. 將以下程式碼貼至網址列上
3. 部分瀏覽器可能會自動移除前端的「javascript:」以安全保護，這時請自行補齊，確認完後按下`Enter`
4. 即可正常開始使用
```javascript
javascript:(function(){var f=document.createElement('script');f.setAttribute('type','text/javascript');f.setAttribute('src','https://hans00.github.io/lhu_labor/autorun.js');document.getElementsByTagName('head')[0].appendChild(f)})()
```
``P.S. 可將此段程式碼加入書籤（我的最愛）以便往後使用。``

# 運作原理
透過[書籤小程式](https://zh.wikipedia.org/wiki/小书签)的方法將 JavaScript 程式碼嵌入龍華學生資訊系統的網頁上（由於 iFrame 與 AJAX 的安全性規則，不能跨網域請求連線或控制 iFrame 畫面），並透過 jQuery 快速實現 AJAX 畫面資料抓取與 HTML DOM 解析。
程式會自動從網頁表格上解析出勞作報名網址以及名稱，名稱會另外以 MD5 Hash 後作為程式內勞作清單的 ID 用，並將清單內除了有「限」該關鍵字以外的勞作全部快速掃一遍，直到報名成功為止。
程式內有個指令叫 Interval，該指令用意為執行抓取資料的指令的間隔，並且由於避免單一項目多線程抓取造成重複報名等情況出現，每個項目都會有目前狀態，狀態回歸到 0 的項目才會再次執行抓取指令，而可以報名的勞作則是直接再次執行抓取指令且送出資料。

# 檔案說明
### autorun.js
編譯過的最小化程式碼 &#40;以 ClosureCompiler 編譯&#41;
### autorun.src.js
編譯前的 JavaScript 程式碼 &#40;以 ClosureCompiler 編譯&#41;
### panel.html
控制面板
### panel.css
控制面板的 CSS


#### Copyright &copy; by [Hans@LHU](mailto:D1044182013@gm.lhu.edu.tw)
#### License : Apache License 2.0
