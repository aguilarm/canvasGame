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

var gInputEngine = {
    bindings:{},
    actions: {},
    presses: {},
    locks: {},
    delayedKeyup: [],
	    
    mouse: {
	    x: 0,
	    y: 0
    },
	
	screenMouse: {
    	x: 0,
    	y: 0
    },
	
    //MEA - these are placeholders
    onMouseDownEvent: function (event) {
        return;
    },
    
    onMouseUpEvent: function (event) {
        return;
    },
    
    onMouseMoveEvent: function (event) {
	    this.mouse.x = event.clientX;
	    this.mouse.y = event.clientY;
	},
    	
    onKeyDownEvent: function (keyCode, event) {
		var code = keyCode,
		    action = this.bindings[code];
		    
    	if(action) {
	    	this.actions[action] = true;
		    if (event && event.cancelable)
			    event.preventDefault();
    	    if (!this.locks[action]) {
	            this.presses[action] = true;
	            this.locks[action] = true;
            }
        }
    },
	    
    onKeyUpEvent: function (keyCode, event) {
		var code = keyCode,
    	    action = this.bindings[code];
	    
	    if(action) {
		    if (event && event.cancelable)
    	        event.preventDefault();
	    	this.delayedKeyup.push(action);
		}
    },
	    
    bind: function (key, action) {
	    this.bindings[key] = action;
    },
	    
    state: function (action) {
	    return this.actions[action];
    },
  	    
    clearState: function (action) {
	    this.actions[action] = false;
    },
	       
    pressed: function (action) {
        return this.presses[action];
    },
	    
    clearPressed: function () {
        var action;
        for (var i = 0; i < this.delayedKeyup.length; i++) {
            action = this.delayedKeyup[i];
            this.actions[action] = false;
            this.locks[action] = false;
        }
        this.delayedKeyup = [];
        this.presses = {};
    },
	    
    clearAllState: function () {
        this.actions = {};
        this.locks = {};
        this.delayedKeyup = [];
        this.presses = {};
    },

};

var KEY = {
  'MOUSE1': -1,
  'MOUSE2': -3,
  'MWHEEL_UP': -4,
  'MWHEEL_DOWN': -5,

  'BACKSPACE': 8,
  'TAB': 9,
  'ENTER': 13,
  'PAUSE': 19,
  'CAPS': 20,
  'ESC': 27,
  'SPACE': 32,
  'PAGE_UP': 33,
  'PAGE_DOWN': 34,
  'END': 35,
  'HOME': 36,
  'LEFT_ARROW': 37,
  'UP_ARROW': 38,
  'RIGHT_ARROW': 39,
  'DOWN_ARROW': 40,
  'INSERT': 45,
  'DELETE': 46,
  '0': 48,
  '1': 49,
  '2': 50,
  '3': 51,
  '4': 52,
  '5': 53,
  '6': 54,
  '7': 55,
  '8': 56,
  '9': 57,
  'A': 65,
  'B': 66,
  'C': 67,
  'D': 68,
  'E': 69,
  'F': 70,
  'G': 71,
  'H': 72,
  'I': 73,
  'J': 74,
  'K': 75,
  'L': 76,
  'M': 77,
  'N': 78,
  'O': 79,
  'P': 80,
  'Q': 81,
  'R': 82,
  'S': 83,
  'T': 84,
  'U': 85,
  'V': 86,
  'W': 87,
  'X': 88,
  'Y': 89,
  'Z': 90,
  'NUMPAD_0': 96,
  'NUMPAD_1': 97,
  'NUMPAD_2': 98,
  'NUMPAD_3': 99,
  'NUMPAD_4': 100,
  'NUMPAD_5': 101,
  'NUMPAD_6': 102,
  'NUMPAD_7': 103,
  'NUMPAD_8': 104,
  'NUMPAD_9': 105,
  'MULTIPLY': 106,
  'ADD': 107,
  'SUBSTRACT': 109,
  'DECIMAL': 110,
  'DIVIDE': 111,
  'F1': 112,
  'F2': 113,
  'F3': 114,
  'F4': 115,
  'F5': 116,
  'F6': 117,
  'F7': 118,
  'F8': 119,
  'F9': 120,
  'F10': 121,
  'F11': 122,
  'F12': 123,
  'SHIFT': 16,
  'CTRL': 17,
  'ALT': 18,
  'PLUS': 187,
  'COMMA': 188,
  'MINUS': 189,
  'PERIOD': 190
};

gInputEngine.KEY = KEY;
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

//-----------------------------------
//The render engine handles the canvas properties so other classes can use them,
//and adds event listeners to the canvas and sends them to the inputEngine

var gRenderEngine = {
	canvas: null,
	context: null,
	lastMouse: {
		x: 0,
		y: 0
	},
	lastMouseCanvas: {
		x: 0,
		y: 0,
	},

	setup: function () {
		console.log('RENDERENGINE.SETUP()');
		this.canvas = document.getElementById('mainCanvas');
		this.context = this.canvas.getContext('2d');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	
		var addEL = window.addEventListener;
	
		addEL('keydown', this.keydown, false);
		addEL('keyup', this.keyup, false);
		
		addEL('mousedown', this.mousedown, false);
		addEL('mouseup', this.mouseup, false);
		addEL('mousemove', this.mousemove, false);
	},
	
	keydown: function (event) {
		if (event.target.type == 'text')
			return;
		gInputEngine.onKeyDownEvent(event.keyCode, event);
	},
	
	keyup: function (event) {
		if (event.target.type == 'text')
			return;
		gInputEngine.onKeyUpEvent(event.keyCode, event);
	},
	
	 mousedown: function (event) {
   		gInputEngine.onMouseDownEvent(event.button, gRenderEngine.lastMouse.x, gRenderEngine.lastMouse.y, event);
	},

	mouseup: function (event) {
    	gInputEngine.onMouseUpEvent(event.button, gRenderEngine.lastMouse.x, gRenderEngine.lastMouse.y, event);
	},
  
	mousemove: function (event) {
   		var el = this.canvas,
    		pos = {
   	  			left: 0,
   				top: 0
    		},
   			tx = event.pageX,
    		ty = event.pageY;
    	
   			while (el != null) {
   				pos.left += el.offsetLeft;
   				pos.top += el.offsetTop;
     			el = el.offsetParent;
   			}
			
    		gRenderEngine.lastMouse.x = tx;
   			gRenderEngine.lastMouse.y = ty;
   		
   			gInputEngine.onMouseMoveEvent(gRenderEngine.lastMouse.x,gRenderEngine.lastMouse.y);

   			gRenderEngine.lastMouseCanvas.x = gRenderEngine.lastMouse.x;
   			gRenderEngine.lastMouseCanvas.y = gRenderEngine.lastMouse.y - gRenderEngine.canvas.offsetTop;
	},
  	
   	getCanvasPosition: function (screenPosition) {
       	return {
           	x: screenPosition.x - this.canvas.offsetLeft,
           	y: screenPosition.y - this.canvas.offsetTop
           	};
   	},

	getScreenPosition: function(worldPosition) {
       	return {
           	x: -(gGameEngine.gMap.viewRect.x) + worldPosition.x,
           	y: -(gGameEngine.gMap.viewRect.y) + worldPosition.y
       	}
   	},
    	
   	getWorldPosition: function (screenPosition) {
       	var gMap = gGameEngine.gMap;
       	
       	return {
           	x: screenPosition.x + gMap.viewRect.x,
           	y: screenPosition.y + gMap.viewRect.y
       	};
   	}
};
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


function AngleBetween(a, b) {
  var dotProd = a.dot(b);
  var lenProd = a.length() * b.length();
  var divOperation = dotProd / lenProd;
  return Math.acos(divOperation); // * (180.0 / Math.PI);
}

ClientPlayerClass = PlayerClass.extend({
  _walkSpriteAnimList: [],
  _legSpriteMaskAnimList: [],
  _currWalkAnimIndex:0,
  init: function (inputx, inputy, settings) {

        this.zIndex = 8;
     
    
   var downUp=["walk_down","walk_up"];   
   var sides=["walk_left","walk_right"];

   //walking sideways uses each animation frame, but up and down exclude the resting ones
   for(var q=0; q < downUp.length; q++)
    {
           var sheet_down = new SpriteSheetAnimClass();
           sheet_down._animIncPerFrame = 0.2;
           sheet_down.loadSheet('master',"img/master.png");
            //add sprites for each movement to anim sheet
                for(var i =1; i < 8; i++)
                        sheet_down.pushFrame("male_" + downUp[q] + "_0" + i);
                this._walkSpriteAnimList.push(sheet_down);
        }
   for(var q=0; q < sides.length; q++)
   {
           var sheet_down = new SpriteSheetAnimClass();
           sheet_down._animIncPerFrame = 0.2;
           sheet_down.loadSheet('master',"img/master.png");
            //add sprites for each movement to anim sheet
                for(var i =0; i < 8; i++)
                        sheet_down.pushFrame("male_" + sides[q] + "_0" + i);
                this._walkSpriteAnimList.push(sheet_down);
        }

        
    // JJG: Ugly hack, we need the spritesheet before calling the parent.
    this.parent(inputx, inputy, settings);
  },
        //-----------------------------------------
    update: function () {
        this.parent();

        if(this.isDead) return;
        
        this._walkSpriteAnimList[this._currWalkAnimIndex].pause(!this.walking);
        //what anim should I be playing?
        var move_dir = new Vec2(0, 0);
        if (gInputEngine.state('move-up'))
          this._currWalkAnimIndex = 1;
        else if (gInputEngine.state('move-down'))
          this._currWalkAnimIndex = 0;
        if (gInputEngine.state('move-left'))
          this._currWalkAnimIndex = 2;
        else if (gInputEngine.state('move-right'))
           this._currWalkAnimIndex = 3;
   
    },
    //-----------------------------------------
    on_stats: function (msg) {
        this.parent(msg);

        //note, we detect this before the parent fucntion gets a chance to modify us.
        if(this.health<=0 && !this.isDead)
        {
                //spawn player death explosion!
                var interpolatedPosition = {x:this.pos.x, y:this.pos.y};

   
                var dPX = gRenderEngine.getScreenPosition(interpolatedPosition).x;
                var dPY = gRenderEngine.getScreenPosition(interpolatedPosition).y;
        
                var efct = gGameEngine.spawnEntity("InstancedEffect", this.pos.x, this.pos.y, null);
                efct.onInit({x:this.pos.x,y:this.pos.y},
                                {       playOnce:true, 
                                        similarName:"landmine_explosion_large_", 
                                        uriToSound:"./sound/explode0.ogg"
                                });
                                
                if(this == gGameEngine.gPlayer0)
                        show_respawn();
        }
                
    },
    //-----------------------------------------
    draw: function (fractionOfNextPhysicsUpdate) {
  
        if(this.isDead) return;
        
        var ctx = gRenderEngine.context;
        
        var intrPos = {x:this.pos.x, y:this.pos.y};
        
        if(this.pInput) {
            // JJG: input is in  units/sec so we convert to units/update and multiply by the fraction of an update
            intrPos.x += (this.pInput.x * Constants.PHYSICS_LOOP_HZ) * fractionOfNextPhysicsUpdate;
            intrPos.y += (this.pInput.y * Constants.PHYSICS_LOOP_HZ) * fractionOfNextPhysicsUpdate;
        }
        
        var dPX = gRenderEngine.getScreenPosition(intrPos).x;
        var dPY = gRenderEngine.getScreenPosition(intrPos).y;
        
        //draw red box where player is for debug
        //var ePX = dPX - (this.hsize.x/2);
        //var ePY = dPY - (this.hsize.y/2);
        //ctx.fillStyle ="#FF0000";
        //ctx.fillRect(ePX, ePY, this.hsize.x, this.hsize.y);
        
        this._drawPlayerAvatar(ctx, {player:this, locX:dPX, locY:dPY});
    
        
        
    },
  
    //--------------------------------------
    _drawPlayerAvatar: function(ctx,settings)
    {
                var spt = settings.player._walkSpriteAnimList[settings.player._currWalkAnimIndex].getCurrentFrameStats();
                {
                  var dPX = settings.locX ,dPY = settings.locY ;
                  //var sptidx = 0;
                  if (settings.player.walking == true) sptidx = settings.player.legWalkFrameIdx;
                  

                  var rotRadians = 0;//settings.player.legRotation * (Math.PI / 180.0);
                //  ctx.translate(dPX, dPY);
                //  ctx.rotate(rotRadians);
                //  ctx.translate(-(spt.w / 2.0), -(spt.h / 2.0));

                  settings.player._walkSpriteAnimList[settings.player._currWalkAnimIndex].draw(this.pos.x,this.pos.y,{ctx: ctx/*,noMapTrans:true*/});

                }
                
        },

});

Factory.nameClassMap["Player"] = ClientPlayerClass;
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
		//spawn the player when game starts
		//TODO this is probably not the best place to put this or even a great way to do it, but for now...
		

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

// We keep a global dictionary of loaded sprite-sheets,
// which are each an instance of our SpriteSheetClass
// below.
//
// This dictionary is indexed by the URL path that the
// atlas is located at. For example, calling:
//
// gSpriteSheets['grits_effects.png'] 
//
// would return the SpriteSheetClass object associated
// to that URL, assuming that it exists.


	ImageCache = {};
	loadAtlasImage = function(imagename){
		if(ImageCache[imagename] != null)
			return ImageCache[imagename];
		var img = new Image();
		img.src = imagename;
		ImageCache[imagename] = img;
		return img;
	};
//-----------------------------------------
SpriteSheetClass = Class.extend({

    // We store in the SpriteSheetClass:
    //
    // The Image object that we created for our
    // atlas.
	img: null,

    // The URL path that we grabbed our atlas
    // from.
	url: "",

    // An array of all the sprites in our atlas.
	sprites: new Array(),

	//-----------------------------------------
	init: function () {},

	//-----------------------------------------
    // Load the atlas at the path 'imgName' into
    // memory. This is similar to how we've
    // loaded images in previous units.
	load: function (imgName) {
		this.img = loadAtlasImage(imgName);
		this.url = imgName;
	},

	//-----------------------------------------
	// Define a sprite for this atlas
	defSprite: function (name, x, y, w, h, cx, cy) {
        // We create a new object with:
        //
        // The name of the sprite as a string
        //
        // The x and y coordinates of the sprite
        // in the atlas.
        //
        // The width and height of the sprite in
        // the atlas.
        //
        // The x and y coordinates of the center
        // of the sprite in the atlas. This is
        // so we don't have to do the calculations
        // each time we need this. This might seem
        // minimal, but it adds up!
		var spt = {
			"id": name,
			"x": x,
			"y": y,
			"w": w,
			"h": h,
			"cx": cx == null? 0 : cx,
			"cy": cy == null? 0 : cy
		};

        // We push this new object into
        // our array of sprite objects,
        // at the end of the array.
		this.sprites.push(spt);
	},
	//---------------------------------
	getStats: function (spritename) {
		for (var i = 0; i < this.sprites.length; i++){
			if (this.sprites[i].id == spritename) return this.sprites[i];
		}
		return null;
	}
});
//------------------------------------------------------
SpriteSheetAnimClass = Class.extend({
        _spriteSheet:null,
        _spriteNames:new Array(),
        _currAnimIdx: 0,  
        _fps:15,
        _animIncPerFrame:0.5,
        _paused:false,
        //-----------------------------------------
        loadSheet: function(sheetName, spriteSheetURI)
        {
                this._spriteSheet = gSpriteSheets[sheetName];
                if(this._spriteSheet != null)
                        return;
                var sheet = new SpriteSheetClass();     
                sheet.load(spriteSheetURI);
                
                this._spriteSheet = sheet
                gSpriteSheets['master'] =sheet;
                
                this._spriteNames.length = 0;
                this._currAnimIdx = 0;
        },
        //-----------------------------------------
        pushFrame: function(spriteName)
        {
                this._spriteNames.push(spriteName);
        },
        //-----------------------------------------
        pause: function(onOff)
        {
                this._paused = onOff;
        },
        //-----------------------------------------
        getNumFrames: function()
        {
                return this._spriteNames.length;
        },
        //-----------------------------------------
        draw: function(posX, posY, settings)
        {
                if(this._spriteSheet == null) return;
                if(!this._paused)
                        this._currAnimIdx +=  this._animIncPerFrame;
                        
                var cIDX = Math.floor(this._currAnimIdx) % this._spriteNames.length;

                var spt = this._spriteSheet.getStats(this._spriteNames[cIDX]);
                if(spt == null)
                        return;
                __drawSpriteInternal(spt,this._spriteSheet,posX,posY,settings);
        },
        //-----------------------------------------
        getCurrentFrameStats:function()
        {
                var cIDX = Math.floor(this._currAnimIdx) % this._spriteNames.length;
                return this._spriteSheet.getStats(this._spriteNames[cIDX]);
        }
});
//------------------------------------------------------
function drawSprite(spritename, posX, posY) {
	for(sheet in gSpriteSheets){
		var sheet = gSpriteSheets['master'];
		var spt = sheet.getStats(spritename);
		if(spt == null)
			continue;
			
		__drawSpriteInternal(spt, sheet, posX, posY);
		return;
	}
};

//------------------------------------------------------
function __drawSpriteInternal(spt,sheet,posX,posY,settings)
{
	if(spt == null || sheet == null)
		return;
	
	var gMap = gGameEngine.gMap;
	var hlf = {
		x: spt.cx,
		y: spt.cy
	};
	
	var mapTrans = {x: gMap.viewRect.x, y: gMap.viewRect.y};
	var ctx = gRenderEngine.context;
	if(settings)
	{
	    if(settings.noMapTrans)
	    {
	        mapTrans.x = 0;
	        mapTrans.y = 0;
	    }
	    if(settings.ctx)
	    {
	        ctx = settings.ctx;
        }
	}
	    
	if(settings && settings.rotRadians != null)
	{
	    ctx.save();
	        var rotRadians = Math.PI + settings.rotRadians;
	        
	        ctx.translate(posX - mapTrans.x, posY - mapTrans.y);
	        ctx.rotate(rotRadians); //rotate in origin
	        
	        ctx.drawImage(sheet.img,
	                                spt.x, spt.y,
	                                spt.w, spt.h,
	                                +hlf.x,
	                                +hlf.y,
	                                spt.w,
	                                spt.h);
        ctx.restore();
        
	}
	else
	{
	    ctx.drawImage(sheet.img,
	                                spt.x, spt.y,
	                                spt.w, spt.h,
	                                (posX - mapTrans.x) + (hlf.x),
	                                (posY - mapTrans.y) + (hlf.y),
	                                spt.w,
	                                spt.h);
	}
};
var gSpriteSheets = {};