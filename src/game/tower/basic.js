'use strict';

const {
   TOWER_SIZE,
   TOWER_BARREL_WIDTH,
   TOWER_BARREL_HEIGHT,
   TOWER_ROTATE_SPEED,
   BASIC_TOWER_COLOR,
   BASIC_TOWER_FOV,
} = require('../../util/constants');
const offset = require('../../util/offset');

function degToRad(deg) {
   return (deg * Math.PI) / 180;
}
function radToDeg(rad) {
   return (rad * 180) / Math.PI;
}
module.exports = class Tower {
   constructor(x, y) {
      this.x = x;
      this.y = y;
      this.angle = Math.round(Math.random() * 360);
      this.rotateSpeed = TOWER_ROTATE_SPEED;
      this.radius = TOWER_SIZE / 2;
      this.color = BASIC_TOWER_COLOR;
      this.fov = BASIC_TOWER_FOV;
   }
   update() {
      this.angle += this.rotateSpeed;
      this.angle = this.angle % 360;
   }
   simulate(state) {
      let distance = null;
      for (let i = 0; i < state.enemy.length; i++) {
         const enemy = state.enemy[i];
         const distX = enemy.x - this.x;
         const distY = enemy.y - this.y;
         const dist = Math.sqrt(distX * distX + distY * distY);
         if (dist < this.fov / 2 + enemy.radius) {
            if (distance === null || distance.dist > dist) {
               distance = { dist, index: i };
            }
         }
      }
      if (distance != null) {
         this.angle +=
            (radToDeg(Math.atan2(state.enemy[distance.index].y - this.y, state.enemy[distance.index].x - this.x)) -
               this.angle) *
            1;
         this.angle = this.angle % 360;
      }
   }
   render(ctx, camera) {
      const pos = offset(this.x, this.y, camera);
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(degToRad(this.angle));
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * camera.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(0, -TOWER_BARREL_HEIGHT / 2, TOWER_BARREL_WIDTH, TOWER_BARREL_HEIGHT);
      ctx.restore();
   }
};
// add towers @param {x , y}
