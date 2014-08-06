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
	
	move_dir: new Vec2(0,0),
	dirVec: new Vec2(0,0),
	gPlayer0:{
		pos: {
			x:100,
			y:100
		},
		
		walkSpeed: 1,
		
		mpPhysBody: new BodyDef()
	},
	
	
	//---------------------------------
	setup: function() {
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
		console.log('gGameEngineUpdate');
		if (gInputEngine.actions['move-up']){
			//Adjust move_dir by 1 in the y direction
			gGameEngine.mov_dir.y -= 1;
			console.log('MOVIN ON UP');
		}
		if (gInputEngine.actions['move-down']){
			//Adjust move_dir by 1 in the y direction
			gGameEngine.mov_dir.y += 1;
		}
		if (gInputEngine.actions['move-left']) {
			// adjust the move_dir by 1 in the
			// x direction.
			gGameEngine.move_dir.x -= 1;
		}
		if (gInputEngine.actions['move-right']) {
			// adjust the move_dir by 1 in the
			// x direction.
			gGameEngine.move_dir.x += 1;
		}
		if (gGameEngine.move_dir.LengthSquared()){
			//Set move_dir to a unit vector in the same direction
			//it's currently pointing
			gGameEngine.move_dir.Normalize();
			//Then multiply move_dir by players set walkSpeed, this
			//allows us to modify walkSpeed outside of this function
			gGameEngine.move_dir.Multiply(gGameEinge.gPlayer0.walkSpeed);
		}
		
		//this.gPlayer0.mpPhysBody.setLinearVelocity(this.move_dir.x, this.move_dir.y);
		
		//Mouse based firing
		if (gInputEngine.actions.fire0 || gInputEngine.actions.fire1) {
			
			var playerInScreenSpace = {
				x: gRenderEngine.getScreenPosition(this.gPlayer0.pos).x,
				y: gRenderEngine.getScreenPosition(this.gPlayer0.pos).y};
			
			var dirVec = new Vec2(0,0);
			dirVec.x = gInputEngine.mouse.x - playerInScreenSpace.x;
			dirVec.y = gInputEngine.mouse.y - playerInScreenSpace.y;
			dirVec.normalize();
		}
		
		//Update the physics engine
		gPhysicsEngine.update();
	}//end of update
});

var gGameEngine = new GameEngineClass();