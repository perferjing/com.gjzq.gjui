/**
 * plugin name : mui复杂列表插件 author : jingws date : 2017-12-25 version : 1.0.1 尼玛
 * 累死我了
 */

(function(window, doc) {
	var hasInit = false;
	// var _sort, _presort, _asc, _urls, _hasMemory, _count, _rows, _total,
	// _wappers, _y, _scrollObj, _slider, _refreshIndex, _funs, _nullmsg,
	// this.container;
	var $ = mui;
	// 恢复sort状态位
	_reloadSortEle = function(sortObj) {
		if (sortObj) {
			for ( var item in sortObj) {
				var ele = document.getElementById(item);
				if (ele) {
					ele.innerHTML = sortObj[item];
				}
			}
		}
	};
	// 初始化数组
	_sameArr = function(val, len) {
		var _TheArray = new Array();
		for (var i = 0; i < len; i++) {
			_TheArray[i] = val;
		}
		return _TheArray;
	};
	// 初始化激活tab
	_activeTab = function(container, activetab) {
		if (activetab && !isNaN(activetab)) {
			var aEles = mui(container
					+ ' .mui-segmented-control a.mui-control-item');
			var aele = aEles[activetab];
			if (aEles && aele) {
				for (var i = 0; i < aEles.length; i++) {
					aEles[i].classList.remove('mui-active');
					mui(aEles[i].getAttribute('href'))[0].classList
							.remove('mui-active');
				}
				aele.classList.add('mui-active');
				mui(aele.getAttribute('href'))[0].classList.add('mui-active');
			}
		}
	};
	// Constructor
	iList = function(options) {

		var self = this;
		this.cacheListStatus = function() {
			var expire = 1000 * 60 * 2;
			var listObj = {
				'activetab' : this.slider ? this.slider.getSlideNumber() : 0,
				'count' : this.count,
				'total' : this.total,
				'sort' : this.sort
			};
			if (this.wappers instanceof Array) {
				var ys = new Array(this.wappers.length);
				if (this.wappers.length) {
					for (var i = 0; i < this.wappers.length; i++) {
						ys[i] = this.wappers[i].y;
					}
					listObj['y'] = ys;
				}
			} else
				listObj['y'] = this.wappers.y;
			// 记录sort状态位
			var sortObj = {};
			mui.each(document
					.querySelectorAll(this.container + ' .sort ul[id]'),
					function(i, ele) {
						sortObj[ele.getAttribute('id')] = ele.innerHTML;
					});
			listObj['sortEle'] = sortObj;
			if (this.storage)
				this.storage.set('listCache', JSON.stringify(listObj), expire);
		};

		this.reloadScrollHeight = function() {
			// 自动计算出高度
			for ( var d in this.wappers) {
				var top = 0;
				var preele = this.wappers[d].element.previousSibling;
				while (preele) {
					if (preele.scrollHeight)
						top += preele.offsetHeight;
					preele = preele.previousSibling;
				}
				this.wappers[d].element.style.top = top + 'px';
			}
		};
		this.activeTab = function(i) {
			this.activeTab(i);
		};
		this.pullupRefresh = function() {

			// var self = this;
			var index = this.element.parentElement.getAttribute("index");
			var con_drop = this.element.parentElement.getAttribute("con_drop");
			// drop查询条件
			self.sort[index] = self.presort[index];
			// var con_drop = self.con_drops[index];//
			// self.element.parentElement.getAttribute("con_drop");
			if (con_drop)
				mui.each(con_drop.split(','), function(i, ele) {
					var obj = document.getElementById(ele);
					if (obj) {
						var name = obj.getAttribute('wName');
						var activeLI = obj.querySelectorAll(self.container
								+ ' .active');
						if (activeLI && activeLI.length > 0) {
							var value = '';
							for (i = 0; i < activeLI.length; i++) {
								value += ',' + activeLI[i].getAttribute('val');
							}
							self.sort[index] += name + ":" + value.substr(1)
									+ "|";
							// 如果是排序字段 判断asc还是desc
							if (name == 'order') {
								if (activeLI[0].classList.contains('sort-up')) {
									self.asc[index] = 'asc';
								} else if (activeLI[0].classList
										.contains('sort-down')) {
									self.asc[index] = 'desc';
								}
							}
						} else if (obj.getAttribute('defaultValue') != null) {
							self.sort[index] += name + ":"
									+ obj.getAttribute('defaultValue') + "|";
						}
					}
				});
			/*
			 * //闭包处理 ((function(ilist){
			 * 
			 * }(ilist)));
			 */

			self.getData(index, this);

		};
		/*
		 * this.getDataProcess=function(jsonObj){ };
		 */
		this.getData = function(index, comp) {
			var ilistObj = this;
			if (!!!this.urls[index])
				return;
			selfAjax(
					this.urls[index],
					{
						page : this.hasMemory[index] ? 1 : this.count[index],
						rows : this.hasMemory[index] ? (this.rows[index] * (--this.count[index]))
								: this.rows[index],
						asc : this.asc[index],
						sort : this.sort[index]
					},
					"json",
					function(jsonObj) {
						;
						if (jsonObj && jsonObj.result == "S"
								&& jsonObj.attach.data
								&& jsonObj.attach.data.list
								&& jsonObj.attach.data.list.length > 0
								&& jsonObj.attach.data.list[0].total) {
							ilistObj.total[index] = Math
									.ceil(jsonObj.attach.data.list[0].total
											/ ilistObj.rows[index]);
						} else {
							ilistObj.total[index] = 0;
						}
						var html = ilistObj.funs[index](index, jsonObj, comp);// eval('getHtml'
						var scrollList = comp.element
								.getElementsByClassName('data-container')[0];
						if (scrollList) {
							if (ilistObj.total[index] == 0) {
								comp.options.up.contentnomore = '';
								comp.endPullUpToRefresh(true);
								if (scrollList.nodeName == 'TBODY') {
									scrollList.innerHTML += '<tr style="background: white; margin: 10px 0; padding: 10px"><td colspan="1000"><div class="mui-col-xs-3"><img src="images/xiaojin-wnbq.png"></div><div class="mui-col-xs-9" style="float: right; margin-top: -77px;text-align: center;">'
											+ (ilistObj.nullmsg[index] || '没有数据了')
											+ '</div></td></tr>';
								} else {

									scrollList.innerHTML += '<div style="background: white; margin: 10px 0; padding: 10px"><div class="mui-col-xs-3"><img src="images/xiaojin-wnbq.png"></div><div class="mui-col-xs-9" style="float: right; margin-top: -77px;text-align: center;">'
											+ (ilistObj.nullmsg[index] || '没有数据了')
											+ '</div></div>';
								}
							} else {
								comp
										.endPullUpToRefresh((++ilistObj.count[index] > ilistObj.total[index])); // 参数为true代表没有更多数据了。
								scrollList.innerHTML += html;
								if (ilistObj.wappers instanceof Array) {
									if (ilistObj.y[index])
										ilistObj.wappers[index].scrollTo(0,
												Number(ilistObj.y[index]), 0);
								} else if (ilistObj.y) {
									ilistObj.wappers.scrollTo(0,
											Number(ilistObj.y), 0);
								}
							}
						}
					}, false);
			ilistObj.hasMemory[index] = false;
		};

		this.search = function() {
			// 获取活跃scroll index;
			var activetab = this.slider.getSlideNumber();
			var list = document.querySelectorAll(this.container
					+ ' .mui-slider-group .mui-slider-item');
			if (activetab != undefined) {
				this.y[activetab] = 0;
				this.count[activetab] = 1;

				list[activetab].querySelectorAll(this.container
						+ ' .data-container')[0].innerHTML = "";
				this.scrollObj[activetab].refresh(true); // 恢复滚动
				if (this.wappers instanceof Array) {
					this.wappers[activetab].scrollTo(0, 0, 100); // 滚动置顶
				} else
					this.wappers.scrollTo(0, 0, 100);
				this.scrollObj[activetab].pullUpLoading();
			}
		};
		this.init = function() {
			/*----------------------下拉筛选框事件 start------------------------*/
			// 筛选条件左右滑动效果
			mui.each(document.querySelectorAll(this.container + ' .sort'),
					function(i, ele) {
						ele.addEventListener('touchstart', function(e) {
							self.slider.stopped = true;
						});
						ele.addEventListener('touchend', function(e) {
							self.slider.stopped = false;
						});
					});
			mui.each(mui(this.container + ' .iscroll-wrapper'),
					function(i, ele) {
						ele.setAttribute('id', 'iscroll-wrapper' + i);
						new iScroll(ele.getAttribute('id'), {
							hScrollbar : false,
							vScrollbar : false,
							hideScrollbar : true,
							vScroll : false
						});
					});
			document
					.querySelector(this.container + '.mui-slider')
					.addEventListener(
							'slide',
							function(event) {
								searchConHide();
								if (self.refreshIndex
										&& self.refreshIndex
												.indexOf(event.detail.slideNumber) > -1) {
									self.search();
								}
							});
			if (document.getElementById('dropdownshade')) {
				document.getElementById('dropdownshade').addEventListener(
						'tap', searchConHide);
			}
			mui('.dropdown-head')
					.on(
							'tap',
							'div.mui-clearfix',
							function(e) {
								var id = this.getAttribute('for');
								if (id) {
									var dropdownBody = document
											.getElementById(id);
									if (dropdownBody) {
										/* 自动计算高度 */
										var height = getTop(this);
										dropdownBody.style.top = (height + this.offsetHeight)
												+ 'px';

										dropdownBody.classList
												.toggle('mui-hidden');
										if (document
												.getElementById('dropdownshade')) {
											document
													.getElementById('dropdownshade').classList
													.toggle('mui-hidden');
										}
									}
								}

							});
			mui('.dropdown-body').on('tap', 'button.search-btn', function(e) {
				searchConHide();
				this.search();
			});
			mui('.dropdown-body').on('tap', 'button.cancel-btn', function(e) {
				searchConHide();
			});
			$('.sort').on(
					'tap',
					'li',
					function(e) {
						var wtype = this.parentElement.getAttribute('wtype');
						var wname = this.parentElement.getAttribute('wname');
						var dclass = this.parentElement.getAttribute('dclass');
						var currClass = (e.srcElement.classList
								.contains('sort-up') ? 'sort-up' : '')
								|| (e.srcElement.classList
										.contains('sort-down') ? 'sort-down'
										: '');
						if (wtype == 'single') {
							// 将兄弟元素classlist移除active
							mui.each(e.srcElement.parentNode
									.getElementsByTagName('li'), function(i,
									ele) {
								ele.classList.remove('active');
								if (wname && wname == 'order') {
									ele.classList.remove('sort-up');
									ele.classList.remove('sort-down');
								}
							});
							if (wname) {
								e.srcElement.classList.add('active');
								if (wname == 'order') {
									if (currClass) {
										e.srcElement.classList
												.remove(currClass);
										if (currClass == 'sort-down') {
											e.srcElement.classList
													.add('sort-up');
										} else
											e.srcElement.classList
													.add('sort-down');
									} else if (dclass)
										e.srcElement.classList.add(dclass);
								}
							}
						} else if (wtype == 'multi') {
							e.srcElement.classList.toggle('active');
						}
						// 判断是否自动刷新（如果div中有保存按钮的话不刷新）
						if (!!!this.parentElement.parentElement
								.querySelector('.search-btn')) {
							self.search();
						}

					});
			mui('ul.gj-li-delete')
					.on(
							'tap',
							'li',
							function(e) {
								// 删除自己
								var pele = this.parentElement;
								pele.removeChild(this);
								// 判断是否自动刷新（如果div中有保存按钮的话不刷新）
								if (!!!pele.parentElement
										.querySelector('.search-btn')) {
									self.search();
								}
								document.getElementById('secumCode1')
										.setAttribute(
												'placeholder',
												document.getElementById(
														'secumCode1')
														.getAttribute('tip'));
							});
			function searchConHide() {
				// 隐藏所有筛选框
				mui.each(document.querySelectorAll(this.container
						+ ' .dropdown-body'), function(i, ele) {
					ele.classList.add("mui-hidden");
				});
				// 隐藏所有遮罩層
				if (document.getElementById('dropdownshade')) {
					document.getElementById('dropdownshade').classList
							.add("mui-hidden");
				}
			}
			/*----------------------下拉筛选框事件 end------------------------*/
		};
		self.length = options.urls.length;
		self.storage = options.storage;
		self.sort = options.sort || _sameArr("", self.length);
		self.asc = options.asc || _sameArr("desc", self.length);
		self.rows = options.rows || _sameArr("20", self.length);
		self.presort = options.presort || _sameArr("", self.length);
		self.urls = options.urls;
		self.funs = options.funs;
		self.refreshIndex = options.refreshIndex;
		// self.con_drops = options.con_drops || _sameArr("", self.length);
		self.nullmsg = options.nullmsg || _sameArr("", self.length);
		self.container = options.container || '#slider';
		var listCacheObj = {};
		self.hasMemory = false;
		if (self.storage) {
			var listCacheStr = self.storage.get('listCache');
			if (listCacheStr) {
				listCacheObj = JSON.parse(listCacheStr);
				// 恢复sort状态位
				_reloadSortEle(listCacheObj['sortEle']);
			}
			self.hasMemory = listCacheStr ? _sameArr(true, self.length)
					: _sameArr(false, this.length);
		}
		var activetab = listCacheObj['activetab'] || options.activetab || 0;
		// 初始化激活tab
		_activeTab(this.container, activetab);
		self.count = listCacheObj['count'] || _sameArr(1, self.length);
		self.total = listCacheObj['total'] || _sameArr(0, self.length);
		self.y = listCacheObj['y'] || _sameArr(0, self.length);

		self.wappers = mui(self.container + ' .content-wrapper').scroll({
			bounce : false,
			indicators : true, // 是否显示滚动条
			deceleration : mui.os.ios ? 0.003 : 0.0009
		// 阻尼系数
		});
		self.scrollObj = [];

		// 循环初始化所有下拉刷新，上拉加载。
		mui.each(document.querySelectorAll(self.container
				+ ' .mui-slider-group .mui-scroll'), function(index,
				pullRefreshEl) {
			var obj;
			if (self.urls[index]) {
				obj = mui(pullRefreshEl).pullToRefresh({
					up : {
						callback : self.pullupRefresh,
						auto : true
					}
				});
			}
			self.scrollObj.push(obj);
		});

		/*
		 * // 循环初始化所有下拉刷新，上拉加载。
		 * mui.each(document.querySelectorAll(this.container + '
		 * .mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
		 * 
		 * });
		 */

		self.slider = mui(this.container).slider();
		if (!hasInit) {
			self.init();
			hasInit = true;
		}

	};

	if (typeof exports !== 'undefined')
		exports.iList = iList;
	else
		window.iList = iList;
})(this, document);