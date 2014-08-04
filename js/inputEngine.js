var keyState = new Array();

keyState[256];

document.getElementById('mainCanvas').addEventListener('mousemove', onMouseMove);
document.getElementById('mainCanvas').addEventListener('keydown', onKeyDown);

function onMouseMove(event){
	var posX = event.clientX;
		posY = event.clientY;
	console.log("positionX = "+posX+"; positionY = ",posY);
}

function onKeyDown(event){
	var keyID = event.keyID;
	console.log("you pressed this keyID: ",keyID);
}