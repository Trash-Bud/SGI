import { CGFappearance, CGFcamera, CGFcameraOrtho, CGFnurbsObject, CGFshader, CGFtexture, CGFXMLreader } from '../lib/CGF.js';
import { MyPatch } from './MyPatch.js';
import { MyCylinder } from './MyCylinder.js';
import { MyRectangle } from './MyRectangle.js';
import { MySphere } from './MySphere.js';
import { MyTorus } from './MyTorus.js';
import { MyTriangle } from './MyTriangle.js';
import {MyKeyframeAnimation} from './MyKeyframeAnimation.js'

var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var ANIMATIONS_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
export class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;
        
        this.updatePeriod = 50;
        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;
        this.animations =  [];
        this.pickedID = undefined

        this.nodes = [];
        this.defaultAppearance = new CGFappearance(this.scene);

        
        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();
        this.defaultCamera = '';

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");

        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "sxs")
            return "root tag <sxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }
        
        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index = 0
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }
         // <animations>
         if ((index = nodeNames.indexOf("animations")) == -1)
         return "tag <animations> missing";
         else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
             return error;
        }


        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
        
    }

    /**
     * Parses the <animations> block. 
     * @param {animation block element} animationNode
     */
    parseAnimations(animationsNode){
        var animationChildren = animationsNode.children;
        for (var i = 0; i < animationChildren.length; i++) {
            
            var animation = animationChildren[i];
            var animation_keyframes = animation.children;
            var animationID = this.reader.getString(animation, 'id');
            var animationObj = new MyKeyframeAnimation(animationID, this.updatePeriod)

            for (let b = 0; b < animation_keyframes.length; b++){
                var keyframe = animation_keyframes[b];
                var keyframe_instant = this.reader.getFloat(keyframe, 'instant');
                if (animationObj.keyframes > 0 &&  keyframe_instant < animationObj.keyframes[-1].instant ){
                    this.onXMLError("KeyFrame instant is less than previous keyframe");
                }
                var keyframe_transformations = keyframe.children;
                var keyFrameObj = {instant : keyframe_instant, transformation: []}
              

                for (var j = 0; j < keyframe_transformations.length; j++) {
                    
                    switch (keyframe_transformations[j].nodeName) {
                        case 'translation':
                            var coordinates = this.parseCoordinates3D(keyframe_transformations[j], "translate transformation for ID " + animationID);
                            if (!Array.isArray(coordinates))
                                return coordinates;
    
                            keyFrameObj.transformation.push({transformType: 'translate', x : coordinates[0], y: coordinates[1], z: coordinates[2] })
                            break;
                        case 'scale':                        
                            var sx = this.reader.getFloat(keyframe_transformations[j], 'sx');
                            var sy = this.reader.getFloat(keyframe_transformations[j], 'sy');
                            var sz = this.reader.getFloat(keyframe_transformations[j], 'sz');
    
                            keyFrameObj.transformation.push({transformType: 'scale', x : sx, y: sy, z: sz})
                            
                            break;
                        case 'rotation':
                            var angle = this.reader.getInteger(keyframe_transformations[j], 'angle');
                            var axis = this.reader.getString(keyframe_transformations[j], 'axis');
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
            this.animations.push(animationObj)
            
       
    
        }
    }
    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        this.cameras = {}
        this.defaultCamera = this.reader.getString(viewsNode, 'default')
        var childs = viewsNode.children;
        
        for (var i = 0; i < childs.length; i++) {
            
            var grandChildren = childs[i].children
            var id = this.reader.getString(childs[i], 'id')
            if(grandChildren.length < 2){
                this.onXMLError("UNABLE TO PARSE CAMERAS - ERROR IN XML")
                return null
            }
            var fromNode = grandChildren[0]
            var toNode = grandChildren[1]
            var near = this.reader.getFloat(childs[i], 'near')
            var far = this.reader.getFloat(childs[i], 'far')

            
            var from = vec3.fromValues(this.reader.getFloat(fromNode, 'x'), this.reader.getFloat(fromNode, 'y'),this.reader.getFloat(fromNode, 'z'))
            var to = vec3.fromValues(this.reader.getFloat(toNode, 'x'), this.reader.getFloat(toNode, 'y'),this.reader.getFloat(toNode, 'z'))
            
            if (id == this.defaultCamera){
                this.scene.defaultCameraIndex = i
                this.scene.selectedCamera = i
            }

            if(childs[i].nodeName == "perspective"){
                var angle = this.reader.getInteger(childs[i], 'angle')
                angle = angle * DEGREE_TO_RAD
                this.scene.cameras.push(new CGFcamera(angle, near,far,from, to))
            }else if(childs[i].nodeName == "ortho"){
                var upNode = undefined
                var up
                if(grandChildren.length > 2){
                    upNode = grandChildren[2]
                }
                if (upNode == undefined){
                    up =vec3.fromValues(0,1,0)
                }else{
                    up = vec3.fromValues(this.reader.getFloat(upNode, 'x'), this.reader.getFloat(upNode, 'y'),this.reader.getFloat(upNode, 'z'))
                }
                
                var left = this.reader.getFloat(childs[i], 'left', true)
                var right = this.reader.getFloat(childs[i], 'right', true)
                var top = this.reader.getFloat(childs[i], 'top', true)
                var bottom = this.reader.getFloat(childs[i], 'bottom', true)
                this.scene.cameras.push(new CGFcameraOrtho(left,right,bottom,top,near,far,from, to, up))
            }
            this.scene.cameraCumulativeId ++
            
            this.scene.camerasID[id] = this.scene.cameraCumulativeId
        }
        
        
       
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            
            enableLight = aux;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        var children = texturesNode.children;

        this.textures = {}

        for (var i = 0; i < children.length; i++){
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

             // Get id of the current texture.
             var textureID = this.reader.getString(children[i], 'id');
             if (textureID == null)
                 return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each light (conflict: ID = " + textureID + ")";

            // Get url of the current texture.
            var textureFile = this.reader.getString(children[i], 'file');
            var newTexture = new CGFtexture(this.scene, textureFile);
            this.textures[textureID] = newTexture

        }
        
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";
            
            var newMaterial = new CGFappearance(this.scene);

            var shininess = this.reader.getFloat(children[i], 'shininess');
            newMaterial.setShininess(shininess);

            grandChildren = children[i].children;
            // Specifications for the current material.

            for (var j = 0; j < grandChildren.length; j++) {
                var r = this.reader.getFloat(grandChildren[j], 'r')
                var g = this.reader.getFloat(grandChildren[j], 'g')
                var b = this.reader.getFloat(grandChildren[j], 'b')
                var a = this.reader.getFloat(grandChildren[j], 'a')
                switch (grandChildren[j].nodeName) {
                    case 'emission':
                        newMaterial.setEmission(r,g,b,a)
                    break;
                    case 'ambient':
                        newMaterial.setAmbient(r,g,b,a)
                    break;
                    case 'diffuse':
                        newMaterial.setDiffuse(r,g,b,a)
                    break;
                    case 'specular':
                        newMaterial.setSpecular(r,g,b,a)
                    break;
                }
            }
            this.materials[materialID] = newMaterial;
            
            
        }

        //this.log("Parsed materials");
        
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':                        
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        
                        break;
                    case 'rotate':
                        var angle = this.reader.getInteger(grandChildren[j], 'angle') * DEGREE_TO_RAD;
                        
                        switch(this.reader.getString(grandChildren[j], 'axis')){
                            case "x":
                                transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle)
                            break;

                            case "y":
                                transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle)
                            break;

                            case "z":
                                transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle)
                            break;
                        }
                    break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'patch')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus or patch)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }else if(primitiveType == 'triangle'){
                //x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;
                

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) ))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;
                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;


                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3) ))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;
                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var s1 = Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2) + Math.pow(z1-z2,2));
                var s2 = Math.sqrt(Math.pow(x1-x3,2) + Math.pow(y1-y3,2) + Math.pow(z1-z3,2));
                var s3 = Math.sqrt(Math.pow(x3-x2,2) + Math.pow(y3-y2,2) + Math.pow(z3-z2,2));
               
                
                if((s1 + s2 > s3) && (s2 + s3 > s1) && (s3 + s1 > s2)){
                    var triangle = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);
                    this.primitives[primitiveId] = triangle;
                }
                else{
                    return "Invalid triangle with ID = " + primitiveId;
                }
            }else if(primitiveType == "cylinder"){

                //base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base) && base >= 0))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                //top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top) && top >= 0))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                if (top == 0 && base == 0){
                    return "top and base can't both not have radius" + primitiveId;
                }


                //height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height) && height > 0))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;
                
                //slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;
                
                //stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;
                var cylinder = new MyCylinder(this.scene, slices, stacks, height, base, top);
                this.primitives[primitiveId] = cylinder;


            }else if(primitiveType == "sphere"){
                //radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                //slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;
                
                var sphere = new MySphere(this.scene, slices, stacks, radius);
                this.primitives[primitiveId] = sphere;
            }else if(primitiveType == "torus"){
                //inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner) && inner >0))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                //outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer) && outer >0))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                //slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;
                //loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops) && loops >0))
                     return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;
                

                var torus = new MyTorus(this.scene, inner, outer, slices, loops);
                this.primitives[primitiveId] = torus;
            }else if(primitiveType == "patch"){
                //inner
                var degree_u = this.reader.getFloat(grandChildren[0], 'degree_u');
                if (!(degree_u != null && !isNaN(degree_u) && degree_u >0))
                    return "unable to parse degree_u of the primitive coordinates for ID = " + primitiveId;

                //outer
                var parts_u = this.reader.getFloat(grandChildren[0], 'parts_u');
                if (!(parts_u != null && !isNaN(parts_u) && parts_u >0))
                    return "unable to parse parts_u of the primitive coordinates for ID = " + primitiveId;

                //slices
                var degree_v = this.reader.getFloat(grandChildren[0], 'degree_v');
                if (!(degree_v != null && !isNaN(degree_v) && degree_v > 0))
                    return "unable to parse degree_v of the primitive coordinates for ID = " + primitiveId;
                //loops
                var parts_v = this.reader.getFloat(grandChildren[0], 'parts_v');
                if (!(parts_v != null && !isNaN(parts_v) && parts_v >0))
                     return "unable to parse parts_v of the primitive coordinates for ID = " + primitiveId;
                
                var cp_elements = grandChildren[0].children;
                var control_points = []
                for (let cp_index = 0; cp_index < cp_elements.length; cp_index++){
                    var cp_x = this.reader.getFloat(cp_elements[cp_index], 'x');
                    var cp_y = this.reader.getFloat(cp_elements[cp_index], 'y');
                    var cp_z = this.reader.getFloat(cp_elements[cp_index], 'z');
                    control_points.push([cp_x,cp_y,cp_z])

                }
        

                
                var patch = new MyPatch(this.scene, degree_u,degree_v, parts_u,parts_v,control_points);
                this.primitives[primitiveId] = patch;
            }
            else {
                console.warn("To do: Parse other primitives.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            var componentObj = {}
        
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";
    
            
            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            //set component ID
            componentObj["id"] = componentID;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var highlightedIndex = nodeNames.indexOf("highlighted");
            var animationsIndex = nodeNames.indexOf("animation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            componentObj["display"] = true

            // highlighted

            if(highlightedIndex != -1){
                
                var highlightedComponent = grandChildren[highlightedIndex];
                var r = this.reader.getFloat(highlightedComponent, 'r');
                var g = this.reader.getFloat(highlightedComponent, 'g');
                var b = this.reader.getFloat(highlightedComponent, 'b');
                var scale_h = this.reader.getFloat(highlightedComponent, 'scale_h');

                componentObj["highlighted"] = {enabled: true, r : r, g: g, b: b, scale: scale_h}
            }

            // animations
            if (animationsIndex != -1){
                
                
                var animationComponent = grandChildren[animationsIndex];
                var animationID = this.reader.getString(animationComponent, 'id')
                var animation = this.animations.find(animation => animation.animationID == animationID);
                animation.addAppliedComponent(componentObj);
                if (animation.keyframes[0].instant > 0){
                    componentObj["display"] = false
                }
                componentObj["animationTransformations"] = []
                
            }
            // Transformations
            componentObj["transformations"] = [];
            var transformationComponents = grandChildren[transformationIndex].children;
            var transformArray = []
            for(let t = 0; t < transformationComponents.length; t++){
                
                switch(transformationComponents[t].nodeName){
                    case "transformationref":
                        transformArray.push({"transformType" : "ref" ,
                        "id" : this.reader.getString(transformationComponents[t], 'id'),
                    })
                    break;

                    case "translate":
                        transformArray.push({"transformType" : "translate" ,
                        "x" : this.reader.getString(transformationComponents[t], 'x'),
                        "y" : this.reader.getString(transformationComponents[t], 'y'),
                        "z" : this.reader.getString(transformationComponents[t], 'z'),
                        
                    })
                    break;
                    case "rotate":
                        transformArray.push({"transformType" : "rotate" ,
                        "axis" : this.reader.getString(transformationComponents[t], 'axis'),
                        "angle" : this.reader.getString(transformationComponents[t], 'angle'),
                        
                    })
                    break;
                    case "scale":
                        transformArray.push({"transformType" : "scale" ,
                        "x" : this.reader.getString(transformationComponents[t], 'x'),
                        "y" : this.reader.getString(transformationComponents[t], 'y'),
                        "z" : this.reader.getString(transformationComponents[t], 'z'),         
                    })
                    break;
                }
                
            }
            componentObj["transformations"] = transformArray;
            
            // Materials
            var materialsComponent = grandChildren[materialsIndex].children;
            var materialsArray = []
            for(let m = 0; m < materialsComponent.length; m++){
                var inherited = this.reader.getString(materialsComponent[m], 'id') == 'inherit' 
                materialsArray.push({"materialID" : this.reader.getString(materialsComponent[m], 'id'), "wantToInherit" : inherited  })

            }

            componentObj["materials"] = materialsArray
            // Texture

            var textureComponent = grandChildren[textureIndex];

            var length_s = this.reader.getFloat(textureComponent, 'length_s', false)
            var length_t = this.reader.getFloat(textureComponent, 'length_t', false)
            inherited = this.reader.getString(textureComponent, 'id') == 'inherit' 
            componentObj["texture"] = {"textureID" : this.reader.getString(textureComponent, 'id'),
            "length_s" : length_s == null ? 1 : length_s,
            "length_t" : length_t == null ? 1 : length_t,
            "wantToInherit" : inherited

            }


            // Children
            var childrenComponents = grandChildren[childrenIndex].children;
            var childrensArray = [];
            for(var childrenId  = 0; childrenId < childrenComponents.length; childrenId++){
                childrensArray.push({"type": childrenComponents[childrenId].nodeName,
                            "id" : childrenComponents[childrenId].id
            
                    })
            
            }

            componentObj["children"] = childrensArray;

            this.components.push(componentObj)
           

        }
        console.log(this.components)
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    executeTransformation(transformObj){
        var transfMatrix = mat4.create()
        switch(transformObj.transformType){
            case "translate":
                var x = transformObj.x
                var y = transformObj.y
                var z = transformObj.z
                var coordinates = [x,y,z]
                return mat4.translate(transfMatrix, transfMatrix, coordinates)

            case "rotate":
                var axis = transformObj.axis
                var angle = parseInt(transformObj.angle)
                var angleInRadians = angle * DEGREE_TO_RAD; 
                switch(axis){
                    case "x":
                        return mat4.rotateX(transfMatrix, transfMatrix, angleInRadians)
                
                    case "y":
                        return mat4.rotateY(transfMatrix, transfMatrix, angleInRadians)
                

                    case "z":
                        return mat4.rotateZ(transfMatrix, transfMatrix, angleInRadians)
                    
                }
                
            break;

            case "scale":
                var x = transformObj.x
                var y = transformObj.y
                var z = transformObj.z
                var coordinates = [x,y,z]
                return mat4.scale(transfMatrix, transfMatrix, coordinates)
            
        }
    }

    displayComponent(component, parentComponent){   
        if(!component["display"]){
            return
        }
        var transformations = component["transformations"]
        var currMatrix = this.scene.getMatrix();

        for(let t = 0; t < transformations.length; t++){
            switch(transformations[t].transformType){
                case "ref":
                    this.scene.multMatrix(this.transformations[transformations[t].id])
                break;
                default:
                    this.scene.multMatrix(this.executeTransformation(transformations[t]))
                break;
            }
        }
        if (component["animationTransformations"] != undefined ){
         
            for(let a = 0; a < component["animationTransformations"].length; a++){
               
                this.scene.multMatrix(this.executeTransformation(component["animationTransformations"][a]))
                
            }
        }
        var materialIndex = this.scene["globalMatIndex"]
        var componentMatIndex = materialIndex % component["materials"].length
        

        var componentMaterialID = component["materials"][componentMatIndex].materialID
        var wantToInherit= component["materials"][componentMatIndex].wantToInherit
        var componentMaterial = this.materials[componentMaterialID]
        var parentComponentTextID
        if(parentComponent != null){
            var parentMatIndex = materialIndex % parentComponent["materials"].length
            var parentComponentMaterial = this.materials[parentComponent["materials"][parentMatIndex].materialID]
            parentComponentTextID = parentComponent["texture"].textureID
            componentMaterial = wantToInherit ? parentComponentMaterial : componentMaterial
            component["materials"][componentMatIndex].materialID = wantToInherit ? parentComponent["materials"][parentMatIndex].materialID : 
            component["materials"][componentMatIndex].materialID

        }
        
        
        var textureID = component["texture"].textureID
        wantToInherit = component["texture"].wantToInherit
        if(wantToInherit){
            component["texture"] = parentComponent["texture"]
        }
        
        var componentTexture = this.textures[textureID]
        if(textureID == "none"){
            componentMaterial.setTexture(null)
        }else{
            componentMaterial.setTexture(componentTexture)
            componentMaterial.setTextureWrap("REPEAT", "REPEAT")
        }
        
        componentMaterial.apply()
        
        
        for(let childrenID = 0; childrenID < component.children.length; childrenID++){
          
            var child = component.children[childrenID];
            var childID = child.id;
            if(component.children[childrenID].type == "componentref"){
 
                this.displayComponent(this.components.find(component => component.id == childID), component)
            }else{
            
                if(this.primitives[childID] instanceof MyRectangle || this.primitives[childID] instanceof MyTriangle){
    
                    this.primitives[childID].updateS_T(component["texture"].length_s, component["texture"].length_t)
                }
                if (component["highlighted"] != undefined && component["highlighted"]["enabled"] ){
                    var baseColor = componentMaterial.diffuse
                    var scale = component["highlighted"]["scale"]
                    var expandedColor = [component["highlighted"]["r"],component["highlighted"]["g"], component["highlighted"]["b"], 1.0 ]
                    this.scene.pulsarShader.setUniformsValues({ baseColor: baseColor, expandedColor: expandedColor, scale: scale });

                    this.scene.setActiveShader(this.scene.pulsarShader);
                }
                
                this.scene.registerForPick(-1, this.primitives[childID] )
                this.primitives[childID].display()
                
                if (component["highlighted"]){
                    this.scene.setActiveShader(this.scene.defaultShader);
                }
                
            }
            
           
        
        }
        /*this.scene.setActiveShader(this.scene.defaultShader); */
        
        this.scene.setMatrix(currMatrix);
        // Apply transformations corresponding to the camera position relative to the origin
       
    }

    toggleHighlightPiece(component){
        component["materials"] = [component["materials"][1], component["materials"][0]]
    
    }

    
    

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph
        this.scene.updateProjectionMatrix();
        this.scene.loadIdentity();
        
        // Apply transformations corresponding to the camera position relative to the origin
        this.scene.applyViewMatrix();
        
        var rootComponent = this.components.find(component => component.id == this.idRoot)
        
        this.displayComponent(rootComponent, null)

    
    }
}