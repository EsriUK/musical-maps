import MidiControl = require("../midi/midiController");
import esri = require("esri");
import Map = require("esri/map");
import FeatureLayer = require("esri/layers/FeatureLayer");
import Query = require("esri/tasks/query");
import MusicControl = require("../midi/musicController");
import VisualRenderer = require("../renderers/visualRenderers");
import GeometryUtils = require("../geometry/geometryUtils");

declare var $:any;
declare var SpeechSynthesisUtterance:any;
declare var window:any;


// Plays a note as you enter and leave a polygon  
 export class FeatureBoundaryRenderer{ 
    private featureLayer: any; 
    private channel:number;
    private note: number;
    private mouseIn: boolean;
    private mouseOut: boolean;
    private midiController: any;

    constructor(featureLayer:any, channel:number, note:number, mouseIn:boolean, mouseOut:boolean) {
        this.featureLayer = featureLayer;
        this.channel = channel;
        this.note=note;
        this.mouseIn = mouseIn;
        this.mouseOut = mouseOut;

        this.midiController = MidiControl.MidiController.getInstance();
    } 

    public applyRenderer(){
        var that=this;
        if(that.mouseIn == true){
            //When the mouse goes over a polygon, activate the mouse move and mouse out listeners
            that.featureLayer.on("mouse-over", function mouseOver(event){
                that.midiController.playNote(that.channel, that.note, 120, 0);
                that.midiController.stopNote(that.channel, that.note, 200);
            });
        }

        if(that.mouseOut == true){
            //When the mouse goes over a polygon, activate the mouse move and mouse out listeners
            that.featureLayer.on("mouse-out", function mouseOver(event){
                that.midiController.playNote(that.channel, that.note-15, 120, 0);
                that.midiController.stopNote(that.channel, that.note, 200);
            });
        }
        
    }
}

// Plays a note where the pitch is defined by a numeric attribute of the data
 export class NumericAttributeRenderer{ 
    private featureLayer: any; 
    private channel:number;
    private note: string;
    private attribute:string;
    private scale:string;
    private midiController: any;
    private featureSet:any;
    private octaves:number;
    scaleArray: number[]; 
    musicController: any;
    otherGeometryUtils: any;

    constructor(featureLayer:any, attribute:string, channel:number, note:string, scale:string) {
        this.featureLayer = featureLayer;
        this.channel = channel;
        this.note=note;
        this.attribute = attribute;
        this.scale = scale;
        this.octaves = 2;

        this.midiController = MidiControl.MidiController.getInstance();
        this.musicController = MusicControl.MusicController.getInstance();
        this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();

        this.scaleArray = this.musicController.getScaleArray(this.note, this.octaves, this.scale);
    } 

    private storeFeatures(featureSet){
        this.featureSet = featureSet;
    }

    private getFeatures(){
        var that=this;
        //Query the feature service to get the attribute that has been specified in the constructor
        var query = new Query();
        query.where = "1=1";
        //get the object ids
        that.featureLayer.queryIds(query, function(objectIds) {
            var query = new Query();
            query.objectIds = objectIds;
            query.outFields = [ "*" ];
            // Query for the features with the given object IDs
            that.featureLayer.queryFeatures(query, function(featureSet) {

            });
        });
    }

    //gets the max and min values of the attribute set in the constructor
    private getMaxMin(featureArray):any{
        var max, min;
        //get the max and min values of the attribute we're using
        for (var i = 0; i<featureArray.length; i++){
            var f = featureArray[i].attributes;
            //the first time, just set max and min
            if(i==0){
                max = f[this.attribute];
                min = f[this.attribute];
            } else {
                if(f[this.attribute]>max){
                    max = f[this.attribute];
                }
                if(f[this.attribute]<min){
                    min = f[this.attribute];
                }
            }
        }
        //format the results into an object ready to return
        var maxMinObj = {max:0, min:0};
        maxMinObj.max = max;
        maxMinObj.min = min;
        return maxMinObj;
    }

    public applyRenderer(){
        var that=this;
    	//get the features
        that.getFeatures();

        //then
        that.featureLayer.on("query-features-complete", function featureQueryDone(event){
            //This is an array of our features
            var features = event.featureSet.features;
            var maxMinObj = that.getMaxMin(features);
            var maxValue = maxMinObj.max;
            var minValue = maxMinObj.min;
            var midiMin = 0;
            var midiMax = 7*that.octaves;

            var opacityRenderer;

            that.featureLayer.on("mouse-over", function mouseOver(event){
                opacityRenderer = new VisualRenderer.BinaryOpacityRenderer(event.graphic.getNode(), 0.3, 0.9);

                var e = event.graphic.attributes;
                var currentValue = e[that.attribute];
                var rescaledValue = that.otherGeometryUtils.convertRanges(maxValue, minValue, midiMax, midiMin, currentValue);
                var note = that.scaleArray[that.scaleArray.length - Math.round(rescaledValue) -1];

                opacityRenderer.setOpacity(true);
                event.graphic.getNode().setAttribute("fill-opacity", 90);
                that.midiController.playNote(that.channel, note, 120, 0);
                that.midiController.stopNote(that.channel, note, 400);
            });

            that.featureLayer.on("mouse-out", function mouseOver(event){
                event.graphic.getNode().setAttribute("fill-opacity", 10);
                opacityRenderer.setOpacity(false);
                opacityRenderer = null;
             });
        });    
    }
}

// Vocalises a string attribute as the cursor enters the feature 
 export class TextToSpeechRenderer{ 
    private featureLayer: any; 
    private channel:number;
    private attribute:string;
    private midiController: any;
    private featureSet:any;
    private voiceLock:boolean;
    musicController: any;
    otherGeometryUtils: any;

    constructor(featureLayer:any, attribute:string) {
        this.featureLayer = featureLayer;
        this.attribute = attribute;

        this.midiController = MidiControl.MidiController.getInstance();
        this.musicController = MusicControl.MusicController.getInstance();
        this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();

        this.voiceLock = false;
    } 

    private storeFeatures(featureSet){
        this.featureSet = featureSet;
    }

    private getFeatures(){
        var that=this;
        //Query the feature service to get the attribute that has been specified in the constructor
        var query = new Query();
        query.where = "1=1";
        //get the object ids
        that.featureLayer.queryIds(query, function(objectIds) {
            var query = new Query();
            query.objectIds = objectIds;
            query.outFields = [ "*" ];
            // Query for the features with the given object IDs
            that.featureLayer.queryFeatures(query, function(featureSet) {

            });
        });
    }

    public applyRenderer(){
        var that=this;
        var msg;
    	//get the features
        that.getFeatures();

        //then
        that.featureLayer.on("query-features-complete", function featureQueryDone(event){
            that.featureLayer.on("mouse-over", function mouseOver(event){
                
                if (that.voiceLock == false){
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
                    msg.onend = function(e) {
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
    }
}

// Plays a single, defined note as the cursor enters a feature 
 export class singleNoteRenderer{ 
    private featureLayer: any; 
    private channel:number;
    private note:string;
    private midiController: any;
    private featureSet:any;

    musicController: any;
    otherGeometryUtils: any;

    constructor(channel:number, featureLayer:any, note:string) {
        this.featureLayer = featureLayer;
        this.note = note;
        this.channel = channel;

        this.midiController = MidiControl.MidiController.getInstance();
        this.musicController = MusicControl.MusicController.getInstance();
        this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
    } 

    private storeFeatures(featureSet){
        this.featureSet = featureSet;
    }

    private getFeatures(){
        var that=this;
        //Query the feature service to get the attribute that has been specified in the constructor
        var query = new Query();
        query.where = "1=1";
        //get the object ids
        that.featureLayer.queryIds(query, function(objectIds) {
            var query = new Query();
            query.objectIds = objectIds;
            query.outFields = [ "*" ];
            // Query for the features with the given object IDs
            that.featureLayer.queryFeatures(query, function(featureSet) {

            });
        });
    }

    public applyRenderer(){
        var that=this;
        var msg;
        var note = that.musicController.getNoteNumber(that.note);
    	//get the features
        that.getFeatures();

        //then
        that.featureLayer.on("query-features-complete", function featureQueryDone(event){

            that.featureLayer.on("mouse-over", function mouseOver(event){
                
                that.midiController.playNote(that.channel, note, 120, 0);
                var opacityRenderer = new VisualRenderer.BinaryOpacityRenderer(event.graphic.getNode(), 0.2, 0.9);

                that.featureLayer.on("mouse-out", function mouseOut(event){
                    that.midiController.stopNote(that.channel, note, 100);
                    opacityRenderer.setOpacity(false);
                    opacityRenderer = null;
                });
                
            });

            
        });    
    }
}