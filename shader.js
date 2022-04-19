let shader_vert = ` attribute vec3 aPosition; attribute vec2 aTexCoord; varying vec2 vTexCoord;
void main() { vTexCoord = aTexCoord; vec4 positionVec4 = vec4(aPosition, 1.0);  
positionVec4.xy = positionVec4.xy * 2.0 - 1.0; gl_Position = positionVec4; }`;
  
let shader_frag = `		precision mediump float; varying vec2 vTexCoord; 
uniform float MLS, FRC; 
uniform vec2  RES, M;
#define PI 3.14159265358979323846  

` + library + `

void main() { 

const int n = 10;		// number of layers
float thr = 0.85;		// threshold of roads in layer
float amt = 0.50;		// amount of cars in layer

			// setup main coordinate system according to the screen dimensions
vec2 	uv0 = gl_FragCoord.xy/RES.xy; uv0.y = 1.0-uv0.y;
	    uv0.x *= RES.x/RES.y;
vec2  uvc = uv0;
			uv0.x -= ((RES.x-RES.y)/RES.y)*0.5;

			// set main coordinate system movement parameters
float angle = sin(MLS*0.2); // MLS
float zoom  = 20.0+10.0*sin(FRC*0.5);
vec2  move  = vec2(FRC*0.2,FRC*0.7);			//

//angle = 0.0;
//zoom = 10.0;
//move = vec2(0.0);

			// move main coordinate system
			uv0 = zr(uv0, move, zoom, angle);

vec3  layer;   	// RGB of every layer
vec3  stack;		// RGB of composed image

			for (int i=n; i>0; i--) {	// for every layer

					vec2  uv = uv0; // copy main coordinate system to create local fixed UV
								// take  ↓ it  ↓ do not move  ↓ zoom according to layer number              ↓ rotate 
								uv = zr( uv,   vec2(0.0),     1.0 + (float(n-i))*0.3 + sin(FRC*0.01)*0.005,  PI*2.0*random(float(i)*0.258) );

								// bend the road
					float kx = 0.5*sin(0.2*PI*random(float(i)*1087.4432)+0.00001*length(uv));     // bending coefficient
								uv.y += 										sin(uv.x*kx);						 // bend Y axis with Sin
								uv.x += (fract(uv.y)-0.5) * sin(uv.x*kx-PI*0.5)*kx;	 // bend X axis with modified Sin
								//                    ↑ we need to bend road X according to the road center

					float dir = step(mod(uv.y,2.0),1.0);	// neighboring roads will have opposite directions (0 and 1)

								// calculate speed on every road according to direction
								//									↓ boost  boost ↓      ↓ break                   ↓ according to layer 
					float	speed = (dir-0.5) * 10.0 * ( FRC + 2.0 * (noise(FRC*0.2+floor(uv.y)+float(i)*10.0)) * 2.0 - 1.0 );
								//       ↑ direction         ↑ counter  counter ↑       ↑ according to road           ↑ normalize to (-1;1)

					vec2  uvi = floor(uv);		// integer part of fixed UV
					vec2  uvf = fract(uv);		// fract part of fixed UV

					vec2  uvm = uv;       		// local moveable UV
								uvm.x += speed;			// move every road along X axis
					vec2  mi  = floor(uvm);   // integer part of moveable UV
					vec2  mf  = fract(uvm); 	// fract part of moveable UV

					float car_vis = step(amt, random(mi.x+float(i)*200.0));										 	// is current block has a car
					float CPR = car_vis * (1.0-step(amt, random(mi.x-1.0+float(i)*200.0)));		 	// is current block has a car and is previous block empty
					float CNX = car_vis * (1.0-step(amt, random(mi.x+1.0+float(i)*200.0)));		 	// is current block has a car and is next block empty
					float CPR2 = (1.0-car_vis) * (step(amt, random(mi.x-1.0+float(i)*200.0))); 	// is current block empty and is previous block has a car
					float CNX2 = (1.0-car_vis) * (step(amt, random(mi.x+1.0+float(i)*200.0))); 	// is current block empty and is next block has a car

					vec3  c_lamp = vec3(1.0);																	// RGB of road lightning
					vec3  c_red  = vec3(1.0,0.0,0.0);													// RGB of red lights
					vec3  c_yel  = vec3(1.0,1.0,random(mi.x+float(i)*300.0));	// RGB of yellow lights

								// paint the car:				                ↓ hue                             ↓ saturation            ↓ brightness
					vec3  car_color = hsb2rgb(vec3( (random(mi.y) + random(mi.x*10.1+5.5)*0.3),  0.4+0.6*random(mi.x+10.0), 1.0 ) );

					float	road_vis = step(thr,(random(uvi.y+float(i)*100.0)))-0.01;     // is current road visible
					float kl = 0.25;	// brightness of car lights
					float ka = 0.50;  // brightness of road lights

								// lightning of roads and cars
					vec3	lamp = mix(vec3(0.0), c_lamp,    pow((abs(snoise( uv/6.5))) ,5.0) +0.07 )        // fixed road lights: white
										 + mix(vec3(0.0), c_red*ka , pow((abs(snoise((uvm+137.0)/5.5))),5.0)) 			 // moving road lights: red
										 + mix(vec3(0.0), c_yel*ka , pow((abs(snoise((uvm+872.0)/5.5))),5.0)) 			 // moving road lights: yellow
										 
										   // drawing 4 circles for car lights, coloring it according to the road direction
										 + mix(vec3(0.0), mix(c_yel,c_red,dir)*(0.6+0.4*random(mi.x+float(i)*13.4)), 
																													CNX * sphere2(mf,0.8,0.7,0.1) 		 
																												+ CNX * sphere2(mf,0.8,0.3,0.1))		 
										 + mix(vec3(0.0), mix(c_red,c_yel,dir)*(0.6+0.4*random(mi.x+float(i)*73.7)), 
																													CPR * sphere2(mf,0.2,0.7,0.1)
																												+ CPR * sphere2(mf,0.2,0.3,0.1)) ;		
																												
											 // drawing 4 circles for extra car lights, coloring it according to the road direction: 																
										 + mix(vec3(0.0), mix(c_red*kl,car_color*kl,dir)*(0.6+0.4*random(mi.x+float(i)*73.7)), 		
																												+	CNX2 * sphere2(mf-vec2(0.5,0.0), 0.5, 0.5, 3.0 ) )
										 + mix(vec3(0.0), mix(car_color*kl,c_red*kl,dir)*(0.6+0.4*random(mi.x+float(i)*13.4)), 
																												+	CPR2 * sphere2(mf+vec2(0.5,0.0), 0.5, 0.5, 3.0 ) )
										 + mix(vec3(0.0), mix(car_color*kl,c_red*kl,dir)*(0.6+0.4*random(mi.x+float(i)*73.7)), 
																												+	CNX  * sphere2(mf-vec2(0.5,0.0), 0.5, 0.5, 3.0 ) )
										 + mix(vec3(0.0), mix(c_red*kl,car_color*kl,dir)*(0.6+0.4*random(mi.x+float(i)*13.4)), 
																												+	CPR  * sphere2(mf+vec2(0.5,0.0), 0.5, 0.5, 3.0 ) ) ;

								lamp = clamp(lamp,vec3(0.0),vec3(1.0)); // clamp lights to avoid overexposure

								// paint layer with:
								//            ↓ road visibility     ↓ road brighntess      ↓ road lightning
								layer = vec3( road_vis            * float(i)/float(n)    * lamp 
															//        ↓ road tiles                                ↓ road lines      
															* ( 0.3 * rect( uvf,  0.5,  0.5,  1.0,  0.9 ) + 1.0 * rect( uvf, 0.5,  0.5,  0.4,  0.1  ) ) ) 
															// ↓ minimal constant lightning				    
															+ lamp * 0.25;	

								// add road cracks
								layer *= (0.75+0.6*pow( abs( snoise(uv*8.0+131.0)  )  ,  3.0  ));

					float fig;	// draw a car
								fig += random(mi.x+0.01) * circle(  mf,  random(mi.x+0.11),   0.5  ,0.3+0.4*random(mi+0.21)  );
								fig += random(mi.x+0.02) *   rect(  mf,  random(mi.x+0.12),   0.5  ,0.1+0.9*random(mi+0.22)  ,  0.1+0.9*random(mi+0.32));
								fig += random(mi.x+0.05) * circle(  mf,  random(mi.x+0.15),   0.5  ,0.3+0.3*random(mi+0.25)  );
								fig += random(mi.x+0.06) *   rect(  mf,  random(mi.x+0.16),   0.5  ,0.1+0.9*random(mi+0.26)  ,  0.1+0.9*random(mi+0.36));
								fig += random(mi.x+0.07) *   rect(  mf,  random(mi.x+0.17),   0.5  ,0.1+0.9*random(mi+0.27)  ,  0.1+0.9*random(mi+0.37));
								// add extra shadows to a car	
								fig *= (0.75+pow( abs( snoise(uvm+725.0)  )  ,  2.5  ));

								// apply lighting to a car and add a car to the layer
								layer = mix(layer, car_color * fig * lamp, car_vis * step(0.05,fig));

								// add layer to the stack
								stack = mix(stack,layer,road_vis+0.01);

								// if current layer is not empty break the cycle to avoid extra calculations
								if (length(stack)>0.0) break;
								
								//if (i==1) {
								//	vec3  color = hsb2rgb(vec3( noise(uv0*0.0030)*PI*5.179,  0.3, 1.0 ) );
								//	float cloud = pow( fbm( vec2(fbm(uv0*0.1),fbm(uv0*0.1+vec2(10.0)+vec2(FRC*0.4,0.0)))   ),10.0*M.x)*10.0*M.y;
								//				stack = mix(stack, color , clamp(cloud,0.0,0.8) );
								//}

			}
			
			vec3  color = hsb2rgb(vec3( noise(uv0*0.0020)*PI,  0.3, 1.0 ) );
float cloud = pow( fbm( vec2(fbm(uv0*0.1),fbm(uv0*0.1+vec2(10.0)+vec2(FRC*0.4,0.0)))   ),7.0)*10.0 * map(zoom,10.0,30.0,0.3,1.0);
			cloud = clamp(cloud,0.0,0.8);
			stack = mix(stack, color , cloud );

			// draw a final image
//vec4  img = vec4(stack,clamp(1.0-cloud*2.0,0.3,1.0)); // fog blur
vec4  img = vec4(stack,1.0);

      gl_FragColor = img;
}`;