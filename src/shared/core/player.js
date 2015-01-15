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

PlayerClass = EntityClass.extend({
	walkSpeed: 52*3, //move 3 tiles/sec
	walking: false,
	physBody: null,
	faceAngleRadians: 0,
	health: 100,
	maxHealth: 100,
	team: 0,  //0 or 1
	color: 0,
	isDead: false,
	zIndex: 1,
	init: function (inputx, inputy, settings) {
		settings.hsize = {x:32, y:50};
		this.parent(inputx, inputy, settings);
		this.team = settings.team;
		var entityDef = {
			id: "player",
			x: this.pos.x,
			y: this.pos.y,
			halfHeight: this.hsize.x / 2, //JJG: divide by 2 to let the player squeeze through narrow corridors
			halfWidth: this.hsize.y / 2,
			damping: 0,
			angle: 0,
			categories: ['player', settings.team === 0 ? 'team0' : 'team1'],
			collidesWith: ['all'],
			userData: {
				"id": "player",
				"ent": this
			}
		};
		this.physBody = gPhysicsEngine.addBody(entityDef);
		
		this.userID = settings.userID;
		this.displayName = settings.displayName;
	},
	
	update: function(){
	    this.parent();
	    
	    if(this.health <= 0) {
	    	if (IS_SERVER && !this.isDead)
	    		Server.stats.log('death_pos', {'x':this.pos.x, 'y':this.pos.y, 'team':this.team});
	    	this.isDead = true;
	    	this.physBody.SetActive(false);
	    } else {
	    	//did we just respawn?
	    	if (this.isDead) {
	    		this.isDead = false;
	    		this.physBody.SetActive(true);
	    		if(!IS_SERVER) {
	    			var pPos = this.physbody.GetPosition(),
	    				ent = gGameEngine.spawnEntity("SpawnEffect", pPos.x, pPos.y, null);
	    			ent.onInit(this, pPos);
	    		}
	    	}
	    }
	},
	//---------------------------------------------------
	applyInputs: function() {
		if(this.pInput) {
			this.faceAngleRadians = this.pInput.faceAngle0to7 / 8 * 2 * Math.PI;
			this.walking = this.pInput.walking;
			this.legRotation = this.pInput.legRotation;
			
			var vx = this.pInput.x;
			var vy = this.pInput.y;
			var ovx = vx;
			var ovy = vy;
			var adjust = this.getPhysicsSyncAdjustment();
			vx += adjust.x;
			vy += adjust.y;
			
			this.physBody.SetLinearVelocity(new Vec2(vx,vy));
		}
	},
	
	sendUpdates: function() {
		this.sendPhysicsUpdates(true);
		if (this.pInput) this.toOthers.q_input(this.pInput);
		if (IS_SERVER) {
			this.toAll.q_stats({
				health: this.health,
				walkSpeed: this.walkspeed,
			});
		}
	},
	
	on_input: function (msg) {
		this.pInput = msg;
	},
	
	on_stats: function (msg) {
		if(IS_SERVER) return;
		
		this.health = msg.health;
		this.walkSpeed = msg.walkSpeed;
		
	},
	
	takeDamage: function (amount) {
		this.health -= amount;
	},
	
	resetStats: function () {
		this.health = 100;
		this.isDead = false;
		this.physBody.SetActive(true);
	},
	
	on_setPosition: function(msg) {
		this.centerAt(msg);
	},
	
});

Factory.nameClassMap["Player"] = PlayerClass;
//gGameEngine.factory['player'] = PlayerClass;