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

ClientGameEngineClass = GameEngineClass.extend({
	gSocket: null,
	init:function() {
		this.parent();
	},
	//---------------------------------
	setup: function() {
		this.parent();
		//console.log('running clientGameEngine setup');
		
		//spawn the player when game starts
		//TODO this is probably not the best place to put this or even a great way to do it, but for now...
		

	},
	//----------------------------------
	update: function() {
		this.parent();
		//console.log('gGameEngineUpdate, Client');
		
		var inputEngine = gInputEngine;
		
		if (!this.gPlayer0 || this.gPlayer0.isDead) {
		    return;
		}
		
		var pInput = {
			x: 0,
			y: 0,
			faceAngle0to7: 0, //Limit facing to 8 directions
			walking: false,
		};
		var move_dir = new Vec2(0, 0);
		if (gInputEngine.state('move-up'))
			move_dir.y -= 1;
		if (gInputEngine.state('move-down'))
			move_dir.y += 1;
		if (gInputEngine.state('move-left'))
			move_dir.x -= 1;
		if (gInputEngine.state('move-right'))
			move_dir.x += 1;
		//check if a move key has been pressed, if so make walk
		if (move_dir.LengthSquared()) {
		    console.log('move key pressed, walking?');
			pInput.walking = true;
			//Set move_dir to a unit vector in the same direction
			//it's currently pointing
			move_dir.Normalize();
			//Then multiply move_dir by players set walkSpeed, this
			//allows us to modify walkSpeed outside of this function
			move_dir.Multiply(this.gPlayer0.walkSpeed);
			pInput.x += move_dir.x;
			pInput.y += move_dir.y;
		} else {
		    console.log('STOP');
			pInput.walking = false;
			pInput.x = 0;
			pInput.y = 0;
		}
		
		var dPX = this.gPlayer0.pos.x;
		var dPY = this.gPlayer0.pos.y;
		
		//Facing direction from mouse or keyboard, defaults to last value
		var faceAngleRadians = this.gPlayer0.faceAngleRadians;
		pInput.faceAngle0to7 = (Math.round(faceAngleRadians/(2*Math.PI)* 8) + 8) % 8;
		
		//Record and sent out inputs
		this.gPlayer0.pInput = pInput;
	    this.gPlayer0.sendUpdates();
	    
	    this.gPlayer0.applyInputs();
		
	},//end of update
	//-----------------------------------------
	run: function() {
		this.parent();
		var fractionOfNextPhysicsUpdate = this.timeSincePhysicsUpdate / Constants.PHYSICS_LOOP_HZ;
			
		this.update();
		
		this.draw(fractionOfNextPhysicsUpdate);
		console.log('clearpressed from client game engine')
		gInputEngine.clearPressed();
	},
	//-----------------------------------------
	//This function draws the entire frame to the canvas each update.
	draw: function (fractionOfNextPhysicsUpdate) {
		//Just to get this working with one entity, I'm not adding the zIndex support yet
		//and I'm just going to draw each entity active no matter
		this.entities.forEach(function(entity){
			//console.log('draw an Entity');
			entity.draw(fractionOfNextPhysicsUpdate);
		});
		
		//Bucket entities by zIndex
		/*var fudgeVariance = 128;
		var zIndex_array = [];
		var entities_bucketed_by_zIndex = {}
		this.entities.forEach(function(entity){
			if(zIndex_array.indexOf(entity.zIndex) === -1)
			{
				zIndex_array.push(entity.zIndex);
				entities_bucketed_by_zIndex[entity.zIndex] = [];
			}
			entities_bucketed_by_zIndex[entity
		zIndex_array.sort(function(a,b){return a-b;}});
		zIndex_array.forEach(function(zIndex){
			entities_bucketed_by_zIndex[zIndex].forEach(function(entity){
				entity.draw(fractionOfNextPhysicsUpdate);
			});
		});*/
	},
});

var gGameEngine = new ClientGameEngineClass();