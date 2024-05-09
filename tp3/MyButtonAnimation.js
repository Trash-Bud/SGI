
export class MyButtonAnimation {
    constructor(scene, button, currentTime, totalTime) {
        this.scene = scene;
        this.button = button
        this.button.press()
        this.totalTime = totalTime;
        this.finalInstant = currentTime + this.totalTime;
        this.currentTime = currentTime;
        this.startTime = null;
        this.active = true;
    }

    /**
     * Update function, called periodically, which calculates the values of the camera at a given moment
     * @param {Integer} elapsedTime - the time elapsed since the last call
     */
    update(elapsedTime) {
        this.currentTime = elapsedTime;
        if (!this.active)
            return 0;

        if(this.currentTime > this.finalInstant) {
            this.active = false;
            this.button.stop_press()            
        }        
    }
}