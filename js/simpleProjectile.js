SimpleProjectileClass = WeaponInstanceClass.extend({
	//init variables
	physBody: null,
	speed: 800,
	lifetime: 0,
	
	init: function(x, y, settings){
		this.parent(x,y,settings);
		
		var startPos = settings.pos;
		
		this.lifetime = 2;
		
		var entityDef = {
			id: "SimpleProjectile" + guid,
			x: startPos.x,
			y: startPos.y,
			halfHeight: 5 * 0.5,
			halfWidth: 5 * 0.5,
			damping: 0
		};
		
		this.physBody = gPhysicsEngine.addBody(entityDef);
	}
});