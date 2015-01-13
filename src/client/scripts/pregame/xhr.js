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