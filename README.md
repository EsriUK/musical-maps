# **Musical Maps**

# About
Musical Maps is a project driven by two questions: 
1. Can we make maps more accessible to partially sighted users? 
2. Can we augment the traditional experience of navigating a digital map using sound? 

We believe that adding audio to static maps can help to bring them to life. Whether you're unable to see the finer details of a map, or you're in a high-pressure environment where your senses are overwhelmed, hearing your way around a map adds an extra level of comprehension. 

So how exactly do we add audio to a map? 

Under the hood, we've written a series of Audio Renderers. You can think of them as just like the symbology renderers that you're probably already familiar with. Let's say you use a [UniqueValueRenderer](https://developers.arcgis.com/javascript/3/jsapi/uniquevaluerenderer-amd.html) to colour your points based on their attributes. 

Next you could use that same arrtibute and apply a Musical Maps Audio Renderer. For example, you could choose the NumericAttributeRenderer. Now, when your user's mouse enters a feature, your map will play a note, in your chosen musical key and scale, based on the attribute in your data. The higher the number, the higher the note. Simple! 

There are plenty of other renderers, too. Our favourite is the PitchBendRenderer that helps users navigate to the centre of a polygon. 

What these Audio Renderers actually do is to turn the map into a MIDI controller. They take your mouse movements and translate them into a stream of MIDI information. So you can hook your map up to any kind of MIDI workstation that you like and take full control of the sounds that you hear. 

# What you'll need to get going
You can use Musical Maps as a library to add audio to your existing maps. But there's also a sample app included to get you going. 

You will need the following components to run the full Musical Maps experience: 
- A Digital Audio Workstation, such as [Reason](https://www.propellerheads.se/)
- A virtual midi loopback cable, such as [loopMIDI](http://www.tobias-erichsen.de/software/loopmidi.html)
- (Optionally) a TypeScript compiler - but we've included the .js files, too

# Sample
We've made two web-only versions of Musical Maps so you can try it out without a MIDI workstation. We call them Musical Maps Lite. 
Just remember, Musical Maps Lite is not the full experience! 

1. SpeechRenderer Example 
2. NumericAttributeRenderer Example 

You can also check out [this video]() to see the full version of Musical Maps in action. 



# Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

# Licensing

Copyright 2017 ESRI (UK) Limited

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the Licence.