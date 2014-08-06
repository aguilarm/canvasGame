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
var gSpriteSheets = {};

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
function drawSprite(spritename, posX, posY) {
	console.log('calling master sheet:');
	console.log(gSpriteSheets);
	for(sheet in gSpriteSheets){
			console.log("drawSprite");
		var sheet = gSpriteSheets['master'];
		console.log(sheet);
		var spt = sheet.getStats(spritename);
		console.log(spt);
		if(spt == null)
			continue;
			
		__drawSpriteInternal(spt, sheet, posX, posY);
		console.log("tried drawSpriteInternal");
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
	
	ctx.drawImage(sheet.img,
				spt.x, spt.y, spt.w, spt.h,
				posX + hlf.x, posY + hlf.y,
				spt.w, spt.h);
				
	console.log('attempting to write img, here is the ctx:');
	console.log(ctx);
}
