define(["require", "exports", "../midi/midiController", "esri/tasks/query", "../midi/musicController", "../renderers/visualRenderers", "../geometry/geometryUtils"], function (require, exports, MidiControl, Query, MusicControl, VisualRenderer, GeometryUtils) {
    Object.defineProperty(exports, "__esModule", { value: true });
    // Plays a note as you enter and leave a polygon  
    var FeatureBoundaryRenderer = (function () {
        function FeatureBoundaryRenderer(featureLayer, channel, note, mouseIn, mouseOut) {
            this.featureLayer = featureLayer;
            this.channel = channel;
            this.note = note;
            this.mouseIn = mouseIn;
            this.mouseOut = mouseOut;
            this.midiController = MidiControl.MidiController.getInstance();
        }
        FeatureBoundaryRenderer.prototype.applyRenderer = function () {
            var that = this;
            if (that.mouseIn == true) {
                //When the mouse goes over a polygon, activate the mouse move and mouse out listeners
                that.featureLayer.on("mouse-over", function mouseOver(event) {
                    that.midiController.playNote(that.channel, that.note, 120, 0);
                    that.midiController.stopNote(that.channel, that.note, 200);
                });
            }
            if (that.mouseOut == true) {
                //When the mouse goes over a polygon, activate the mouse move and mouse out listeners
                that.featureLayer.on("mouse-out", function mouseOver(event) {
                    that.midiController.playNote(that.channel, that.note - 15, 120, 0);
                    that.midiController.stopNote(that.channel, that.note, 200);
                });
            }
        };
        return FeatureBoundaryRenderer;
    }());
    exports.FeatureBoundaryRenderer = FeatureBoundaryRenderer;
    // Plays a note where the pitch is defined by a numeric attribute of the data
    var NumericAttributeRenderer = (function () {
        function NumericAttributeRenderer(featureLayer, attribute, channel, note, scale) {
            this.featureLayer = featureLayer;
            this.channel = channel;
            this.note = note;
            this.attribute = attribute;
            this.scale = scale;
            this.octaves = 2;
            this.midiController = MidiControl.MidiController.getInstance();
            this.musicController = MusicControl.MusicController.getInstance();
            this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
            this.scaleArray = this.musicController.getScaleArray(this.note, this.octaves, this.scale);
        }
        NumericAttributeRenderer.prototype.storeFeatures = function (featureSet) {
            this.featureSet = featureSet;
        };
        NumericAttributeRenderer.prototype.getFeatures = function () {
            var that = this;
            //Query the feature service to get the attribute that has been specified in the constructor
            var query = new Query();
            query.where = "1=1";
            //get the object ids
            that.featureLayer.queryIds(query, function (objectIds) {
                var query = new Query();
                query.objectIds = objectIds;
                query.outFields = ["*"];
                // Query for the features with the given object IDs
                that.featureLayer.queryFeatures(query, function (featureSet) {
                });
            });
        };
        //gets the max and min values of the attribute set in the constructor
        NumericAttributeRenderer.prototype.getMaxMin = function (featureArray) {
            var max, min;
            //get the max and min values of the attribute we're using
            for (var i = 0; i < featureArray.length; i++) {
                var f = featureArray[i].attributes;
                //the first time, just set max and min
                if (i == 0) {
                    max = f[this.attribute];
                    min = f[this.attribute];
                }
                else {
                    if (f[this.attribute] > max) {
                        max = f[this.attribute];
                    }
                    if (f[this.attribute] < min) {
                        min = f[this.attribute];
                    }
                }
            }
            //format the results into an object ready to return
            var maxMinObj = { max: 0, min: 0 };
            maxMinObj.max = max;
            maxMinObj.min = min;
            return maxMinObj;
        };
        NumericAttributeRenderer.prototype.applyRenderer = function () {
            var that = this;
            //get the features
            that.getFeatures();
            //then
            that.featureLayer.on("query-features-complete", function featureQueryDone(event) {
                //This is an array of our features
                var features = event.featureSet.features;
                var maxMinObj = that.getMaxMin(features);
                var maxValue = maxMinObj.max;
                var minValue = maxMinObj.min;
                var midiMin = 0;
                var midiMax = 7 * that.octaves;
                var opacityRenderer;
                that.featureLayer.on("mouse-over", function mouseOver(event) {
                    opacityRenderer = new VisualRenderer.BinaryOpacityRenderer(event.graphic.getNode(), 0.3, 0.9);
                    var e = event.graphic.attributes;
                    var currentValue = e[that.attribute];
                    var rescaledValue = that.otherGeometryUtils.convertRanges(maxValue, minValue, midiMax, midiMin, currentValue);
                    var note = that.scaleArray[that.scaleArray.length - Math.round(rescaledValue) - 1];
                    opacityRenderer.setOpacity(true);
                    event.graphic.getNode().setAttribute("fill-opacity", 90);
                    that.midiController.playNote(that.channel, note, 120, 0);
                    that.midiController.stopNote(that.channel, note, 400);
                });
                that.featureLayer.on("mouse-out", function mouseOver(event) {
                    event.graphic.getNode().setAttribute("fill-opacity", 10);
                    opacityRenderer.setOpacity(false);
                    opacityRenderer = null;
                });
            });
        };
        return NumericAttributeRenderer;
    }());
    exports.NumericAttributeRenderer = NumericAttributeRenderer;
    // Vocalises a string attribute as the cursor enters the feature 
    var TextToSpeechRenderer = (function () {
        function TextToSpeechRenderer(featureLayer, attribute) {
            this.featureLayer = featureLayer;
            this.attribute = attribute;
            this.midiController = MidiControl.MidiController.getInstance();
            this.musicController = MusicControl.MusicController.getInstance();
            this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
            this.voiceLock = false;
        }
        TextToSpeechRenderer.prototype.storeFeatures = function (featureSet) {
            this.featureSet = featureSet;
        };
        TextToSpeechRenderer.prototype.getFeatures = function () {
            var that = this;
            //Query the feature service to get the attribute that has been specified in the constructor
            var query = new Query();
            query.where = "1=1";
            //get the object ids
            that.featureLayer.queryIds(query, function (objectIds) {
                var query = new Query();
                query.objectIds = objectIds;
                query.outFields = ["*"];
                // Query for the features with the given object IDs
                that.featureLayer.queryFeatures(query, function (featureSet) {
                });
            });
        };
        TextToSpeechRenderer.prototype.applyRenderer = function () {
            var that = this;
            var msg;
            //get the features
            that.getFeatures();
            //then
            that.featureLayer.on("query-features-complete", function featureQueryDone(event) {
                that.featureLayer.on("mouse-over", function mouseOver(event) {
                    if (that.voiceLock == false) {
                        var opacityRenderer = new VisualRenderer.BinaryOpacityRenderer(event.graphic.getNode(), 0.2, 0.9);
                        var node = event.graphic.getNode();
                        that.voiceLock = true;
                        var e = event.graphic.attributes;
                        var currentValue = e[that.attribute];
                        //say it
                        msg = new SpeechSynthesisUtterance(currentValue);
                        var voices = window.speechSynthesis.getVoices();
                        msg.voice = voices[4];
                        msg.lang = 'en-UK';
                        msg.onend = function (e) {
                            //console.log('Finished in ' + e.elapsedTime + ' ms.');
                            that.voiceLock = false;
                            opacityRenderer.setOpacity(false);
                            opacityRenderer = null;
                        };
                        window.speechSynthesis.speak(msg);
                        opacityRenderer.setOpacity(true);
                    }
                });
            });
        };
        return TextToSpeechRenderer;
    }());
    exports.TextToSpeechRenderer = TextToSpeechRenderer;
    // Plays a single, defined note as the cursor enters a feature 
    var singleNoteRenderer = (function () {
        function singleNoteRenderer(channel, featureLayer, note) {
            this.featureLayer = featureLayer;
            this.note = note;
            this.channel = channel;
            this.midiController = MidiControl.MidiController.getInstance();
            this.musicController = MusicControl.MusicController.getInstance();
            this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
        }
        singleNoteRenderer.prototype.storeFeatures = function (featureSet) {
            this.featureSet = featureSet;
        };
        singleNoteRenderer.prototype.getFeatures = function () {
            var that = this;
            //Query the feature service to get the attribute that has been specified in the constructor
            var query = new Query();
            query.where = "1=1";
            //get the object ids
            that.featureLayer.queryIds(query, function (objectIds) {
                var query = new Query();
                query.objectIds = objectIds;
                query.outFields = ["*"];
                // Query for the features with the given object IDs
                that.featureLayer.queryFeatures(query, function (featureSet) {
                });
            });
        };
        singleNoteRenderer.prototype.applyRenderer = function () {
            var that = this;
            var msg;
            var note = that.musicController.getNoteNumber(that.note);
            //get the features
            that.getFeatures();
            //then
            that.featureLayer.on("query-features-complete", function featureQueryDone(event) {
                that.featureLayer.on("mouse-over", function mouseOver(event) {
                    that.midiController.playNote(that.channel, note, 120, 0);
                    var opacityRenderer = new VisualRenderer.BinaryOpacityRenderer(event.graphic.getNode(), 0.2, 0.9);
                    that.featureLayer.on("mouse-out", function mouseOut(event) {
                        that.midiController.stopNote(that.channel, note, 100);
                        opacityRenderer.setOpacity(false);
                        opacityRenderer = null;
                    });
                });
            });
        };
        return singleNoteRenderer;
    }());
    exports.singleNoteRenderer = singleNoteRenderer;
});
