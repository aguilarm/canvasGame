//Abstracted XMLHTTPRequest
function xhrGet(reqUri, reqCred, callback) {
	//set the function that calls the xhrget
	console.log("xhrGet fired");
	var caller = xhrGet.caller;
	//set the request up
	var xhr = new XMLHttpRequest();
	//when the json is loaded completely and server is done
	//xhr.addEventListener('loadend', xhrComplete, false);
	//run the request	
	xhr.open("GET", reqUri, true);
	
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status != 200) {
				throw 'xhrGet failed:\n' + reqUri + '\nHTTP ' + xhr.status + ': ' + xhr.responseText + '\ncaller: ' + caller;
			}
			if(callback){
				try{
					callback(xhr);
				} catch(e){
					throw 'xhrGet failed:\n' + reqUri + '\nException: ' + e + '\nresponseText: ' + xhr.responseText + '\ncaller: ' + caller;
				}
			}
		}
	};
	if(reqCred)
			xhr.withCredentials = "true";
	//send the request
	xhr.send();
}
//--------------------------------------------------------
function saveMaster(data){
				var obj = JSON.parse(data.response);
				console.log(obj);
				console.log("should have just seen some parsed JSON");
				var sheet = new SpriteSheetClass();
				gSpriteSheets['master'] = sheet;
				console.log("Just added to gSpriteSheets from xhr:");
				console.log(gSpriteSheets);
				sheet.load("img/master.png");
				for (var key in obj.frames) {
					var val = obj.frames[key];
					var cx = val.frame.w * 0.5;
					var cy = val.frame.h * 0.5;
				
					sheet.defSprite(key, val.frame.x, val.frame.y, val.frame.w, val.frame.h, cx, cy);
					console.log("sheet.defSprite in saveMaster");
				}
				
				console.log(sheet);
				$(document).trigger('saveMaster');
		}