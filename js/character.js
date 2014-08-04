function character() {
	//grab the ghostmaster json, parse it, and add it to the parsedJSON variable
	xhrGet('json/ghostmaster.json', parseJSON, null);
	//Use ghostmaster var to show ghostmaster is loaded and set jsonLoaded to prevent loading a different json
		ghostmaster = 1;
		jsonLoaded = 1;
	//Run the following only if the xhr for the json is finished loading and ghostmaster is set
	$(document).on('xhrDone', function() {
		if (ghostmaster == 1){
		console.log('ghostmaster is 1 and the event trigger xhrDone is active');
		//Pass the parsedJSON to the spriteSheets array
		ghostmaster = parsedJSON;
		//spriteSheets.push(ghostmaster);
		console.log('next item should be = to parsedJSON');
		console.log(spriteSheets);
		//Clear the parsedJSON variable
		parsedJSON = 0;
		//Now that I've got the json parsed and extracted from the xhrGet function, I can retrieve the character data
		console.log('Printing "ghostatk00.png" below');
		console.log(ghostmaster['frames'][0]['filename']);
		//
		
		}
	}); 

}