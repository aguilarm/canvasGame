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
	newMapPos: {x:0, y:0},
	
	init:function() {
		this.parent();
	},
	//---------------------------------
	setup: function() {
		this.parent();
		
		gInputEngine.bind(gInputEngine.KEY.W, 'move-up');
        gInputEngine.bind(gInputEngine.KEY.S, 'move-down');
        gInputEngine.bind(gInputEngine.KEY.A, 'move-left');
        gInputEngine.bind(gInputEngine.KEY.D, 'move-right');
        
        gInputEngine.bind(gInputEngine.KEY.SHIFT, 'run');
        
        //TODO MEA change these to 'attack_up' etc and make these stop the character to shoot/swing weapon
        //gInputEngine.bind(gInputEngine.KEY.UP_ARROW, 'fire-up');
        //gInputEngine.bind(gInputEngine.KEY.DOWN_ARROW, 'fire-down');
        //gInputEngine.bind(gInputEngine.KEY.LEFT_ARROW, 'fire-left');
        //gInputEngine.bind(gInputEngine.KEY.RIGHT_ARROW, 'fire-right');

        //firing
        //gInputEngine.bind(gInputEngine.KEY.MOUSE1, 'fire0-mouse');
        //gInputEngine.bind(gInputEngine.KEY.SHIFT, 'fire1-instead-of-0');
        //gInputEngine.bind(gInputEngine.KEY.MOUSE2, 'fire1-mouse');
        //gInputEngine.bind(gInputEngine.KEY.SPACE, 'fire2');
	},
	//----------------------------------
	update: function() {
		this.parent();
		//console.log('gGameEngineUpdate, Client');
		
		
		//Make sure the part of the map that is being drawn matches the viewport
		if(gRenderEngine.canvas.width != this.gMap.viewRect.w) {
		    this.gMap.viewRect.w = gRenderEngine.canvas.width;
		}
		if(gRenderEngine.canvas.height != this.gMap.viewRect.h) {
		    this.gMap.viewRect.h = gRenderEngine.canvas.height;
		} 
		
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
			pInput.walking = true;
			//Set move_dir to a unit vector in the same direction
			//it's currently pointing
			move_dir.Normalize();
			//Then multiply move_dir by players set walkSpeed, this
			//allows us to modify walkSpeed outside of this function
			//MEA Added a check to see if we should be running or not
			if(!gInputEngine.state('run')){
			    move_dir.Multiply(this.gPlayer0.walkSpeed);
			    //check animation speed, reset if needed
			    if (this.gPlayer0._walkSpriteAnimList[0]._animIncPerFrame != 0.2){
    			    for(i = 0;i < 4;i++){
			            this.gPlayer0._walkSpriteAnimList[i]._animIncPerFrame = 0.2;
			        }
			    }
			}
			if(gInputEngine.state('run')){
			    move_dir.Multiply(this.gPlayer0.walkSpeed * 2);
			    //change the animation speed to match
			    for(i = 0;i < 4;i++){
			        this.gPlayer0._walkSpriteAnimList[i]._animIncPerFrame = 0.4;
			    }
			}
			pInput.x += move_dir.x;
			pInput.y += move_dir.y;
		} else {
			pInput.walking = false;
			pInput.x = 0;
			pInput.y = 0;
		}
		
		var dPX = this.gPlayer0.pos.x;
		var dPY = this.gPlayer0.pos.y;
		
		//Facing direction from mouse or keyboard, defaults to last value
		//var faceAngleRadians = this.gPlayer0.faceAngleRadians;
		//pInput.faceAngle0to7 = (Math.round(faceAngleRadians/(2*Math.PI)* 8) + 8) % 8;
		
		//Record and sent out inputs
		this.gPlayer0.pInput = pInput;
	    this.gPlayer0.sendUpdates();
	    
	    this.gPlayer0.applyInputs();
		
		//recenter our map bounds based upon the player's centered position
		this.newMapPos.x = this.gPlayer0.pos.x - (this.gMap.viewRect.w * 0.5);
		this.newMapPos.y = this.gPlayer0.pos.y - (this.gMap.viewRect.h * 0.5);
	},//end of update
	//-----------------------------------------
	run: function() {
		this.parent();
		var fractionOfNextPhysicsUpdate = this.timeSincePhysicsUpdate / Constants.PHYSICS_LOOP_HZ;
			
		this.update();
		
		this.draw(fractionOfNextPhysicsUpdate);
		gInputEngine.clearPressed();
	},
	//-----------------------------------------
	//This function draws the entire frame to the canvas each update.
	draw: function (fractionOfNextPhysicsUpdate) {
	    
	    // Alpha-beta filter on camera
        this.gMap.viewRect.x = parseInt(alphaBeta(this.gMap.viewRect.x, this.newMapPos.x, 0.9));
        this.gMap.viewRect.y = parseInt(alphaBeta(this.gMap.viewRect.y, this.newMapPos.y, 0.9));
    
	    // Draw map.
	    this.gMap.draw(null);
	    
	    //no death so haven't implemented yet.
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
	
	//------------------------------------------------
	preloadComplete: false,
	preloadAssets: function ()
	{
        //go load images first
        var assets = new Array();
        assets.push("img/master.png");
        
        var map = mapOutside;
        for (var i = 0; i < map.tilesets.length; i++) {
            assets.push("img/" + map.tilesets[i].image.replace(/^.*[\\\/]/, ''));
        }
        //TODO sounds
        loadAssets(assets, function() 
        {
            xhrGet("img/master.json", false, 
                function(data){
                    var obj = JSON.parse(data.response);
                    var sheet = new SpriteSheetClass();
                    gSpriteSheets['master'] = sheet;
                    sheet.load("img/master.png");
                    
                    for (var key in obj.frames)
                    {
                        var val = obj.frames[key];
                        var cx=-val.frame.w * 0.5;
                        var cy=-val.frame.h * 0.5;
                        
                        if(val.trimmed)
                        {
                            cx = val.spriteSourceSize.x - (val.sourceSize.w * 0.5);
                            cy = val.spriteSourceSize.y - (val.sourceSize.h * 0.5);
                        }
                        
                        sheet.defSprite(key, val.frame.x, val.frame.y, val.frame.w, val.frame.h, cx, cy);
                    }
                    gGameEngine.preloadComplete = true;
            });
        });
        
        //google says effects!@ here in comments,
        //but no code is here. no idea why
    }
});

var gGameEngine = new ClientGameEngineClass();