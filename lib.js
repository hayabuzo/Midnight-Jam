// ⇓⇣⇩↓

let library = `
	

	
vec2  zr(vec2 uv, vec2 move, float zoom, float ang) {
		  uv -= 0.5;
		  uv *= mat2( 
  	  			cos(ang) , -sin(ang) ,
  	  			sin(ang) ,  cos(ang) );
		  uv *= zoom;
		  uv -= move*zoom;
		  uv -= move*(5.0-zoom);
		  return(uv); }
	
float random (float x) {
  		return fract(sin(0.005387+x)*129878.4375453); }

float random (vec2 uv) {
  		return fract(sin(0.005387+dot( uv.xy, vec2(12.9898,78.233))) * 43758.5453123 ); }

float noise(float x) {
			float i = floor(x);
			float f = fract(x);
			float y = mix(random(i), random(i + 1.0), smoothstep(0.,1.,f));
			return y; }
	
vec2  random2(vec2 st){
		  st = vec2( dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)));
  	  return -1.0 + 2.0*fract(sin(st)*43758.5453123); }
float noise(vec2 st) {
  		vec2  i = floor(st);   // Gradient Noise by Inigo Quilez - iq/2013
  		vec2  f = fract(st);   // https://www.shadertoy.com/view/XdXGW8
  		vec2  u;
			u = f*f*f*(f*(f*6.-15.)+10.);
  		return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
  		                 dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
  		            mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
  		                 dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y); }

vec3  hsb2rgb (vec3 c) {
  		vec4   K = vec4(1.0,2.0/3.0,1.0/3.0,3.0);     				// Color conversion function from Sam Hocevar: 
  		vec3   p = abs(fract(c.xxx+K.xyz)*6.0-K.www); 				// lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
  		return c.z*mix(K.xxx,clamp(p-K.xxx,0.0,1.0),c.y); }
									 
float rect(vec2 uv, float x, float y, float w, float h) { 
			return step(x-w*0.5,uv.x) * step(uv.x,x+w*0.5)
				 	 * step(y-h*0.5,uv.y) * step(uv.y,y+h*0.5);   }
				 
float circle(vec2 uv, float x, float y, float d) {
			return step(distance(uv,vec2(x,y)),d*0.5); }						 
									 
float sphere2(vec2 uv, float x, float y, float d) {
    	vec2 dist = uv-vec2(x,y);
			return clamp( (1.- dot(dist,dist)/(d/8.0)) ,0.0, 1.0); }
									 
				
				
				
// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float fbm_noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 10
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * fbm_noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
				
				
vec2 random3( vec2 p ) {
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
									 
									 
									 
									 
									 

float map(float value, float min1, float max1, float min2, float max2) {
  		return min2 + (value - min1) * (max2 - min2) / (max1 - min1);    }

	
mat2 rotate2d(float a)   {
     return mat2( 
     cos(a) , -sin(a) ,
     sin(a) ,  cos(a) ); }
	
mat2 scale(vec2 s) {
     return mat2(
     s.x, 0.0 ,
     0.0 , s.y );  }
		 

		 

	

vec2 uv2wtr( vec2 uv, float kx, float ky) {
  kx = kx*2.0+0.01;
  vec2 t1 = vec2(kx,ky);
  vec2 t2 = uv;
  for(int i=1; i<10; i++) {
    t2.x+=0.3/float(i)*sin(float(i)*3.0*t2.y+MLS*kx)+t1.x;
    t2.y+=0.3/float(i)*cos(float(i)*3.0*t2.x+MLS*kx)+t1.y; }
	vec3 tc1;
  tc1.r=cos (t2.x+t2.y+1.0)*0.5+0.5;
  tc1.g=sin (t2.x+t2.y+1.0)*0.5+0.5;
  tc1.b=(sin(t2.x+t2.y)+cos(t2.x+t2.y))*0.5+0.5;
  uv = uv +(tc1.rb*vec2(2.0)-vec2(1.0))*ky;
	return uv; }
	
float nexto(float ch, float n) {
  float a;
  a = sin(n*ch);  a = floor(a*10000.0)*0.001;
  a = cos(a);     a = floor(a*8000.0)*0.001;
  return fract(a); }	
	
vec2 uv2wav( vec2 uv1, float kx, float ky, float sd) {
    float tx = kx;
    float ty = ky;
		vec2 t1;
		float time = FRC*0.0;
    //                       frq                                     spd                    amp
    t1.y = cos( uv1.x * nexto(1.0,tx)*10.0 + time * ceil(nexto(2.0,tx)*10.0-5.0) ) * nexto(3.0,tx)*1.15;
    t1.x = sin( uv1.y * nexto(1.0,ty)*10.0 + time * ceil(nexto(2.0,ty)*10.0-5.0) ) * nexto(3.0,ty)*1.15;
    uv1 = uv1 + vec2(t1.x,t1.y)*sd;
    t1.y = cos( uv1.x * nexto(4.0,tx)*10.0 + time * ceil(nexto(5.0,tx)*10.0-5.0) ) * nexto(6.0,tx)*0.55;
    t1.x = sin( uv1.y * nexto(4.0,ty)*10.0 + time * ceil(nexto(5.0,ty)*10.0-5.0) ) * nexto(6.0,ty)*0.55;
    uv1 = uv1 + vec2(t1.x,t1.y)*sd;
    t1.y = cos( uv1.x * nexto(7.0,tx)*10.0 + time * ceil(nexto(8.0,tx)*10.0-5.0) ) * nexto(9.0,tx)*0.15;
    t1.x = sin( uv1.y * nexto(7.0,ty)*10.0 + time * ceil(nexto(8.0,ty)*10.0-5.0) ) * nexto(9.0,ty)*0.15;
    uv1 = uv1 + vec2(t1.x,t1.y)*sd;
	return uv1; }
	
	
	/* RGB to HSB Conversion */
vec3 rgb2hsb( vec3 c ) {
  // Color conversion function from Sam Hocevar: 
  // lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
  vec4   K = vec4(0.0,-1.0/3.0,2.0/3.0,-1.0);
  vec4   p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4   q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float  d = q.x - min(q.w, q.y);
  float  e = 1.0e-10;
  return vec3(abs(q.z+(q.w-q.y)/(6.0*d+e)), d/(q.x+e), q.x); }


	
	/* Hue Tune & Replace  */
vec3 rgb2ht( vec3 img, float t) {
	img.rgb = rgb2hsb(img.rgb);
	img.r = img.r+t;
	return hsb2rgb(img.rgb); }
vec3 rgb2hr( vec3 img, float t) {
	img.rgb = rgb2hsb(img.rgb);
	img.r = t;
	return hsb2rgb(img.rgb); }
		
/* Saturation Tune & Replace */
vec3 rgb2st( vec3 img, float t) {
	img.rgb = rgb2hsb(img.rgb);
	img.g = img.g+t;
	return hsb2rgb(img.rgb); }
vec3 rgb2sr( vec3 img, float t) {
	img.rgb = rgb2hsb(img.rgb);
	img.g = t;
	return hsb2rgb(img.rgb); }
		
/* Lightness Tune & Replace  */
vec3 rgb2lt( vec3 img, float t) {
	img.rgb = rgb2hsb(img.rgb);
	img.b = img.b+t;
	return hsb2rgb(img.rgb); }
vec3 rgb2lr( vec3 img, float t) {
	img.rgb = rgb2hsb(img.rgb);
	img.b = t;
	return hsb2rgb(img.rgb); }

	
vec2 zoom(vec2 uv, vec2 m, float zmin, float zmax) {
	float zoom = map(sin(FRC),-1.,1.,zmin,zmax);
	uv -= 0.5;
	uv *= zoom;
	uv -= m*zoom;
	uv -= m*(zmax-zoom);
	return(uv);
}

vec2 roto(vec2 uv, vec2 m, float ang) {

		//uv.x = (uv.x*cos(ang) - uv.y*sin(ang));
		//uv.y = (uv.x*sin(ang) + uv.y*cos(ang));
	
		//uv -= m;
		
    // vec3 uv3 = vec3(uv.x, uv.y, 1.0);
		
		// uv3 = uv3 
		// * 
		// mat3( 
		// cos(ang) , -sin(ang) , 0.0,
		// sin(ang) ,  cos(ang) , 0.0,
		// 0.0,        0.0,       1.0)
		// * 
		// mat3(
		// 1.0,  0.0,  0.0,
		// 0.0,  1.0,  0.0,
		// -m.x, -m.y, 1.0)
		// ;
		
    // uv3 = uv3 
		// * 
		// mat3( 
    // cos(ang) , sin(ang) , 0.0,
    // -sin(ang) ,  cos(ang) , 0.0,
		// -m.x*(cos(ang)-1.0)+m.y*sin(ang), -m.x*sin(ang)-m.y*(cos(ang)-1.0), 1.0)
		// ;
		
		uv -= 0.5;
		
		uv *= mat2( 
    cos(ang) , -sin(ang) ,
    sin(ang) ,  cos(ang) );
		
		uv += 0.5;
	return(uv);
}
	







	

	

	

	
	
	
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
	
// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}
	
	
/////////////// Float 

/* Float to Zero Centered */
float f2z ( float f ) {
	return f*2.0-1.0; }
	
/* Zero Centered to Float */
float z2f ( float z ) {
	return z*0.5+0.5; }
	
/* Float Constrain */
float f2f ( float f ) {
	return clamp(f,0.0,1.0); }
	
/* Zero Centered Constrain */
float z2z ( float z ) {
	return clamp(z,-1.0,1.0); }

/* Float to Random */	
float f2rand (float x) {
  return fract(sin(0.005387+x)*129878.4375453); }
	
/* Float to Noise */	
float f2noise(float x) {
	return mix(f2rand(floor(x)), f2rand(floor(x) + 1.0), smoothstep(0.,1.,fract(x))); }
	
/* Float to Slit */
float f2slit ( float f, float lvl, float len, float smt ) { 
	return smoothstep(lvl-len*0.5-smt,lvl-len*0.5    ,f) - 
	       smoothstep(lvl+len*0.5    ,lvl+len*0.5+smt,f); }

/* Float to Map */
float f2m(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);        }
	
	
	
	
	
	
	
	
	
	
	
	
	
	
float sphere(vec2 uv, float x, float y, float d, vec2 l) {
	return 
		(1.0-distance(uv,vec2(x,y)+l*d)*(1.0/d))  
		* 
		smoothstep(d*0.51,d*0.49,distance(uv,vec2(x,y)))
	; }
	
	
float cube(vec2 uv, float x, float y, float s) { 

	return step(x-s*0.5,uv.x) * step(uv.x,x+s*0.5)
				 * step(y-s*0.5,uv.y) * step(uv.y,y+s*0.5);     }
				 
				 

		
float sphere3(vec2 uv, float x, float y, float d, vec2 l) {
	return 
		clamp((1.0-distance(uv,vec2(x,y)+l*d)),0.0,1.0)
	; }



/* Cartesian to Polar */
vec2 xy2md(vec2 xy) {
	return vec2( 
		sqrt( pow(xy.x,2.0) + pow(xy.y,2.0) ) ,
		atan(xy.y,xy.x) ); }

/* Polar to Cartesian */
vec2 md2xy(vec2 md) {
	return vec2( 
		md.x * cos(md.y) ,
		md.x * sin(md.y) ); }
	
/* Barrel Distortion */
vec2 uv2brl( vec2 uv, float pwr ) {
	//uv.y = uv.y * (HEIGHT/WIDTH);  
	uv = md2xy(xy2md(uv - 0.5) + vec2(pwr-0.5,0.0)) + 0.5;
	//uv.y = uv.y * (WIDTH/HEIGHT);  
	return uv; }


`;

