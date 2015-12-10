if(location.hostname!="www.lhu.edu.tw"){
    alert("請勿於非龍華學生系統的網頁上開啟此程式。");
}
if(!window.jQuery){
    var f=document.createElement('script');
    f.setAttribute('type','text/javascript');
    f.setAttribute('src','https://hans00.github.io/lhu_labor/jquery.min.js');
    document.getElementsByTagName('head')[0].appendChild(f);
    var f=document.createElement('script');
    f.setAttribute('type','text/javascript');
    f.setAttribute('src','https://hans00.github.io/lhu_labor/md5.min.js');
    document.getElementsByTagName('head')[0].appendChild(f);
}
if(!$(document).has("#labor_panel")){
    $.get('https://hans00.github.io/lhu_labor/panel.html',
    function (data) {
        //$("html").remove();
        $(document).html(data);
        $("#display h1").html("已就緒");
        $("#l,#p").change(function(){
            Interval($("#l").val()*1000, $("#p").val()*1000);
        });
    });
} else {
    $(document).ready(function(){
        $("#display h1").html("已就緒");
        $("#l,#p").change(function(){
            Interval($("#l").val()*1000, $("#p").val()*1000);
        });
    });
}
var iList=1000, iProc=800, en=false;
var BaseUrl="https://www.lhu.edu.tw/StudAp/C00/C4001/Apply/", logData={}, proc=false, loading=false;
function log(text){
	$("#log").text($("#log").text()+text+"\n");
	if($("#log").length){$("#log").scrollTop($("#log")[0].scrollHeight - $("#log").height());}
}
function a(item, name){
	if($("#a>#"+item).length==0){
		$("#a").append("<li id='"+item+"'>"+name+"</li>");
	}
	if($("#b>#"+item).length!=0){
		$("#b>#"+item).remove();
	}
}
function b(item, name){
	if($("#b>#"+item).length==0){
		$("#b").append("<li id='"+item+"'>"+name+"</li>");
	}
	if($("#a>#"+item).length!=0){
		$("#a>#"+item).remove();
	}
}
function get(ID, post,url){
    post = (typeof post === 'undefined') ? false : post;
    url = (typeof url === 'undefined') ? null : url;
    if(ID=="list"){
        $.ajax({
            url: BaseUrl+"Labor_Apply.aspx",
            cache: false
        })
        .done(function(data){
            if(data.search("登入")!=-1){
                $("#display h1").html("尚未登入學生資訊系統 ˋ_ˊ");
                _switch();
                return;
            }
            var table=$(data).find("#DG_Content");
            if(table.children("tr").length>=1){
                table.children("tr").each(function(){
                    var _url=BaseUrl+$(e).find("td:first-child a").prop("href"), _name=$(e).find("td:nth-child(2) font").text(), _id=md5(_name);
                    if(_name.search("限")!=-1) return;
                    if(_id in logData){
                        logData[_id]={url:_url,name:_name,stat:0};
                    }
                });
            } else {
                $("#display h1").html("暫無勞作，請稍後 030");
            }
            loading=false;
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            log("取得清單失敗："+textStatus);
        });
    }else{
        if(post==false){
            var m="GET",d="";
        }else{
            var m="POST",d=post;
        }
        $.ajax({
            url: ((url!=null)?BaseUrl+logData[ID].url:url),
            method: m,
            data: d,
            cache: false
        })
        .done(function(data){
            var btn=$(data).find("#Btn_Join"), val=logData[ID];
            switch(btn.val()){
                case "取消參加此活動":
                    logData[ID].stat=1;
                    a(ID, val.name);
                    log("勞作「"+val.name+"」已報名完成。");
                    return;
                case "活動人數額滿":
                    logData[e].stat=0;
                    b(ID, val.name);
                    log("勞作「"+val.name+"」人數已額滿，重試中。");
                    return;
                default:
                    var data={__VIEWSTATE:$(data).find("[name='__VIEWSTATE']").val(),Btn_Join:$(data).find("#Btn_Join").val()},url=BaseUrl+$(data).find("#Labor_Apply_D").prop("action");
                    get(ID,data,url);
                    log("勞作「"+val.name+"」可以報名，嘗試中。");
                    
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            log("取得活動狀態失敗："+textStatus);
        });
    }
}
function process(){
	if(!en){proc=false;return;}
	$.each(logData,function(e,val){
		if(val.stat==1) return;
        if(logData[e].stat==0){
            logData[e].stat=2;
            get(e);
        }
	});
	setTimeout("process();",iProc);
}
function getlist(){
	if(!en) return;
	if(!loading){
        get("list");
        loading=true;
    }
	if(!proc && logData.length>0){
		proc=true;
		$("#display h1").html("有勞作開放，正在爭取中 :3");
		process();
	}
	setTimeout("getlist();",iList);
}
function Interval(l,p){
	iList=l;
	iProc=p;
}
function _switch(e){
	en=!en;
    if(en){getlist();}
	var val=(en)?"結束":"啟動";
	$(e).text(val);
}