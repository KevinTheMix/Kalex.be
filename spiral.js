
function pause(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}
function reset(canva, context) {
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
    reset(canva, context);
    
    // Line.
    context.beginPath();
    context.moveTo(canva.width/2, canva.height/2);
    context.lineTo(canva.width/2, canva.height/2);
    context.stroke();
    
    // Arc.
    var numberOfCircles = Math.floor(canva.width/120 - 1);
    var padding = canva.width/50 - 6;
    var x = canva.width/2;
    var y = canva.height/2;		
    
    for(radius = numberOfCircles*2; radius > 0; radius=radius-2)
    {
        var arcStart = angle * Math.PI;
        var arcEnd = angle * Math.PI + Math.PI;
        context.beginPath();			
        context.arc(x, y, padding * radius, arcStart, arcEnd, true);
        context.stroke();
        
        var offsetX = padding * Math.cos(angle * Math.PI);
        var offsetY = padding * Math.sin(angle * Math.PI);
        context.beginPath();			
        context.arc(x + offsetX, y + offsetY, padding * (radius - 1), arcStart, arcEnd, false);
        context.stroke();
    }
    if(angle <= 1000)
        requestAnimFrame(function() {animate(angle + 0.001);});
}
function refresh() {
    var elem = (document.compatMode === "CSS1Compat") ? document.documentElement : document.body;
    var canva = document.getElementById("roll");
    canva.width = elem.clientWidth;
    canva.height = elem.clientHeight;
    
    if(document.styleSheets) {
        var sheet = document.styleSheets[0];
        if(sheet) {				
            var rules = sheet.cssRules || sheet.rules;
            if(rules) {
                var numberOfProjectListItems = document.querySelectorAll("ul#projects li").length;
                var numberOfWebsitesListItems = document.querySelectorAll("ul#websites li").length;
                var projectsListItemStyle = null;
                var websitesListItemStyle = null;
                for(var i = 0; i < rules.length; i++) {
                    // Find the already CSS rules (note: they must already be present in the stylesheet!).
                    if(rules[i].selectorText == "ul#projects li") { projectsListItemStyle = rules[i].style; }
                    if(rules[i].selectorText == "ul#websites li") { websitesListItemStyle = rules[i].style; }
                }
                projectsListItemStyle.paddingBottom = (canva.height/numberOfProjectListItems - 25) + "px" ; // Distributes evenly on the page.
                websitesListItemStyle.paddingBottom = (canva.height/numberOfWebsitesListItems - 25) + "px" ; // Distributes evenly on the page. 
            }
        }
    }
    
    animate(0);
}

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame || function(callback) {window.setTimeout(callback, 1000 / 60);};
})();

window.onload = function() { refresh(); }
window.onresize = function() { refresh(); }