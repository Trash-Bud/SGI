import { CGFscene, CGFshader, CGFappearance, CGFtexture, CGFcamera } from '../lib/CGF.js';
import { CGFaxis } from '../lib/CGF.js';
import { MyGameOrchestrator } from './MyGameOrchestrator.js';
import {MySceneGraph} from './MySceneGraph.js'

var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
export class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();
        
        this.interface = myinterface;
        this.cameras = []
        this.defaultCameraIndex = 0;
        this.selectedCamera = 0;  
        this.camerasID = {};
        this.cameraCumulativeId = 1;
        this.lights = []
        this.lightsVisible = true
        this.lightsCount = 0
        this.globalMatIndex = 0

    }
   
    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;
        this.timeCounter = 0;
        this.xml_files = ["empty.xml","picnic.xml","table.xml"]
        this.current_file = 0
        this.setPickEnabled(true);
        this.enableTextures(true);
        this.init_components()

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.gameOrchestrator = new MyGameOrchestrator(this)
        this.animationCamera = null
        this.buttons_animator = null


    }

    init_components(){
        this.initCameras();
        this.initTextures();
        this.initShaders();
        this.initMaterials();
    }

    update(t) {
		this.pulsarShader.setUniformsValues({ timeFactor: (1 + Math.sin( t / 200 % 100)) / 2 });
        for (let i = 0; i < this.graph.animations.length; i++){
            var animation = this.graph.animations[i]
            const replaceAnimationTransformations =  animation.update(this.timeCounter)
            animation.applyNewTransformationsToComponents(replaceAnimationTransformations)
        }
        
        if (this.animationCamera != null) this.animationCamera.update(this.timeCounter);
        if (this.buttons_animator != null) this.buttons_animator.update(this.timeCounter);

        this.gameOrchestrator.update(this.timeCounter)

        this.timeCounter = this.timeCounter + this.updatePeriod;

        if (this.timeCounter % 1000 == 0){
            this.gameOrchestrator.update_every_second()
        }
        
	}
    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(45 * Math.PI / 180, 0.1, 500, vec3.fromValues(0, 4, 15), vec3.fromValues(0, 2, 0));
        this.cameras.push(this.camera)
        this.camerasID["sceneWhite"] = 0
        this.camera = new CGFcamera(45 * Math.PI / 180, 0.1, 500, vec3.fromValues(0, 4, -21), vec3.fromValues(0, 2, 0));
        this.cameras.push(this.camera)
        this.camerasID["sceneBlack"] = 1

    }


    updateCamera(){
        this.camera = this.cameras[this.selectedCamera]
        this.interface.setActiveCamera(this.camera)
    }

    initTextures(){
        this.font = new CGFappearance(this);
		this.fontTexture = new CGFtexture(this, "./scenes/images/oolite-font.trans.png");
		this.font.setTexture(this.fontTexture);
    }

    initShaders(){
        this.pulsarShader = new CGFshader(this.gl, "./shaders/pulsar.vert", "./shaders/pulsar.frag");
        this.textShader=new CGFshader(this.gl, "shaders/font.vert", "shaders/font.frag");
		this.textShader.setUniformsValues({'dims': [16, 16]});
    }

    initMaterials() {
        this.white = new CGFappearance(this)
        this.white.setSpecular(1,1,1,1)
        this.white.setDiffuse(1,1,1,1)

        this.red = new CGFappearance(this)
        this.red.setSpecular(1,0,0,1)
        this.red.setDiffuse(1,0,0,1)

        this.brown = new CGFappearance(this)
        this.brown.setSpecular(0.4,0.2,0,1)
        this.brown.setDiffuse(0.4,0.2,0,1)

        this.green = new CGFappearance(this)
        this.green.setSpecular(0,1,0,1)
        this.green.setDiffuse(0,1,0,1)

        this.blue = new CGFappearance(this)
        this.blue.setSpecular(0,0,1,1)
        this.blue.setDiffuse(0,0,1,1)


        this.black = new CGFappearance(this)
        this.black.setSpecular(0.1,0.1,0.1,1)
        this.black.setDiffuse(0.1,0.1,0.1,1)

        this.pickedColor = new CGFappearance(this)
        this.pickedColor.setSpecular(0,1,0,1)
        this.pickedColor.setDiffuse(0,1,0,1)

        this.highlightColor = new CGFappearance(this)
        this.highlightColor.setSpecular(1,0,0,1)
        this.highlightColor.setDiffuse(1,0,0,1)

    }
    
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.
        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];
                this.lights[i]["key"] = key
                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
            
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();
            
                i++;
               
            }
        }
        
        this.lightsCount = i
        for (i; i < 8; i++){
            this.lights[i].setVisible(false);
            this.lights[i].disable()
            this.lights[i].update()
            
        }
    }
    toggleLights(){  
        for(let i = 0; i < this.lightsCount; i++){
            this.lights[i].setVisible(this.lightsVisible)

        }

        
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.interface.addCameraMenu()
        this.setUpdatePeriod(this.graph.updatePeriod);
        this.updateCamera()
       
        this.initLights()
        this.interface.addLightsFolder()
        this.interface.addHighlightFolder()
        this.sceneInited = true;
       
        

    }

    handlePicking()
	{
		if (this.pickMode == false) {
			// results can only be retrieved when picking mode is false
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i=0; i< this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj)
					{
						var customId = this.pickResults[i][1];	
                        const realID = customId - 1		
                        
                        
                        this.gameOrchestrator.handlePicking(realID, this.timeCounter)
                        
                        
                        
                        
					}
				}
				this.pickResults.splice(0,this.pickResults.length);
			}		
		}
	}

    changeXml(){
        
        this.current_file = (this.current_file + 1) % this.xml_files.length

        this.graph = new MySceneGraph(this.xml_files[this.current_file], this)
        
        this.sceneInited = false

        this.cameras = []
        this.defaultCameraIndex = 0;
        this.selectedCamera = 0;  
        this.camerasID = {};
        this.cameraCumulativeId = 1;

        this.init_components()

    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        

        for(let i = 0; i < this.lightsCount; i++){
            this.lights[i].update()
        }

        this.handlePicking()
        this.clearPickRegistration()
       
        this.gameOrchestrator.registerForPicking()
        this.gameOrchestrator.display()

      
        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();  
                      
            // Displays the scene (MySceneGraph function).
            this.graph.displayScene(this.gameOrchestrator);
        }

    
        // ---- END Background, camera and axis setup
    }
}