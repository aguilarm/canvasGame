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

var gRenderEngine = {
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

	setup: function () {
		console.log('RENDERENGINE.SETUP()');
		this.canvas = document.getElementById('mainCanvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	
		var addEL = window.addEventListener;
	
		addEL('keydown', this.keydown, false);
		addEL('keyup', this.keyup, false);
		
		addEL('mousedown', this.mousedown, false);
		addEL('mouseup', this.mouseup, false);
		addEL('mousemove', this.mousemove, false);
	},
	
	keydown: function (event) {
		if (event.target.type == 'text')
			return;
		gInputEngine.onKeyDownEvent(event.keyCode, event);
	},
	
	keyup: function (event) {
		if (event.target.type == 'text')
			return;
		gInputEngine.onKeyUpEvent(event.keyCode, event);
	},
	
	 mousedown: function (event) {
   		gInputEngine.onMouseDownEvent(event.button, gRenderEngine.lastMouse.x, gRenderEngine.lastMouse.y, event);
	},

	mouseup: function (event) {
    	gInputEngine.onMouseUpEvent(event.button, gRenderEngine.lastMouse.x, gRenderEngine.lastMouse.y, event);
	},
  
	mousemove: function (event) {
   		var el = this.canvas,
    		pos = {
   	  			left: 0,
   				top: 0
    		},
   			tx = event.pageX,
    		ty = event.pageY;
    	
   			while (el != null) {
   				pos.left += el.offsetLeft;
   				pos.top += el.offsetTop;
     			el = el.offsetParent;
   			}
			
    		gRenderEngine.lastMouse.x = tx;
   			gRenderEngine.lastMouse.y = ty;
   		
   			gInputEngine.onMouseMoveEvent(gRenderEngine.lastMouse.x,gRenderEngine.lastMouse.y);

   			gRenderEngine.lastMouseCanvas.x = gRenderEngine.lastMouse.x;
   			gRenderEngine.lastMouseCanvas.y = gRenderEngine.lastMouse.y - gRenderEngine.canvas.offsetTop;
	},
  	
   	getCanvasPosition: function (screenPosition) {
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
       	
       	return {
           	x: screenPosition.x + gMap.viewRect.x,
           	y: screenPosition.y + gMap.viewRect.y
       	};
   	}
};