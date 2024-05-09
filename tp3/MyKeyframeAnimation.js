import { MyAnimation } from "./MyAnimation.js";
import { MyAnimationHelper } from "./MyAnimationHelper.js";

export class MyKeyframeAnimation extends MyAnimation{
    constructor(animationID, updatePeriod) {
		super();
		this.animationID = animationID;
        this.keyframes = []
        this.interpolationTransformations = []
        this.components = []
        this.updatePeriod = updatePeriod;
        this.counter = 0;
        this.lastAppliedTransformations = [];

	}

    addlastAppliedTransformation(transformation){
        this.lastAppliedTransformations.push(transformation)
    }

    // called after animation has loaded every keyframe: calculate the interpolations inbetween frames
    executeAnimationCalculations(){
        for(let i = 0; i < this.keyframes.length - 1; i++){
            var first_keyframe = this.keyframes[i]
            var second_keyframe = this.keyframes[i + 1]
            this.interpolationTransformations.push(this.calculateInterpolationBetweenFrames(first_keyframe, second_keyframe))
        }
       
    }

    //calculate interpolation for rotations
    calculateRotationsInterpolation(prev_keyframe_transformations,next_keyframe_transformations, axis, time_between_frames ){
        //compute the differences between rotate axis
        var prev_keyframe_rotateX_transfs = prev_keyframe_transformations.filter(transf => transf.transformType == 'rotate' && transf.axis == axis)
        const prev_keyframe_rotateX = MyAnimationHelper.condenseRotations(prev_keyframe_rotateX_transfs, axis)
        var next_keyframe_rotateX_transfs = next_keyframe_transformations.filter(transf => transf.transformType == 'rotate' && transf.axis == axis)
        const next_keyframe_rotateX = MyAnimationHelper.condenseRotations(next_keyframe_rotateX_transfs, axis)
        let diff_keyframe_rotateX = {transformType:  "rotate", axis: axis}
        diff_keyframe_rotateX["angle"] = next_keyframe_rotateX["angle"] - prev_keyframe_rotateX["angle"]
        let rotateX_per_frame = diff_keyframe_rotateX
        rotateX_per_frame["angle"] = diff_keyframe_rotateX["angle"] / time_between_frames
        return rotateX_per_frame;
    }

    // calculate interpolation between translations
    calculateTranslateInterpolation(prev_keyframe_transformations,next_keyframe_transformations, time_between_frames){
        var prev_keyframe_translate_transfs = prev_keyframe_transformations.filter(transf => transf.transformType == 'translate')
        
        const prev_keyframe_translate = MyAnimationHelper.condenseTranslations(prev_keyframe_translate_transfs)

        var next_keyframe_translate_transfs = next_keyframe_transformations.filter(transf => transf.transformType == 'translate')
    
        const next_keyframe_translate = MyAnimationHelper.condenseTranslations(next_keyframe_translate_transfs)
        const initialTransform = {transformType:  "translate", x:  0, y: 0, z: 0}
        let diff_keyframe_translate = initialTransform
        diff_keyframe_translate["x"] = next_keyframe_translate["x"] - prev_keyframe_translate["x"]
        diff_keyframe_translate["y"] = next_keyframe_translate["y"] - prev_keyframe_translate["y"]
        diff_keyframe_translate["z"] = next_keyframe_translate["z"] - prev_keyframe_translate["z"]
        
        let translation_per_frame = initialTransform
        translation_per_frame["x"] = diff_keyframe_translate["x"] / time_between_frames
        translation_per_frame["y"] = diff_keyframe_translate["y"] / time_between_frames    
        translation_per_frame["z"] = diff_keyframe_translate["z"] / time_between_frames  

        return translation_per_frame;
    }

    // calculates interpolation scales
    calculateScaleterpolation(prev_keyframe_transformations,next_keyframe_transformations, time_between_frames){
        var prev_keyframe_translate_transfs = prev_keyframe_transformations.filter(transf => transf.transformType == 'scale')
        
        const prev_keyframe_translate = MyAnimationHelper.condenseScales(prev_keyframe_translate_transfs)

        var next_keyframe_translate_transfs = next_keyframe_transformations.filter(transf => transf.transformType == 'scale')
        const next_keyframe_translate = MyAnimationHelper.condenseScales(next_keyframe_translate_transfs)
        const initialTransform = {transformType:  "scale", x:  1, y: 1, z: 1}
        let diff_keyframe_translate = initialTransform
        diff_keyframe_translate["x"] = next_keyframe_translate["x"] - prev_keyframe_translate["x"]
        diff_keyframe_translate["y"] = next_keyframe_translate["y"] - prev_keyframe_translate["y"]
        diff_keyframe_translate["z"] = next_keyframe_translate["z"] - prev_keyframe_translate["z"]
        
        let translation_per_frame = initialTransform
        translation_per_frame["x"] = diff_keyframe_translate["x"] / time_between_frames
        translation_per_frame["y"] = diff_keyframe_translate["y"] / time_between_frames    
        translation_per_frame["z"] = diff_keyframe_translate["z"] / time_between_frames  

        return translation_per_frame;
    }

    // calculates the transformations the animation will need to apply on the component its applied to in between the two frames
    calculateInterpolationBetweenFrames(prev_keyframe, next_keyframe){

        let interpolationObj = []
        const time_between_frames = ((next_keyframe.instant - prev_keyframe.instant) * 1000) / this.updatePeriod;
       
        var next_keyframe_transformations = next_keyframe.transformation;
        var prev_keyframe_transformations = prev_keyframe.transformation;

        //compute the differences between translations
        
        interpolationObj.push(this.calculateTranslateInterpolation(prev_keyframe_transformations, next_keyframe_transformations, time_between_frames))

        //compute the differences between rotate axis 'X'
        
        interpolationObj.push(this.calculateRotationsInterpolation(prev_keyframe_transformations, next_keyframe_transformations, 'x', time_between_frames))
        
        //compute the differences between rotate axis 'Y'
        
        interpolationObj.push(this.calculateRotationsInterpolation(prev_keyframe_transformations, next_keyframe_transformations, 'y', time_between_frames))

        //compute the differences between rotate axis 'Z'

        interpolationObj.push(this.calculateRotationsInterpolation(prev_keyframe_transformations, next_keyframe_transformations, 'z', time_between_frames))
        
        //compute the differences between scales

        interpolationObj.push(this.calculateScaleterpolation(prev_keyframe_transformations, next_keyframe_transformations, time_between_frames))
        
        return interpolationObj;
       

    }

    addKeyFrame(keyframe){
        this.keyframes.push(keyframe)
    }

    addAppliedComponent(component){
        this.components.push(component)
    }

    applyNewTransformationsToComponents(replaceAnimationTransformations){
        this.components.forEach(component => {
            component["display"] = true;
            component["animationTransformations"] = replaceAnimationTransformations;
        });
    }

    // called on every update 
    update(t) {
         // find out what the next keyframe is
         var next_keyframe_index = this.keyframes.findIndex(keyframe => keyframe.instant * 1000 >= t);
         if (next_keyframe_index == 0 || next_keyframe_index == -1){
             // the first keyframe hasn't happened yet or the animation has ended
             return false
         }
         var transfs_to_add = this.interpolationTransformations[next_keyframe_index  - 1]
       
        var replaceAnimationTransformations = []
        var animationsTransformations = this.lastAppliedTransformations

        // update translate
        var animationsTranslate = animationsTransformations.find(transf => transf.transformType == 'translate')
        var translateToAdd = transfs_to_add.find(transf => transf.transformType == 'translate')
        animationsTranslate["x"] = animationsTranslate["x"] + translateToAdd["x"]
        animationsTranslate["y"] = animationsTranslate["y"] + translateToAdd["y"]
        animationsTranslate["z"] = animationsTranslate["z"] + translateToAdd["z"]
        replaceAnimationTransformations.push(animationsTranslate)

        // update rotate 'X'
        var animationsRotateX = animationsTransformations.find(transf => transf.transformType == 'rotate' && transf.axis == 'x')
        var rotateToAdd = transfs_to_add.find(transf => transf.transformType == 'rotate' && transf.axis == 'x')
        animationsRotateX["angle"] = animationsRotateX["angle"] + rotateToAdd["angle"]
        replaceAnimationTransformations.push(animationsRotateX)
        
            // update rotate 'Y'
        var animationsRotateY = animationsTransformations.find(transf => transf.transformType == 'rotate' && transf.axis == 'y')
        rotateToAdd = transfs_to_add.find(transf => transf.transformType == 'rotate' && transf.axis == 'y')
        animationsRotateY["angle"] = animationsRotateY["angle"] + rotateToAdd["angle"]
        replaceAnimationTransformations.push(animationsRotateY)

        // update rotate 'Z'
        var animationsRotateZ = animationsTransformations.find(transf => transf.transformType == 'rotate' && transf.axis == 'z')
        rotateToAdd = transfs_to_add.find(transf => transf.transformType == 'rotate' && transf.axis == 'z')
        animationsRotateZ["angle"] = animationsRotateZ["angle"] + rotateToAdd["angle"]
        replaceAnimationTransformations.push(animationsRotateZ)
        
        // update scale
        var animationsScale = animationsTransformations.find(transf => transf.transformType == 'scale')
        var scaleToAdd = transfs_to_add.find(transf => transf.transformType == 'scale')
        animationsScale["x"] = animationsScale["x"] + scaleToAdd["x"]
        animationsScale["y"] = animationsScale["y"] + scaleToAdd["y"]
        animationsScale["z"] = animationsScale["z"] + scaleToAdd["z"]
        replaceAnimationTransformations.push(animationsScale)

        return replaceAnimationTransformations
        
            
        
    }

}