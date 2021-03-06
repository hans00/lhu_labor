// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name autorun.js
// @code_url http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @code_url https://raw.githubusercontent.com/blueimp/JavaScript-MD5/master/js/md5.js
// ==/ClosureCompiler==
// My autorun code

if (typeof LABOR === 'undefined') {
    var LABOR = true;

    if (window.location.hostname != "www.lhu.edu.tw" || window.location.protocol != "https:") {
        if ($("#labor_panel").length < 0) {
            alert("請勿於非龍華學生系統的網頁上開啟此程式。");
            window.location = "https://www.lhu.edu.tw/StudAp/index_log.aspx";
        }
    } else {
        if ($("#labor_panel").length < 1) {
            $.get('https://hans00.github.io/lhu_labor/panel.html')
                .done(function(data) {
                    document.write(data);
                });
        }
    }

    var iList = 1000,
        iProc = 800,
        en = false;
    var BaseUrl = "https://www.lhu.edu.tw/StudAp/C00/C4001/Apply/",
        logData = {},
        proc = false,
        loading = false;

    function log(text) {
        $("#log").text($("#log").text() + text + "\n");
        if ($("#log").length) {
            $("#log").scrollTop($("#log")[0].scrollHeight - $("#log").height());
        }
    }

    function a(item, name) {
        if ($("#a>#" + item).length == 0) {
            $("#a").append("<li id='" + item + "'>" + name + "</li>");
        }
        if ($("#b>#" + item).length != 0) {
            $("#b>#" + item).remove();
        }
    }

    function b(item, name) {
        if ($("#b>#" + item).length == 0) {
            $("#b").append("<li id='" + item + "'>" + name + "</li>");
        }
        if ($("#a>#" + item).length != 0) {
            $("#a>#" + item).remove();
        }
    }

    function get(ID, post) {
        if (!en) return;
        post = (typeof post === 'undefined') ? {} : post;
        if (ID == "list") {
            $.ajax({
                    url: BaseUrl + "Labor_Apply.aspx",
                    cache: false
                })
                .done(function(data) {
                    if (data.search("登入") != -1) {
                        $("#display h1").html("尚未登入學生資訊系統 ˋ_ˊ");
                        _switch();
                        return;
                    }
                    var table = $(data).find("#DG_Content");
                    if (table.find("tr").length > 0) {
                        table.find("tr:not(:eq(0))").each(function() {
                            var _url = BaseUrl + $(this).find("td:first-child a").prop("href"),
                                _name = $(this).find("td:nth-child(2) font").text(),
                                _id = md5(_name);
                            if (_name.search("限") != -1) return;
                            if (!(_id in logData)) {
                                logData[_id] = {
                                    url: BaseUrl + _url.split("/").pop(),
                                    name: _name,
                                    stat: 0
                                };
                            }
                        });
                    } else {
                        $("#display h1").html("暫無勞作，請稍後 030");
                    }
                    loading = false;
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    log("取得清單失敗：" + textStatus);
                });
        } else {
            //console.log(post);
            $.post(logData[ID].url, post, function(data, status) {
                if (status != "success") {
                    log("取得勞作「" + logData[ID].name + "」狀態失敗：" + status);
                    return;
                }
                var btn = $(data).find("#Btn_Join").val(),
                    val = logData[ID];
                switch (btn) {
                    case "取消參加此活動":
                        logData[ID].stat = 1;
                        a(ID, val.name);
                        log("勞作「" + val.name + "」已報名完成。");
                        return;
                    case "活動人數額滿":
                        logData[ID].stat = 0;
                        b(ID, val.name);
                        log("勞作「" + val.name + "」人數已額滿，重試中。");
                        return;
                    case "報名參加此活動":
                        get(ID, {
                            __VIEWSTATE: $(data).find("[name='__VIEWSTATE']").val(),
                            Btn_Join: btn
                        });
                        log("勞作「" + val.name + "」可以報名，嘗試中。");
                        return;
                    default:
                        log("勞作「" + val.name + "」資料抓取時發生錯誤。");
                        logData[ID].stat = 0;
                }
            });
        }
    }

    function process() {
        if (!en) {
            proc = false;
            return;
        }
        $.each(logData, function(e, val) {
            if (val.stat == 1) return;
            if (logData[e].stat == 0) {
                logData[e].stat = 2;
                get(e);
            }
        });
        setTimeout("process();", iProc);
    }

    function getlist() {
        if (!en) return;
        if (!loading) {
            get("list");
            loading = true;
        }
        if (!proc && Object.keys(logData).length > 0) {
            proc = true;
            $("#display h1").html("有勞作開放，正在爭取中 :3");
            process();
        }
        setTimeout("getlist();", iList);
    }

    function Interval() {
        var l = $("#l").val() * 1000,
            p = $("#p").val() * 1000;
        iList = l;
        iProc = p;
    }

    function _switch() {
        en = !en;
        if (en) {
            getlist();
        }
        $("#switch").text((en) ? "結束" : "啟動");
    }

} else {
    alert("請不要重複載入程式！");
}
