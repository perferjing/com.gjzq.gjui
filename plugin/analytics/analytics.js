/*!
 * analytics.js v0.0.2
 * Copyright 2018 Gjzq
 * creator by jingws 2018-10-16
 * modify
 * dependence 
 */
(function(root, undefined) {
	/* --- Setup --- */

	// Create the local library object, to be exported or referenced globally
	// later
	var lib = {};

	// Current version
	lib.version = '0.0.2';

	var redirctId, timeIn, timeOut;
	var dwelling_time_key = "analytics:dwelling_time_key";
	// 原生js的ajax
	var Ajax = {
		get : function(url, fn) {
			// XMLHttpRequest对象用于在后台与服务器交换数据
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onreadystatechange = function() {
				// readyState == 4说明请求已完成
				if (xhr.readyState == 4 && xhr.status == 200
						|| xhr.status == 304) {
					// 从服务器获得数据
					fn.call(this, xhr.responseText);
				}
			};
			xhr.send();
		},
		// datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
		post : function(url, data, fn) {
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			// 添加http头，发送信息至服务器时内容编码类型
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4
						&& (xhr.status == 200 || xhr.status == 304)) {
					fn.call(this, xhr.responseText);
				}
			};
			xhr.send(data);
		}
	}
	function getRootPath_web() {
		var curWwwPath = window.document.location.href;
		var pathName = window.document.location.pathname;
		var pos = curWwwPath.indexOf(pathName);
		var localhostPaht = curWwwPath.substring(0, pos);
		var projectName = pathName
				.substring(0, pathName.substr(1).indexOf('/') + 1);
		return (localhostPaht + projectName);
	}
	
	
	// 不等onload直接执行
	// window.onload =
	init();
	function init() {
		// 每请求一次html，生成一个guid
		redirctId = guid();
		// 将redirct设置进cookie中，使得以后的ajax请求能带上
		document.cookie = "redirctId=" + redirctId + ";;path=/xje/";

		// 将上一次的页面浏览时间上传到服务器
		var val = localStorage.getItem(dwelling_time_key);
		if (val) {
			Ajax.post(getRootPath_web()+"/analytic/dwelling_time", val, function() {
			});
			localStorage.removeItem(dwelling_time_key);
		}
		// 记录页面开始时间
		timeIn = Date.now();
	}

	window.onunload = dwelling_time;
	function dwelling_time() {
		// var redirctId = getCookie('redirctId');
		var dataArr = {
			// 'url' : location.href,
			// 'refer' : getReferrer(),
			'redirctId' : redirctId,
			'timeIn' : timeIn,
			'timeOut' : Date.now()
		};
		console.log(redirctId);
		// onunload方法中无法将数据抛到服务器，暂存在localStorage中
		localStorage.setItem(dwelling_time_key, JSON.stringify(dataArr));
		// selfAjax("./analytic/dwelling_time", dataArr, "json", null);

	}

	// 取cookies函数
	function getCookie(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name
				+ "=([^;]*)(;|$)"));
		if (arr != null)
			return unescape(arr[2]);
		return null;
	}
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	function guid() {
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()
				+ S4() + S4());
	}
	function getReferrer() {
		var referrer = '';
		try {
			referrer = window.top.document.referrer;
		} catch (e) {
			if (window.parent) {
				try {
					referrer = window.parent.document.referrer;
				} catch (e2) {
					referrer = '';
				}
			}
		}
		if (referrer === '') {
			referrer = document.referrer;
		}
		return referrer;
	}

}(this));