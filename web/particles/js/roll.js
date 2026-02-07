function clean(canva, context) {
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canva.width, canva.height);
	context.restore();
}
function animate(angle) {	
	var canva = document.getElementById("roll");
	var context = canva.getContext("2d");
	
	// Style.
	context.lineWidth = canva.width/120;
	context.strokeStyle = '#717';
	context.lineCap = 'round';

	// Nettoie le canvas.
	clean(canva, context);
	
	// Cercles.
	var numberOfCircles = Math.floor(canva.width/60 - 1);
	var spacing = canva.width/30 - 6;	// Espace entre les cercles
	var centerX = canva.width/2;
	var centerY = canva.height/2;		
	
	// Boucle traçant une fois tous les cercles imbriqués (par demi-cercles), en commençant par les plus grands.
	for(circle = numberOfCircles*2; circle > 0; circle=circle-2)
	{
		// 1er demi-cercle (centré sur le centre)
		var startingAngle = angle * Math.PI;
		var endingAngle = (angle + 1) * Math.PI;
		var counterclockwise = false;

		var radius = spacing * circle;
		context.beginPath();
		context.strokeStyle = '#717';
		context.arc(centerX, centerY, radius, startingAngle, endingAngle, counterclockwise);
		context.stroke();
		
		// 2ème demi-cercle (plus petit, décalé d'un spacing (en suivant l'angle), dessiné dans l'autre sens)
		var offsetX = spacing * Math.cos(angle * Math.PI);
		var offsetY = spacing * Math.sin(angle * Math.PI);
		radius =  spacing * (circle - 1);
		context.beginPath();
		context.strokeStyle = '#FFF';
		context.arc(centerX + offsetX, centerY + offsetY, radius, startingAngle, endingAngle, !counterclockwise);
		context.stroke();
	}
	if(angle <= 10)
		window.requestAnimationFrame(function() {animate(angle + 0.01)});
}