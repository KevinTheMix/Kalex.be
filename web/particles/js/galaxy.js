function drawGalaxy(context, canvas, angle, size) {
		var x = canvas.width/2;
		var y = canvas.height/2;
		var radius = size/3;

		context.save();
		context.strokeStyle = '#fff';
		//context.lineCap = 'round';
		context.lineWidth = size / 10;		
		context.translate(x, y);
		context.rotate(angle);

		// Line
		context.beginPath();
		context.moveTo(-radius, 0);
		context.lineTo(radius, 0);
		context.stroke();

		// Top central arc
		context.beginPath();
		context.arc(radius, 0, 2*radius, Math.PI, 0);
		context.stroke();
		
		// Bottom central arc
		context.beginPath();
		context.arc(-radius, 0, 2*radius, 0, Math.PI);
		context.stroke();

		// Bottom external arc
		context.beginPath();
		context.arc(-radius, 0, 4*radius, 0, Math.PI/2);
		context.stroke();

		// Top external arc
		context.beginPath();
		context.arc(radius, 0, 4*radius, Math.PI, -Math.PI/2);
		context.stroke();

		context.restore();
	}