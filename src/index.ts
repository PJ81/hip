import Board from "./board.js";
import { SCALE, SIZE } from "./consts.js";

class GetHome {

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lastTime: number;
  board: Board;
  loop: (time?: number) => void;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener("click", (me) => this.click(me));
    this.canvas.addEventListener("mousemove", (me) => this.move(me));
    this.canvas.id = "main";
    this.canvas.style.imageRendering = "pixelated";
    this.canvas.width = SIZE * SCALE;
    this.canvas.height = SIZE * SCALE;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(SCALE, SCALE);
    this.ctx.imageSmoothingEnabled = false;
    /*this.ctx.font = `${TILE * .75}px Consolas`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle"*/

    document.body.appendChild(this.canvas);

    this.lastTime = 0;
    this.board = new Board(this.ctx);

    this.loop = (time = 0) => {
      this.update(Math.min((time - this.lastTime) / 1000, .25));
      this.ctx.clearRect(0, 0, SIZE, SIZE);
      this.draw();
      this.lastTime = time;
      requestAnimationFrame(this.loop);
    }

    this.loop();
  }

  move(ev: MouseEvent): void {
    ev.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left, y = ev.clientY - rect.top;
    this.board.move(x, y);
  }

  click(ev: MouseEvent): void {
    ev.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left, y = ev.clientY - rect.top;
    this.board.click(x, y);
  }

  update(dt: number): void {
    this.board.update(dt);
  }

  draw(): void {
    this.board.draw();
  }

}

const gh = new GetHome();