// manages the midi implementaton 
// to be instantiated as a singleton class 
declare var MIDI:any;
declare var navigator:any;

export class MidiController{

    private static _instance:MidiController = new MidiController();
    //array to control which midi channels are in use 
    //boolean array set to true if the channel is occupied and false if it's available
    private _channelArray:boolean[];
    private _instrumentArray:string[];
    private _midiOutputName:string;
    private _midiOut: any;
 
    constructor(){
        if(MidiController._instance){
            throw new Error("Instantiation failed because MidiController is a singleton class and an instance already exists. Please use getInstance() instead");
        }
        MidiController._instance = this;

        //Name of loopmidi
        this._midiOutputName = "MusicalMapsMIDI";
        
        this.initialiseMidi();
    }

    private initialiseMidi():void{
        var that = this;

        //setup the MIDI stuff
        function success (midi) {
            console.log('Got midi!', midi);

            // This is an iterator
            var outputs = midi.outputs.values();
            var midiOuts = new Array;

            for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
                // setup an array with all the available outputs
                midiOuts[output.value.id] = output.value;
                //If we find the output name we are looking for (set in constructor), set the index that we'll reference henceforth 
                if (output.value.name = that._midiOutputName){
                    that._midiOut = output.value;
                    console.log(that._midiOut);
                }
            }
        }
        
        function failure () {
            console.error('Sorry, I could not gain access to your MIDI hardware');
        }

        if (navigator.requestMIDIAccess) {
            console.log('Browser supports MIDI!');

            navigator.requestMIDIAccess().then(success, failure);
        }
    }

    //returns the singleton instance
    public static getInstance():MidiController{
        return MidiController._instance;
    }

    public playNote(channel, note, velocity, delay){
        //MIDI message - 144
        this._midiOut.send([0x90 + channel, note, velocity], window.performance.now() + delay);
    }

    public stopNote(channel,note,delay){
        //MIDI message - 128
        this._midiOut.send([0x80 + channel, note, 0], window.performance.now() + delay);
    }

    public bendPitch(channel, pitchBend, delay){
        this._midiOut.send([0xE0 + channel, pitchBend, pitchBend], delay * 1000);
    }



    //some useful stuff: 
    // midi.setVolume = function(channel, volume, delay) { // set channel volume
	// 	output.send([0xB0 + channel, 0x07, volume], delay * 1000);
	// };

	// midi.programChange = function(channel, program, delay) { // change patch (instrument)
	// 	output.send([0xC0 + channel, program], delay * 1000);
	// };

	// midi.pitchBend = function(channel, program, delay) { // pitch bend
	// 	output.send([0xE0 + channel, program], delay * 1000);
	// };

	// midi.noteOn = function(channel, note, velocity, delay) {
	// 	output.send([0x90 + channel, note, velocity], delay * 1000);
	// };

	// midi.noteOff = function(channel, note, delay) {
	// 	output.send([0x80 + channel, note, 0], delay * 1000);
	// };

	// midi.chordOn = function(channel, chord, velocity, delay) {
	// 	for (var n = 0; n < chord.length; n ++) {
	// 		var note = chord[n];
	// 		output.send([0x90 + channel, note, velocity], delay * 1000);
	// 	}
	// };

	// midi.chordOff = function(channel, chord, delay) {
	// 	for (var n = 0; n < chord.length; n ++) {
	// 		var note = chord[n];
	// 		output.send([0x80 + channel, note, 0], delay * 1000);
	// 	}
	// };

	// midi.stopAllNotes = function() {
	// 	output.cancel();
	// 	for (var channel = 0; channel < 16; channel ++) {
	// 		output.send([0xB0 + channel, 0x7B, 0]);
	// 	}
	// };

}