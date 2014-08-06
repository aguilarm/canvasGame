PlayerClass = EntityClass.extend({
	walkSpeed: 52*5,
	walking: false,
	physBody: null,
	isDead: false,
	zIndex: 1,
	init: function (inputx, inputy, settings) {
		settings.hsize = {x:26, y:26};
		this.parent(inputx, inputy, settings);
		var entityDef = {
			id: "player",
			x: this.pos.x,
			y: this.pos.y,
			halfHeight: this.hsize.x / 2,
			halfWidth: this.hsize.y / 2,
			damping: 0,
			angle: 0,
			collidesWith: ['all'],
			userData: {
				"id": "player",
				"ent": this
			}
		};
		this.physBody = gPhysicsEngine.addBody(entityDef);
		
		this.userID = settings.userID;
		this.displayName = settings.displayName;
	},
	//---------------------------------------------------
	update: function(){
		//I have no idea what this actually does
		this.physBody.SetActive(true);
	},
	//---------------------------------------------------
	applyInputs: function() {
		if(this.pInput) {
			this.faceAngleRadians = this.pInput.faceAngle0to7 / 8 * 2 * Math.PI;
			this.walking = this.pInput.walking;
			this.legRotation = this.pInput.legRotation;
			
			var vx = this.pInput.x;
			var vy = this.pInput.y;
			var ovx = vx;
			var ovy = vy;
			var adjust = this.getPhysicsSyncAdjustment();
			vx += adjust.x;
			vy += adjust.y;
			
			this.physBody.SetLinearVelocity(new Vec2(vx,vy));
		}
	},
	//---------------------------------------------------
	on_setPosition: function(msg) {
		this.centerAt(msg);
	},
});

//gGameEngine.factory['player'] = PlayerClass;