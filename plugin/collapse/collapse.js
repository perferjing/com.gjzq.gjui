/*v 0.0.1 plugin by jws collapse.js 20181011
 *伸缩类
 *dependency mui-font,mui-css
 */
(function($) {

	let eles = document.getElementsByClassName('gjzq-collapse-line');
	for (let i = 0; i < eles.length; i++) {
		let ele = eles[i];
		ele.classList.add('gjzq-active');
		let rownum = ele.getAttribute('data-collapse-line-rownum');
		ele.style['-webkit-line-clamp'] = rownum;
		let iconEle = document.createElement("span");
		iconEle.classList.add('retract-arrow', 'mui-icon', 'mui-icon-arrowup',
				'mui-icon-arrowdown');
		ele.appendChild(iconEle);
		if (iconEle) {
			iconEle.classList.remove('mui-hidden');
			iconEle.addEventListener('tap', function() {
				ele.classList.toggle('gjzq-active');
				iconEle.classList.toggle('mui-icon-arrowdown');
			});
		}
	}
	
	mui('.gjzq-collapse').on('tap', '.mui-navigate-right', function(e) {
		this.parentElement.classList.toggle('mui-active');
		return false;
	});

})(mui)