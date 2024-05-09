import { CGFobject } from '../lib/CGF.js';

/**
* MyPyramid
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks,height, base, top) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.base = base;
        this.top = top;
        this.initBuffers();       
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;
        
        if(this.base == 0){
            for(var i = 0; i < (this.slices + 1); i++){
                this.vertices.push(Math.cos(ang) * this.top, -Math.sin(ang) * this.top, this.height);
                this.indices.push(i, (i+1) % (this.slices + 1), (this.slices + 1));
                this.normals.push(Math.cos(ang), -Math.sin(ang), Math.cos(Math.PI/4.0));

                ang+=alphaAng;

                this.texCoords.push((1 / (this.slices + 1)) * i , 0);
            }   

            this.vertices.push(0,0,0);
            this.normals.push(0,1,0);
            this.texCoords.push(0.5,1);
            
        }else if(this.top == 0){
            
            for(var i = 0; i < (this.slices + 1); i++){

                this.vertices.push(Math.cos(ang) * this.base, -Math.sin(ang) * this.base, 0);
                this.indices.push((this.slices + 1), (i+1) % (this.slices + 1), i);
                this.normals.push(Math.cos(ang), -Math.sin(ang), Math.cos(Math.PI/4.0));
                
                ang+=alphaAng;
                this.texCoords.push((i / ((this.slices + 1))) , 0);
            }

            this.vertices.push(0,0, this.height);
            this.normals.push(0, 0,-1);
            
            this.texCoords.push(0.5,1);

        }
        else{
            for (var i = 0; i < this.slices; i++) {

         
                this.vertices.push(Math.cos(ang) * this.base, -Math.sin(ang) * this.base, 0); //bottom, left -> 0,1
                this.vertices.push(Math.cos(ang + alphaAng) * this.base, -Math.sin(ang + alphaAng) * this.base,0); //bottom, right ->1,1
            
    
        
                this.vertices.push(Math.cos(ang) * this.top, -Math.sin(ang) * this.top,this.height); //top, left -> 0,0
                this.vertices.push(Math.cos(ang + alphaAng) * this.top, -Math.sin(ang + alphaAng) * this.top, this.height); //top, right -> 1,0
            
                
                this.texCoords.push((1 / this.slices) * i, 1);
                this.texCoords.push((1 / this.slices) * (i + 1), 1);
                this.texCoords.push((1 / this.slices) * i, 0);
                this.texCoords.push((1 / this.slices) * (i + 1), 0);
    
                this.indices.push(4*i + 2, 4*i + 1, 4*i);
                this.indices.push(4*i + 1, 4*i + 2, 4*i +3 );
    
    
                this.normals.push(Math.cos(ang) * this.base, -Math.sin(ang) * this.base, 0);
                this.normals.push(Math.cos(ang + alphaAng) * this.base, -Math.sin(ang + alphaAng) * this.base, 0);
                
                this.normals.push(Math.cos(ang) * this.top, -Math.sin(ang) * this.top, 0);
                this.normals.push(Math.cos(ang + alphaAng) * this.top, -Math.sin(ang + alphaAng) * this.top, 0);
                
    
    
                ang += alphaAng;
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


