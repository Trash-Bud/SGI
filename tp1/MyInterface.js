import { CGFinterface, CGFapplication, dat } from '../lib/CGF.js';

/**
* MyInterface class, creating a GUI interface.
*/

export class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
        
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        this.initKeys();

        return true;
    }

    addCameraMenu(){
        this.gui.add(this.scene, 'selectedCamera', this.scene.camerasID)
        .name('Selected Camera')
        .onChange(this.scene.updateCamera.bind(this.scene));
    }

    

    addLightsFolder(){
        this.gui.add(this.scene, 'lightsVisible').name("Hide/Show Lights").onChange(this.scene.toggleLights.bind(this.scene))
        var lightsFolder = this.gui.addFolder('Lights')
        var i = 0;
        for(var key in this.scene.graph.lights){
            if (i >= 8){
                break;
            }
            lightsFolder.add(this.scene.lights[i], 'enabled').name(key)
            i++
        }
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
        if(event.code == "KeyM"){
            this.scene["globalMatIndex"]++
            
        }
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
        
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}