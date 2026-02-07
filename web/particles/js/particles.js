function absorb(width, height, size) {
	var absorbedMass = 0;
	var i = particles.length;
	while(i--) {
		if(particles[i].isWithin(width/2, height/2, size)) {
			absorbedMass += particles[i].size;
			particles.splice(i, 1);
		}
	}
	return absorbedMass;
}

// Draw lines between this p particle and all following particles.
function drawLinks(context, p, index) {
	for (var i = index; i < particles.length; i++)
		drawLink(context, p, particles[i]);
}

// Draw a line between two particles.
function drawLink(context, p, other) {
	var distance = p.distanceToParticle(other);
	if(distance <= linkMaxDistance) {
	// if(p.distanceToParticleWithinMax(other, linkMaxDistance)) {
		// TODO: Use easing (see https://github.com/gre/bezier-easing)
		// var alpha = 1 - (Math.pow(distance, 2)/Math.pow(linkMaxDistance, 2));
		var alpha = 1 - (distance/linkMaxDistance);
		var rgb = 255*alpha;
		context.beginPath();
		context.moveTo(p.x, p.y);
		context.lineTo(other.x, other.y);
		// context.strokeStyle = `rgb(255, 255, 255)`;	// Simple RGB
		// context.strokeStyle = `rgba(255, 255, 255, ${alpha})`;	// RGBA
		context.strokeStyle = `rgb(${rgb}, ${rgb}, ${rgb})`;	// RGB
		context.stroke();
	}
}
function drawLinksFast(ctx, particles, maxDist) {
  const maxDist2 = maxDist * maxDist;
  ctx.beginPath();
  for (let i = 0, n = particles.length; i < n - 1; ++i) {
    const pi = particles[i];
    for (let j = i + 1; j < n; ++j) {
      const pj = particles[j];
      const dx = pi.x - pj.x;
      const dy = pi.y - pj.y;
      const d2 = dx * dx + dy * dy;
      if (d2 <= maxDist2) {
        const alpha = 1 - d2 / maxDist2;        // alpha ∈ (0,1]
        ctx.globalAlpha = alpha;                // change only when needed
        ctx.moveTo(pi.x, pi.y);
        ctx.lineTo(pj.x, pj.y);
      }
    }
  }
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  ctx.globalAlpha = 1;                          // restore
}
function excludeParticles(canvas, x, y) {
	particles.forEach(function(p) {
		if(p.distanceToPoint(x, y) < config.ExclusionRadius) {
			var angle = p.angleFromPoint(x, y);
			p.x = x + Math.cos(angle) * config.ExclusionRadius;
			p.y = y - Math.sin(angle) * config.ExclusionRadius;
		}
	});
}