// TAB_SIZE = 4

var TLS = {
	loadFile: function(file, type, callback, thisArg){
		thisArg = thisArg || this;
		
		var xhr = new XMLHttpRequest();
		xhr.open('GET', file, true);
		xhr.responseType = type;
		xhr.onload = function(){
			if(xhr.status === 200){
				callback.call(thisArg, xhr.response);
			}else{
				throw new Error("XMLHttpRequest to "+file+" failed: "+xhr.status+" "+xhr.statusText);
			}
		}
		xhr.onprogress = function(e){
			console.log("Loading "+file+": "+(Math.floor((e.loaded/e.total)*100))+"%");
		}
		xhr.send();
	},
	
	loadFiles: function(files, types, callback, thisArg){
		thisArg = thisArg || this;
		
		var loaded = 0;
		var loadedData = [];
		
		if(typeof types === "string"){
			var allTypes = types;
			types = Array(files.length);
			for(var i = 0; i < types.length; i++){
				types[i] = allTypes;
			}
		}
		
		files.forEach(function(file, index, all){
			TLS.loadFile(file, types[index], function(data){
				loaded++;
				loadedData[index] = data;
				
				if(loaded === all.length){
					callback.call(thisArg, loadedData);
				}
			});
		});
	},
	
	keyCodes: {
		'zero': 48,
		'one': 49,
		'two': 50,
		'three': 51,
		'four': 52,
		'five': 53,
		'six': 54,
		'seven': 55,
		'eight': 56,
		'nine': 57,
		
		'break': 3,
		'backspace': 8,
		'tab': 9,
		'clear': 12,
		'enter': 13,
		'shift': 16,
		'ctrl': 17,
		'alt': 18,
		'pause': 19,
		'capsLock': 20,
		'escape': 27,
		'spacebar': 32,
		'pageUp': 33,
		'pageDown': 34,
		'end': 35,
		'home': 36,
		'left': 37,
		'up': 38,
		'right': 39,
		'down': 40,
		'select': 41,
		'print': 42,
		'execute': 43,
		'printScreen': 44,
		'insert' : 45,
		'delete': 46,
		
		'a': 65,
		'b': 66,
		'c': 67,
		'd': 68,
		'e': 69,
		'f': 70,
		'g': 71,
		'h': 72,
		'i': 73,
		'j': 74,
		'k': 75,
		'l': 76,
		'm': 77,
		'n': 78,
		'o': 79,
		'p': 80,
		'q': 81,
		'r': 82,
		's': 83,
		't': 84,
		'u': 85,
		'v': 86,
		'w': 87,
		'x': 88,
		'y': 89,
		'z': 90,
		
		'numpadZero' : 96,
		'numpadOne' : 97,
		'numpadTwo' : 98,
		'numpadThree' : 99,
		'numpadFour' : 100,
		'numpadFive' : 101,
		'numpadSix' : 102,
		'numpadSeven' : 103,
		'numpadEight' : 104,
		'numpadNine' : 105,
		'multiply' : 106,
		'add': 107,
		'subtract' : 109,
		'decimalPoint': 110,
		'divide' : 111,
		
		'f1' : 112,
		'f2' : 113,
		'f3' : 114,
		'f4' : 115,
		'f5' : 116,
		'f6' : 117,
		'f7' : 118,
		'f8' : 119,
		'f9' : 120,
		'f10': 121,
		'f11': 122,
		'f12': 123,
		'f13': 124,
		'f14': 125,
		'f15': 126,
		'f16': 127,
		'f17': 128,
		'f18': 129,
		'f19': 130,
		
		'numLock' : 144,
		'scrollLock': 145,
		'semiColon' : 186,
		'equalSign' : 187,
		'comma': 188,
		'dash' : 189,
		'period' : 190,
		'forwardSlash': 191,
		'graveAccent' : 192,
		'openBracket' : 219,
		'backSlash' : 220,
		'closeBracket' : 221,
		'singleQuote' : 222,
		'altgr': 225,
		'toggleTouchpad': 255
	},
	
	gamepads: (function() {
		var gpl = [];
		
		window.addEventListener('gamepadconnected', function(e) {
			console.log('Gamepad connected: '+e.gamepad.id);
			gpl.push(e.gamepad);
		});
		
		return gpl;
	})(),
	
	isKeyDown: (function() {
		var status = [];
		
		window.addEventListener('keydown', function(e) {
			e.preventDefault();
			
			status[e.keyCode] = true;
		});
		
		window.addEventListener('keyup', function(e) {
			e.preventDefault();
			
			status[e.keyCode] = false;
		});
		
		return function(k) {
			return !!status[k];
		}
	})()
};

// Utils
// object.watch
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop, handler) {
			var
			  oldval = this[prop]
			, newval = oldval
			, getter = function () {
				return newval;
			}
			, setter = function (val) {
				oldval = newval;
				return newval = handler.call(this, prop, oldval, val);
			}
			;
			
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					  get: getter
					, set: setter
					, enumerable: true
					, configurable: true
				});
			}
		}
	});
}

// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}

function mixin(a, b) {
	var m = {};
	
	for(var x in a) {
		m[x] = a[x];
	}
	
	for(var x in b) {
		m[x] = b[x];
	}
	
	return m;
}

function prettyTime(s) {
	s = s || 0;
	
	var seconds = (s % 60) | 0;
	var minutes = (s / 60 % 60) | 0;
	var hours = (s / 3600) | 0;
	
	if(hours) return hours+':'+('0'+minutes).substr(-2)+':'+('0'+seconds).substr(-2);
	else return minutes+':'+('0'+seconds).substr(-2);
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
	r = Math.max(r, 0);
	if(r === 0) {
		this.beginPath();
		this.rect(x, y, w, h);
		return;
	}
	
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y,   x+w, y+h, r);
	this.arcTo(x+w, y+h, x,   y+h, r);
	this.arcTo(x,   y+h, x,   y,   r);
	this.arcTo(x,   y,   x+w, y,   r);
	this.closePath();
}

function isNullOrUndef(v) { return (v === null || v === undefined); }
function EnumerationValue(ownerEnum, name) {
	this.name = name;
	this.ownerEnum = ownerEnum;
}
EnumerationValue.prototype.toJSON = function() {
	return this.name;
};
EnumerationValue.prototype.toString = EnumerationValue.prototype.toJSON;

function Enumeration(vals) {
	if(!Array.isArray(vals)) {
		throw new Error('No values specified for the Enumeration');
	}
	
	for(var i = 0; i < vals.length; i++) {
		this[vals[i]] = new EnumerationValue(this, vals[i]);
	}
}

// ----- CLASSES -----
function Sprite(opts) {
	opts = opts || {};
	
	this.img = opts.img ? opts.img : null;
	
	this.sizeX = isNullOrUndef(opts.sizeX) ? (isNullOrUndef(opts.size) ? 1.0 : opts.size) : opts.sizeX;
	this.sizeY = isNullOrUndef(opts.sizeY) ? (isNullOrUndef(opts.size) ? 1.0 : opts.size) : opts.sizeY;
}

function GameObject(opts) {
	opts = opts || {};
	
	var parent = null;
	
	Object.defineProperty(this, 'parent', {
		get: function() {
			return parent;
		},
		
		set: function(nv) {
			if(parent !== nv) {
				if(parent !== null) {
					parent.children.splice(parent.children.indexOf(this), 1);
				}
				
				parent = nv;
				
				if(parent) {
					parent.children.push(this);
				}
			}
			
			return nv;
		}
	});
	
	this.addChildren = function() {
		for(var i = 0; i < arguments.length; i++) {
			arguments[i].parent = this;
		}
	}
	
	Object.defineProperty(this, "addChildren", {
		enumerable: false
	});
	
	this.visible = isNullOrUndef(opts.visible) ? true : opts.visible;
	this.opacity = isNullOrUndef(opts.opacity) ? 1 : opts.opacity;
	
	this.children = [];
	
	this.position = new NATH.Vec2(opts.position);
	this.orientation = opts.orientation || 0;
	
	this.sprite = opts.sprite || null;
	this.shape = opts.shape || null;
	
	this.shapeColor = opts.shapeColor || "white";
	this.shapeStrokeColor = opts.shapeStrokeColor || "black";
	
	this.drawBehindParent = isNullOrUndef(opts.drawBehindParent) ? false : opts.drawBehindParent;
	
	this.shapeOutline = isNullOrUndef(opts.shapeOutline) ? false : opts.shapeOutline;
	this.shapeFill = isNullOrUndef(opts.shapeFill) ? true : opts.shapeFill;
	this.shapeLineWidth = isNullOrUndef(opts.shapeLineWidth) ? 0.05 : opts.shapeLineWidth;
}

function Vehicle(opts) {
	opts = opts || {};
	
	GameObject.call(this, opts);
	
	this.frtWheelDst = isNullOrUndef(opts.frtWheelDst) ? 3.7 : opts.frtWheelDst;
	this.bckWheelDst = isNullOrUndef(opts.bckWheelDst) ? 3.7 : opts.bckWheelDst;
	this.length = isNullOrUndef(opts.length) ? 12 : opts.length;
	this.width = isNullOrUndef(opts.width) ? 2.5 : opts.width;
	
	this.wheelConeAngle = isNullOrUndef(opts.wheelConeAngle) ? 85 : opts.wheelConeAngle;
	this.wheelOrientSpeed = isNullOrUndef(opts.wheelOrientSpeed) ? 1/700 : opts.wheelOrientSpeed;
	this.wheelOrientation = isNullOrUndef(opts.wheelOrientation) ? 0 : opts.wheelOrientation;
	this.engineForce = isNullOrUndef(opts.engineForce) ? 0 : opts.engineForce;
	this.enginePing = isNullOrUndef(opts.enginePing) ? 2 : opts.enginePing;
	
	this.brakeForce = isNullOrUndef(opts.brakeForce) ? 0.9 : opts.brakeForce;
	
	this.acceleration = isNullOrUndef(opts.acceleration) ? 1/700 : opts.acceleration;
	this.speed = 0;
	this.maxSpeed = isNullOrUndef(opts.maxSpeed) ? 27.8 : opts.maxSpeed;
	
	this.shape = new NATH.Rect2(this.length, this.width);
	this.shapeColor = "#ddd";
	
	this.shapeOutline = true;
	
	var wheelShape = new NATH.Rect2(0.9, 0.4);
	
	this.leftBackWheelObj = new GameObject({
		shape: wheelShape,
		shapeColor: "#111",
		position: [-this.frtWheelDst, this.width/2],
		
		drawBehindParent: true
	});
	this.leftFrontWheelObj = new GameObject({
		shape: wheelShape,
		shapeColor: "#111",
		position: [this.bckWheelDst, this.width/2],
		
		drawBehindParent: true
	});
	this.rightBackWheelObj = new GameObject({
		shape: wheelShape,
		shapeColor: "#111",
		position: [-this.frtWheelDst, -this.width/2],
		
		drawBehindParent: true
	});
	this.rightFrontWheelObj = new GameObject({
		shape: wheelShape,
		shapeColor: "#111",
		position: [this.bckWheelDst, -this.width/2],
		
		drawBehindParent: true
	});
	
	// True when "actionGaz" has been called since the last forces apply.
	this.hasGazzed = false;
	
	this.addChildren(this.leftBackWheelObj, this.rightBackWheelObj, this.leftFrontWheelObj, this.rightFrontWheelObj);
}

Vehicle.prototype = mixin(GameObject.prototype, {
	actionOrientWheels: function(side, dt) {
		this.wheelOrientation += ((side * this.wheelConeAngle/2) - this.wheelOrientation) * this.wheelOrientSpeed * dt;
		this.wheelOrientation = NATH.clamp(this.wheelOrientation, -this.wheelConeAngle/2, this.wheelConeAngle/2);
		
		this.leftFrontWheelObj.orientation = this.rightFrontWheelObj.orientation = this.wheelOrientation;
	},
	
	actionGaz: function(f, dt) {
		this.engineForce = NATH.lerp(this.engineForce, f, this.enginePing * (dt / 1000));
		
		this.hasGazzed = true;
	},
	
	actionBrake: function(f, dt) {
		this.speed = NATH.lerp(this.speed, 0, this.brakeForce * NATH.clamp(f, 0, 1) * (dt / 1000));
		this.engineForce = NATH.lerp(this.engineForce, 0, this.enginePing * (dt / 1000));
		
		if(Math.abs(this.speed) < 0.1) this.speed = 0;
		if(this.engineForce < 1/500) this.engineForce = 0;
	},
	
	applyForces: (function() {
		var bckWheel = new NATH.Vec2();
		var frtWheel = new NATH.Vec2();
		
		var dir = new NATH.Vec2();
		
		var posoffset = new NATH.Vec2();
		
		return function(dt) {
			this.getDirection(dir);
			
			if(!this.hasGazzed) this.engineForce = NATH.lerp(this.engineForce, 0, this.enginePing / 8 * (dt / 1000));
			this.speed = NATH.lerp(this.speed, this.maxSpeed * this.engineForce, this.acceleration);
			
			posoffset.set(dir).mul(this.speed * (dt / 1000));
			bckWheel.set(this.position).sub(dir.x * this.bckWheelDst, dir.y * this.bckWheelDst);
			frtWheel.set(this.position).add(dir.x * this.frtWheelDst, dir.y * this.frtWheelDst);
			
			bckWheel.add(posoffset);
			frtWheel.add(posoffset.rotateDeg(this.wheelOrientation));
			
			this.orientation = NATH.toDegrees(bckWheel.vectorTo(frtWheel).angle());
			this.position.set(bckWheel.add(frtWheel).div(2));
			
			this.hasGazzed = false;
		}
	})(),
	
	getDirection: function(dst) {
		dst = dst || new NATH.Vec2();
		
		return dst.set(Math.cos(NATH.toRadians(this.orientation)), Math.sin(NATH.toRadians(this.orientation)));
	}
});

Vehicle.prototype.constructor = Vehicle;

// ----- The actual app -----
var AudioContext = window.AudioContext || window.webkitAudioContext;

window.addEventListener('load', function() {
	var requestAnimationFrame =
		window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(callback){ setTimeout(callback, 1000/60); };
	
	var cvs = document.getElementById("cvs");
	var gtx = cvs.getContext('2d');
	var ctx = new AudioContext();
	
	var delta = 0;
	var lastFrameTime = Date.now();
	var thisFrameTime = Date.now();
	
	var csize = 0;
	var cw = 0;
	var ch = 0;
	
	var meterSize = 1/50;
	
	var scene = new GameObject();
	var bus = new Vehicle();
	
	var pad = null;

	function loop() {
		thisFrameTime = Date.now();
		delta = thisFrameTime - lastFrameTime;
		
		if(cvs.width != cvs.clientWidth || cvs.height != cvs.clientHeight) {
			cvs.width = cvs.clientWidth;
			cvs.height = cvs.clientHeight;
			
			aspect = cvs.width / cvs.height;
			csize = Math.min(cvs.width, cvs.height);
			cw = cvs.width / csize;
			ch = cvs.height / csize;
		}
		
		pad = TLS.gamepads[0];
		if(pad && pad.id === 'xinput') { // Microsoft Xbox 360 controller
			if(pad.buttons[7].pressed) bus.actionGaz(pad.buttons[7].value, delta);
			if(pad.buttons[6].pressed) bus.actionGaz(-pad.buttons[6].value, delta);
			bus.actionOrientWheels(-pad.axes[0], delta);
			if(pad.buttons[1].pressed) bus.actionBrake(1, delta);
		} else {
			if(TLS.isKeyDown(TLS.keyCodes.up)) bus.actionGaz(1, delta);
			if(TLS.isKeyDown(TLS.keyCodes.down)) bus.actionGaz(-1, delta);
			if(TLS.isKeyDown(TLS.keyCodes.left)) bus.actionOrientWheels(1, delta);
			if(TLS.isKeyDown(TLS.keyCodes.right)) bus.actionOrientWheels(-1, delta);
			if(TLS.isKeyDown(TLS.keyCodes.spacebar)) bus.actionBrake(1, delta);
		}
		
		bus.applyForces(delta);
		
		render();
		
		lastFrameTime = thisFrameTime;
		requestAnimationFrame(loop);
	}
	
	var render = (function() {
		// Funcs
		
		/*
			This renders a 100x100 city tile at position (x,y)
			It includes building(s) at the bottom left and roads
			at the top and right.
			By sticking tiles together, a city is obtained.
			
			Code by Antoine: https://github.com/antoineMoPa
		*/
		function renderTile(x, y, hue){
			// Building & sidewalk are at the bottom left of the tile

            // Turning radi
			var r = 2;

			gtx.save();
			gtx.translate(x, y);
			
			// Sidewalk
			gtx.fillStyle = "#eee";
			gtx.strokeStyle = "#444";
			gtx.lineWidth = 0.1;
			gtx.beginPath();
				gtx.roundRect(0,0,80,80,r);
				// Remove inner Rectangle
				// To avoid filling uselessly
				gtx.moveTo(3,3);
				gtx.lineTo(3,77);
				gtx.lineTo(77,77);
				gtx.lineTo(77,3);
			gtx.fill();
			gtx.stroke();
			
			gtx.fillStyle = "hsl("+hue+", 80%, 70%)";
			gtx.lineWidth = 0.5;
			gtx.strokeStyle = "hsl("+hue+", 80%, 30%)";
			gtx.beginPath();
				gtx.roundRect(2,2,76,76,1);
			gtx.fill();
			gtx.stroke();
			
			// Yellow road lines
			gtx.strokeStyle = "#fa1";
			gtx.lineWidth = 0.2;
			gtx.beginPath();
				gtx.moveTo(89.8,0);
				gtx.lineTo(89.8,80);
				gtx.moveTo(90.2,0);
				gtx.lineTo(90.2,80);

				gtx.moveTo(0,	89.8);
				gtx.lineTo(80,89.8);
				gtx.moveTo(0,	90.2);
				gtx.lineTo(80,90.2);
			gtx.stroke();
			
			// White road stop lines
			gtx.strokeStyle = "#eee";
			gtx.lineWidth = 0.8;
			gtx.beginPath();
				// Top road, coming from left
				gtx.moveTo(79.5,89.6);
				gtx.lineTo(79.5,80.2);
				// Right road, comming from bottom
				gtx.moveTo(90.6,79.5);
				gtx.lineTo(99.8,79.5);
				// Leaving to the bottom
				gtx.moveTo(80.2,0.5);
				gtx.lineTo(89.5,0.5);
				// Leaving through the left
				gtx.moveTo(0.5,90.5);
				gtx.lineTo(0.5,99.8);
			gtx.stroke();
			
			// White road dotted lines
			gtx.strokeStyle = "#eee";
			gtx.lineWidth = 0.2;
			gtx.save();
					gtx.setLineDash([2, 6]);
					gtx.beginPath();
					// Top
					gtx.moveTo(0,86.5);
					gtx.lineTo(78,86.5);
					gtx.moveTo(3,93.5);
					gtx.lineTo(80,93.5);
					// Right
					gtx.moveTo(86.5,80);
					gtx.lineTo(86.5,3);
					gtx.moveTo(93.5,78);
					gtx.lineTo(93.5,3);
				gtx.stroke();
			gtx.restore();
			
			// Parking/bike lane
			gtx.strokeStyle = "#eee";
			gtx.lineWidth = 0.2;
			gtx.save();
					gtx.beginPath();
					// Top
					gtx.moveTo(3,83);
					gtx.lineTo(78,83);
					gtx.moveTo(3,97);
					gtx.lineTo(77,97);
					// Right
					gtx.moveTo(83,77);
					gtx.lineTo(83.5,3);
					gtx.moveTo(97,78);
					gtx.lineTo(97,3);
				gtx.stroke();
			gtx.restore();

			gtx.restore();
		}
		
		function renderBackground(busx, busy) {
			gtx.save();
				for(var i=-2; i < 2; i++) {
					for(var j=-2; j < 2; j++) {
						var wx = Math.round(busx/100)*100 + i*100;
						var wy = Math.round(busy/100)*100 + j*100;
						
						renderTile(
							Math.round(busx/100)*100 + i*100 - busx,
							Math.round(busy/100)*100 + j*100 - busy,
							NATH.fRandom(wx * 100000 + wy) * 360
						);
					}
				}
			gtx.restore();
		}
		
		function renderGObject(go) {
			if(!go.visible) return;
			
			gtx.save();
				gtx.translate(go.position.x, go.position.y);
				gtx.rotate(NATH.toRadians(go.orientation));
				
				gtx.globalAlpha = go.opacity;
				
				for(var i = 0; i < go.children.length; i++) {
					if(!go.children[i].visible || !go.children[i].drawBehindParent) continue;
					
					renderGObject(go.children[i]);
				}
				
				gtx.fillStyle = go.shapeColor;
				gtx.strokeStyle = go.shapeLineColor;
				gtx.lineWidth = go.shapeLineWidth;
				
				if(go.sprite) {
					if(go.sprite.img) {
						gtx.drawImage(img, -go.sprite.sizeX/2, -go.sprite.sizeY/2, go.sprite.sizeX, go.sprite.sizeY);
					}
				} else if(go.shape && go.shape.vertices.length >= 6) {
					gtx.beginPath();
					
					gtx.moveTo(go.shape.vertices[0], go.shape.vertices[1]);
					for(var i = 2; i < go.shape.vertices.length; i += 2) {
						gtx.lineTo(go.shape.vertices[i], go.shape.vertices[i + 1]);
					}
					
					gtx.closePath();
					
					if(go.shapeFill) gtx.fill();
					if(go.shapeOutline) gtx.stroke();
				}
				
				for(var i = 0; i < go.children.length; i++) {
					if(!go.children[i].visible || go.children[i].drawBehindParent) continue;
					
					renderGObject(go.children[i]);
				}
			gtx.restore();
		}
		
		function renderCounter(x, y, s, a) {
			gtx.beginPath();
			gtx.moveTo(x, y);
			gtx.arc(x + s/2, y, s/2, Math.PI, NATH.PI2);
			gtx.closePath();
			gtx.fill();
			gtx.stroke();
			
			gtx.beginPath();
			gtx.moveTo(x + s/2, y - s/30);
			gtx.lineTo(x + s/2 + Math.cos(Math.PI + a * Math.PI) * s * 0.45, y + Math.sin(Math.PI + a * Math.PI) * s * 0.45 - s/30);
			gtx.stroke();
		}
		
		function renderHUD() {
			gtx.save();
				gtx.strokeStyle = "black";
				gtx.fillStyle = "white";
				
				renderCounter(10, cvs.height - 10, 200, Math.abs(bus.engineForce));
				renderCounter(cvs.width - 210, cvs.height - 10, 200, Math.abs(bus.speed / bus.maxSpeed));
				
				gtx.font = "normal 40px Sans-Serif";
				gtx.textAlign = "right";
				gtx.fillText(Math.round(NATH.mps2kmh(bus.speed)) + "km/h", cvs.width - 10, cvs.height - 130);
			gtx.restore();
		}
		
		return function() {
			gtx.clearRect(0, 0, cvs.width, cvs.height);
			gtx.fillStyle = "gray";
			gtx.fillRect(0, 0, cvs.width, cvs.height);
			
			gtx.save();
				gtx.translate(cvs.width/2, cvs.height/2);
				gtx.scale(csize * meterSize, -csize * meterSize);
				
				renderBackground(bus.position.x, bus.position.y);
				
				gtx.translate(-bus.position.x, -bus.position.y);
				renderGObject(scene);
				gtx.translate(bus.position.x, bus.position.y);
			gtx.restore();
			
			renderHUD();
		}
	})();
	
	function init() {
		if(!cvs || !gtx || !ctx) {
			alert("Your browser isn't compatible"); 
			throw new Error("Couldn't initialize");
			
			return;
		}
		
		cvs.width = document.body.clientWidth;
		cvs.height = document.body.clientHeight;
		
		aspect = cvs.width / cvs.height;
		csize = Math.min(cvs.width, cvs.height);
		cw = cvs.width / csize;
		ch = cvs.height / csize;
		
		scene.addChildren(bus);
		
		loop();
	}
	
	init();
});
