export class MyAnimationHelper{

    static condenseScales(scalesArray){
        const initialTransform = {transformType:  "scale", x:  1, y: 1, z: 1}
        if (scalesArray.length == 0){
            return initialTransform;
        }

        return scalesArray.reduce(
            function (accumulator, currentValue) { accumulator["x"] = accumulator["x"] + currentValue["x"]; 
            accumulator["y"] = accumulator["y"] + currentValue["y"];
            accumulator["z"] = accumulator["z"] + currentValue["z"];
            return accumulator;
        },
            initialTransform
        );
    }

    static condenseRotations(rotationsArray, axis){
        const initialTransform = {transformType:  "rotate", axis:  axis, angle: 0}
        if (rotationsArray.length == 0){
            return initialTransform;
        }

        return rotationsArray.reduce(
            function (accumulator, currentValue) { accumulator["angle"] = accumulator["angle"] + currentValue["angle"]; 
            return accumulator;
           
        },
            initialTransform
        );


    }

    static condenseTranslations(translationsArray){
        const initialTransform = {transformType:  "translate", x:  0, y: 0, z: 0}
        if (translationsArray.length == 0){
            return initialTransform;
        }

        return translationsArray.reduce(
            function (accumulator, currentValue) { accumulator["x"] = accumulator["x"] + currentValue["x"]; 
            accumulator["y"] = accumulator["y"] + currentValue["y"];
            accumulator["z"] = accumulator["z"] + currentValue["z"];
            return accumulator;
        },
            initialTransform
        );
    }
}