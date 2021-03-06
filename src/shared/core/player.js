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
	team: 0,  //0 or 1
	isDead: false,
	zIndex: 1,
	init: function (inputx, inputy, settings) {
		this.hsize = {x:32, y:50};
		console.log(this.hsize);
		this.parent(inputx, inputy, settings);
		var entityDef = {
			id: "player",
			x: this.pos.x,
			y: this.pos.y,
			halfHeight: this.hsize.x / 2, //JJG: divide by 2 to let the player squeeze through narrow corridors
			halfWidth: this.hsize.y / 2,  //MEA: removed division, I want player to have full size collision
			damping: 0,
			angle: 0,
			categories: ['player', settings.team == 0 ? 'team0' : 'team1'],
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
	//---------------------------------------------------
	update: function(){
	    this.parent();
	    //TODO: this would normally handle respawns/deaths
		this.physBody.SetActive(true);
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
	//---------------------------------------------------
	sendUpdates: function() {
		this.sendPhysicsUpdates(true);
		//if (this.pInput) this.toOthers.q_input(this.pInput);
	},
	on_setPosition: function(msg) {
		this.centerAt(msg);
	},
});

Factory.nameClassMap["Player"] = PlayerClass;
//gGameEngine.factory['player'] = PlayerClass;