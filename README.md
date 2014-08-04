canvasGame
==========

Creating an html5 game using the canvas element and a ton of javascript, following the <a href="https://www.udacity.com/course/cs255">Udacity HTML5 Game Development course</a> as well as refrencing and the actual GRITS game code.

## Goal

When I'm finished with this project, I hope to understand how to write the entire thing from scratch.  This is why I'm implementing it in parts; I'm going through every component and experimenting as I go to learn how each section interacts with all of the others.

Also, GRITS is a robot fighting game that has a controllable robot which can pickup various objects like powerups and health from the gameworld and shoots other AI or player controlled robots.  My ultimate goal is to use this framework to build something more like BrowserQuest, a more Zelda-like RPG game, and the Udacity course was the best resource I've found since afaik BrowserQuest does not have an entire course built to understand how to put it together.

Short term, I next need to add a way to handle input, and a main game engine that will use the inputs to make things happen.  After or sometime during that I'll add animations, and once I have a character walking around the canvas I'll tackle adding a tiled map loader.  Then I'll need entities to interact with and once all of that is finished to a reasonable extent I think I'll be able to make a way to log in and save things to a database.

## Progress

Right now I have the assetLoader working which will load items correctly depending on type, spriteSheet.js which handles the processing of any atlases I need to use, and xhr which abstracts xmlhttprequests and parses json data for spriteSheet to use.

With all of those working, I can write images to the canvas from an atlas json/img pair.  Next I'm going to implement the input and then I'll probably need animations and a game engine to call the input engine with.  After I can move a character around the screen with my mouse and keyboard, I'll tackle the creation of a tiled map loader.
