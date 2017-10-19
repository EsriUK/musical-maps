 import MidiControl = require("../midi/midiController");
 import MusicControl = require("../midi/musicController");

 declare var $:any;
 declare var MIDI:any;

 
//Plays a tone upon your cursor entering and leaving the browser window 
 export class WindowLeaveRenderer{ 
     private _midiController:MidiControl.MidiController;
     private _musicController:MusicControl.MusicController;
     private _channel:number;
     private _inNote:number;
     private _outNote: number;
 
    constructor(channel:number, inNote:string, outNote:string) {
        this._midiController = MidiControl.MidiController.getInstance();
        this._musicController = MusicControl.MusicController.getInstance();
        this._channel = channel;
        this._inNote = this._musicController.getNoteNumber(inNote);
        this._outNote = this._musicController.getNoteNumber(outNote);
    } 

    public applyRenderer(){
        var that = this;

        $("#map").mouseleave(function () {
            console.log('out');
            that._midiController.playNote(that._channel, that._outNote, 120, 0);
            that._midiController.stopNote(that._channel, that._outNote, 500);
        });

        $("#map").mouseenter(function () {
            console.log('in');
            that._midiController.playNote(that._channel, that._inNote, 120, 100);
            that._midiController.stopNote(that._channel, that._inNote, 500);
        }); 
    }
}