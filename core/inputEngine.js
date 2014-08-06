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

InputEngineClass = Class.extend({
	// Dictionary mapping ASCII key codes to string values describing intended actions
	bindings:{},
	//Dictionary of actions that could be taken and a boolean indicating whether it's currently taking place
	actions: {},
	
	mouse: {
		x: 0,
		y: 0
	},
	
	screenMouse: {
		x: 0,
		y: 0
	},
	
	setup: function () {
		console.log('gInputEngine.setup');
		// Example usage of bind, where we're setting up
		// the W, A, S, and D keys in that order.
		gInputEngine.bind(87, 'move-up');
		gInputEngine.bind(65, 'move-left');
		gInputEngine.bind(83, 'move-down');
		gInputEngine.bind(68, 'move-right');
	},	

	//-----------------------
	//When mouse moves, update our info on where it is
	onMouseMoveEvent: function (event) {
		this.mouse.x = event.clientX;
		this.mouse.y = event.clientY;
	},
	//--------------------------
	onKeyDownEvent: function (keyCode, event) {
		//grab the keycode from the event listener
		var code = keyCode;
		//check the bindings dictionary for an
		//action associated with the passed code
		var action = this.bindings[code];
		if(action) {
			this.actions[action] = true;
		}
	},
	//----------------
	onKeyUpEvent: function (keyCode) {
		//when key is released, deactivate action
		var code = keyCode;
		
		var action = this.bindings[code];
		if(action) {
			this.actions[action] = false;
		}
	},
	//-----------------
	//this can be called on update cycle to
	//let other classes know an action state is
	//active or true
	state: function (action) {
    	return this.actions[action];
  	},
	clearState: function (action) {
		this.actions[action] = false;
	},
	//Takes ASCII keycode and a string representing an action
	//Actions are defined in the gameEngine
	bind: function (key, action) {
		this.bindings[key] = action;
	}
});

gInputEngine = new InputEngineClass();