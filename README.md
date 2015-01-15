canvasGame
==========

###<a href="http://mikaaguilar.com/projects/canvasgame/client/index.html">Try the most recent release here!</a>

This project was born when I went through the <a href="https://www.udacity.com/course/cs255">Udacity HTML5 Game Development course</a>.  It was my first interaction with a large-scale JavaScript project, and I have gone through all of the code by hand implementing features piece by piece to create a quite different, single player version of the game using awesome art from <a href="http://opengameart.org/">Open Game Art (more info in License)</a>.

It has since grown to one of my favorite side-projects to work on and I'm constantly modernizing the source code as I learn new things.  So far, it uses **node.js**, **express**, **socket.io**, **box2d physics**, and a LOT of vanilla JavaScript using an old <a href="http://ejohn.org/blog/simple-javascript-inheritance/">Class shim by John Resig</a> that seems to hold up well, but I can't wait to replace it with ES6 classes.

## Goal

Long-term I'd like to have a simple game that plays kind of like <a href="http://browserquest.mozilla.org/">Browser Quest</a> which is a Zelda-like top down point and click RPG with multiplayer.  Player accounts and customization will most likely be implemented after I have multiplayer/netcode working how I'd like it to.

## Progress

1/11/2015 - Returning to this project with the intention of learning more advanced ways to use Socket.io.  A bit of housekeeping is in order, I'm positive there are a lot of bad variable declarations and other easy optimizations specific to JS I can do throughout the project.  In some places, using the Class system is unnecessary and I'll switch to object literals.

~~As of v0.1.0, the game is complete on the most basic level.  It could use a lot of optimization but all of the big parts are working together to allow a single player to walk around the map, bump into things, and even use a teleporter.~~

