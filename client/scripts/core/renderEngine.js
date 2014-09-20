/*Copyright 2011 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
#limitations under the License.*/
//----------------------------------
//Modified by Mika Aguilar
//----------------------------------

//-----------------------------------
//The render engine handles the canvas properties so other classes can use them,
//and adds event listeners to the canvas and sends them to the inputEngine

RenderEngineClass = Class.extend({
	canvas: null,
	context: null,
	lastMouse: {
		x: 0,
		y: 0
	},
	lastMouseCanvas: {
		x: 0,
		y: 0,
	},
	//mouse position normalized and clamped to the canvas bounds
	//not entirely sure why this is in the google src, but here it is
	init: function () {
		//console.log("Render engine init called");
	},
	
	setup: function () {
		this.canvas = document.getElementById('mainCanvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		//add event listeners and run specified functions in this class when
		//they bubble up
		window.addEventListener('keydown', this.keydown, false);
		window.addEventListener('keyup', this.keyup, false);
		
		window.addEventListener('mousedown', this.mousedown, false);
		window.addEventListener('mouseup', this.mouseup, false);
		window.addEventListener('mousemove', this.mousemove, false);
	},
	
	keydown: function (event) {
		//I think this checks to see if we're trying to type text
		//into something like a textbox so we can ignore those keystrokes
		if (event.target.type == 'text') {
			return;
		}
		//tell the input engine to run the event assigned to this key
		gInputEngine.onKeyDownEvent(event.keyCode, event);
	},
	//------------------------------
	keyup: function (event) {
		//if we intend to get text input we can ignore
		if (event.target.type == 'text') {
			return;
		}
		gInputEngine.onKeyUpEvent(event.keyCode, event);
	},
	//commenting these out, I have no events binded to this
 	 /*mousedown: function (event) {
    	gInputEngine.onMouseDownEvent(event.button, gRenderEngine.lastMouse.x, gRenderEngine.lastMouse.y, event);
  	},

  	//-----------------------------------------
 	mouseup: function (event) {
    	gInputEngine.onMouseUpEvent(event.button, gRenderEngine.lastMouse.x, gRenderEngine.lastMouse.y, event);
  	},*/
  
	mousemove: function (event) {
    	var el = this.canvas;
    	var pos = {
      		left: 0,
      		top: 0
    	};
    	while (el != null) {
      		pos.left += el.offsetLeft;
      		pos.top += el.offsetTop;
      		el = el.offsetParent;
    	}
    	var tx = event.pageX;
    	var ty = event.pageY;

    	gRenderEngine.lastMouse.x = tx;
    	gRenderEngine.lastMouse.y = ty;
		//We've grabbed the position of the mouse, now we're telling the inputEngine where it is
    	gInputEngine.onMouseMoveEvent(gRenderEngine.lastMouse.x,gRenderEngine.lastMouse.y);

    	//weapons and events need the mouse locations clamped to the canvas bounds
    	gRenderEngine.lastMouseCanvas.x = gRenderEngine.lastMouse.x;
    	gRenderEngine.lastMouseCanvas.y = gRenderEngine.lastMouse.y - gRenderEngine.canvas.offsetTop;
  	},
  	
    getCanvasPosition: function (screenPosition) {

        //transfer position to world-space
        return {
            x: screenPosition.x - this.canvas.offsetLeft,
            y: screenPosition.y - this.canvas.offsetTop
            };
    },

    getScreenPosition: function(worldPosition) {
        return {
            x: -(gGameEngine.gMap.viewRect.x) + worldPosition.x,
            y: -(gGameEngine.gMap.viewRect.y) + worldPosition.y
        }
    },
    getWorldPosition: function (screenPosition) {
        var gMap = gGameEngine.gMap;

        //transfer position to world-space
        return {
            x: screenPosition.x + gMap.viewRect.x,
            y: screenPosition.y + gMap.viewRect.y
        };
    },
});

var gRenderEngine = new RenderEngineClass();