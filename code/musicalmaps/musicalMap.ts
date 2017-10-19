/// <reference path="typings/arcgis-js-api.d.ts"/>
/// <reference path="renderers/proximityRenderers.ts" />

 declare var $:any;

import esri = require("esri");
import Map = require("esri/map");
import FeatureLayer = require ("esri/layers/FeatureLayer");
import arcgisUtils = require("esri/arcgis/utils");
import ProximityRenderers = require("./renderers/proximityRenderers");
import CoreRenderers = require("./renderers/coreRenderers");
import SimpleRenderers = require("./renderers/simpleRenderers");
import Config = require("./config/config");


 
export class MusicalMap {
    private map: Map;
    private static _instance:MusicalMap = new MusicalMap(); 
    private _configManager: Config.ConfigManager;

    constructor(){
        if(MusicalMap._instance){
            throw new Error("Instantiation failed because MusicalMap is a singleton class and an instance already exists. Please use getInstance() instead");
        }
        MusicalMap._instance = this;
        this.initialiseConfig();
    } 

    //returns the singleton instance
    public static getInstance():MusicalMap{
        return MusicalMap._instance;
    }

    //Start up the interactive config
    private initialiseConfig(){
        var that = this;
        this._configManager = new Config.ConfigManager();
        this._configManager.listen().done(function (webmap) {
            console.log(webmap);
            //Once the interactive config is complete, build the map
            that.initialiseMap(webmap);
            $('#webmapForm').css("visibility", "hidden");
            $('#formBackground').css("visibility", "hidden");
        });
    }

    //Build the map using the user-specified config file (either supplied or built)
    public initialiseMap(webmapConfig):void{
        arcgisUtils.createMap(webmapConfig.id, "map").then(function (response) {
            this.map = response.map;
            var layers = response.itemInfo.itemData.operationalLayers;

            //For each of the layers in the webmap, check which renderer the user has specified and implement it
            for (var i=0; i<layers.length; i++){
                var rend;
                if(webmapConfig.operationalLayers[i].audioRenderer.type == "pitchBendRenderer"){
                    var midiChannel = parseInt(webmapConfig.operationalLayers[i].audioRenderer.options.midiChannel)-1;
                    var note = webmapConfig.general.key.toString() + webmapConfig.operationalLayers[i].audioRenderer.options.octave.toString();
                    rend = new ProximityRenderers.PitchBendRenderer(midiChannel, this.map, layers[i].layerObject, note, 0, 127);
                }
                else if(webmapConfig.operationalLayers[i].audioRenderer.type == "numericAttributeRenderer"){
                    var midiChannel = parseInt(webmapConfig.operationalLayers[i].audioRenderer.options.midiChannel)-1;
                    var note = webmapConfig.general.key.toString() + webmapConfig.operationalLayers[i].audioRenderer.options.octave.toString();
                    var numericAttribute = webmapConfig.operationalLayers[i].audioRenderer.options.numericAttribute.toString();
                    rend = new SimpleRenderers.NumericAttributeRenderer(layers[i].layerObject,numericAttribute,midiChannel,note,webmapConfig.general.scale.toString());
                }
                else if(webmapConfig.operationalLayers[i].audioRenderer.type == "textToSpeechRenderer"){
                    var attribute = webmapConfig.operationalLayers[i].audioRenderer.options.attribute.toString();
                    rend = new SimpleRenderers.TextToSpeechRenderer(layers[i].layerObject,attribute);
                }
                else if(webmapConfig.operationalLayers[i].audioRenderer.type == "singleNoteRenderer"){
                    var note = webmapConfig.general.key.toString();
                    var octave = webmapConfig.operationalLayers[i].audioRenderer.options.octave.toString();
                    var noteOctave = note+octave;
                    var midiChannel = parseInt(webmapConfig.operationalLayers[i].audioRenderer.options.midiChannel)-1;
                    rend = new SimpleRenderers.singleNoteRenderer(midiChannel, layers[i].layerObject,noteOctave);
                }
                rend.applyRenderer();
            }

            //set the notes of the window leave renderer
            var noteIn = webmapConfig.general.key.toString() + "5";
            var noteOut = webmapConfig.general.key.toString() + "4";
            var cr = new CoreRenderers.WindowLeaveRenderer(0, noteIn, noteOut);
            cr.applyRenderer();
        });

        $('#map').css("visibility", "visible");
    }
 }