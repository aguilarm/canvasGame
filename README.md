canvasGame
==========

This project was born when I went through the <a href="https://www.udacity.com/course/cs255">Udacity HTML5 Game Development course</a>.  It was my first interaction with a large-scale JavaScript project, and I have gone through all of the code by hand implementing features piece by piece to create a quite different, single player version of the game using awesome art from <a href="http://opengameart.org/">Open Game Art (more info in License)</a>.

It has since grown to one of my favorite side-projects to work on and I'm constantly modernizing the source code as I learn new things.  So far, it uses **node.js**, **express**, **socket.io**, **box2d physics**, and a LOT of vanilla JavaScript using an old <a href="http://ejohn.org/blog/simple-javascript-inheritance/">Class shim by John Resig</a> that seems to hold up well, but I can't wait to replace it with ES6 classes.

## Goal

Long-term I'd like to have a simple game that plays kind of like <a href="http://browserquest.mozilla.org/">Browser Quest</a> which is a Zelda-like top down point and click RPG with multiplayer.  Player accounts and customization will most likely be implemented after I have multiplayer/netcode working how I'd like it to.

## Progress

1/11/2015 - Returning to this project with the intention of learning more advanced ways to use Socket.io.  Before implementing, I'm going to refactor the majority of the project using what I've learned over the past several months about JavaScript preformance and formatting.  Even after one day, the game hardly lags especially compared to previously where I encountered frequent major slowdown spikes.  
Ultimate goal is to stop relying on the Class system being used and use a more simple pattern with objects and prototyping.

As of v0.1.0, the game is complete on the most basic level.  It could use a lot of optimization but all of the big parts are working together to allow a single player to walk around the map, bump into things, and even use a teleporter.

