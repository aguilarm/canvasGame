//Set up globals
//var parsedJSON = 0;
//	jsonLoaded = 0;
//	ghostmaster = 0;
//var mainCTX = 0;
//	mainCanvas = 0;
//	sheet = 0;
	
//Load assets
function preloadAssets () {
	console.log("preloadAssets begin");
	var assets = new Array();
	assets.push("img/master.png");
	
	//sounds
	//none yet
	
	loadAssets(assets, 
		xhrGet("img/master.json", false, saveMaster)
	);
}

preloadAssets();

//Run when document is ready
$(function(){
	
	//Setup the render engine which sizes the canvas and adds event listeners

	//saveMaster is fired when the xhr loads, to prevent calling a draw without a loaded image
	//Prooobably a better way to do this, but for now:
	$(document).on('saveMaster', function () {
		//setTimeout(function(){
		drawSprite("skele_18.png",100,100);
		console.log('drawing skele_01');
		setTimeout(function(){
			clearCanvas(gRenderEngine.context);
			console.log('clearCanvas call');
		}, 4000);
		//},200);
	});
	
	//Start up game engine
	gInputEngine.setup();
	gGameEngine.setup();
	gRenderEngine.setup();
	console.log('setup engines');
	setTimeout(function(){
	gGameEngine.spawnEntity("Player", 100, 100, {name: "halfwit", team: "wat", userID: "player0", displayName: "potato"});
	},1600);
	//set a ready call just for funsies
	var ready = true;
});

//Create a canvas with the id of canvasID and context of contextName
/*This is now handled by the renderEngine
function initCanvas() {
	//Set up variables
	var canvas = document.getElementById('mainCanvas');
		ctx = canvas.getContext('2d');
	//Create and style the canvas
	
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	canvas.style.backgroundColor = "#00f";
	setTimeout(function(){
		canvas.style.backgroundColor = "#fff";
	}, 300);
	console.log("attempted to edit canvas, checking ctx next");
}
*/
//Clear the entire specific canvas
function clearCanvas(context){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}