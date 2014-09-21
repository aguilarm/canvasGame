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
	gPlayers: {},
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
		
		gPhysicsEngine.addContactListener({
		    BeginContact: function(idA, idB) {
		        //?
		    },
		    
		    PostSolve: function (bodyA, bodyB, impulse) {
		        
		        if (impulse < 0.1) return;
		        //MEA: I think impulse weapons push stuff around rather than just hitting it and thats it
		        var u = [bodyA.GetUserData(),bodyB.GetUserData()];
		        var nm = ['',''];
		        var typ = [-1,-1];//0,1,2 = player, projectile, wall
		        
		        //figure out what our player names are, and what types they are
		        for (var i =0; i < 2; i++)
		        {
		            if(u[i] != null)
		            {
		                if(u[i].ent != null)
		                {
		                    nm[i] = u[i].ent.name || '';
		                    if(u[i].ent.walkSpeed != null){
		                        console.log('Player colliding!');
		                        typ[i] = 0; }//it's a player
		                    else{
		                        console.log('Object colliding!');
		                        typ[i] = 1;} //either a projectile or enviro object
		                }
		                else
		                {
		                    console.log('Wall colliding!');
		                    typ[i] = 2; //it's a wall
		                }
		            }
		        }
		        
		        //if this is player/player, or player/wall, ignore!
		            if(typ[0] == 0)
				        if(typ[1] == 0 || typ[1] == 2)
					        return;
				console.log('Not two players!');
			        if(typ[1] == 0)
				        if(typ[0] == 0 || typ[0] == 2)
					        return;
			    console.log('Nor a player and a wall!');
					        
					        
			if(IS_SERVER)		
		    {
			    //we care about sending this along, so do such.
			    Server.broadcaster.q_collision({
			        ent0: nm[0],
			        ent1: nm[1],
			        impulse: impulse,
			    });
		    }
		    else
		    {
			    //if we're client ignore the collision unless it's projectile/wall
			    //MEA just kidding, making teleporters work client side
			    if(typ[0] == 1)
				    if(typ[1] != 2)
					    return;
				console.log('Not a projectile hitting something besides a wall!');//0,1,2 = player, projectile, wall
			    //if(typ[1] == 1)
				//    if(typ[0] != 2)
				//	    return;
			    console.log('Or the other way around!');
		    }
		    
	        gGameEngine.onCollisionTouch(bodyA,bodyB,impulse);
            console.log('collision!');
		    }
		});
		
		//clm hax - force load a map
		this.gMap = new TileMapLoaderClass();
		this.gMap.load(mapOutside);
		
		//MEA spawn player
		//TODO since it's single player right now, this works.  but on multiplayer ill need to switch spawning method
		this.gPlayer0 = this.spawnEntity("Player", 1380.04, 1456.44, {name: "halfwit", team: "wat", userID: "player0", displayName: "potato"});
		console.log('spawning player from gameEngine.js');
	},
	//----------------------------------
	//-----------------------------
    onCollisionTouch: function(bodyA,bodyB,impulse)
        {
            console.log('gameEngine.onCollisionTouch');
            if (impulse < 0.1) return;
            var uA = bodyA?bodyA.GetUserData():null;
            var uB = bodyB?bodyB.GetUserData():null;
            //CLM commented out due to perf spew
            //console.log('Touch' + uA + ' ' + uB + ' ' + uA.ent + ' ' + uB.ent);

            if (uA != null) {
                if (uA.ent != null && uA.ent.onTouch) {
                    uA.ent.onTouch(bodyB, null, impulse);
                }
            }

            if (uB != null) {
                if (uB.ent != null && uB.ent.onTouch) {
                    uB.ent.onTouch(bodyA, null, impulse);
                }
            }
    },
    
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
	
	nextSpawnId: function () {
	    return this.spawnCounter++;
	},
	
	onSpawned: function(){},
	onUnspawned: function(){},
	
	spawnEntity: function (typename, x, y, settings) {
		var entityClass = Factory.nameClassMap[typename];
		var es = settings || {};
		es.type = typename;
		var ent = new(entityClass)(x, y, es);
		    var msg = "SPAWNING " + typename + " WITH ID " + ent.id;
        if (ent.name) {
            msg += " WITH NAME " + ent.name;
        }
        if (es.displayName) {
            msg += " WITH displayName " + es.displayName;
        }
        if (es.userID) {
            msg += " WITH userID " + es.userID;
        }
        if (es.displayName) {
            console.log(msg);
        }
		gGameEngine.entities.push(ent);
		if (ent.name) {
			gGameEngine.namedEntities[ent.name] = ent;
		}
		gGameEngine.onSpawned(ent);
		if (ent.type == "Player") {
		    console.log('SPAWING PLAYER, ASSIGNING TO GPLAYER0');
			this.gPlayer0 = ent;
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
		
		for (var p in this.gPlayers) {
		    this.gPlayers[p].applyInputs();
		}
		
	},//end of update
	//-----------------------------------------
	updatePhysics: function() {
		gPhysicsEngine.update();
		//TODO only doing one player, should be doing a bunch
	    var plyr = this.gPlayer0;
	    if (plyr) {
	    var pPos = plyr.physBody.GetPosition();
	    plyr.pos.x = pPos.x;
	    plyr.pos.y = pPos.y;
	    }
	},
	
	
});

var gGameEngine = new GameEngineClass();