define(["require", "exports", "../geometry/geometryUtils"], function (require, exports, GeometryUtils) {
    Object.defineProperty(exports, "__esModule", { value: true });
    // Varies the opacity of the feature symbology
    var OpacityRenderer = (function () {
        function OpacityRenderer(svgNode, offOpacity, onOpacity, sourceValueMin, sourceValueMax) {
            this.svgNode = svgNode;
            this.opacityMax = offOpacity;
            this.opacityMin = onOpacity;
            this.sourceValueMin = sourceValueMin;
            this.sourceValueMax = sourceValueMax;
            this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
        }
        OpacityRenderer.prototype.setOpacity = function (currentValue) {
            this.currentOpacity = this.otherGeometryUtils.convertRanges(this.sourceValueMax, this.sourceValueMin, this.opacityMax, this.opacityMin, currentValue);
            this.svgNode.setAttributeNS(null, "fill-opacity", (100 - this.currentOpacity) / 100);
        };
        return OpacityRenderer;
    }());
    exports.OpacityRenderer = OpacityRenderer;
    // Switches the opacity of a feature symbology between two defined values 
    var BinaryOpacityRenderer = (function () {
        function BinaryOpacityRenderer(svgNode, offOpacity, onOpacity) {
            this.svgNode = svgNode;
            this.opacityOn = onOpacity;
            this.opacityOff = offOpacity;
            this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
        }
        BinaryOpacityRenderer.prototype.setOpacity = function (state) {
            if (state == true) {
                this.svgNode.setAttributeNS(null, "fill-opacity", this.opacityOn);
            }
            else if (state == false) {
                this.svgNode.setAttributeNS(null, "fill-opacity", this.opacityOff);
            }
        };
        return BinaryOpacityRenderer;
    }());
    exports.BinaryOpacityRenderer = BinaryOpacityRenderer;
});
