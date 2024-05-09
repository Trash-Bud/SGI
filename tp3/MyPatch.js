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
		var real_control_points = []
		for(let u = 0; u < degrees_u + 1; u++){
			var v_subArray = []
			
			for(let v = 0; v < degrees_v + 1; v++ ){
				v_subArray.push([...control_points[u * (degrees_v + 1) + v], 1])
			}
			real_control_points.push(v_subArray)
		}
		this.nurbsSurface = new CGFnurbsSurface(degrees_u, degrees_v, real_control_points)
		this.nurbs = new CGFnurbsObject(scene,parts_u,parts_v, this.nurbsSurface)

	}
	display(){
		this.nurbs.display()
	}
	


}

