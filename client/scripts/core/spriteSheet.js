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

//I moved the declaration of this variable to xhr.js
//var gSpriteSheets = {};

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
function __drawSpriteInternal(spt,sheet,posX,posY){
	if(spt == null || sheet == null)
		return;
	
	var hlf = {
		x: spt.cx,
		y: spt.cy
	};
	
	var ctx = gRenderEngine.context;
	
	ctx.drawImage(sheet.img,
				spt.x, spt.y, spt.w, spt.h,
				posX + hlf.x, posY + hlf.y,
				spt.w, spt.h);
}
