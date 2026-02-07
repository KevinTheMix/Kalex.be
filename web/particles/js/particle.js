class Particle {
	constructor(x, y, vx, vy, size, rgb, grayscale) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.size = size;
		this.rgb = rgb;
		this.grayscale = grayscale;
	}
	static create(config, x, y) {
		var vx = (Math.random() * 2 * config.MaxParticleSpeed) - config.MaxParticleSpeed;
		var vy = (Math.random() * 2 * config.MaxParticleSpeed) - config.MaxParticleSpeed;
		var size = Math.round(Math.random() * (config.MaxParticleSize - config.MinParticleSize) + config.MinParticleSize);
		var r = Math.round(Math.random() * 255);
		var g = Math.round(Math.random() * 255);
		var b = Math.round(Math.random() * 255);
		var rgb = `rgb(${r}, ${g}, ${b})`;
		var brightness = (255 - config.MinParticleBrightness) * (config.MaxParticleSize - size) / (config.MaxParticleSize - config.MinParticleSize) + config.MinParticleBrightness;
		var grayscale = `rgb(${brightness}, ${brightness}, ${brightness})`;
		return new Particle(x, y, vx, vy, size, rgb, grayscale);
	}
	static generate(width, height, config) {
		var particles = [];
		for (var i = config.NumberOfParticles - 1; i >= 0; i--) {
			var x = Math.round(Math.random() * (width - 2 * config.HorizontalPadding)) + config.HorizontalPadding;	// Avoid edges
			var y = Math.round(Math.random() * (height - 2 * config.VerticalPadding)) + config.VerticalPadding;	// Avoid edges
			particles[i] = Particle.create(config, x, y);
		}
		return particles;
	}
	drawVector(context) {
		context.save();
		context.beginPath();
		context.translate(this.x, this.y);			// Current particle is the new center.
		context.moveTo(0, 0);
		context.rotate(-Math.atan(this.vy/this.vx));// Inversé car rotate est horlogique.
		context.lineTo((this.vx >= 0 ? 1 : -1 ) * (this.size + 10), 0);
		context.strokeStyle = this.grayscale;
		context.stroke();
		context.restore();
	}
	slowDown() {
		if(this.vx > 20) this.vx = 18;
		if(this.vy > 20)  this.vy = 18;
		if(this.vx < -20) this.vx = -18;
		if(this.vy < -20) this.vy = -18;
	}
	bounce(width, height) {
		if(this.x <= config.HorizontalPadding || this.x >= width - config.HorizontalPadding) { this.vx = -this.vx; }
		if(this.y <= config.VerticalPadding || this.y >= height - config.VerticalPadding) { this.vy = -this.vy; }
	}
	keepFromLimits(width, height) {
		if(this.x < config.HorizontalPadding) this.x = config.HorizontalPadding;
		if(this.x > width - config.HorizontalPadding) this.x = width - config.HorizontalPadding;
		if(this.y < config.VerticalPadding) this.y = config.VerticalPadding;
		if(this.y > height - config.VerticalPadding) this.y = height - config.VerticalPadding;
	}
	move(width, height) {		
		this.x += this.vx;
		this.y -= this.vy;
		this.bounce(width, height);
		this.keepFromLimits(width, height);
	};
	moveWithGravity(width, height, mass) {
		this.gravitate(width/2, height/2, mass);
		this.slowDown();
		this.move(width, height);
	}
	gravitate(x, y, mass) {
		var distance = this.distanceToPoint(x, y);
		var gravity = config.GravityStrength * mass / (distance * distance);
		var gravityAngle = this.angleToPoint(x, y);		
		//console.log(toDegrees(gravityAngle));
		
		var accelerationX = Math.cos(gravityAngle) * gravity;
		var accelerationY = Math.sin(gravityAngle) * gravity;
		//console.log("x=" + accelerationX + " & y=" + accelerationY);
		
		this.vx += accelerationX;
		this.vy += accelerationY;
		// console.log("Vx=" + this.vx + "Vy=" + this.vy);
	}
	distanceToParticleWithinMax(other, distance) {
		const r2 = distance * distance;
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		return dx * dx + dy * dy < r2;   // true ⇒ inside radius
	}
	distanceToParticle(other) { return this.distanceToPoint(other.x, other.y); }
	squaredDistanceToPoint(x, y) { return (this.x - x) * (this.x - x) + (this.y - y) * (this.y - y); }
	distanceToPoint(x, y) { return Math.sqrt(this.squaredDistanceToPoint(x, y)); }
	approximateDistanceToPoint(x, y) {
		let dx = Math.abs(this.x - x);
  		let dy = Math.abs(this.y - y);
  		if (dx < dy) [dx, dy] = [dy, dx];   // ensure dx ≥ dy
  		return dx + 0.41421356237 * dy;      // 1/√2 ≈ 0.707; 1-0.293 ≈ 0.414
	 }
	angleFromPoint(x, y) { return angleBetween(x, y, this.x, this.y); }
	angleToPoint(x, y) { return angleBetween(this.x, this.y, x, y); }	
	isWithin(x, y, size) { return x-size <= this.x+this.size && this.x-this.size <= x+size && y-size <= this.y+this.size && this.y-this.size <= y+size; }
}

function angleBetween(x1, y1, x2, y2) {
	var deltaY = y1 - y2;	// Inversé car les coordonnées sur une page vont de haut en bas (pas de bas en haut comme en trigo).
	//var deltaY = y2 - y1;
	var deltaX = x2 - x1;
	var ratio = deltaY / deltaX;
	var angle = Math.atan(ratio);
	if(deltaX < 0) angle += Math.PI;
	//console.log("Angle = " + toDegrees(angle));
	return angle;
}

function toDegrees(angle) {
	return 180*angle/Math.PI
}