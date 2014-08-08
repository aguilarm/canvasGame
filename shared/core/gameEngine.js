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
	
	gravity: 0,
	screen: {
		x: 0,
		y: 0
	},
	
	entities: [],
	namedEntities: {},
	
	timeSinceGameUpdate: 0,
	timeSincePhysicsUpdate: 0,
	clock: null,
	
	dataTypes: [],
	gPlayer0: null,
	fps: 0,
	currentTick: 0,
	lastFpsSec: 0,
	
	init: function() {
		this.clock = new TimerClass();
	},
	
	//---------------------------------
	setup: function() {
		//create physics
		gPhysicsEngine.create(Constants.PHYSICS_UPDATES_PER_SEC, false);
	},
	//----------------------------------
	
	getTime: function() { return this.currentTick * 0.05; },
	
	getEntityByName: function(name) { return this.namedEntities[name];},
	
	getEntityById: function(id) {
		for (var i = 0; i < this.entities.length; i++){
			var ent = this.entities[i];
			if (ent.id == id){
				return ent;
			}
		}
		return null;
	},
	
	
	spawnEntity: function (typename, x, y, settings) {
		var entityClass = Factory.nameClassMap[typename];
		var es = settings || {};
		var ent = new (entityClass)(x, y, es);
		gGameEngine.entities.push(ent);
		if (ent.name) {
			gGameEngine.namedEntities[ent.name] = ent;
		}
		gGameEngine.onSpawned(ent);
		if (ent.type == "Player") {
			this.gPlayers[ent.name] = ent;
		}
		return ent;
	},
	
	run: function () {
		this.fps++;
		GlobalTimer.step();
		
		var timeElapsed = this.clock.tick();
		this.timeSinceGameUpdate += timeElapsed;
		this.timeSincePhysicsUpdate += timeElapsed;
		
		while (this.timeSinceGameUpdate >= Constants.GAME_LOOP_HZ &&
			this.timeSincePhysicsUpdate >= Constants.PHYSICS_LOOP_HZ){
				this.update();
				this.updatePhysics();
				this.timeSinceGameUpdate -= Constants.GAME_LOOP_HZ;
				this.timeSincePhysicsUpdate -= Constants.PHYSICS_LOOP_HZ;
		}
		
		while (this.timeSincePhysicsUpdate >= Constants.PHYSICS_LOOP_HZ){
			this.updatePhysics();
			this.timeSincePhysicsUpdate -= Constants.PHYSICS_LOOP_HZ;
		}
		
		if(this.lastFpsSec < this.currentTick/Constants.GAME_UPDATES_PER_SEC && this.currentTick % Constants.GAME_UPDATES_PER_SEC == 0) {
			this.lastFpsSec = this.currentTick / Constants.GAME_UPDATES_PER_SEC;
			this.fps = 0;
		}
	},
		
	update: function() {
		this.currentTick++;
		
		//check entities
		for (var i = 0; i < this.entities.length; i++){
			var ent = this.entities[i];
			if (!ent._killed) {
				ent.update();
			}
		}
		
	},//end of update
	//-----------------------------------------
	updatePhysics: function() {
		gPhysicsEngine.update();
	},
	
	
});

var gGameEngine = new GameEngineClass();