WeaponInstanceClass = EntityClass.extend({
	damageMultiplier:1.0,
	
	init: function(x,y,settings){
		this.parent(x,y,settings);
	}
});

//gGameEngine.factory['WeaponInstance'] = WeaponInstanceClass;