var gCachedAssets = {};



function loadAssets(assetList, callback) {
	var loadBatch = {
		count: 0,
		total: assetList.count,
		cb: callback
	};
	
	console.log("loadAssets fired");
	for(var i = 0; i < assetList.length; i++) {
		if(gCachedAssets[assetList[i]] == null) {
			var assetType = getAssetTypeFromExtension(assetList[i]);
			
			if(assetType == 0) { // Asset is an image
				var img = new Image();
				img.onload = function () {
				onLoadedCallback(img, loadBatch);
				};
				img.src = assetList[i];
				gCachedAssets[assetList[i]] = img;
				
			} else if(assetType == 1) { //Asset is Javascript
				var fileref = document.createElement('script');
				var filename = assetList[i];
				fileref.setAttribute("type", "text/javascript");
				fileref.addEventListener('load', function(e){
					onLoadedCallback(fileref,loadBatch);
				}, false);
				fileref.setAttribute("src", filename);
				document.getElementsByTagName("head")[0].appendChild(fileref);
				gCachedAssets[assetList[i]] = fileref;
			}
		} else { //Asset is already loaded
			onLoadedCallback(gCachedAssetsassetList[i], loadBatch);
		}
	}
}

//---------------------------------------------
function onLoadedCallback(asset, batch) {
	// If the entire batch has been loaded, call the callback.
	batch.count++;
	if(batch.count == batch.total) {
		batch.cb(asset);
	}
}
//---------------------------------------------
function getAssetTypeFromExtension(fname) {
	if(fname.indexOf('.jpg') != -1 || fname.indexOf('.jpeg') != -1 || fname.indexOf('.png') != -1 || fname.indexOf('.gif') != -1 || fname.indexOf('.wp') != -1) {
		// It's an image!
		return 0;
	}

	if(fname.indexOf('.js') != -1 || fname.indexOf('.json') != -1) {
		// It's javascript!
		return 1;
	}

	// Not one of these types!
	return -1;
}

function getMasterJSON(){
		console.log("line before xhrGet is called");
		xhrGet("img/master.json", false, 
			function(data){
				var obj = JSON.parse(data.response);
				console.log(obj);
				console.log("should have just seen some parsed JSON");
				var sheet = new SpriteSheetClass();
				gSpriteSheets['master'] = sheet;
				sheet.load("img/master.png");
				
				for (var key in obj.frames) {
					var val = obj.frames[key];
					var cx = val.frame.w * 0.5;
					var cy = val.frame.h * 0.5;
				
					sheet.defSprite(key, val.frame.x, val.frame.y, val.frame.w, val.frame.h, cx, cy);
				}
				
		});
	}