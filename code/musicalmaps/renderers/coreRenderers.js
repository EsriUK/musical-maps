define(["require", "exports", "../midi/midiController", "../midi/musicController"], function (require, exports, MidiControl, MusicControl) {
    Object.defineProperty(exports, "__esModule", { value: true });
    //Plays a tone upon your cursor entering and leaving the browser window 
    var WindowLeaveRenderer = (function () {
        function WindowLeaveRenderer(channel, inNote, outNote) {
            this._midiController = MidiControl.MidiController.getInstance();
            this._musicController = MusicControl.MusicController.getInstance();
            this._channel = channel;
            this._inNote = this._musicController.getNoteNumber(inNote);
            this._outNote = this._musicController.getNoteNumber(outNote);
        }
        WindowLeaveRenderer.prototype.applyRenderer = function () {
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
        };
        return WindowLeaveRenderer;
    }());
    exports.WindowLeaveRenderer = WindowLeaveRenderer;
});
