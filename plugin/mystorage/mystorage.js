/**
* v1.0.0
*
*
*/

function mystorage(ms) {
	var storage = window.localStorage;
	if (!window.localStorage) {
		alert("浏览器支持localstorage");
		return false;
	}

	var set = function(key, value, expire) {
		// 存储
		var mydata = storage.getItem(ms);
		if (!mydata) {
			this.init();
			mydata = storage.getItem(ms);
		}
		mydata = JSON.parse(mydata);
		if (!!expire) {
			var curTime = new Date().getTime();
			mydata.data[key] = {
				'value' : value,
				'time' : curTime,
				'expire' : expire
			};
		} else {
			mydata.data[key] = {
				'value' : value
			};
		}
		try {
			storage.setItem(ms, JSON.stringify(mydata));
		} catch (oException) {
			if (oException.name == 'QuotaExceededError') {
				console.log('超出本地存储限额！');
				// 先删过期缓存
				_clearTimeOut();
				try {
					storage.setItem(ms, JSON.stringify(mydata));
				} catch (oException) {
					if (oException.name == 'QuotaExceededError') {
						//删命名空间缓存
						clear();
						try {
							storage.setItem(ms, JSON.stringify(mydata));
						} catch (oException) {
							if (oException.name == 'QuotaExceededError') {
								//删所有缓存
								storage.clear();
								storage.setItem(ms, JSON.stringify(mydata));
							}
						}
					}
				}
			}
		}

		return mydata.data;

	};
	var _clearTimeOut = function() {
		// 存储
		var mydata = storage.getItem(ms);
		if (!mydata) {
			this.init();
			mydata = storage.getItem(ms);
		}
		mydata = JSON.parse(mydata);
		for (item in mydata.data) {
			if (mydata.data[item].expire && mydata.data[item].time) {
				if (new Date().getTime() - mydata.data[item].time > mydata.data[item].expire) {
					delete mydata.data[item];
				}
			}
		}
		storage.setItem(ms, JSON.stringify(mydata));
	};
	var get = function(key) {
		// 读取
		var mydata = storage.getItem(ms);
		if (!mydata) {
			return null;
		}
		mydata = JSON.parse(mydata);
		if (!mydata.data[key])
			return false;
		if (mydata.data[key].expire && mydata.data[key].time) {
			if (new Date().getTime() - mydata.data[key].time > mydata.data[key].expire) {
				return null;
			} else {
				return mydata.data[key].value;
			}
		}

		return mydata.data[key].value;
	};

	var remove = function(key) {
		// 读取
		var mydata = storage.getItem(ms);
		if (!mydata) {
			return false;
		}

		mydata = JSON.parse(mydata);
		delete mydata.data[key];
		storage.setItem(ms, JSON.stringify(mydata));
		return mydata.data;
	};

	var clear = function() {
		// 清除对象
		storage.removeItem(ms);
	};

	var init = function() {
		storage.setItem(ms, '{"data":{}}');
	};

	return {
		set : set,
		get : get,
		remove : remove,
		init : init,
		clear : clear
	};
}