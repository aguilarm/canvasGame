canvasGame
==========

Creating an html5 game using the canvas element and a ton of javascript, following the <a href="https://www.udacity.com/course/cs255">Udacity HTML5 Game Development course</a> as well as refrencing and the actual GRITS game code.

## Progress

Right now I have the assetLoader working which will load items correctly depending on type, spriteSheet.js which handles the processing of any atlases I need to use, and xhr which abstracts xmlhttprequests and parses json data for spriteSheet to use.

With all of those working, I can write images to the canvas from an atlas json/img pair right now.  Next I'm going to implement the input and then I'll probably need animations and a game engine to call the input engine with.
