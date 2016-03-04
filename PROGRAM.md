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
