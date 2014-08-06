GameEngineClass = Class.extend({
	move_dir: new Vec2(0,0),
	dirVec: new Vec2(0,0),
	gPlayer0:{
		pos: {
			x:100,
			y:100
		},
		
		walkSpeed: 1,
		
		mpPhysBody: new BodyDef()
	},
	
	//---------------------------------
	setup: function() {
		//Call input setup to bind kets and set event listeners
		gInputEngine.setup();
	},
	//----------------------------------
	//Entity handling
	//list of active entities
	entities: [],
	//factory is used to store new classes for each entity
	factory:{},
	
	spawnEntity: function (typename) {
		
		var ent = new (factory[typename])();
		this.entities.push(ent);
		return ent;
	},
	
	update: function() {
		
		if (gInputEngine.actions['move-up']){
			//Adjust move_dir by 1 in the y direction
			gGameEngine.mov_dir.y -= 1;
		}
		if (gInputEngine.actions['move-down']){
			//Adjust move_dir by 1 in the y direction
			gGameEngine.mov_dir.y += 1;
		}
		if (gInputEngine.actions['move-left']) {
			// adjust the move_dir by 1 in the
			// x direction.
			gGameEngine.move_dir.x -= 1;
		}
		if (gInputEngine.actions['move-right']) {
			// adjust the move_dir by 1 in the
			// x direction.
			gGameEngine.move_dir.x += 1;
		}
		if (gGameEngine.move_dir.LengthSquared()){
			//Set move_dir to a unit vector in the same direction
			//it's currently pointing
			gGameEngine.move_dir.Normalize();
			//Then multiply move_dir by players set walkSpeed, this
			//allows us to modify walkSpeed outside of this function
			gGameEngine.move_dir.Multiply(gGameEinge.gPlayer0.walkSpeed);
		}
		
		gGameEngine.gPlayer0.mpPhysBody.setLinearVelocity(gGameEngine.move_dir.x, gGameEngine.move_dir.y);
		
		//Mouse based firing
		if (gInputEngine.actions.fire0 || gInputEngine.actions.fire1) {
			
			var playerInScreenSpace = {
				x: gRenderEngine.getScreenPosition(this.gPlayer0.pos).x,
				y: gRenderEngine.getScreenPosition(this.gPlayer0.pos).y};
			
			var dirVec = new Vec2(0,0);
			dirVec.x = gInputEngine.mouse.x - playerInScreenSpace.x;
			dirVec.y = gInputEngine.mouse.y - playerInScreenSpace.y;
			dirVec.normalize();
		}
	}
});

var gGameEngine = new GameEngineClass();