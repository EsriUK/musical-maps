/// <reference path="../typings/arcgis-js-api.d.ts"/>

import esri = require("esri");
import Map = require("esri/map");
import FeatureLayer = require("esri/layers/FeatureLayer");
import MidiControl = require("../midi/midiController");
import MusicControl = require("../midi/musicController");
import VisualRenderer = require("../renderers/visualRenderers");
import GeometryUtils = require("../geometry/geometryUtils");

declare var MIDI:any;


// Plays a scale based on how close you are to the centroid of a polygon
export class ScaledProximityRenderer{ 
    map : Map;
    featureLayer: FeatureLayer;
    midiController: any;
    musicController: any;  
    channel: number; 
    scale: string;
    startingNote: string;
    octaves: number;
    scaleArray: number[]; 
    polygonUtils:any;
    otherGeometryUtils: any;
    mouseOut:any;
 
    constructor(channel: number, currentMap :any, currentFeatureLayer:any, scale:string, startingNote:string, octaves:number) {
        this.channel = channel;
        this.map = currentMap;
        this.featureLayer = currentFeatureLayer;  
        this.scale = scale;
        this.startingNote = startingNote;
        this.octaves = octaves;
        //get the singleton instances of Midi and Music Controllers
        this.midiController = MidiControl.MidiController.getInstance();
        this.musicController = MusicControl.MusicController.getInstance();
        //generate the array of Midi notes that represents the scale, startingNote and octaves we're working with
        this.scaleArray = this.musicController.getScaleArray(this.startingNote, this.octaves, this.scale);

        this.polygonUtils = new GeometryUtils.PolygonUtils();
        this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
    }

    private playNote (note, channel, delay){
        var n = Math.round(note);
        this.midiController.playNote(channel, n, 80, 0);
    } 

    public applyRenderer():void {
        var that=this;
        //When the mouse goes over a polygon, activate the mouse move and mouse out listeners
        that.featureLayer.on("mouse-over", function mouseOver(event){
            if(that.mouseOut && that.mouseOut.advice != null){
                that.mouseOut.remove();
            }
            var svgNode = event.graphic.getNode();
            var startingNote = that.musicController.getNoteNumber(that.startingNote);
            //The geometry of the feature that the mouse has entered 
            var mouseOverGeometry = event.graphic.geometry.rings;
            var currentNote = 0; //to check for repeating notes 
            
            // get the size of the polygon to base the note scaling on 
            var geomMax = that.polygonUtils.getMaxDistanceFromCentroid(mouseOverGeometry);
            var geomMin = 0;
            var midiMin = 0; 
            var midiMax = 11*that.octaves; //the highest note to play

            //Create a new opacityRenderer to deal with visual feedback
            //Add some options here for which visual renderer to use
            var opacityRenderer = new VisualRenderer.OpacityRenderer(svgNode, 10, 90, geomMin, geomMax);

            //Every time the mouse moves...
            var mouseMove = that.map.on("mouse-move", function mouseMove(event){
                var distanceToCentroid = that.polygonUtils.getCurrentDistanceFromCentroid(mouseOverGeometry, event.mapPoint);
                opacityRenderer.setOpacity(distanceToCentroid);
                //scales the geometry value to an index in the scale array
                var rescaledValue = that.otherGeometryUtils.convertRanges(geomMax, geomMin, midiMax, midiMin, distanceToCentroid);
                var note = that.scaleArray[Math.round(rescaledValue)];
                // Play the note
                if(note != currentNote){
                    that.midiController.stopNote(that.channel, currentNote, 0);
                    that.playNote(note, that.channel, 0);
                    currentNote = note;
                } 
            });
            that.mouseOut = that.featureLayer.on("mouse-out", function mouseOut(event){
                that.midiController.stopNote(that.channel, currentNote, 0);
                mouseOverGeometry = null;
                mouseMove.remove();
            });
        });
    }
}


// Bends the pitch of a note based on how close you are to the centroid of a polygon 
export class PitchBendRenderer{ 
    map : Map;
    featureLayer: FeatureLayer;
    midiController: any;
    musicController: any;  
    channel: number; 
    note: string;
    pitchBendMin: number;
    pitchBendMax: number; 
    polygonUtils:any;
    otherGeometryUtils: any;
    mouseOut:any;
 
    constructor(channel: number, currentMap :any, currentFeatureLayer:any, note: string, pitchBendMin: number, pitchBendMax:number) {
        this.channel = channel;
        this.map = currentMap;
        this.featureLayer = currentFeatureLayer;
        
        this.pitchBendMin = pitchBendMin;
        this.pitchBendMax = pitchBendMax;

        //get the singleton instances of Midi and Music Controllers
        this.midiController = MidiControl.MidiController.getInstance();
        this.musicController = MusicControl.MusicController.getInstance();
        
        this.note = this.musicController.getNoteNumber(note);

        this.polygonUtils = new GeometryUtils.PolygonUtils();
        this.otherGeometryUtils = new GeometryUtils.OtherGeometryUtils();
    }

    public applyRenderer():void {
        var that=this;
        //When the mouse goes over a polygon, activate the mouse move and mouse out listeners
        that.featureLayer.on("mouse-over", function mouseOver(event){
            if(that.mouseOut && that.mouseOut.advice != null){
                that.mouseOut.remove();
            }
            var svgNode = event.graphic.getNode();

            //The geometry of the feature that the mouse has entered 
            that.midiController.playNote(that.channel, that.note, 127, 0);
            var mouseOverGeometry = event.graphic.geometry.rings;
            var currentPitchBend = 63; //to check for repeating notes 
            // get the size of the polygon to base the note scaling on 
            var geomMax = that.polygonUtils.getMaxDistanceFromCentroid(mouseOverGeometry);
            var geomMin = 0;
            var pitchBendMin = that.pitchBendMin;
            var pitchBendMax = that.pitchBendMax
            //Calculate the ranges
            var oldRange = geomMax - geomMin;

            //Create a new opacityRenderer to deal with visual feedback
            var opacityRenderer = new VisualRenderer.OpacityRenderer(svgNode, 10, 90, geomMin, geomMax);

            //Every time the mouse moves...
            var mouseMove = that.map.on("mouse-move", function mouseMove(event){
                var distanceToCentroid = that.polygonUtils.getCurrentDistanceFromCentroid(mouseOverGeometry, event.mapPoint);
                opacityRenderer.setOpacity(distanceToCentroid);
                //index resaled to the Midi range from the Geographic range
                var scaledPitchBend = that.otherGeometryUtils.convertRanges(geomMax, geomMin, pitchBendMax, pitchBendMin, distanceToCentroid);
                // Play the note
                if(scaledPitchBend != currentPitchBend){
                    //that.midiController.stopNote(that.channel, that.note, 0);
                    that.midiController.bendPitch(that.channel, Math.round(scaledPitchBend), 0);
                    currentPitchBend = scaledPitchBend;
                }
            });

            // This gets created each time (check the other renderer, too) - Use the same format as mousemove!!
            that.mouseOut = that.featureLayer.on("mouse-out", function mouseOut(event){
                that.midiController.stopNote(that.channel, that.note, 0);
                //opacityRenderer.setOpacity(10);
                //that.midiController.stopNote(that.channel, that.pitch, 0);
                mouseOverGeometry = null;
                mouseMove.remove();
                opacityRenderer = null;
            });
        });
    }
}


