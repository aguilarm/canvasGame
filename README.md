canvasGame
==========

Creating an html5 game using the canvas element and a ton of (vanilla) javascript, following the <a href="https://www.udacity.com/course/cs255">Udacity HTML5 Game Development course</a> as well as refrencing and the actual GRITS game code.  The Udacity course is a great resource, but it woefully fails at actually allowing someone to build an entire game engine and use it just following the class.  After the class, you can EDIT the game engine a little bit, and understand how key parts work, but a huge majority of it is still kind of a mystery.  So with this project I'm hoping to fill in the gaps.

## Goal

When I'm finished with this project, I hope to understand how to write the entire thing from scratch.  This is why I'm implementing it in parts; I'm going through every component and experimenting as I go to learn how each section interacts with all of the others.

Also, GRITS is a robot fighting game that has a controllable robot which can pickup various objects like powerups and health from the gameworld and shoots other AI or player controlled robots.  My ultimate goal is to use this framework to build something more like BrowserQuest, a more Zelda-like RPG game, and the Udacity course has been a fun way to do it.  The goal is more to really understand Javascript more than how a game works.

First, I'm going to try to get the engine working on it's own and then add server interaction so I can have different players login, or perhaps have a login system where you can save a character tied to an account with stats and items.

## Progress

As of v0.1.0, the game is complete on the most basic level.  It could use a lot of optimization but all of the big parts are working together to allow a single player to walk around the map, bump into things, and even use a teleporter.

