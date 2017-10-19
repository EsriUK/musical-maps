 declare var $:any;
 declare var MIDI:any;

 

 export class ConfigManager{ 

     private _configObject:any;
     public webmap:any;
     private layerIndex:number;
     private maxIndex:number;
     //private configDfd:any;
     private configComplete:boolean;
 
    constructor() {
        this._configObject = {
            webmap:"",
            layers:[]
        };
        this.layerIndex = 0;
        this.configComplete = false;
        //this.listen();

    } 

    private getWebmap(webmapId){
        return $.ajax({
            type: "POST",
            url: "//www.arcgis.com/sharing/rest/content/items/" + webmapId + "/data?f=json",
            data: {
                
            },
            dataType: "json"
        });
    }

    private getLayerDetails(layer){
        return $.ajax({
            type: "POST",
            url: layer.url + "?f=json",
            data: {
                
            },
            dataType: "json"
        });
    }

    private getRendererSelection(layer){
        var that=this;
        var dfd = $.Deferred();
        
        this.getLayerDetails(layer).done(function (layerDetails) {
            $("#renderersDropdown").empty();
            $("#rendererSubmit").remove();

            //Here, set all the renderers that are conpatible with each geometry type
            $('#layerTitle').html("How should " + layer.title + " sound?");
            if (layerDetails.geometryType == "esriGeometryPoint"){
                $("#renderersDropdown").append("<option value='numericAttributeRenderer'>Change the pitch based on an attribute value</option>");
                $("#renderersDropdown").append("<option value='textToSpeechRenderer'>Say the value of an attribute</option>");
                $("#renderersDropdown").append("<option value='none'>I don't want to make this layer musical</option>");
                $("#layerForm").append("<button type='button' class='btn btn-default' id='rendererSubmit'>Next</button>");

            } else if (layerDetails.geometryType == "esriGeometryPolygon"){
                $("#renderersDropdown").append("<option value='numericAttributeRenderer'>Change the pitch based on an attribute value</option>");
                $("#renderersDropdown").append("<option value='pitchBendRenderer'>Bend the pitch as I move over the polygons</option>");
                $("#renderersDropdown").append("<option value='none'>I don't want to make this layer musical</option>");
                $("#layerForm").append("<button type='button' class='btn btn-default' id='rendererSubmit'>Next</button>");
            
            } else if (layerDetails.geometryType == "esriGeometryPolyline"){
                $("#renderersDropdown").append("<option value='singleNoteRenderer'>Play a single note</option>"); 
                $("#renderersDropdown").append("<option value='none'>I don't want to make this layer musical</option>");    
                $("#layerForm").append("<button type='button' class='btn btn-default' id='rendererSubmit'>Next</button>");         
            }
            $('#layerForm').css("visibility", "visible");

            //Here, set the configuration options for each of the renderer types
            $('#rendererSubmit').on('click', function(event) {
                var selected = $('#renderersDropdown').find(":selected").val();
                //create an audioRenderer section in the webmap json 
                that.webmap.operationalLayers[that.layerIndex].audioRenderer = {};
                that.webmap.operationalLayers[that.layerIndex].audioRenderer.type = selected;

                $("#layerConfigForm").empty();
                $('#layerForm').css("visibility", "hidden");
                if(selected == "numericAttributeRenderer"){
                    $("#layerConfigForm").append("<label for='midiChannel'>Which midi channel should this layer use?</label>");
                    $("#layerConfigForm").append("<select class='form-control' id='midiChannelDropdown'>");
                        $("#midiChannelDropdown").append("<option value='1'>1</option>");
                        $("#midiChannelDropdown").append("<option value='2'>2</option>");
                        $("#midiChannelDropdown").append("<option value='3'>3</option>");
                        $("#midiChannelDropdown").append("<option value='4'>4</option>");
                        $("#midiChannelDropdown").append("<option value='5'>5</option>");
                        $("#midiChannelDropdown").append("<option value='6'>6</option>");
                        $("#midiChannelDropdown").append("<option value='7'>7</option>");
                        $("#midiChannelDropdown").append("<option value='8'>8</option>");
                        $("#midiChannelDropdown").append("<option value='9'>9</option>");
                        $("#midiChannelDropdown").append("<option value='10'>10</option>");
                        $("#midiChannelDropdown").append("<option value='11'>11</option>");
                        $("#midiChannelDropdown").append("<option value='12'>12</option>");
                        $("#midiChannelDropdown").append("<option value='13'>13</option>");
                        $("#midiChannelDropdown").append("<option value='14'>14</option>");
                        $("#midiChannelDropdown").append("<option value='15'>15</option>");
                    $("#layerConfigForm").append("<label for='octave'>Which octave should this layer start on?</label>");
                        $("#layerConfigForm").append("<select class='form-control' id='octaveDropdown'>");
                        $("#octaveDropdown").append("<option value='1'>1</option>");
                        $("#octaveDropdown").append("<option value='2'>2</option>");
                        $("#octaveDropdown").append("<option value='3'>3</option>");
                        $("#octaveDropdown").append("<option value='4'>4</option>");
                        $("#octaveDropdown").append("<option value='5'>5</option>");
                        $("#octaveDropdown").append("<option value='6'>6</option>");
                        $("#octaveDropdown").append("<option value='7'>7</option>");
                        $("#octaveDropdown").append("<option value='8'>8</option>");
                    $("#layerConfigForm").append("<label for='octave'>What's the name of the attribute?</label>");
                        $("#layerConfigForm").append("<input type='text' class='form-control' id='numericAttribute' placeholder='availableBikes'>");
                    $("#layerConfigForm").append("<button type='button' class='btn btn-default' id='numericAttributeSubmit'>Next</button>");
                    
                } else if (selected == "pitchBendRenderer"){
                    $("#layerConfigForm").append("<label for='midiChannel'>Which midi channel should this layer use?</label>");
                    $("#layerConfigForm").append("<select class='form-control' id='midiChannelDropdown'>");
                        $("#midiChannelDropdown").append("<option value='1'>1</option>");
                        $("#midiChannelDropdown").append("<option value='2'>2</option>");
                        $("#midiChannelDropdown").append("<option value='3'>3</option>");
                        $("#midiChannelDropdown").append("<option value='4'>4</option>");
                        $("#midiChannelDropdown").append("<option value='5'>5</option>");
                        $("#midiChannelDropdown").append("<option value='6'>6</option>");
                        $("#midiChannelDropdown").append("<option value='7'>7</option>");
                        $("#midiChannelDropdown").append("<option value='8'>8</option>");
                        $("#midiChannelDropdown").append("<option value='9'>9</option>");
                        $("#midiChannelDropdown").append("<option value='10'>10</option>");
                        $("#midiChannelDropdown").append("<option value='11'>11</option>");
                        $("#midiChannelDropdown").append("<option value='12'>12</option>");
                        $("#midiChannelDropdown").append("<option value='13'>13</option>");
                        $("#midiChannelDropdown").append("<option value='14'>14</option>");
                        $("#midiChannelDropdown").append("<option value='15'>15</option>");
                    $("#layerConfigForm").append("<label for='octave'>Which octave should this layer start on?</label>");
                        $("#layerConfigForm").append("<select class='form-control' id='octaveDropdown'>");
                        $("#octaveDropdown").append("<option value='1'>1</option>");
                        $("#octaveDropdown").append("<option value='2'>2</option>");
                        $("#octaveDropdown").append("<option value='3'>3</option>");
                        $("#octaveDropdown").append("<option value='4'>4</option>");
                        $("#octaveDropdown").append("<option value='5'>5</option>");
                        $("#octaveDropdown").append("<option value='6'>6</option>");
                        $("#octaveDropdown").append("<option value='7'>7</option>");
                        $("#octaveDropdown").append("<option value='8'>8</option>");
                    $("#layerConfigForm").append("<button type='button' class='btn btn-default' id='pitchBendSubmit'>Next</button>");

                } else if (selected == "textToSpeechRenderer"){
                    $("#layerConfigForm").append("<label for='attribute'>What's the name of the attribute?</label>");
                        $("#layerConfigForm").append("<input type='text' class='form-control' id='ttsAttribute' placeholder='availableBikes'>");
                    $("#layerConfigForm").append("<button type='button' class='btn btn-default' id='textToSpeechSubmit'>Next</button>");
                } 
                
                else if (selected == "singleNoteRenderer"){
                    $("#layerConfigForm").append("<label for='midiChannel'>Which midi channel should this layer use?</label>");
                    $("#layerConfigForm").append("<select class='form-control' id='midiChannelDropdown'>");
                        $("#midiChannelDropdown").append("<option value='1'>1</option>");
                        $("#midiChannelDropdown").append("<option value='2'>2</option>");
                        $("#midiChannelDropdown").append("<option value='3'>3</option>");
                        $("#midiChannelDropdown").append("<option value='4'>4</option>");
                        $("#midiChannelDropdown").append("<option value='5'>5</option>");
                        $("#midiChannelDropdown").append("<option value='6'>6</option>");
                        $("#midiChannelDropdown").append("<option value='7'>7</option>");
                        $("#midiChannelDropdown").append("<option value='8'>8</option>");
                        $("#midiChannelDropdown").append("<option value='9'>9</option>");
                        $("#midiChannelDropdown").append("<option value='10'>10</option>");
                        $("#midiChannelDropdown").append("<option value='11'>11</option>");
                        $("#midiChannelDropdown").append("<option value='12'>12</option>");
                        $("#midiChannelDropdown").append("<option value='13'>13</option>");
                        $("#midiChannelDropdown").append("<option value='14'>14</option>");
                        $("#midiChannelDropdown").append("<option value='15'>15</option>");
                     $("#layerConfigForm").append("<label for='attribute'>Which octave shall we use?</label>");
                        $("#layerConfigForm").append("<input type='text' class='form-control' id='singleNoteOctave' placeholder='4'>");
                    $("#layerConfigForm").append("<button type='button' class='btn btn-default' id='singleNoteSubmit'>Next</button>");
                }

                else if (selected == "none"){
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options = {};
                    $('#layerConfigForm').css("visibility", "hidden");
                    $('#layerForm').css("visibility", "hidden");
                    dfd.resolve(selected);
                }

                $('#layerConfigForm').css("visibility", "visible");
                
                //Here, set what needs to be entered into the config file for each renderer type
                $('#numericAttributeSubmit').on('click', function(evt) {
                    var channel = $('#midiChannelDropdown').find(":selected").val();
                    var octave = $('#octaveDropdown').find(":selected").val();
                    var attribute = $('#numericAttribute').val();

                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options = {};
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options.midiChannel = channel;
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options.octave = octave;
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options.numericAttribute = attribute;
                    $('#layerConfigForm').css("visibility", "hidden");
                    dfd.resolve(selected);
                });

                $('#pitchBendSubmit').on('click', function(evt) {
                    var channel = $('#midiChannelDropdown').find(":selected").val();
                    var octave = $('#octaveDropdown').find(":selected").val();

                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options = {};
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options.midiChannel = channel;
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options.octave = octave;
                    $('#layerConfigForm').css("visibility", "hidden");
                    dfd.resolve(selected);
                });

                $('#textToSpeechSubmit').on('click', function(evt) {
                    var attribute = $('#ttsAttribute').val();

                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options = {};
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options.attribute = attribute;
                    $('#layerConfigForm').css("visibility", "hidden");
                    dfd.resolve(selected);
                });

                $('#singleNoteSubmit').on('click', function(evt) {
                    var channel = $('#midiChannelDropdown').find(":selected").val();
                    var octave = $('#singleNoteOctave').val();
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options = {};
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options.midiChannel = channel;
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options.octave = octave;
                    $('#layerConfigForm').css("visibility", "hidden");
                    dfd.resolve(selected);
                });

                $('#noneSubmit').on('click', function(evt) {
                    
                    that.webmap.operationalLayers[that.layerIndex].audioRenderer.options = {};;
                    $('#layerConfigForm').css("visibility", "hidden");
                    dfd.resolve(selected);
                });



                
            });

        });
        return dfd.promise();
    }

    private configureLayers(webmap){
        var that = this;
        //that.configDfd = $.Deferred();
        that.maxIndex = webmap.operationalLayers.length;
        //hide the webmap entry form
        that.getRendererSelection(webmap.operationalLayers[that.layerIndex]).done(function (selectedRenderer) {
            //console.log(selectedRenderer);
            that.layerIndex++;

            if(that.layerIndex<that.maxIndex){
                that.configureLayers(that.webmap);
            } else {
                $('#layerConfig').css("visibility", "hidden");
                //that.configDfd.resolve();
                that.configComplete = true;
            }
        });
         //return that.configDfd.promise();
    }

    private getMapKey(webmap){
        var that = this;
        var dfd = $.Deferred();
        $('#webmapForm').css("visibility", "hidden");
        $('#keyForm').css("visibility", "visible");

        $('#keySubmit').on('click', function(evt) {
            var key = $('#keyDropdown').find(":selected").val();
            var scale = $('#scaleDropdown').find(":selected").val();
            that.webmap.general = {};
            that.webmap.general.key = key;
            that.webmap.general.scale = scale;
            dfd.resolve(that.webmap);
            $('#keyForm').css("visibility", "hidden");
        });
        return dfd.promise();
    }

    public listen(){
        var that = this;
        var dfd = $.Deferred();
        //Configuration wizard activated
        $('#webmapSubmit').on('click', function(evt) {
            var webmapId = $('#webmapId').val();
            if (webmapId.length==32){
                //validate
                that.getWebmap(webmapId).done(function (webmap) {
                    if(webmap.operationalLayers.length<1){
                        //return an error
                        console.log("fail");
                    } else {
                        //Got a suitable webmap
                        webmap.id = webmapId;
                        that.webmap = webmap;
                        //Get the user to set a key for the map
                        that.getMapKey(webmap).done(function(webmap){
                          that.configureLayers(webmap);
                            var interval = setInterval(function(){ 
                                if(that.configComplete == true){
                                    clearInterval(interval);
                                    var downloadData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(that.webmap));
                                    $('<a href="data:' + downloadData + '" download="mmConfig.json" id="downloadLink">Download Config File</a>').appendTo('#map');
                                    var timeout = setTimeout(function(){
                                        $('#downloadLink').css("visibility", "hidden");
                                    }, 5000);
                                    dfd.resolve(that.webmap);
                                }
                            }, 1000);
                          });
                    }
                });
            }
        });

        //Configuration JSON activated
        $('#configJson').on('click', function(evt) {
            $('#webmapForm').css("visibility", "hidden");
            $('#dragDrop').css("visibility", "visible");
            that.dropJSON(
                document.getElementById("formBackground"),
                function(data) {
                    $('#dragDrop').css("visibility", "hidden");
                    dfd.resolve(data);
                });
        });
        return dfd.promise();
    }


    private dropJSON(targetEl, callback) {
        // disable default drag & drop functionality
        targetEl.addEventListener('dragenter', function(e){ e.preventDefault(); });
        targetEl.addEventListener('dragover',  function(e){ e.preventDefault(); });

        targetEl.addEventListener('drop', function(event) {

            var reader = new FileReader();
            reader.onloadend = function() {
                var data = JSON.parse(this.result);
                callback(data);
            };

            reader.readAsText(event.dataTransfer.files[0]);    
            event.preventDefault();
        });
    }
}