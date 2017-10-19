define(["require", "exports", "../midi/midiController"], function (require, exports, MidiControl) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var MusicController = (function () {
        function MusicController() {
            if (MusicController._instance) {
                throw new Error("Instantiation failed because MiniController is a singleton class and an instance already exists. Please use getInstance() instead");
            }
            MusicController._instance = this;
            this.midiController = MidiControl.MidiController.getInstance();
            this._noteArray = new Array;
            this.populateNoteArray();
            this._majorScalePattern = new Array;
            this._majorScalePattern = [2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1];
            this._minorScalePattern = new Array;
            this._minorScalePattern = [2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1, 2, 1, 2, 2, 1, 3, 1];
        }
        //returns the singleton instance 
        MusicController.getInstance = function () {
            return MusicController._instance;
        };
        MusicController.prototype.populateNoteArray = function () {
            //Octave 0
            this._noteArray[0] = 'C0';
            this._noteArray[1] = 'C#0';
            this._noteArray[2] = 'D0';
            this._noteArray[3] = 'D#0';
            this._noteArray[4] = 'E0';
            this._noteArray[5] = 'F0';
            this._noteArray[6] = 'F#0';
            this._noteArray[7] = 'G0';
            this._noteArray[8] = 'G#0';
            this._noteArray[9] = 'A0';
            this._noteArray[10] = 'A#0';
            this._noteArray[11] = 'B0';
            //Octave 1
            this._noteArray[12] = 'C1';
            this._noteArray[13] = 'C#1';
            this._noteArray[14] = 'D1';
            this._noteArray[15] = 'D#1';
            this._noteArray[16] = 'E1';
            this._noteArray[17] = 'F1';
            this._noteArray[18] = 'F#1';
            this._noteArray[19] = 'G1';
            this._noteArray[20] = 'G#1';
            this._noteArray[21] = 'A1';
            this._noteArray[22] = 'A#1';
            this._noteArray[23] = 'B1';
            //Octave 2
            this._noteArray[24] = 'C2';
            this._noteArray[25] = 'C#2';
            this._noteArray[26] = 'D2';
            this._noteArray[27] = 'D#2';
            this._noteArray[28] = 'E2';
            this._noteArray[29] = 'F2';
            this._noteArray[30] = 'F#2';
            this._noteArray[31] = 'G2';
            this._noteArray[32] = 'G#2';
            this._noteArray[33] = 'A2';
            this._noteArray[34] = 'A#2';
            this._noteArray[35] = 'B2';
            //Octave 3
            this._noteArray[36] = 'C3';
            this._noteArray[37] = 'C#3';
            this._noteArray[38] = 'D3';
            this._noteArray[39] = 'D#3';
            this._noteArray[40] = 'E3';
            this._noteArray[41] = 'F3';
            this._noteArray[42] = 'F#3';
            this._noteArray[43] = 'G3';
            this._noteArray[44] = 'G#3';
            this._noteArray[45] = 'A3';
            this._noteArray[46] = 'A#3';
            this._noteArray[47] = 'B3';
            //Octave 4
            this._noteArray[48] = 'C4';
            this._noteArray[49] = 'C#4';
            this._noteArray[50] = 'D4';
            this._noteArray[51] = 'D#4';
            this._noteArray[52] = 'E4';
            this._noteArray[53] = 'F4';
            this._noteArray[54] = 'F#4';
            this._noteArray[55] = 'G4';
            this._noteArray[56] = 'G#4';
            this._noteArray[57] = 'A4';
            this._noteArray[58] = 'A#4';
            this._noteArray[59] = 'B4';
            //Octave 5
            this._noteArray[60] = 'C5';
            this._noteArray[61] = 'C#5';
            this._noteArray[62] = 'D5';
            this._noteArray[63] = 'D#5';
            this._noteArray[64] = 'E5';
            this._noteArray[65] = 'F5';
            this._noteArray[66] = 'F#5';
            this._noteArray[67] = 'G5';
            this._noteArray[68] = 'G#5';
            this._noteArray[69] = 'A5';
            this._noteArray[70] = 'A#5';
            this._noteArray[71] = 'B5';
            //Octave 6
            this._noteArray[72] = 'C6';
            this._noteArray[73] = 'C#6';
            this._noteArray[74] = 'D6';
            this._noteArray[75] = 'D#6';
            this._noteArray[76] = 'E6';
            this._noteArray[77] = 'F6';
            this._noteArray[78] = 'F#6';
            this._noteArray[79] = 'G6';
            this._noteArray[80] = 'G#6';
            this._noteArray[81] = 'A6';
            this._noteArray[82] = 'A#6';
            this._noteArray[83] = 'B6';
            //Octave 7
            this._noteArray[84] = 'C7';
            this._noteArray[85] = 'C#7';
            this._noteArray[86] = 'D7';
            this._noteArray[87] = 'D#7';
            this._noteArray[88] = 'E7';
            this._noteArray[89] = 'F7';
            this._noteArray[90] = 'F#7';
            this._noteArray[91] = 'G7';
            this._noteArray[92] = 'G#7';
            this._noteArray[93] = 'A7';
            this._noteArray[94] = 'A#7';
            this._noteArray[95] = 'B7';
            //Octave 8
            this._noteArray[96] = 'C8';
            this._noteArray[97] = 'C#8';
            this._noteArray[98] = 'D8';
            this._noteArray[99] = 'D#8';
            this._noteArray[100] = 'E8';
            this._noteArray[101] = 'F8';
            this._noteArray[102] = 'F#8';
            this._noteArray[103] = 'G8';
            this._noteArray[104] = 'G#8';
            this._noteArray[105] = 'A8';
            this._noteArray[106] = 'A#8';
            this._noteArray[107] = 'B8';
            //Octave 9
            this._noteArray[108] = 'C9';
            this._noteArray[109] = 'C#9';
            this._noteArray[110] = 'D9';
            this._noteArray[111] = 'D#9';
            this._noteArray[112] = 'E9';
            this._noteArray[113] = 'F9';
            this._noteArray[114] = 'F#9';
            this._noteArray[115] = 'G9';
            this._noteArray[116] = 'G#9';
            this._noteArray[117] = 'A9';
            this._noteArray[118] = 'A#9';
            this._noteArray[119] = 'B9';
            //Octave 10
            this._noteArray[120] = 'C10';
            this._noteArray[121] = 'C#10';
            this._noteArray[122] = 'D10';
            this._noteArray[123] = 'D#10';
            this._noteArray[124] = 'E10';
            this._noteArray[125] = 'F10';
            this._noteArray[126] = 'F#10';
            this._noteArray[127] = 'G10';
        };
        MusicController.prototype.getNoteNumber = function (noteLetter) {
            for (var i in this._noteArray) {
                if (this._noteArray[i] == noteLetter) {
                    return parseInt(i);
                }
            }
            return -1;
        };
        MusicController.prototype.getNoteLetter = function (noteNumber) {
            return this._noteArray[noteNumber];
        };
        //generates an array of midi notes based on the parameters provided
        MusicController.prototype.getScaleArray = function (startNote, octaves, scale) {
            var scaleArray = new Array;
            if (scale == 'major') {
                var currentNote = this.getNoteNumber(startNote);
                for (var i = 0; i < octaves * 11; i++) {
                    scaleArray[i] = currentNote;
                    currentNote = currentNote + this._majorScalePattern[i];
                }
            }
            else if (scale == 'minor') {
                var currentNote = this.getNoteNumber(startNote);
                for (var i = 0; i < octaves * 11; i++) {
                    scaleArray[i] = currentNote;
                    currentNote = currentNote + this._minorScalePattern[i];
                }
            }
            return scaleArray;
        };
        MusicController._instance = new MusicController();
        return MusicController;
    }());
    exports.MusicController = MusicController;
});
