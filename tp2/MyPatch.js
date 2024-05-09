import { CGFnurbsObject, CGFnurbsSurface, CGFobject } from '../lib/CGF.js';
/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
export class MyPatch extends CGFobject {
	constructor(scene, degrees_u, degrees_v, parts_u, parts_v, control_points) {
		super(scene);

		this.nurbsSurface = new CGFnurbsSurface(degrees_u, degrees_v, control_points)
		this.nurbs = new CGFnurbsObject(scene,parts_u,parts_v, this.nurbsSurface)

	}
	display(){
		this.nurbs.display()
	}
	


}

