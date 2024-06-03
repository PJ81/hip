import { BRD, TWO_PI } from "./consts.js";
import Point from "./point.js";

export default class Dot {

  pos: Point;
  tile: Point;
  active: boolean;
  free: boolean;
  color: string;
  activeClr: string;


  constructor(x: number, y: number) {
    this.tile = new Point(x, y);
    this.pos = new Point(BRD + this.tile.x * BRD + BRD * this.tile.x, BRD + this.tile.y * BRD + BRD * this.tile.y);
    this.active = false;
    this.free = true;
    this.color = "#aaa";
  }

  activate(clr: string): void {
    this.activeClr = clr;
    this.active = true;
  }

  take(clr: string): void {
    this.color = clr;
    this.free = false;
    this.active = false;
  }

  untake(clr: string): void {
    this.color = "#aaa";
    this.free = true;
    this.active = false;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();

    ctx.fillStyle = this.color;
    ctx.arc(this.pos.x, this.pos.y, this.free ? 5 : 8, 0, TWO_PI);
    ctx.fill();

    if (this.active) {
      ctx.beginPath();
      ctx.strokeStyle = this.activeClr;
      ctx.arc(this.pos.x, this.pos.y, 10, 0, TWO_PI);
      ctx.stroke();
    }
  }
}