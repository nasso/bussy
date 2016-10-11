var NATH = {};

NATH.FRANDOM_TABLE = {};
NATH.PI2 = Math.PI * 2;
NATH.toDegrees = function(r) { return r * 180 / Math.PI; };
NATH.toRadians = function(d) { return d * Math.PI / 180; };
NATH.clamp = function(x, a, b) { return Math.max(Math.min(x, b), a); };
NATH.lerp = function(a, b, x) { return a + NATH.clamp(x, 0, 1) * (b - a); };
NATH.fRandom = function(s) { return typeof NATH.FRANDOM_TABLE[s] === 'number' ? NATH.FRANDOM_TABLE[s] : (NATH.FRANDOM_TABLE[s] = Math.random()); };

NATH.Vec2 = function(x, y) {
	this.set(x, y);
}

NATH.Vec2.prototype = {
	set: function(x, y) {
		if(x === null || y === null) return;
		
		if(x === undefined && y === undefined) {
			this.x = 0;
			this.y = 0;
		} else if(x instanceof NATH.Vec2 || (typeof x === 'object' && (x.hasOwnProperty('x') && x.hasOwnProperty('y')))) {
			this.x = x.x;
			this.y = x.y;
		} else if(Array.isArray(x) && x.length > 1) {
			var o = y || 0;
			
			this.x = x[o] || 0;
			this.y = x[o + 1] || 0;
		} else {
			this.x = x || 0;
			this.y = (y === undefined ? x : y) || 0;
		}
		
		return this;
	},
	
	add: function(x, y) {
		if(x instanceof NATH.Vec2 || (typeof x === 'object' && (x.hasOwnProperty('x') && x.hasOwnProperty('y')))) {
			this.x += x.x;
			this.y += x.y;
		} else {
			this.x += x;
			this.y += y === undefined ? x : y;
		}
		
		return this;
	},
	
	sub: function(x, y) {
		if(x instanceof NATH.Vec2 || (typeof x === 'object' && (x.hasOwnProperty('x') && x.hasOwnProperty('y')))) {
			this.x -= x.x;
			this.y -= x.y;
		} else {
			this.x -= x;
			this.y -= y === undefined ? x : y;
		}
		
		return this;
	},
	
	mul: function(x, y) {
		if(x instanceof NATH.Vec2 || (typeof x === 'object' && (x.hasOwnProperty('x') && x.hasOwnProperty('y')))) {
			this.x *= x.x;
			this.y *= x.y;
		} else {
			this.x *= x;
			this.y *= y === undefined ? x : y;
		}
		
		return this;
	},
	
	div: function(x, y) {
		if(x instanceof NATH.Vec2 || (typeof x === 'object' && (x.hasOwnProperty('x') && x.hasOwnProperty('y')))) {
			this.x /= x.x;
			this.y /= x.y;
		} else {
			this.x /= x;
			this.y /= y === undefined ? x : y;
		}
		
		return this;
	},
	
	negate: function() {
		this.x = -this.x;
		this.y = -this.y;
		
		return this;
	},
	
	lengthSq: function() {
		return this.x * this.x + this.y * this.y;
	},
	
	length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
	
	dot: function(v) {
		return this.x * v.y + this.y * v.x;
	},
	
	orth: function(i) {
		return new NATH.Vec2(i ? -this.y : this.y, i ? this.x : -this.x);
	},
	
	normalize: function() {
		this.div(this.length());
		
		return this;
	},
	
	angle: function(base) {
		var a = Math.atan2(this.y, this.x);
		
		if(base instanceof NATH.Vec2) {
			var ba = a.angle();
			a -= ba;
		}
		
		return a;
	},
	
	vectorTo: function(x, y) {
		if(x instanceof NATH.Vec2 || (typeof x === 'object' && (x.hasOwnProperty('x') && x.hasOwnProperty('y')))) {
			return new NATH.Vec2(x.x - this.x, x.y - this.y);
		} else {
			return new NATH.Vec2(x - this.x, (y === undefined ? x : y) - this.y);
		}
	},
	
	rotateDeg: function(deg) {
		this.rotateRad(NATH.toRadians(deg));
		
		return this;
	},
	
	rotateRad: function(rad) {
		var cs = Math.cos(rad);
		var sn = Math.sin(rad);
		
		this.set(this.x * cs - this.y * sn, this.x * sn + this.y * cs);
		
		return this;
	},
	
	fromDegrees: function(deg) {
		this.fromRadians(NATH.toRadians(deg));
	},
	
	fromRadians: function(rad) {
		this.x = Math.cos();
	}
};

NATH.Shape2 = function(verts) {
	this.vertices = [];
	
	if(verts) this.vertices = this.vertices.concat(verts);
}

NATH.Shape2.prototype = {
	addVertice: function(x, y) {
		if(x === undefined || x === null) return;
		
		if(x instanceof NATH.Vec2 || (typeof x === 'object' && (x.hasOwnProperty('x') && x.hasOwnProperty('y')))) {
			this.addVertice(x.x, x.y);
		} else if(Array.isArray(x) && x.length > 1) {
			var o = y || 0;
			
			this.addVertice(x[o] || 0, x[o + 1] || 0);
		} else {
			this.vertices.push(x || 0, (y === undefined ? x : y) || 0);
		}
	},
	
	removeVertice: function(i) {
		this.vertices.splice(i || 0, 2);
	}
};

NATH.Rect2 = function(w, h) {
	w /= 2;
	h /= 2;
	
	NATH.Shape2.call(this, [-w, -h, -w, h, w, h, w, -h]);
}

NATH.Rect2.prototype = Object.create(NATH.Shape2.prototype);
NATH.Rect2.prototype.constructor = NATH.Rect2;

NATH.Oval2 = function(w, h, p) {
	NATH.Shape2.call(this);
	
	w /= 2;
	h /= 2;
	p = p || 16;
	
	var pr = 0, x = 0, y = 0;
	for(var i = 0; i < p; i++) {
		pr = i / p;
		
		x = Math.cos(pr * NATH.PI2);
		y = Math.sin(pr * NATH.PI2);
		
		this.vertices.push(x, y);
	}
}

NATH.Oval2.prototype = Object.create(NATH.Shape2.prototype);
NATH.Oval2.prototype.constructor = NATH.Oval2;
