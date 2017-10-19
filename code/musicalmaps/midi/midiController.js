define(["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var MidiController = (function () {
        function MidiController() {
            if (MidiController._instance) {
                throw new Error("Instantiation failed because MidiController is a singleton class and an instance already exists. Please use getInstance() instead");
            }
            MidiController._instance = this;
            //Name of loopmidi
            this._midiOutputName = "MusicalMapsMIDI";
            this.initialiseMidi();
        }
        MidiController.prototype.initialiseMidi = function () {
            var that = this;
            //setup the MIDI stuff
            function success(midi) {
                console.log('Got midi!', midi);
                // This is an iterator
                var outputs = midi.outputs.values();
                var midiOuts = new Array;
                for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
                    // setup an array with all the available outputs
                    midiOuts[output.value.id] = output.value;
                    //If we find the output name we are looking for (set in constructor), set the index that we'll reference henceforth 
                    if (output.value.name = that._midiOutputName) {
                        that._midiOut = output.value;
                        console.log(that._midiOut);
                    }
                }
            }
            function failure() {
                console.error('Sorry, I could not gain access to your MIDI hardware');
            }
            if (navigator.requestMIDIAccess) {
                console.log('Browser supports MIDI!');
                navigator.requestMIDIAccess().then(success, failure);
            }
        };
        //returns the singleton instance
        MidiController.getInstance = function () {
            return MidiController._instance;
        };
        MidiController.prototype.playNote = function (channel, note, velocity, delay) {
            //MIDI message - 144
            this._midiOut.send([0x90 + channel, note, velocity], window.performance.now() + delay);
        };
        MidiController.prototype.stopNote = function (channel, note, delay) {
            //MIDI message - 128
            this._midiOut.send([0x80 + channel, note, 0], window.performance.now() + delay);
        };
        MidiController.prototype.bendPitch = function (channel, pitchBend, delay) {
            this._midiOut.send([0xE0 + channel, pitchBend, pitchBend], delay * 1000);
        };
        MidiController._instance = new MidiController();
        return MidiController;
    }());
    exports.MidiController = MidiController;
});
