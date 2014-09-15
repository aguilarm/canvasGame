canvasGame
==========

Creating an html5 game using the canvas element and a ton of (vanilla) javascript, following the <a href="https://www.udacity.com/course/cs255">Udacity HTML5 Game Development course</a> as well as refrencing and the actual GRITS game code.  The Udacity course is a great resource, but it woefully fails at actually allowing someone to build an entire game engine and use it just following the class.  After the class, you can EDIT the game engine a little bit, and understand how key parts work, but a huge majority of it is still kind of a mystery.  So with this project I'm hoping to fill in the gaps.

## Goal

When I'm finished with this project, I hope to understand how to write the entire thing from scratch.  This is why I'm implementing it in parts; I'm going through every component and experimenting as I go to learn how each section interacts with all of the others.

Also, GRITS is a robot fighting game that has a controllable robot which can pickup various objects like powerups and health from the gameworld and shoots other AI or player controlled robots.  My ultimate goal is to use this framework to build something more like BrowserQuest, a more Zelda-like RPG game, and the Udacity course was the best resource I've found since afaik BrowserQuest does not have an entire course built to understand how to put it together.

First, I'm going to try to get the engine working on it's own and then add server interaction so I can have different players login.

## Progress

I have a working assetloading system, a physics engine using box2d, an input handling engine, and rendering engine.  As of last updating this section, all of those systems work and will draw a skeleton character onto the canvas with a physics body.  No animations or interactions yet.

