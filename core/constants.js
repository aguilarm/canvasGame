ConstantsClass = Class.extend({
	GAME_UPDATES_PER_SEC : 10,
	GAME_LOOP_HZ: 1.0 / 10.0,
	
	PHYSICS_UPDATES_PER_SEC: 60,
	PHYSICS_LOOP_HZ: 1.0 / 60.0,
});

var Constants = new ConstantsClass();