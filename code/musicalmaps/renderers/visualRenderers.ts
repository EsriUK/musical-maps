import GeometryUtils = require("../geometry/geometryUtils");

// Varies the opacity of the feature symbology
export class OpacityRenderer{ 
    svgNode:any
    opacityMax: number;
    opacityMin: number;
    sourceValueMin: number;
    sourceValueMax: number;
    currentOpacity: number;
    otherGeometryUtils: any;
 
    constructor(svgNode:any, offOpacity:number, onOpacity:number, sourceValueMin:number, sourceValueMax:number) {
       this.svgNode = svgNode;
       this.opacityMax = offOpacity; 
       this.opacityMin = onOpacity;
       this.sourceValueMin = sourceValueMin;
       this.sourceValueMax = sourceValueMax;

       this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
    } 

    public setOpacity(currentValue:number){
        this.currentOpacity = this.otherGeometryUtils.convertRanges(this.sourceValueMax, this.sourceValueMin, this.opacityMax, this.opacityMin, currentValue);
        this.svgNode.setAttributeNS(null, "fill-opacity", (100-this.currentOpacity)/100);
    }
}

// Switches the opacity of a feature symbology between two defined values 
export class BinaryOpacityRenderer{ 
    svgNode:any
    opacityOn: number;
    opacityOff: number;
    sourceValueMin: number;
    sourceValueMax: number;
    currentOpacity: number;
    otherGeometryUtils: any;
 
    constructor(svgNode:any, offOpacity:number, onOpacity:number) {
       this.svgNode = svgNode;
       this.opacityOn = onOpacity; 
       this.opacityOff = offOpacity;

       this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
    } 

    public setOpacity(state:boolean){
        if(state == true){
             this.svgNode.setAttributeNS(null, "fill-opacity", this.opacityOn);
        } else if (state == false){ 
            this.svgNode.setAttributeNS(null, "fill-opacity", this.opacityOff);
        }
       
    }
}