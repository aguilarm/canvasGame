//Global shorthands for Box2d primitives
Vec2 = Box2D.Common.Math.b2Vec2;
BodyDef = Box2D.Dynamics.b2BodyDef;
Body = Box2D.Dynamics.b2Body;
FixtureDef = Box2D.Dynamics.b2FixtureDef;
Fixture = Box2D.Dynamics.b2Fixture;
World = Box2D.Dynamics.b2World;
MassData = Box2D.Collision.Shapes.b2MassData;
PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
CircleShape = Box2D.Collision.Shapes.b2CircleShape;
DebugDraw = Box2D.Dynamics.b2DebugDraw;
RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;


PhysicsEngineClass = Class.extend({
	world: null,
	
	PHYSICS_LOOP_HZ: 1.0/60.0,
	
	//----------------------------------------------
	create: function() {
		//Vec2(x,y) specifies gravity vector (topdown has none)
		//And a boolean allows or disallows sleep
		this.world = new World(
			new Vec2(0,0),
			false
		);
	},
	
	//-----------------------------------------------
	update: function() {
		var start = Date.now();
		
		this.world.Step(
			PHYSICS_LOOP_HZ, //Framerate at which to update phyics
			10,
			10
		);
		this.world.ClearForces();
		
		return(Date.now() - start);
	},
	//------------------------------------------------
	registerBody: function(bodyDef) {
		var body = gPhysicsEngine.world.CreateBody(bodyDef);
		return body;
	},
	addBody: function (entityDef) {
		//create a new BodyDef object
		var bodyDef = new BodyDef();
		
		var id = entityDef.id;
		
		//static or dynamic?
		if(entityDef.type == 'static'){
			bodyDef.type = Body.b2_staticBody;
		} else {
			bodyDef.type = Body.b2_dynamicBody;
		}
		
		bodyDef.position.x = entityDef.x;
		bodyDef.position.y = entityDef.y;
		
		//Invokes box2d to create a physics object
		var body = this.registerBody(bodyDef);
		var fixtureDefinition = new FixtureDef();
		
		if(entityDef.useBouncyFixture){
			fixtureDefinition.density = 1.0;
			fixtureDefinition.friction = 0;
			fixtureDefinition.restitution = 1.0;
		}
		
		//Now we define the shape of this object as a box
		fixtureDefinition.shape = new PolygonShape();
		fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
		body.CreateFixture(fixtureDefinition);
		
		return body;
	},
	
	//-------------------------------------------------
	removeBody: function (obj) {
		this.world.DestroyBody(obj);
	}
});

var gPhysicsEngine = new PhysicsEngineClass();