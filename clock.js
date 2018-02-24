/*
	created by 符东伟
	2016-08-17
*/

$.extend({
	clock: function(options) {
		var option = {
			el: '', //element的id   字符串
			//是否为静态时间
			time: {
				isStatic: false,
				timestamp: 0
			},
			//时钟的边界
			border: {
				type: "circle", //边界类型（圆、四边形）;circle(圆形) 、 rectangle(四边形)
				setCircle: {
					radius: 150,
					lineWidth: 6,
					color: '#bbb'
				},
				setRectangle: {
					width: 300,
					height: 300,
					lineWidth: 6,
					color: '#bbb'
				}
			},
			//背景
			background: {
				isBackground: false,
				color: "",
				image: ''
			},
			//针
			needle: {
				second: {
					length: 100,
					color: '#aaa',
					lineWidth: 3,
					longOut: 0,
				},
				minute: {
					length: 110,
					color: '#999',
					lineWidth: 4,
					longOut: 0,
				},
				hour: {
					length: 70,
					color: '#888',
					lineWidth: 4,
					longOut: 0,
				},
			},
			//刻度
			dial: {
				isDial: true, //是否要刻度
				distance: 0, //刻度与边界的距离
				maxLength: 8,
				minLength: 5,
				maxWidth: 3,
				minWidth: 2,
				color: '#888'
			},
			//时钟的数字
			number: {
				isNumber: true, //是否要数字
				type: "arabic", //数字类型，罗马：“roman”；阿拉伯：“arabic”（默认）
				color: "#777",
				fontSize: "19px",
				fontWeight: "normal",
				fontFamily: "微软雅黑",
				radius: 125,
			}
		}
		option = $.extend(true, option, options);
		if (option.border.type == 'rectangle') {
			if (option.border.setRectangle.width <= option.border.setRectangle.height) {
				option.border.setCircle.radius = option.border.setRectangle.width / 2;
			} else {
				option.border.setCircle.radius = option.border.setRectangle.height / 2;
			}
		}

		//过渡参数
		var transitionOption = {
			bgImg: ''
		}
		var sAngle, mAngle, hAngle;
		var clockCanvas = document.createElement('canvas');
		var parent = $(option.el);
		clockCanvas.width = parent.width();
		clockCanvas.height = parent.height();
		parent.append(clockCanvas);
		var context = clockCanvas.getContext('2d');

		//初始时间
		function newData() {
			var nd = option.time.isStatic ? new Data(option.time.timestamp) : new Date()
			var hour = nd.getHours();
			var minute = nd.getMinutes();
			var second = nd.getSeconds();
			sAngle = Math.PI * 2 * (second % 60) / 60;
			mAngle = Math.PI * 2 * (minute % 60) / 60 + sAngle / 60;
			hAngle = Math.PI * 2 * (hour % 12) / 12 + mAngle / 12;

		}


		//边界
		function rounds() {
			if (option.border.type == 'rectangle') {
				rectangle();
				return;
			}
			context.save();
			context.translate(clockCanvas.width / 2, clockCanvas.height / 2);
			context.beginPath();
			context.arc(0, 0, option.border.setCircle.radius, 0, Math.PI * 2, true);
			context.closePath();
			context.strokeStyle = option.border.setCircle.color;
			context.lineWidth = option.border.setCircle.lineWidth;
			context.stroke();
			context.restore();
		}

		function rectangle() {
			context.save();
			context.translate(clockCanvas.width / 2, clockCanvas.height / 2);
			context.beginPath();
			context.rect(-option.border.setRectangle.width / 2, -option.border.setRectangle.height / 2, option.border.setRectangle.width, option.border.setRectangle.height);
			context.closePath();
			context.strokeStyle = option.border.setRectangle.color;
			context.lineWidth = option.border.setRectangle.lineWidth;
			context.stroke();
			context.restore();
		}


		//背景图片
		function bgImag() {
			if (!option.background.isBackground) {
				return;
			}
			context.save();
			context.beginPath();
			context.translate(clockCanvas.width / 2, clockCanvas.height / 2);
			var x, y;
			if (option.border.type == 'rectangle') {
				context.rect(-option.border.setRectangle.width / 2, -option.border.setRectangle.height / 2, option.border.setRectangle.width, option.border.setRectangle.height);
				x = -option.border.setRectangle.width / 2;
				y = -option.border.setRectangle.height / 2;
			} else {
				context.arc(0, 0, option.border.setCircle.radius, 0, Math.PI * 2, true);
				x = -option.border.setCircle.radius;
				y = -option.border.setCircle.radius;
			}
			if (option.background.color && !option.background.image) {
				context.fillStyle = option.background.color;
				context.fill();
			}
			if (option.background.image) {
				var image = new Image();

				if (!transitionOption.bgImg) {
					image.src = option.background.image;
					image.onload = function() {
						transitionOption.bgImg = image;
					}

				} else {
					image = transitionOption.bgImg;
				}

				var sx, sy, autow;
				if (image.width >= image.height) {
					sx = (image.width - image.height) / 2;
					sy = 0;
					autow = image.height;
				} else {
					sx = 0;
					sy = (image.height - image.width) / 2;
					autow = image.width;
				}

				context.clip();
				context.drawImage(image, sx, sy, autow, autow, x, y, -x * 2, -y * 2);
			}
			context.closePath();
			context.restore();
		}

		//数字
		function number() {
			if (!option.number.isNumber) return;
			var num = [];
			for (var i = 1; i < 13; i++) {
				num[i - 1] = i + 3;
				if ((i + 3) > 12) {
					num[i - 1] = 3 - (12 - i);
				}
			}
			if (option.number.type == 'roman') {
				for (var i = 0; i < 12; i++) {
					num[i] = intToRoman(num[i]);
				}
			}
			var ar = Math.PI / 6;
			context.save();
			context.fillStyle = option.number.color;
			context.font = option.number.fontWeight + ' ' + option.number.fontSize + ' ' + option.number.fontFamily;
			context.textBaseline = "middle";
			context.textAlign = "center";
			context.translate(clockCanvas.width / 2, clockCanvas.height / 2);
			for (var i = 0; i < num.length; i++) {
				context.fillText(num[i], option.number.radius * Math.cos(ar * (i + 1)), option.number.radius * Math.sin(ar * (i + 1)));
			}
			context.restore();
		}

		function intToRoman(num) {
			var roman = ['I', 'V', 'X', 'L', 'C', 'D', 'M'];
			var numArr = num.toString().split('');
			for (var i = 0; i < numArr.length; i++) {
				var n = Number(numArr[numArr.length - 1 - i]);
				numArr[numArr.length - 1 - i] = '';
				if (n >= 5 && n < 9) {
					numArr[numArr.length - 1 - i] = roman[2 * i + 1];
					for (var j = 0; j < n - 5; j++) {
						numArr[numArr.length - 1 - i] += roman[2 * i];
					}
				} else if (n == 9) {
					numArr[numArr.length - 1 - i] = roman[2 * i] + roman[2 * i + 2];
				} else if (n == 4) {
					numArr[numArr.length - 1 - i] = roman[2 * i] + roman[2 * i + 1];
				} else {
					for (var j = 0; j < n; j++) {
						numArr[numArr.length - 1 - i] += roman[2 * i];
					}
				}
			}
			return numArr.join('');
		}

		//针
		function needle(h, m, s) {
			context.save();
			context.translate(clockCanvas.width / 2, clockCanvas.height / 2);

			line({
				x: 0,
				y: option.needle.hour.longOut
			}, h, option.needle.hour.length, option.needle.hour.color, option.needle.hour.lineWidth); //时针
			line({
				x: 0,
				y: option.needle.minute.longOut
			}, m, option.needle.minute.length, option.needle.minute.color, option.needle.minute.lineWidth); //分针
			line({
				x: 0,
				y: option.needle.second.longOut
			}, s, option.needle.second.length, option.needle.second.color, option.needle.second.lineWidth); //秒针

			context.restore();
		}

		//刻度
		function dial() {
			if (!option.dial.isDial) return;
			var degMinute = Math.PI * 2 / 60;
			var degFiveMinut = degMinute * 5;
			var degM = 0;
			var distance = option.dial.distance ? option.dial.distance + option.border.setCircle.lineWidth / 2 : option.border.setCircle.lineWidth / 2;
			if (option.dial.distance == 0) distance = option.border.setCircle.lineWidth / 2;
			var begainPosition = {
				x: 0,
				y: option.border.setCircle.radius - distance
			};
			for (var i = 0; i < 60; i++) {
				degM = degMinute * i;
				context.save();
				context.translate(clockCanvas.width / 2, clockCanvas.height / 2);
				if (i % 5 == 0) line(begainPosition, degM, option.dial.maxLength - begainPosition.y, option.dial.color, option.dial.maxWidth);
				else line(begainPosition, degM, option.dial.minLength - begainPosition.y, option.dial.color, option.dial.minWidth);
				context.restore();
			}
		}

		function line(starp, s, len, col, lw) {
			context.save();
			context.beginPath();
			context.rotate(s);
			context.moveTo(starp.x, starp.y);
			context.lineTo(0, -len);
			context.strokeStyle = col;
			context.lineWidth = lw;
			context.stroke();
			context.restore();
		}


		function draw() {
			newData();
			bgImag();
			rounds();
			number();
			needle(hAngle, mAngle, sAngle);
			dial();
		}
		draw();
		if (!option.time.isStatic) {
			setInterval(function() {
				context.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
				draw();
			}, 1000);
		}
	}
});