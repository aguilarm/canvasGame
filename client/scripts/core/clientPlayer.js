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


function AngleBetween(a, b) {
  var dotProd = a.dot(b);
  var lenProd = a.length() * b.length();
  var divOperation = dotProd / lenProd;
  return Math.acos(divOperation); // * (180.0 / Math.PI);
}

ClientPlayerClass = PlayerClass.extend({
  _walkSpriteAnimList: [],
  _legSpriteMaskAnimList: [],
  _currWalkAnimIndex:0,
  init: function (inputx, inputy, settings) {

        this.zIndex = 8;
        
   var names=["walk_up","walk_left","walk_down","walk_right"];
   //run once for each animation
   for(var q=0; q < names.length; q++)
   {
           var sheet_down = new SpriteSheetAnimClass();
           sheet_down._animIncPerFrame = 0.75;
           sheet_down.loadSheet('master',"img/master.png");
            //add sprites for each movement to anim sheet
                for(var i =0; i < 8; i++)
                        sheet_down.pushFrame("male_" + names[q] + "_0" + i + ".png");
                this._walkSpriteAnimList.push(sheet_down);
        }
        
    // JJG: Ugly hack, we need the spritesheet before calling the parent.
    this.parent(inputx, inputy, settings);
  },
        //-----------------------------------------
    update: function () {
        this.parent();

        if(this.isDead) return;
        
        this._walkSpriteAnimList[this._currWalkAnimIndex].pause(!this.walking);
        //what anim should I be playing?
        var move_dir = new Vec2(0, 0);
        if (gInputEngine.state('move-up'))
          this._currWalkAnimIndex = 0;
        else if (gInputEngine.state('move-down'))
          this._currWalkAnimIndex = 2;
        if (gInputEngine.state('move-left'))
          this._currWalkAnimIndex = 1;
        else if (gInputEngine.state('move-right'))
           this._currWalkAnimIndex = 3;
   
    },
    //-----------------------------------------
    on_stats: function (msg) {
        this.parent(msg);

        //note, we detect this before the parent fucntion gets a chance to modify us.
        if(this.health<=0 && !this.isDead)
        {
                //spawn player death explosion!
                var interpolatedPosition = {x:this.pos.x, y:this.pos.y};

   
                var dPX = gRenderEngine.getScreenPosition(interpolatedPosition).x;
                var dPY = gRenderEngine.getScreenPosition(interpolatedPosition).y;
        
                var efct = gGameEngine.spawnEntity("InstancedEffect", this.pos.x, this.pos.y, null);
                efct.onInit({x:this.pos.x,y:this.pos.y},
                                {       playOnce:true, 
                                        similarName:"landmine_explosion_large_", 
                                        uriToSound:"./sound/explode0.ogg"
                                });
                                
                if(this == gGameEngine.gPlayer0)
                        show_respawn();
        }
                
    },
    //-----------------------------------------
    draw: function (fractionOfNextPhysicsUpdate) {
  
        if(this.isDead) return;
        
        var ctx = gRenderEngine.context;
        
        var interpolatedPosition = {x:this.pos.x, y:this.pos.y};
        
        if(this.pInput) {
            // JJG: input is in  units/sec so we convert to units/update and multiply by the fraction of an update
            interpolatedPosition.x += (this.pInput.x * Constants.PHYSICS_LOOP_HZ) * fractionOfNextPhysicsUpdate;
            interpolatedPosition.y += (this.pInput.y * Constants.PHYSICS_LOOP_HZ) * fractionOfNextPhysicsUpdate;
        }
        
        drawSprite("male_walk_down_00", gGameEngine.gPlayer0.pos.x , gGameEngine.gPlayer0.pos.y);
        
    },
  
    //--------------------------------------
    _drawPlayerAvatar: function(ctx,settings)
    {
                var spt = settings.player._walkSpriteAnimList[settings.player._currWalkAnimIndex].getCurrentFrameStats();
                {
                  var dPX = settings.locX ,dPY = settings.locY ;
                  //var sptidx = 0;
                  if (settings.player.walking == true) sptidx = settings.player.legWalkFrameIdx;
                  

                  var rotRadians = 0;//settings.player.legRotation * (Math.PI / 180.0);
                  ctx.translate(dPX, dPY);
                  ctx.rotate(rotRadians);
                //  ctx.translate(-(spt.w / 2.0), -(spt.h / 2.0));

                  settings.player._walkSpriteAnimList[settings.player._currWalkAnimIndex].draw(0,0,{ctx: ctx,noMapTrans:true});
                 
                 //draw our color mask
                        var sptleg = this._legSpriteMaskAnimList[this._currWalkAnimIndex].getCurrentFrameStats();
                        ctx.drawImage( gGameEngine.colorTintCanvas2, -(sptleg.w / 2.0),-(sptleg.h / 2.0));
                        
                  ctx.rotate(-rotRadians);
                  ctx.translate(-dPX, -dPY);
                }
                
                //DRAW THE TOP
                //determine the proper rotation for the top
                {

                  var rotRadians = -1.0 * Math.PI + settings.player.faceAngleRadians; // Initial sprite position faces up, rotate 1/4 turn clockwise first.
                  ctx.translate(dPX, dPY);
                  ctx.rotate(rotRadians);


                drawSprite("turret.png", 0, 0, {ctx:ctx,noMapTrans:true});
                
                  //draw any weapons we have.
                  for (var i = 0; i < settings.player.weapons.length; i++)
                        if (settings.player.weapons[i] != null) settings.player.weapons[i].onDraw(this);

                  ctx.rotate(-rotRadians);
                  ctx.translate(-dPX, -dPY);

                }
                
        },

});

Factory.nameClassMap["Player"] = ClientPlayerClass;