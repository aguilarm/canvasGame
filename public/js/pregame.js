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

al_currAssetStates= Array();
function al_isImgFilename(fname)
	{
		return  fname.indexOf('.jpg') != -1 ||
				fname.indexOf('.png') != -1 ||
				fname.indexOf('.gif') != -1 ||
				fname.indexOf('.wp') != -1;
	};

	function al_isSoundFilename(fname)
	{
		return  fname.indexOf('.ogg') != -1 ||
				fname.indexOf('.ogg') != -1 ||
				fname.indexOf('.ogg') != -1 != -1;
	};
	
	function al_isLoadFinished()
	{
		for(key in al_currAssetStates)
		{
			if(al_currAssetStates[key] == 0)
				return false;
		}
		return true;
	};
	function al_imgLoadCallback(imgName)
	{
		al_currAssetStates[imgName] = 1;
	};
	function loadAssets(uriList, onCompleteFunction)
	{
		al_currAssetStates.length = 0;
		
		for(var i =0; i < uriList.length;i++)
		{
			var ast = uriList[i];
			al_currAssetStates[ast] = 0;
			
			if(al_isImgFilename(ast))
			{
				if(ImageCache[ast] != null)
					return ImageCache[ast];
				var img = new Image();
				img.onload = new function() {al_imgLoadCallback(ast)};
				img.src = ast;	
				
				ImageCache[ast] = img;
			}
			else if(al_isSoundFilename(ast))
			{
				gSM.loadAsync(ast, function(s) {
				al_currAssetStates[s.path] = 1;
				} );
			}
			
			//else //TODO
			
		}
		
		checkWait(al_isLoadFinished, onCompleteFunction);
	}
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
//Abstracted XMLHTTPRequest
function xhrGet(reqUri, reqCred, callback) {
	//set the function that calls the xhrget
	console.log('xhrget');
	var caller = xhrGet.caller;
	//set the request up
	var xhr = new XMLHttpRequest();
	//when the json is loaded completely and server is done
	//xhr.addEventListener('loadend', xhrComplete, false);
	//run the request	
	xhr.open("GET", reqUri, false);
	
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
Array.prototype.erase = function (item) {
	for (var i = this.length; i--; i) {
		if (this[i] === item) this.splice(i, 1);
	}

	return this;
};

Function.prototype.bind = function (bind) {
	var self = this;
	return function () {
		var args = Array.prototype.slice.call(arguments);
		return self.apply(bind || null, args);
	};
};

merge = function (original, extended) {
	for (var key in extended) {
		var ext = extended[key];
		if (typeof (ext) != 'object' || ext instanceof Class) {
			original[key] = ext;
		} else {
			if (!original[key] || typeof (original[key]) != 'object') {
				original[key] = {};
			}
			merge(original[key], ext);
		}
	}
	return original;
};

function copy(object) {
	if (!object || typeof (object) != 'object' || object instanceof Class) {
		return object;
	} else if (object instanceof Array) {
		var c = [];
		for (var i = 0, l = object.length; i < l; i++) {
			c[i] = copy(object[i]);
		}
		return c;
	} else {
		var c = {};
		for (var i in object) {
			c[i] = copy(object[i]);
		}
		return c;
	}
}

function ksort(obj) {
	if (!obj || typeof (obj) != 'object') {
		return [];
	}

	var keys = [],
		values = [];
	for (var i in obj) {
		keys.push(i);
	}

	keys.sort();
	for (var i = 0; i < keys.length; i++) {
		values.push(obj[keys[i]]);
	}

	return values;
}

// -----------------------------------------------------------------------------
// Class object based on John Resigs code; inspired by base2 and Prototype
// http://ejohn.org/blog/simple-javascript-inheritance/
(function () {
	var initializing = false,
		fnTest = /xyz/.test(function () {
			xyz;
		}) ? /\bparent\b/ : /.*/;

	this.Class = function () {};
	var inject = function (prop) {
		var proto = this.prototype;
		var parent = {};
		for (var name in prop) {
			if (typeof (prop[name]) == "function" && typeof (proto[name]) == "function" && fnTest.test(prop[name])) {
				parent[name] = proto[name]; // save original function
				proto[name] = (function (name, fn) {
					return function () {
						var tmp = this.parent;
						this.parent = parent[name];
						var ret = fn.apply(this, arguments);
						this.parent = tmp;
						return ret;
					};
				})(name, prop[name]);
			} else {
				proto[name] = prop[name];
			}
		}
	};

	this.Class.extend = function (prop) {
		var parent = this.prototype;

		initializing = true;
		var prototype = new this();
		initializing = false;

		for (var name in prop) {
			if (typeof (prop[name]) == "function" && typeof (parent[name]) == "function" && fnTest.test(prop[name])) {
				prototype[name] = (function (name, fn) {
					return function () {
						var tmp = this.parent;
						this.parent = parent[name];
						var ret = fn.apply(this, arguments);
						this.parent = tmp;
						return ret;
					};
				})(name, prop[name]);
			} else {
				prototype[name] = prop[name];
			}
		}

		function Class() {
			if (!initializing) {

				// If this class has a staticInstantiate method, invoke it
				// and check if we got something back. If not, the normal
				// constructor (init) is called.
				if (this.staticInstantiate) {
					var obj = this.staticInstantiate.apply(this, arguments);
					if (obj) {
						return obj;
					}
				}

				for (var p in this) {
					if (typeof (this[p]) == 'object') {
						this[p] = copy(this[p]); // deep copy!
					}
				}

				if (this.init) {
					this.init.apply(this, arguments);
				}
			}

			return this;
		}

		Class.prototype = prototype;
		Class.constructor = Class;
		Class.extend = arguments.callee;
		Class.inject = inject;

		return Class;
	};

})();

newGuid_short = function () {
	var S4 = function () {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return (S4()).toString();
};

