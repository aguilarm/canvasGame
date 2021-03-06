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


EntityClass = Class.extend({
	// can all be refrenced by child classes
	//Variables
	pos: {x:0,y:0},
	size: {x:0,y:0},
	last: {x:0,y:0},
	zIndex: 0, //Entities draws small zIndex values first, and larger on top
	currSpriteName: null,
	
	type: 0,
	checkAgainst: 0,
	collides: 0, //Zero means this will not collide
	_killed: false,
	lastCloseTeleportPos: null,
	forcePos: null,
	markForDeath: false, //Can be used to kill the entity next cycle
	//----------------------------------------------
	init: function (x, y, settings) {
		this.id = ++EntityClass._lastId; //Give the entity a new unique identifier
		//the x and y passed to the init function are where we will position the entity
		this.pos.x = x;
		this.pos.y = y;
		
		//TODO this works, but settings should be handled differently, probably entity specific.
		this.type = settings.type;
		merge(this,settings);
		
		this.spawnInfo = JSON.stringify(settings);
	},
	//can be overloaded by child classes
	update: function(){
		//Check if marked for death, and if so kill the entity and stop this function
		if(this.markForDeath == true) {
			this.kill();
			return;
		}
		//if we are forcing a position, set it in Physics, move the physBody there as well as the sprite?
		if(this.forcePos) {
		    console.log('forcepos!');
			this.physBody.SetPosition(new Vec2(this.forcePos.x, this.forcePos.y));
			this.pos.x = this.forcePos.x;
			this.pos.y = this.forcePos.y;
			this.forcePos = null;
		}
		//save current position this update under last pos for later
		this.last.x = this.pos.x;
		this.last.y = this.pos.y;
		
		//once we get 100 units from the teleporter, we can re-enter
		if (this.lastCloseTeleportPos != null && distSq(this.pos, this.lastCloseTeleportPos) > (100*100)) {
		    //we can teleport again
		    this.lastCloseTeleportPos = null;
		}
	},
	//----------------------------
	sendPhysicsUpdates: function (clientControlledPhysics) {
    var sender = null;
    if (clientControlledPhysics) {
      sender = this.toOthers;
    } else if (IS_SERVER) {
      sender = this.toAll;
    }
    if (sender && this.physBody) {
      var loc = this.physBody.GetPosition();
      var vel = this.physBody.GetLinearVelocity();
      sender.q_phys({
        x:loc.x,
        y:loc.y,
        vx:vel.x,
        vy:vel.y
      });
     }
    },
    
    //-----------------------------------------
  getPhysicsSyncAdjustment: function () {
    var out = {x:0, y:0};
    var tp = this.targetPhys;
    if (tp && !IS_SERVER) {
      var op = this.tpOrig;
      var dt = (new Date().getTime() - op.t)/1000;
      if (dt < 0.2) {
        var ploc = this.physBody.GetPosition();
        var cx = ploc.x;
        var cy = ploc.y;
        var ox = op.x;
        var oy = op.y;
        var ovx = op.vx;
        var ovy = op.vy;
        var predx = ox + ovx * dt;
        var predy = oy + ovy * dt;
        var allowSlipTime = 0.1;
        var dpred = Math.sqrt((predx-cx)*(predx-cx)+(predy-cy)*(predy-cy));
        var dallow = Math.sqrt(ovx*ovx+ovy*ovy)*(allowSlipTime+dt)+10;
        if (!this.snapped && dpred > dallow) {
          var putx = predx + (cx - predx) * dallow/dpred;
          var puty = predy + (cy - predy) * dallow/dpred;
          this.physBody.SetPosition(new Vec2(putx, puty));
          Logger.log("snap " + ox + " " + oy + " " + putx + " " + puty);
        } else {
          out.x = (predx - cx) * dpred / dallow * 0.1;
          out.y = (predy - cy) * dpred / dallow * 0.1;
        }
      }
      this.snapped = true;
    }
    return out;
  },
  
	//-----------------------------
	draw: function() {
		//if there is a current sprite name, draw that sprite with the drawSprite function from spriteSheet
		if(this.currSpriteName) {
			console.log('entity.draw call');
			drawSprite(this.currSpriteName, this.pos.x.round() - this.hsize.x, this.pos.y.round() - this.hsize.y);
		}
	},
	//-----------------------------
	kill: function() {
	//kill is different for most entities, so it's set in their classes
	},
	//---------------------------
	//I think this moves the centered location of the viewport over the player?
	centerAt: function(newPos) {
		this.forcePos = {
			x: (newPos.x - this.hsize.x),
			y: (newPos.y - this.hsize.y)
		};
	},

});

//Last used entity id, incremented every time we init an entity
EntityClass._lastId = 0;