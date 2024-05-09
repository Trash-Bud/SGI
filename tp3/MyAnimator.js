import { MyKeyframeAnimation } from "./MyKeyframeAnimation.js"

const DEGREE_TO_RAD = Math.PI / 180;

export class MyAnimator{

    constructor(scene){
        this.scene = scene
        this.updatePeriod = 50
        this.animationObjects = []
   
    }

    keyFrameParser(animation_keyframes, obj_to_move, original_position){
    
        var animationObj = new MyKeyframeAnimation('movePiece', this.updatePeriod)
        for (let b = 0; b < animation_keyframes.length; b++){
            var keyframe = animation_keyframes[b];
            var keyframe_instant = keyframe['instant'];
            if (animationObj.keyframes > 0 &&  keyframe_instant < animationObj.keyframes[-1].instant ){
                this.onXMLError("KeyFrame instant is less than previous keyframe");
            }
            var keyframe_transformations = keyframe['transformations'];
            var keyFrameObj = {instant : keyframe_instant, transformation: []}
          
            for (var j = 0; j < keyframe_transformations.length; j++) {
                
                switch (keyframe_transformations[j]['type']) {
                    case 'translation':
                        var x = keyframe_transformations[j]['x'];
                        var y = keyframe_transformations[j]['y'];
                        var z = keyframe_transformations[j]['z'];
                      
                        keyFrameObj.transformation.push({transformType: 'translate', x : x, y: y, z:z })
                        break;
                    case 'scale':                        
                        var sx = keyframe_transformations[j]['x'];
                        var sy = keyframe_transformations[j]['y'];
                        var sz = keyframe_transformations[j]['z'];

                        keyFrameObj.transformation.push({transformType: 'scale', x : sx, y: sy, z: sz})
                        
                        break;
                    case 'rotation':
                        var angle = keyframe_transformations[j]['angle'];
                        var axis = keyframe_transformations[j]['axis'];
                        keyFrameObj.transformation.push({transformType: 'rotate', angle: angle, axis: axis})
                        
                    break;
                }
            }
            animationObj.addKeyFrame(keyFrameObj)
        }

        for (let transfCount = 0; transfCount < animationObj.keyframes[0].transformation.length; transfCount++){
            var transformation = animationObj.keyframes[0].transformation[transfCount]
            animationObj.addlastAppliedTransformation(transformation)
            
        }
        

        animationObj.executeAnimationCalculations()
        this.animationObjects.push({ 'animation' : animationObj, 'object' : obj_to_move, 'transfsToApply':
         animationObj.keyframes[0].transformation, original_position: original_position })
    }

    makeAMovePieceAnimation(time, original_position, final_destination, obj_to_move, animation_duration){
       
        const translate_diff_x = final_destination[0] - original_position[0]
        const translate_diff_y = final_destination[1] - original_position[1]
        const translate_diff_z = final_destination[2] - original_position[2]
       
        original_position[0] += 0.5
        original_position[1] += 0.5
        original_position[2] += 0.1

        const initialInstant = time /1000 - 0.1
    
        const key_frames = [{instant: initialInstant , transformations: [{'type': 'translation', 'x': 0, 'y': 0, 'z' : 0},
        {'type': 'rotation', 'angle': 0, 'axis': 'x'}, {'type': 'rotation', 'angle': 0, 'axis': 'y'}, {'type': 'rotation', 'angle': 0, 'axis': 'z'}, 
        {'type': 'scale', x : 1, y: 1, z: 1}
        ]},
             {instant: initialInstant + animation_duration, transformations: [{'type': 'translation', 'x': translate_diff_x, 'y': translate_diff_y, 'z' : translate_diff_z}, 
             {'type': 'rotation', 'angle': 0, 'axis': 'x'}, {'type': 'rotation', 'angle': 0, 'axis': 'y'}, 
             {'type': 'rotation', 'angle': 0, 'axis': 'z'}, 
             {'type': 'scale', x : 1, y: 1, z: 1}]}]

        this.keyFrameParser(key_frames, obj_to_move, original_position)
        
        

    }

    makeAKingAnimation(time,original_position, final_destination, obj_to_move,max_height, animation_duration){
        //make the arch animation here
        final_destination[0] += 0.5
        final_destination[1] += 0.5
        final_destination[2] += 0.1
        
        const translate_diff_x = final_destination[0] - original_position[0]
        const translate_diff_y = (final_destination[1] + original_position[1])
        
        original_position[1] = - original_position[1]
        const initialInstant = time /1000 - 0.2
        var x  = 0
        var z = 0
        var y = 0
        const number_of_frames = 20
        const key_frames = []
        const functionPoints = this.getFunctionPoints(-2, 2, number_of_frames)
        console.log(functionPoints)
        for (let i = 0; i < number_of_frames; i++){

            x = i * (animation_duration / number_of_frames)
            y = i * (animation_duration / number_of_frames)
            z = this.paraboleAnimation(functionPoints[i], 5)

            key_frames.push({instant: initialInstant + x, transformations: [
                {'type': 'translation', 'x': i * ( translate_diff_x/ (number_of_frames - 1)), 'y': i * (translate_diff_y / (number_of_frames - 1)), 'z' : z},
            {'type': 'rotation', 'angle': 0, 'axis': 'x'}, {'type': 'rotation', 'angle': 0, 'axis': 'y'},
             {'type': 'rotation', 'angle': 0, 'axis': 'z'}, 
            {'type': 'scale', x : 1, y: 1, z: 1}
            ]})
        }
        this.keyFrameParser(key_frames, obj_to_move, original_position)
    }

    paraboleAnimation(x, max_height){
        return - (x * x ) + max_height
    }

    getFunctionPoints(min_x, max_x, number_of_points){
        const diff = max_x - min_x
        var points = []  
        for(let i = 0; i < number_of_points; i++){
            points.push(min_x + i * (diff/ (number_of_points - 1)) )
        }
        return points
    }

    makeACapturingAnimation(time,original_position, final_destination, obj_to_move,max_height, animation_duration){
        //make the arch animation here
        
        original_position[0] += 0.5
        original_position[1] += 0.5
        original_position[2] += 0.1
        
        const translate_diff_x = final_destination[0] - original_position[0] + 0.2
        const translate_diff_y = -(final_destination[1] + original_position[1]) * 1.1
    

        const initialInstant = time /1000 - 0.2
        var x  = 0
        var z = 0
        var y = 0
        const number_of_frames = 20
        const key_frames = []
        const functionPoints = this.getFunctionPoints(-2, 2, number_of_frames)
        console.log(functionPoints)
        for (let i = 0; i < number_of_frames; i++){

            x = i * (animation_duration / number_of_frames)
            y = i * (animation_duration / number_of_frames)
            z = this.paraboleAnimation(functionPoints[i], 5)

            key_frames.push({instant: initialInstant + x, transformations: [
                {'type': 'translation', 'x': i * ( translate_diff_x/ (number_of_frames - 1) ), 'y': i * (translate_diff_y / (number_of_frames - 1)), 'z' : z + 0.2},
            {'type': 'rotation', 'angle': 0, 'axis': 'x'}, {'type': 'rotation', 'angle': 0, 'axis': 'y'},
             {'type': 'rotation', 'angle': 0, 'axis': 'z'}, 
            {'type': 'scale', x : 1, y: 1, z: 1}
            ]})
        }

        console.log(key_frames)

        this.keyFrameParser(key_frames, obj_to_move, original_position)
    }


    update(time){
        this.animationObjects.forEach(animation => {
            const animationObj = animation['animation']
            var piece = animation['object']
            const replaceAnimationTransformations = animationObj.update(time)
            if(!replaceAnimationTransformations){
                if (piece != null) piece.becomeStatic()
                this.animationObjects.splice(this.animationObjects.indexOf(animation), 1);
            }else{
                animation['transfsToApply'] = replaceAnimationTransformations
            }
            
         
        });
    }

    executeTransformation(transformObj){
        switch(transformObj.transformType){
            case "translate":
                var x = transformObj.x
                var y = transformObj.y
                var z = transformObj.z
                
                return this.scene.translate(x,y,z)

            case "rotate":
                var axis = transformObj.axis
                var angle = parseInt(transformObj.angle)
                var angleInRadians = angle * DEGREE_TO_RAD; 
                switch(axis){
                    case "x":
                        return this.scene.rotate(angleInRadians,1,0,0)
                
                    case "y":
                        return this.scene.rotate(angleInRadians,0,1,0)
                
                    case "z":
                        return this.scene.rotate(angleInRadians,0,0,1)
                    
                }
                
            break;

            case "scale":
                var x = transformObj.x
                var y = transformObj.y
                var z = transformObj.z
                return  this.scene.scale(x,y,z)
            
        }
    }

    isAnimating(){
        return this.animationObjects.length > 0
    }

    display(){
        
        this.animationObjects.forEach(animation => {
            const piece = animation['object']
            if(piece == undefined){
                return
            }
            const original_position_x = animation['original_position'][0]
            const original_position_y = animation['original_position'][1]
            const original_position_z = animation['original_position'][2]
            const transformationsToApply = animation['transfsToApply']
            this.scene.pushMatrix()
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            
            this.scene.translate(original_position_x,original_position_y , original_position_z)
            transformationsToApply.forEach(transformation => {
                this.executeTransformation(transformation)
            });

         
            piece.display()
            if(piece.isKing){
                this.scene.pushMatrix()
                this.scene.translate(0,0,0.25)
                piece.display()
                this.scene.popMatrix()
            }

            this.scene.popMatrix()
            
         
    
        });
    }
}
