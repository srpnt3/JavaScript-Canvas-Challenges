function setup(callback) {

	// variables
	let vars = {
		canvas: document.getElementById("canvas"),
		ctx: this.canvas.getContext("2d"),
		width: window.innerWidth,
		height: window.innerHeight,
		mouse: {
			x: 0,
			y: 0
		},
	};

	// utilities
	let utilities = {
		getRandomNumber: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		getRandomFromArray: function (array) {
			return array[Math.floor(Math.random() * (array.length - 1))];
		},
		getPointAtCircle: function (coords, degrees, radius) {
			let radiants = degrees * Math.PI / 180;
			return {
				x: Math.cos(radiants) * radius + coords.x,
				y: Math.sin(radiants) * radius + coords.y
			};
		},
		getCenterPoint: function () {
			return {
				x: vars.width / 2,
				y: vars.height / 2
			};
		},
		getRandomBoolean: function () {
			return Math.floor(Math.random() * 2) === 1;
		},
		getDistance: function (p1, p2) {
			let xd = p2.x - p1.x;
			let yd = p2.y - p1.y;
			return {
				x: xd,
				y: yd,
				d: Math.sqrt(xd*xd + yd*yd)
			}
		},
		getDirection: function (distance) {
			return {
				x: distance.x / distance.d,
				y: distance.y / distance.d
			};
		},
		round: function (number, decimals) {
			decimals = Math.pow(10, decimals);
			return Math.round(number * decimals) / decimals;
		},
		getSphereDiameter: function (mass, density) { // mass: kg, density: g/cm3
			return Math.pow((mass / (density * 1000)) / (4 / 3 * Math.PI), 1 / 3) * 2; // in m
		},
		rgbToHex: function (rgb) {
			let x = rgb.toString().split(","),
				r = Math.round(parseInt(x[0])),
				g = Math.round(parseInt(x[1])),
				b = Math.round(parseInt(x[2]));
			return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		},
		hexToRgb: function (hex) {
			let x = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return Math.round(parseInt(x[1], 16)) + "," + Math.round(parseInt(x[2], 16)) + "," + Math.round(parseInt(x[3], 16));
		},
		complexFunctions: {
			add: function (a, b) {
				return {
					re: a.re + b.re,
					im: a.im + b.im
				}
			},
			subtract: function (a, b) {
				return {
					re: a.re - b.re,
					im: a.im - b.im
				}
			},
			multiply: function (a, b) {
				return {
					re: (a.re * b.re) - (a.im * b.im),
					im: (a.re * b.im) + (a.im * b.re)
				}
			},
			divide: function (a, b) {
				let co = (1/(Math.pow(b.re, 2) + Math.pow(b.im, 2)));
				return {
					re: co * ((a.re * b.re) + (a.im * b.im)),
					im: co * ((a.im * b.re) - (a.re * b.im))
				}
			},
			getAbsoluteValue(a) {
				return Math.sqrt((Math.pow(a.re, 2) + Math.pow(a.im, 2)));
			}/*,
			pow: function (a, x) {

			},
			root: function (a, x) {
				
			}*/
		}
	};

	vars.canvas.addEventListener('mousemove', function (e) {
		let r = vars.canvas.getBoundingClientRect();
		vars.mouse.x = e.clientX - r.left;
		vars.mouse.y = e.clientY - r.top;
	});

	window.addEventListener('resize', function () {
		vars.width = window.innerWidth;
		vars.height = window.innerHeight;
		vars.canvas.width = vars.width;
		vars.canvas.height = vars.height;
		challenge.resize();
	}, false);

	// start callback
	vars.canvas.width = vars.width;
	vars.canvas.height = vars.height;
	let challenge = callback(vars, utilities);
	let ms = 33;
	if (typeof challenge.fps !== "undefined") ms = 1000 / challenge.fps;
	challenge.start();
	setInterval(challenge.update, ms);
}

function description() {
	document.getElementsByClassName("description")[0].classList.toggle("visible");
}
