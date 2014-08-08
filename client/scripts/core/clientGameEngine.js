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

GameEngineClass = Class.extend({
	gSocket: null,
	
	init:function() {
		this.parent();
	},
	//---------------------------------
	setup: function() {
		this.parent();
		console.log('running gameEngine setup');
		//Create physics Engine
		gPhysicsEngine.create(Constants.PHYSICS_UPDATES_PER_SEC, false);
		
		//Call input setup to bind keys and set event listeners
		gInputEngine.setup();

	},
	//----------------------------------
	//Entity handling
	//list of active entities
	entities: [],
	//factory is used to store new classes for each entity
	factory:{},
	//Used to set the kill order of entities
	_deferredKill: [],
	
	spawnEntity: function (typename) {
		
		var ent = new (factory[typename])();
		this.entities.push(ent);
		return ent;
	},
	
	update: function() {
		this.parent();
		console.log('gGameEngineUpdate, Client');
		
		var pInput = {
			x: 0,
			y: 0,
			faceAngle0to7: 0, //Limit facing to 8 directions
			walking: false,
		};
		
		var move_dir = new Vec2(0,0);
		if (gInputEngine.state['move-up']){
			//Adjust move_dir by 1 in the y direction
			mov_dir.y -= 1;
			console.log('MOVIN ON UP');
		}
		if (gInputEngine.state['move-down']){
			//Adjust move_dir by 1 in the y direction
			gGameEngine.mov_dir.y += 1;
		}
		if (gInputEngine.state['move-left']) {
			// adjust the move_dir by 1 in the
			// x direction.
			gGameEngine.move_dir.x -= 1;
		}
		if (gInputEngine.state['move-right']) {
			// adjust the move_dir by 1 in the
			// x direction.
			gGameEngine.move_dir.x += 1;
		}
		//check if a move key has been pressed, if so make walk
		if (gGameEngine.move_dir.LengthSquared()){
			pInput.walking = true;
			//Set move_dir to a unit vector in the same direction
			//it's currently pointing
			gGameEngine.move_dir.Normalize();
			//Then multiply move_dir by players set walkSpeed, this
			//allows us to modify walkSpeed outside of this function
			gGameEngine.move_dir.Multiply(this.gPlayer0.walkSpeed);
			pInput.x += move_dir.x;
			pInput.y += move_dir.y;
		} else {
			pInput.walking = false;
			pInput.x = 0;
			pInput.y = 0;
		}
		
		var dPX = gRenderEngine.getScreenPosition(this.gPlayer0.pos).x;
		var dPY = gRenderEngine.getScreenPosition(this.gPlayer0.pos).y;
		
		//Facing direction from mouse or keyboard, defaults to last value
		var faceAngleRadians = this.gPlayer0.faceAngleRadians;
		pInput.faceAngle0to7 = (Math.round(faceAngleRadians/(2*Math.PI)* 8) + 8) % 8;
		
		//Record and sent out inputs
		this.gPlayer0.pInput = pInput;
		this.gPlayer0.sendUpdates();
		
	},//end of update
	//-----------------------------------------
	run: function() {
		this.parent();
		var fractionOfNextPhysicsUpdate = this.timeSincePhysicsUpdate / Constants.PHYSICS_LOOP_HZ;
			
			this.update();
			
		this.draw(fractionOfNextPhysicsUpdate);
	},
	//-----------------------------------------
	//This function draws the entire frame to the canvas each update.
	draw: function (fractionOfNextPhysicsUpdate) {
		//Just to get this working with one entity, I'm not adding the zIndex support yet
		//and I'm just going to draw each entity active no matter
		this.entities.forEach(function(entity){
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

var gGameEngine = new GameEngineClass();