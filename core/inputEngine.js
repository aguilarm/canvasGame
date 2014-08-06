InputEngineClass = Class.extend({
	// Dictionary mapping ASCII key codes to string values describing intended actions
	bindings:{},
	//Dictionary of actions that could be taken and a boolean indicating whether it's currently taking place
	actions: {},
	
	mouse: {
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

		// Adding the event listeners for the appropriate DOM events.
		document.getElementById('mainCanvas').addEventListener('mousemove', gInputEngine.onMouseMove);
		document.getElementById('mainCanvas').addEventListener('keydown', gInputEngine.onKeyDown);
		document.getElementById('mainCanvas').addEventListener('keyup', gInputEngine.onKeyUp);
	},	

	//-----------------------
	//When mouse moves, update our info on where it is
	onMouseMove: function (event) {
		gInputEngine.mouse.x = event.clientX;
		gInputEngine.mouse.y = event.clientY;
	},
	//--------------------------
	onKeyDown: function (event) {
		//when the key is pressed, make the action active
		var action = gInputEngine.bindings[event.keyID];
		if(action) {
			gInputEngine.actions[action] = true;
		}
	},
	//----------------
	onKeyUp: function (event) {
		//when key is released, deactivate action
		var action = gInputEngine.bindings[event.keyID];
		if(action) {
			gInputEngine.actions[action] = false;
		}
	},
	
	//Takes ASCII keycode and a string representing an action
	//Actions are defined in the gameEngine
	bind: function (key, action) {
		gInputEngine.bindings[key] = action;
	}
});

gInputEngine = new InputEngineClass();