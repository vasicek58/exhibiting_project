
let p5_vis;

$(document).ready(function(){
	p5_vis = new p5(visualization, "vis-window");	
});

let visualization = function(p) {
	
	p.setup = function() {
		var w = parseInt($("#vis-window").css('width').split('px')[0]);
		var h = parseInt($("#vis-window").css('height').split('px')[0]);
		
		var bg_strnig = $('body').css('background-color');
		var bg_rgb = [];
		
		var str1 = bg_strnig.split('(')[1];
		var str2 = str1.split(')')[0];
		var colors = str2.split(', ');
		
		colors.forEach(function(c){
			bg_rgb.push(parseInt(c));			
		});
		
		p.bg_color = p.color(bg_rgb[0], bg_rgb[1], bg_rgb[2]);
		
		p.createCanvas(w, h);
		
		p.marginTop = p.height * 0.2;
		p.marginBottom = p.height * 0.2;
		p.marginLeft = p.width * 0.2;
		p.marginRight = p.width * 0.2;
		
		p.circleSize = 20;
		
		// data
		p.pointCount = 20;
		p.data = [];
		for (var i=0; i < 30; i++) {
			var vector = [];
			
			for (var j=0; j < p.pointCount; j++) {
				vector.push(p.round(Math.random() - 0.3));
			}
			
			p.data.push(vector);
		}
		
		p.highlightedLine = -1;
		
		p.placePoints();
	}
	
	p.placePoints = function() {
		p.pointLocations = [];
		
		for (var i=0; i < p.pointCount; i++) {
			
			var point = {x: 0, y: 0};
			
			point.x = p.round(Math.random() * (p.width - p.marginRight - p.marginLeft)) + p.marginLeft;
			point.y = p.round(Math.random() * (p.height - p.marginBottom - p.marginTop)) + p.marginTop;
			
			while (-1 != p.pointLocations.findIndex( function(elem){ return (p.dist(point.x, point.y, elem.x, elem.y) <= p.circleSize); } )) {
				
				point.x = p.round(Math.random() * (p.width - p.marginRight)) + p.marginLeft;
				point.y = p.round(Math.random() * (p.height - p.marginBottom)) + p.marginTop;
			}
			
			p.pointLocations.push(point);
		}
		
		p.pointLocations.sort(function(a, b){
			if (a.y == b.y) return a.x - b.x;
			return a.y - b.y;
		});
	}
	
	p.draw = function() {
		p.background(p.bg_color);
		
		p.smooth();
		
		//	draw lines
		p.noFill();
		
		for (var i=0; i < p.data.length; i++) {
			var mapped_color = p.mapColor(i, d3.interpolateRdYlGn);
			
			if (i == p.highlightedLine) {
				p.stroke(mapped_color);
				p.strokeWeight(3);
			} else {				
				p.stroke(mapped_color, 100);
				p.strokeWeight(0.8);
			}
			
			
			p.beginShape();
			
			var firstPoint = true;
			var lastPoint = -1;
			
			for (var j=0; j < p.pointLocations.length; j++) {
				if (p.data[i][j] == 1) {
					p.curveVertex(p.pointLocations[j].x, p.pointLocations[j].y);
					if (firstPoint) {
						p.curveVertex(p.pointLocations[j].x, p.pointLocations[j].y);
						firstPoint = false;
					}
					
					lastPoint = j;
				}
			}
			
			if (lastPoint != -1) {
				p.curveVertex(p.pointLocations[lastPoint].x, p.pointLocations[lastPoint].y);
			}
			
			p.endShape();
		}
		
		
		// 	draw circles
		p.fill(255, 127);
		p.noStroke();
		
		p.pointLocations.forEach(function(point){
			p.ellipse(point.x, point.y, p.circleSize, p.circleSize);	
		});
		
		p.drawLineSelector();
	}
	
	p.drawLineSelector = function() {
		var yStart = 10;
		var xStart = 10;
		
		var yStep = 19;
		
		p.textAlign(p.LEFT, p.CENTER);
		p.textFont('Arial', 12);
		p.rectMode(p.CORNER);
		
		for (var i=0; i < p.data.length; i++) {
			var mapped_color = p.mapColor(i, d3.interpolateRdYlGn);
			p.noStroke();
			p.fill(mapped_color, 100);
			
			p.ellipse(xStart, yStart + i * yStep, 12, 12);
			
			p.fill(133);
			p.text("anonymous_" + i, xStart + 20, yStart + i * yStep);
			
			if (i == p.highlightedLine) {
				p.noFill();
				p.stroke(200);
				p.strokeWeight(1);
				
				p.rect(xStart - 9, yStart + (i-0.3) * yStep - 3, 125, yStep - 3);
			}
		}
	}
	
	p.mapColor = function(i, func) {
        var mapped_value = p.map(i, 0, p.data.length, 0, 1);

        var c = func(mapped_value).substr(4).split(")")[0].split(", ");
		
        return p.color(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]));
    }
	
	p.mouseMoved = function() {
		
		// check line selector		
		p.highlightedLine = -1;
		var yStart = 10;
		var xStart = 10;		
		var yStep = 19;
		
		for (var i=0; i < p.data.length; i++) {
			if (p.mouseX < 100 && p.mouseY < yStart + (i+0.5) * yStep && p.mouseY > yStart + (i-1.5) * yStep) {
				p.highlightedLine = i;
				break;
			}
		}
		
		
	}
};