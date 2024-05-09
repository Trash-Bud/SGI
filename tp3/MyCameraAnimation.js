import { CGFcamera } from "../lib/CGF.js";


export class MyCameraAnimation {
    constructor(scene, initialCamera, finalCamera, currentTime) {
        this.scene = scene;
        this.initialCamera = initialCamera;
        this.finalCamera = finalCamera;

        this.angleInitialCamera = initialCamera.fov;
        this.nearInitialCamera = initialCamera.near;
        this.farInitialCamera = initialCamera.far;
        this.positionInitialCamera = initialCamera.position;
        this.targetInitialCamera = initialCamera.target;
        
        this.angleFinalCamera = finalCamera.fov;
        this.nearFinalCamera = finalCamera.near;
        this.farFinalCamera = finalCamera.far;
        this.positionFinalCamera = finalCamera.position;
        this.targetFinalCamera = finalCamera.target;

        this.totalTime = 5000;
        this.finalInstant = currentTime + this.totalTime;
        this.currentTime = currentTime;
        this.startTime = null;
        this.active = true;

        this.currentCamera = this.initialCamera;
    }

    /**
     * Update function, called periodically, which calculates the values of the camera at a given moment
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.currentTime = elapsedTime;
        if (!this.active)
            return 0;

        if(this.currentTime <= this.finalInstant) {
            var percentageTime = (this.finalInstant - this.currentTime) / (this.totalTime);
            
            let newPosition = [0, 0, 0];
            vec3.lerp(newPosition, this.positionFinalCamera, this.positionInitialCamera, percentageTime);

            let newTarget = [0, 0, 0];
            vec3.lerp(newTarget, this.targetFinalCamera, this.targetInitialCamera, percentageTime);

            let near = this.nearFinalCamera + percentageTime * (this.nearInitialCamera - this.nearFinalCamera);
            let far = this.farFinalCamera + percentageTime * (this.farInitialCamera - this.farFinalCamera);
            let fov = this.angleFinalCamera + percentageTime * (this.angleInitialCamera - this.angleFinalCamera);
            
            this.currentCamera = new CGFcamera(fov, near, far, newPosition, newTarget);
        }
        else {
            this.active = false;
            this.currentCamera = this.finalCamera;
            this.applyCamera();
            
        }
        this.applyCamera();
        
    }

    /**
     * Applies the current camera to the scene, if the animation if active
     */
    apply() {
        if (!this.active) {
            return 0;
        }

        this.applyCamera();
    }

    /**
     * Applies the current camera to the scene
     */
    applyCamera() {
        this.scene.camera = this.currentCamera;
        //this.scene.interface.setActiveCamera(this.scene.camera);
    }
}