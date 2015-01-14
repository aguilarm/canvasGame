/*Copyright 2012 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
#limitations under the License.*/


exports.kill = function (loop) {
  if (!loop) return;
  loop.alive = false;
}

exports.run = function(dt, f) {
  var loop = { alive: true };
  var start = Date.now();
  var scheduled = start + dt;
  var lastSend = dt;
  var tick = function() {
    if (!loop.alive) {
      return;
    }
    f();
    var now = Date.now();
    scheduled += dt;
    if (now > scheduled) {
      console.log("over ran timeslot by " + (now-scheduled) + "ms");
      scheduled = now;
    }
    var sleep = scheduled - now;
    setTimeout(tick, sleep);
  }
  setTimeout(tick, dt);
  return loop;
}
