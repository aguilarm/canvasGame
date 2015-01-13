ConstantsClass = Class.extend({
	GAME_UPDATES_PER_SEC : 30,
	GAME_LOOP_HZ: 1.0 / 30.0,
	
	PHYSICS_UPDATES_PER_SEC: 120,
	PHYSICS_LOOP_HZ: 1.0 / 120.0,
});

var Constants = new ConstantsClass();