/*Copyright 2011 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
#limitations under the License.*/
//----------------------------------
//Modified by Mika Aguilar
//----------------------------------

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
	
	//----------------------------------------------
	create: function() {
		//console.log('Creating world');
		//Vec2(x,y) specifies gravity vector (topdown has none)
		//And a boolean allows or disallows sleep
		gPhysicsEngine.world = new World(
			new Vec2(0,0),
			false
		);
	},
	
	//-----------------------------------------------
	update: function() {
		var start = Date.now();
		gPhysicsEngine.world.Step(
			Constants.PHYSICS_LOOP_HZ, //Framerate at which to update phyics
			10,		//velocity iterations
			10		//position iterations
		);
		this.world.ClearForces();//Stop physics so things do not keep gliding all over
		return(Date.now() - start);
	},
	//------------------------------------------------
	registerBody: function(bodyDef) {
		var body = this.world.CreateBody(bodyDef);
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