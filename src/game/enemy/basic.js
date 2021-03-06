'use strict';

const { BASIC_ENEMY_COLOR, ENEMY_STATS_WIDTH, ENEMY_STATS_HEIGHT } = require('../../util/constants');
const offset = require('../../util/offset');

module.exports = class Enemy {
   constructor(path, speed = 5, size = 50) {
      this.pathIndex = 1;
      this.path = path;
      this.x = this.lastPath.x;
      this.y = this.lastPath.y;
      this.radius = size / 2;
      this.speed = speed;
      this.color = BASIC_ENEMY_COLOR;
      this.accuracy = 5;
      this.calculateVelocity();
      this.health = 100;
      this.showStats = false;
      this.type = 'Basic';
   }
   lerp(start, end, time) {
      return start * (1 - time) + end * time;
   }
   findAngle() {
      return Math.atan2(this.currentPath.y - this.lastPath.y, this.currentPath.x - this.lastPath.x);
   }
   calculateVelocity() {
      this.angle = this.findAngle();
      this.xv = (this.speed * Math.cos(this.angle)) / this.accuracy;
      this.yv = (this.speed * Math.sin(this.angle)) / this.accuracy;
   }
   update() {
      for (let i = 0; i < this.accuracy; i++) {
         this.x += this.xv;
         this.y += this.yv;
         if (this.onPath) {
            this.pathIndex++;
            this.x = this.lastPath.x;
            this.y = this.lastPath.y;
            if (!this.currentPath) {
               this.pathIndex = 1;
               this.x = this.path[0].x;
               this.y = this.path[0].y;
               this.calculateVelocity();
               // this.dead = true; break;
            } else {
               this.calculateVelocity();
            }
         }
      }
   }
   get roundPos() {
      return { x: Math.round(this.x), y: Math.round(this.y) };
   }
   drawPlayer(ctx, fill, camera) {
      ctx.fillStyle = fill;
      ctx.beginPath();
      const pos = offset(this.x, this.y, camera);
      ctx.arc(pos.x, pos.y, this.radius * camera.scale, 0, Math.PI * 2);
      ctx.fill();
   }
   showEnemyStats(ctx, camera) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = this.color;
      const pos = offset(this.x, this.y, camera);
      ctx.fillRect(pos.x - ENEMY_STATS_WIDTH / 2, pos.y, ENEMY_STATS_WIDTH, ENEMY_STATS_HEIGHT);
      ctx.fillStyle = 'white';
      ctx.fillRect(pos.x - ENEMY_STATS_WIDTH / 2, pos.y, ENEMY_STATS_WIDTH, ENEMY_STATS_HEIGHT);
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'black';
      ctx.font = `${28 * camera.scale}px sans-serif`;
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(this.health)}`, pos.x, pos.y);
      ctx.fillStyle = 'black';
      ctx.fillText(`type: ${this.type}`, pos.x, Math.round(pos.y + ENEMY_STATS_HEIGHT / 3));
      ctx.fillText(
         `speed: ${Math.round(this.speed * 4)}`,
         pos.x,
         Math.round(pos.y + ENEMY_STATS_HEIGHT - ENEMY_STATS_HEIGHT / 3)
      );
   }
   render(ctx, camera) {
      this.drawPlayer(ctx, this.color, camera);
   }
   get lastPath() {
      return this.path[this.pathIndex - 1];
   }
   get onPath() {
      return Math.abs(this.currentPath.x - this.roundPos.x) < 2 && Math.abs(this.currentPath.y - this.roundPos.y) < 2;
   }
   get nextPath() {
      return this.path[this.pathIndex + 1];
   }
   get currentPath() {
      return this.path[this.pathIndex];
   }
};
