import { CGFobject } from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;

		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;
	
		this.s = 1;
		this.t = 1;

		var point1 = vec3.fromValues(x1,y1,z1);
		var point2 = vec3.fromValues(x2,y2,z2);
		var point3 = vec3.fromValues(x3,y3,z3);

		var sideA = vec3.create();
		var sideB = vec3.create();

		var vecU = vec3.create();
		var vecV = vec3.create();
		var sideC = vec3.create();
		this.normal = vec3.create();

		sideA = vec3.subtract(sideA, point2, point1);
		
		sideB = vec3.subtract(sideB, point3, point2)
	
		sideC = vec3.subtract(sideC, point1, point3);
		
		this.a = Math.sqrt( vec3.squaredLength(sideA));
		this.b = Math.sqrt( vec3.squaredLength(sideB));
		this.c = Math.sqrt( vec3.squaredLength(sideC));
		
		this.cos_a = (this.a**2 - this.b**2 + this.c**2 ) / (2 * this.a * this.c)
		this.cos_Y = (-(this.a**2) + this.b**2 + this.c**2) / (2 * this.b * this.c)
		this.cos_B = (this.a**2 + this.b**2 - (this.c**2)) / (2*this.a*this.b)

		this.sin_a  = Math.sqrt(1 - this.cos_a ** 2)

		vecU = vec3.subtract(vecU, point2, point1);
		
		vecV = vec3.subtract(vecV, point3, point1)

		vec3.cross(this.normal, vecU, vecV);

		
		this.initBuffers();
		
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
            0, 1, 2,
        
		];
		this.normals = [
			this.normal[0], this.normal[1], this.normal[2],
			this.normal[0], this.normal[1], this.normal[2],
			this.normal[0], this.normal[1], this.normal[2],
		]


		this.texCoords = [
			0,0,
			(this.a / this.s), 0,
			(this.c * this.cos_a )/ this.s , (this.c * this.sin_a ) / this.t
		]
	

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

	updateS_T(s, t){
		this.s = s
		this.t = t
		this.texCoords = [
			0,0,
			(this.a / this.s), 0,
			(this.c * this.cos_a )/ this.s , (this.c * this.sin_a ) / this.t
		]
		this.updateTexCoordsGLBuffers();
	}
}