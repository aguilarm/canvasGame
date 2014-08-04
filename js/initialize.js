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
	
	//Create the canvas element
	initCanvas();
	
	//Attempt to draw the sprite
	//setInterval(function () {
	//	drawSprite("skele_01.png",40,40);
	//	console.log('skele1')
	//	setTimeout(function(){drawSprite("skele_02.png",40,41);console.log("skele2")},200);
	//	setTimeout(function(){drawSprite("skele_03.png",41,42);console.log("skele2")},401);
	//	setTimeout(function(){drawSprite("skele_04.png",42,43);console.log("skele2")},602);
	//	setTimeout(function(){drawSprite("skele_05.png",43,44);console.log("skele2")},803);
	//	setTimeout(function(){drawSprite("skele_06.png",45,46);console.log("skele2")},904);
	//	setTimeout(function(){drawSprite("skele_07.png",47,48);console.log("skele2")},1005);
	//}, 1300);
	
	$(document).on('saveMaster', function () {
		//setTimeout(function(){
		drawSprite("skele_01.png",100,100);
		console.log('drawing skele_01');
		setTimeout(function(){
			clearCanvas(ctx);
			console.log('clearCanvas call');
		}, 4000);
		//},200);
	});
	
});

//Create a canvas with the id of canvasID and context of contextName
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

//Clear the entire specific canvas
function clearCanvas(context){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}