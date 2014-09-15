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
	presses: {},
	locks: {},
	delayedKeyup: [],
	

	mouse: {
		x: 0,
		y: 0
	},
	
	screenMouse: {
		x: 0,
		y: 0
	},
	
	setup: function () {
		//console.log('gInputEngine.setup');
		// Example usage of bind, where we're setting up
		// the W, A, S, and D keys in that order.
		//TODO actual GRITS game handles this differently
		gInputEngine.bind(87, 'move-up');
		gInputEngine.bind(65, 'move-left');
		gInputEngine.bind(83, 'move-down');
		gInputEngine.bind(68, 'move-right');
		//now doing up, left, down, right arrow keys; binding the same action
		gInputEngine.bind(38, 'move-up');
		gInputEngine.bind(37, 'move-left');
		gInputEngine.bind(40, 'move-down');
		gInputEngine.bind(39, 'move-right');
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
			if (event && event.cancelable)
			    event.preventDefault();
		    if (!this.locks[action]) {
		        this.presses[action] = true;
		        this.locks[action] = true;
		    }
		}
	},
	//----------------
	onKeyUpEvent: function (keyCode, event) {
		//when key is released, deactivate action
		console.log('keyup called');
		var code = keyCode;
		var action = this.bindings[code];
		if(action) {
		    if (event && event.cancelable)
		        event.preventDefault();
			this.delayedKeyup.push(action);
		}
	},
	//-----------------
	bind: function (key, action) {
		this.bindings[key] = action;
	},
	//-----------------
	//this can be called on update cycle to
	//let other classes know an action state is
	//active or true
	state: function (action) {
    	return this.actions[action];
  	},
  	//-----------------
	clearState: function (action) {
		this.actions[action] = false;
	},
	//-----------------
	pressed: function (action) {
	    return this.presses[action];
	},
	//-----------------
	clearPressed: function () {
	    for (var i = 0; i < this.delayedKeyup.length; i++) {
	        var action = this.delayedKeyup[i];
	        this.actions[action] = false;
	        this.locks[action] = false;
	    }
	    this.delayedKeyup = [];
	    this.presses = {};
	},
    //-----------------------------------------
    clearAllState: function () {
        this.actions = {};
        this.locks = {};
        this.delayedKeyup = [];
        this.presses = {};
    },
});

KEY = {
  'MOUSE1': -1,
  'MOUSE2': -3,
  'MWHEEL_UP': -4,
  'MWHEEL_DOWN': -5,

  'BACKSPACE': 8,
  'TAB': 9,
  'ENTER': 13,
  'PAUSE': 19,
  'CAPS': 20,
  'ESC': 27,
  'SPACE': 32,
  'PAGE_UP': 33,
  'PAGE_DOWN': 34,
  'END': 35,
  'HOME': 36,
  'LEFT_ARROW': 37,
  'UP_ARROW': 38,
  'RIGHT_ARROW': 39,
  'DOWN_ARROW': 40,
  'INSERT': 45,
  'DELETE': 46,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'A': 65,
  'B': 66,
  'C': 67,
  'D': 68,
  'E': 69,
  'F': 70,
  'G': 71,
  'H': 72,
  'I': 73,
  'J': 74,
  'K': 75,
  'L': 76,
  'M': 77,
  'N': 78,
  'O': 79,
  'P': 80,
  'Q': 81,
  'R': 82,
  'S': 83,
  'T': 84,
  'U': 85,
  'V': 86,
  'W': 87,
  'X': 88,
  'Y': 89,
  'Z': 90,
  'NUMPAD_0': 96,
  'NUMPAD_1': 97,
  'NUMPAD_2': 98,
  'NUMPAD_3': 99,
  'NUMPAD_4': 100,
  'NUMPAD_5': 101,
  'NUMPAD_6': 102,
  'NUMPAD_7': 103,
  'NUMPAD_8': 104,
  'NUMPAD_9': 105,
  'MULTIPLY': 106,
  'ADD': 107,
  'SUBSTRACT': 109,
  'DECIMAL': 110,
  'DIVIDE': 111,
  'F1': 112,
  'F2': 113,
  'F3': 114,
  'F4': 115,
  'F5': 116,
  'F6': 117,
  'F7': 118,
  'F8': 119,
  'F9': 120,
  'F10': 121,
  'F11': 122,
  'F12': 123,
  'SHIFT': 16,
  'CTRL': 17,
  'ALT': 18,
  'PLUS': 187,
  'COMMA': 188,
  'MINUS': 189,
  'PERIOD': 190
};

var gInputEngine = new InputEngineClass();
gInputEngine.KEY = KEY;