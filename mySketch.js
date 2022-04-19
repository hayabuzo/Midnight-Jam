function setup() {
	createCanvas(windowWidth, windowHeight).background(100);
  if (getURLParams().q==1) { createCanvas(800, 600).background(0); pixelDensity(0.5); }
	imgx  = createGraphics(width, height, WEBGL);
	shdr  = imgx.createShader(shader_vert, shader_frag); 
	FRS = floor(random(3600));
	//print(); 
	FRC = 0;
}

function draw() {
	//background(0);
	FRC+=0.5;//*(mouseX/width);
	shdr.setUniform( 'MLS' , millis()/1000 ); 
	shdr.setUniform( 'FRC' , FRS+1000+(FRC/60) ); 
	shdr.setUniform( 'RES' , [width,height]); 
	shdr.setUniform( 'M' , [mouseX/width,mouseY/height]); 
	imgx.shader(shdr);
	imgx.rect(0,0,1,1);
	image(imgx,0,0,width,height);
	
}

/*
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
	imgx  = createGraphics(width, height, WEBGL);
	shdr  = imgx.createShader(shader_vert, shader_frag); 
	stck  = createGraphics(width, height);
}
*/