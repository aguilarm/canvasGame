/*Copyright 2012 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
#limitations under the License.

Modifications by Mika Aguilar, 2015 */

var fs = require('fs');
var vm = require('vm');

var ALL_SOURCE = [];

function include(name) {
  ALL_SOURCE.push({
    name: name,
    src: fs.readFileSync(__dirname + '/' + name),
  });
}

include("src/shared/core/core.js");
include("src/shared/core/Logger.js");
include("src/shared/core/box2D.js");
include("src/shared/core/Constants.js");
include("src/shared/core/Timer.js");
include("src/shared/core/Entity.js");
include("src/shared/core/Util.js");
include("src/shared/core/Factory.js");
include("src/shared/core/GameEngine.js");
include("src/shared/core/PhysicsEngine.js");
include("src/shared/core/Player.js");
include("src/shared/core/TileMap.js");
include("src/shared/core/Weapon.js");
include("src/shared/core/WeaponInstance.js");
include("src/shared/environment/Spawner.js");
include("src/shared/environment/SpawnPoint.js");
include("src/shared/environment/Teleporter.js");
include("src/shared/items/EnergyCanister.js");
include("src/shared/items/HealthCanister.js");
include("src/shared/items/QuadDamage.js");
include("src/shared/maps/map1.js");
include("src/shared/weaponinstances/SimpleProjectile.js");
include("src/shared/weaponinstances/BounceBallBullet.js");
include("src/shared/weaponinstances/LandmineDisk.js");
include("src/shared/weaponinstances/Shield.js");
include("src/shared/weaponinstances/Sword.js");
include("src/shared/weapons/Thrusters.js");
include("src/shared/weapons/Shield.js");
include("src/shared/weapons/BounceBallGun.js");
include("src/shared/weapons/Landmine.js");
include("src/shared/weapons/ShotGun.js");
include("src/shared/weapons/ChainGun.js");
include("src/shared/weapons/MachineGun.js");
include("src/shared/weapons/RocketLauncher.js");
include("src/shared/weapons/Sword.js");

exports.createGameInstance = function(callbacks) {
  var fakeConsole = { log: function() {} };

  var phonyContextGlobals = {
    IS_SERVER:true,
    console:fakeConsole,
    Server:callbacks,
  };

  var phonyContext = vm.createContext(phonyContextGlobals);

  for (var i=0; i<ALL_SOURCE.length; i++) {
    var s = ALL_SOURCE[i];
    try {
      vm.runInContext(String(s.src), phonyContext, s.name);
    } catch (e) {
      console.log("error loading game file " + s.name);
      throw e;
    }
  }

  phonyContext.enableLogging = function() {
    fakeConsole.log = console.log;
  }

  return phonyContext;
};

