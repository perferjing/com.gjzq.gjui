﻿com.gjzq.gjui
===

对前端常用js操作进行插件化，并进行版本管控。
期望规范前端开发模式，减少无效开发时间，并通过开发团队的迭代更新，达到组内的技术积累。

accounting.js
===
对货币及数字格式化的封装

analytics.js
===
对前端行为日志的封装，停留时间等  
tips:1.文件初始化会生成一次html加载的id，记在cookie中，传递到后台，记录行为日志
     2.js文件放在html文档最开始位置，保证在其他ajax执行前已刷新了当前页面的cookie

collpase.js
===
对页面折叠效果的封装

dateformat.js
===
对日期格式的封装

ilist.js
===
对前端多个tab页的上拉加载更多效果的列表进行封装，依赖mui  
demo：  
var ilist = new iList({  
		length : 4,//实例数  
		refreshIndex : [ 3 ],  
		storage : storage,//缓存体  
		activetab : (GetQueryString('activetab') || 0),//页面加载时默认展现第几个tab  
		urls : [ "zhgc/mnzhList", "zhgc/mnzhList", "zhgc/mnzhList",  
				"zhgc/mnzhList" ],//请求url  
		presort : [ 'viewType:recommend|', 'viewType:gjlh|', 'viewType:lhlh|',  
				'viewType:my|' ],//预设置的筛选参数  
		funs : [ getHtml2, getHtml0, getHtml1, getHtml3 ],//html模板  
		nullmsg : [ '暂无匹配您风格偏好的示范模拟盘。', , , '您还没有关注的组合' ]//为空时的话术  
	});  

mystorage.js
===
对浏览器localstorage缓存的操作封装


