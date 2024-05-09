import { CGFobject } from '../lib/CGF.js';

/**
* MyPyramid
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;
        this.initBuffers();     
      
    }

    /** Torus : 
        x = (R + r cos(u) ) * cos(PI)
        y = (R + r cos(u) ) sin(PI)
        z = sin(u)
        T1 = [-sin(PI), cos(PI), 0]
        T2 = [-sin(u)cos(PI), -sin(u)sin(PI), cos(u)]
    */

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
    
        for (let slice = 0; slice <= this.slices; ++slice) {
          const u= slice / this.slices;
          const s_ang = u* 2 * Math.PI;
          const cos_s = Math.cos(s_ang);
          const sin_s = Math.sin(s_ang);
          const s_rad = this.inner * cos_s + this.outer
    
          for (let loop = 0; loop <= this.loops; ++loop) {
            
            const t = loop / this.loops
            const l_ang = Math.PI * t * 2
            const cos_l = Math.cos(l_ang)
            const sin_l = Math.sin(l_ang)
    
            const x = cos_l * s_rad
            const y = sin_l * s_rad 
            const z = this.inner * sin_s
    
            this.normals.push( cos_l * sin_s, sin_l * sin_s,cos_s)
            
            this.vertices.push(x, y, z)

            this.texCoords.push(t)
            this.texCoords.push(u)
          }
        }
    
        const verSlice = this.loops + 1;
        for (let i = 0; i < this.slices; ++i) {
          let v1 = i * verSlice;
          let v2 = v1 + verSlice;
    
          for (let j = 0; j < this.loops; ++j) {
            this.indices.push(v1, v1+1, v2);
            this.indices.push(v2, v1+1, v2+ 1);
    
            v1 += 1;
            v2 += 1;
          }
        }

    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


