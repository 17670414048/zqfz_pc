
var headers = { source: "Web", token: $.cookie('token'), userid: $.cookie('userid') };
//  var base = 'http://api.hbb.com';
var base = 'http://api.tszh.wiwcc.com';
// var base = 'http://xinshengerke.hbb.net:8080/api';
//登录判断
if ($.cookie('source') != undefined && $.cookie('token') != undefined && $.cookie('userid') != undefined && $.cookie('source') != 'null' && $.cookie('token') != 'null' && $.cookie('userid') != 'null') {
	if (window.location.pathname.indexOf('login.html') >=0) {
		window.location.href = 'index.html';
	}
} else {
	if (window.location.pathname.indexOf('login.html') <0) {
		window.location.href = "login.html";
		$.cookie('source', 'Web');
	}
};

(function ($) {
	
	var ajaxStatus = true;
	//添加headers
	addHeaders = function () {
		headers.token = $.cookie('token');
		headers.userid = $.cookie('userid');
	};
	addHeaders();
	//添加cookie
	addCookie = function (userid, token, isadmin) {
		$.cookie("userid", userid);  
		$.cookie("token", token);
		$.cookie("is_admin", isadmin);
		addHeaders();
	};
	//删除cookie
	deletCookie = function () {
		$.cookie("userid", null);
		$.cookie("token", null);
		$.cookie("is_admin", null);
		addHeaders();
	};
	//模态框
	popModal = function (id, url) {
		$(id).load(url, function () {
			//  $('#sys_dlg_submit').on('click');
			$(id).modal({ backdrop: 'static' });
		});
	};
	//退出登录
	quit = function () {
		if (confirm('确定退出登录！！！')) {
			deletCookie();
			window.location.href = "login.html";
		}
	};
	$.extend({
		week:function(index){
			var arr =['周日','周一','周二','周三','周四','周五','周六'];
			return arr[index];
			
		},
		/*获取参数名获取参数*/
		getUrlParam: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象

			var r = document.location.search.substr(1).match(reg);  //匹配目标参数
			if (r != null) return unescape(r[2]); return null; //返回参数值
		},
		/* 通过链接获取参数*/
		getUrlParams: function (url, name) {
			//截取get字符串
			var getstr = url.substr(url.indexOf('?') + 1);
			//解析成get数组
			var get = getstr.split('&');
			//查找要找到参数（name）
			for (var i in get) {
				if (get[i].indexOf(name + '=') >= 0) {
					return get[i].replace(name + '=', '');
				}
			}
			//如果找不到返回false
			return null;
		},
		/*修改头部的样式*/
		// addActive: function (doc) {
		// 	var src = $(doc).find("#center").attr("src");
		// 	var index = $.getUrlParam('index');
		// 	$(doc).find('li.js-list').removeClass('active');
		// 	$(doc).find('li.js-list').eq(index - 1).addClass('active');
		// },
		// 时间戳转化为日期
		/*
		* @param <int> unixTime  待时间戳(秒)       
       * @param <bool> isFull  返回完整时间(Y-m-d 或者 Y-m-d H:i:s)       
       * @param <int> timeZone  时区 
		*/
		unixToDate: function (unixTime, isFull) {
			isFull = isFull || false;
			var time = new Date(unixTime * 1000);
			var ymdhis = "";
			ymdhis += time.getFullYear() + "-";
			var month = time.getMonth() + 1;
			if (month <= 9) {
				month = '0' + month;
			}
			ymdhis += month + "-";
			var day = time.getDate();
			if (day <= 9) {
				day = '0' + day;
			}
			ymdhis += day;
			if (isFull === true) {
				var h = time.getHours();
				if (h <= 9) {
					h = '0' + h;
				}
				var m = time.getMinutes();
				if (m <= 9) {
					m = '0' + m;
				}
				var s = time.getSeconds();
				if (s <= 9) {
					s = '0' + s;
				}
				ymdhis += " " + h + ":";
				ymdhis += m + ":";
				ymdhis += s;
			}
			return ymdhis;
		},
		//日期转化为时间戳 日期格式:2019-03-03 11:11:00
		dateToUnix: function (string) {
			var f = string.split(' ', 2);
			var d = (f[0] ? f[0] : '').split('-', 3);
			var t = (f[1] ? f[1] : '').split(':', 3);
			return (new Date(
				parseInt(d[0], 10) || null,
				(parseInt(d[1], 10) || 1) - 1,
				parseInt(d[2], 10) || null,
				parseInt(t[0], 10) || null,
				parseInt(t[1], 10) || null,
				parseInt(t[2], 10) || null
			)).getTime() / 1000;
		},
		//js 时间戳转换成几分钟前，几小时前，几天前
		formatMsgTime: function (timespan) {
			var dateTime = new Date(timespan * 1000);
			var year = dateTime.getFullYear();
			var month = dateTime.getMonth() + 1;
			var day = dateTime.getDate();
			var hour = dateTime.getHours();
			var minute = dateTime.getMinutes();
			var second = dateTime.getSeconds();
			var now = new Date();
			var now_new = Date.parse(now.toString()); //typescript转换写法

			var milliseconds = 0;
			var timeSpanStr;
			milliseconds = now_new - timespan * 1000;
			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			};
			if (milliseconds <= 1000 * 60 * 1) {
				timeSpanStr = '刚刚';
			} else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
				timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
			} else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
				timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
			} else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 7) {
				timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
			} else if (milliseconds > 1000 * 60 * 60 * 24 * 7 && year == now.getFullYear()) {
				// timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
				timeSpanStr = month + '-' + day;
			} else {
				// timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
				timeSpanStr = year + '-' + month + '-' + day;
			}
			return timeSpanStr;
		},
		/** 
* 获得相对当前周AddWeekCount个周的起止日期 
* AddWeekCount为0代表当前周   为-1代表上一个周   为1代表下一个周以此类推
* **/ 
	 getWeekStartAndEnd:function(AddWeekCount) { 
			//起止日期数组   
			var startStop = new Array(); 
			//一天的毫秒数   
			var millisecond = 1000 * 60 * 60 * 24; 
			//获取当前时间   
			var currentDate = new Date();
			//相对于当前日期AddWeekCount个周的日期
			currentDate = currentDate.getTime() + (millisecond * 7*AddWeekCount);
			var currentDate1 = new Date(currentDate);
			//返回date是一周中的某一天
			var week = currentDate1.getDay(); 
			//返回date是一个月中的某一天   
			var month = currentDate1.getDate();
			//减去的天数   
			var minusDay = week != 0 ? week - 1 : 6; 
			//获得当前周的第一天  (时间戳) 
			var currentWeekFirstDay = (currentDate - (millisecond * minusDay))/1000; 
			//获得当前周的最后一天（时间戳）
			 var currentWeekLastDay = (currentWeekFirstDay*1000 + (millisecond * 6))/1000;
			//添加至数组   
			startStop.push($.unixToDate(currentWeekFirstDay)); 
			startStop.push($.unixToDate(currentWeekLastDay)); 
		   
			return startStop; 
		} 


	});
	//封装ajax
	ajax = function (url, data, success, cache, alone, async, type, dataType, error) {
		// var urls = base + url + "&" +  Math.random();
		var urls = base + url;
		var type = type || 'post';//请求类型
		var dataType = dataType || 'json';//接收数据类型
		var async = async || true;//异步请求
		var alone = alone || false;//独立提交（一次有效的提交）
		var cache = cache || false;//浏览器历史缓存
		var success = success || function (data) {
				console.log('请求成功');
				setTimeout(function () {
					alert(data.msg);//通过layer插件来进行提示信息
				}, 500);
				if (data.status) {//服务器处理成功
					setTimeout(function () {
						if (data.url) {
							location.replace(data.url);
						} else {
							location.reload(true);
						}
					}, 1500);
				} else {//服务器处理失败
					alert("服务器处理失败");
				}

		};
		var error = error || function (data) {
			console.log(data.result);
			setTimeout(function () {
				if (data.status == 404) {
					alert('请求失败，请求未找到');
				} else if (data.status == 503) {
					alert('请求失败，服务器内部错误');
				} else {
					alert('请求失败,网络连接超时');
				}
			}, 1500);
		};
		/*判断是否可以发送请求*/
		// if(!ajaxStatus){
		// 	return false;
		// }else{
		//ajaxStatus = false;//禁用ajax请求
		/*正常情况下1秒后可以再次多个异步请求，为true时只可以有一次有效请求（例如添加数据）*/
		// if(!alone){
		// 	setTimeout(function () {
		// 		ajaxStatus = true;
		// 	},1000);
		// }
	
		$.ajax({
			'url': urls,
			'data': data,
			'headers': headers,
			'type': type,
			'dataType': dataType,
			'async': async,
			'cache': cache,
			'success': success,
			'error': error,
			'jsonpCallback': 'jsonp' + (new Date()).valueOf().toString().substr(-4),//通过jsonp跨域请求的回调函数名
			'beforeSend': function () {
				
			 },//请求前要处理的函数
			}).always(function(res) {//结束后的处理函数，不管成功失败都执行
					if(res.result === 20009){
						console.log(res);
						alert('您的账号已在其他地方登录');
						deletCookie();
						ajaxStatus = false;
						console.log(ajaxStatus);
						window.location.reload(base+'/login.html');
						return false;
					}
				 })//成功后的处理函数,res为服务器返回的数据
		.done(function(res) {
			if(res.result === 20009){
						deletCookie();
						ajaxStatus = false;
						window.location.reload(base+'/login.html');
						return false;
			}
		});
	}
		//失败后的处理函数
		// .fail(function() {
		// 	console.log("error");
		// 	console.log(res);
		// });
	//};
})(jQuery);

//ie阻止冒泡事件的兼容写法
function stopPropagation(e) {
	e = window.event || e;
	if (document.all) {  //只有ie识别
		e.cancelBubble = true;
	} else {
		e.stopPropagation();
	}
}
//IE8，解决"console"未定义错误
window.console = window.console || (function () {
	var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile
		= c.clear = c.exception = c.trace = c.assert = function () { };
	return c;
})();
