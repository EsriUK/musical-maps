/// <reference path="../typings/arcgis-js-api.d.ts"/>

import Polygon = require("esri/geometry/Polygon");
import Point = require("esri/geometry/Point");
import geometryEngine = require("esri/geometry/geometryEngine");
  
export class PolygonUtils{ 

    constructor() {

    } 

    public getCurrentDistanceFromCentroid(rings, mouseLocation){
        // Turn the current mouseover feature into a polygon geometry
        var polygon = new Polygon(rings);
        var centroid = polygon.getCentroid();
        // Calculate the distance between the centroid point and the current mouse location 
        var distanceToCentroid = geometryEngine.distance(centroid, mouseLocation,0);
        return distanceToCentroid;
    }

    //get's the longest possible distance from the centroid (the furtheset vertex)
    public getMaxDistanceFromCentroid(polygonRings):number{
        var polygonVertecies = polygonRings[0];
        var longestDistanceFromCentroid = 0;
        var polygon = new Polygon(polygonVertecies);
        var centroid = polygon.getCentroid();
        var vertexDistances = new Array; 
        //get the distance from the centroid to each vertex
        for(var i in polygonVertecies){
            vertexDistances[i] = geometryEngine.distance(centroid, new Point(polygonVertecies[i]),0);
        }
        //return the longest of these distances 
        for(var i in vertexDistances){
            if (longestDistanceFromCentroid < vertexDistances[i]){
                longestDistanceFromCentroid = vertexDistances[i];
            }
        }
        //The longest distance between the centroid and a vertex
        return longestDistanceFromCentroid;
    }
}

export class OtherGeometryUtils{ 

    constructor() {

    } 

    public convertRanges(oldMax, oldMin, newMax, newMin, oldCurrent):number{
        var oldRange = oldMax - oldMin;
        var newRange = newMax - newMin;

        var newCurrentValue = (((oldMax-(oldCurrent-oldMin))*newRange)/oldRange)+newMin;
        
        return newCurrentValue;
    }
}