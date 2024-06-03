import { COM, COUNT, HUM, SIZE, choose, random } from "./consts.js";
import Dot from "./dot.js";
import Point from "./point.js";
import Square from "./square.js";

export default class Board {

  ctx: CanvasRenderingContext2D;
  board: Dot[][];
  loser: Dot[];
  squares: Square[];
  player: number;
  go: boolean;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.loser = null;
    this.player = choose([HUM, COM]);
    this.go = false;

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle"
    this.ctx.font = `${SIZE / 7}px Consolas`;

    this.createBoard();
    if (this.player === COM) this.computerMove();
  }

  createBoard(): void {
    this.board = [];
    for (let y = 0; y < COUNT; y++) {
      this.board.push([]);
      for (let x = 0; x < COUNT; x++) {
        this.board[y].push(new Dot(x, y));
      }
    }

    this.createAllSquares();
  }

  createAllSquares(): void {
    this.squares = [];

    for (let i = 0; i < COUNT; i++) {
      for (let j = 0; j < COUNT; j++) {
        for (let k = 1; k < COUNT; k++) {
          for (let m = -4; m <= 4; m++) {
            const s = new Square();
            s.set(
              new Point(i, j),
              new Point(i + k, j + m),
              new Point(i - m, j + k),
              new Point(i + k - m, j + m + k)
            );

            if (this.isValid(s) && !this.squares.includes(s)) {
              this.squares.push(s);
            }
          }
        }
      }
    }
  }

  inBounds(pt: Point): boolean {
    return (pt.x >= 0 && pt.y >= 0 && pt.x < COUNT && pt.y < COUNT);
  }

  distance(a: Point, b: Point): number {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  isValid(s: Square): boolean {
    // Check if all points are within the grid bounds
    if (!this.inBounds(s.lt) || !this.inBounds(s.rt) || !this.inBounds(s.rb) || !this.inBounds(s.lb)) {
      return false;
    }

    // Check if all sides are of equal length
    const side1 = this.distance(s.lt, s.rt),
      side2 = this.distance(s.rt, s.rb),
      side3 = this.distance(s.rb, s.lb),
      side4 = this.distance(s.lb, s.lt);

    if (side1 != side2 || side2 != side3 || side3 != side4) {
      return false;
    }

    // Check if the diagonals intersect at right angles
    if (this.distance(s.lt, s.rb) != this.distance(s.rt, s.lb)) {
      return false;
    }

    return true;
  }

  move(x: number, y: number): void {
    if (this.go) return;

    const pt = new Point(x, y);

    for (let y = 0; y < COUNT; y++) {
      for (let x = 0; x < COUNT; x++) {
        const z = this.board[y][x];
        if (z.pos.dist(pt) < 10 && z.free) {
          z.activate("#03f");
        } else {
          z.active = false;
        }
      }
    }
  }

  click(x: number, y: number): void {
    if (this.go) return;

    const pt = new Point(x, y);
    const playerClr = this.player === HUM ? "#03f" : "#f30";

    for (let y = 0; y < COUNT; y++) {
      for (let x = 0; x < COUNT; x++) {
        const z = this.board[y][x];
        if (z.pos.dist(pt) < 10 && z.free) {
          z.take(playerClr);
          const a = this.checkForSquares(playerClr, z.tile);
          if (a !== null) {
            this.go = true;
            return;
          }
          this.player = COM;
          this.computerMove();
          return;
        }
      }
    }
  }

  checkForSquares(clr: string, pt: Point): Dot[] {
    const sqrs = this.squares.filter(x => x.hasPoint(pt));

    for (const s of sqrs) {
      const
        d1 = this.board[s.lb.y][s.lb.x],
        d2 = this.board[s.rb.y][s.rb.x],
        d3 = this.board[s.lt.y][s.lt.x],
        d4 = this.board[s.rt.y][s.rt.x];
      if (d1.color === clr && d2.color === clr && d3.color === clr && d4.color === clr) {
        this.loser = [d1, d2, d3, d4];
      }
    }
    return this.loser;
  }

  computerMove(): void {
    let cnt = 0;
    let z: Dot;

    while (true) {
      z = this.board[~~random(COUNT)][~~random(COUNT)];

      if (z.free) {
        z.take("#f30");
        if (this.checkForSquares("#f30", z.tile) === null) {
          break;
        } else {
          z.untake("#f30");
          this.loser = null;
        }
        if (++cnt > 1000) break;
      }
    }
    z.take("#f30");

    const a = this.checkForSquares("#f30", z.tile);
    if (a !== null) {
      this.go = true;
      return;
    }

    this.player = HUM;
  }

  update(dt: number): void {
    //
  }

  draw(): void {
    for (let y = 0; y < COUNT; y++) {
      for (let x = 0; x < COUNT; x++) {
        this.board[y][x].draw(this.ctx);
      }
    }

    if (this.go) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.loser[0].pos.x, this.loser[0].pos.y);
      this.ctx.lineTo(this.loser[1].pos.x, this.loser[1].pos.y);
      this.ctx.lineTo(this.loser[3].pos.x, this.loser[3].pos.y);
      this.ctx.lineTo(this.loser[2].pos.x, this.loser[2].pos.y);
      this.ctx.closePath();
      this.ctx.strokeStyle = this.loser[0].color;
      this.ctx.stroke();

      this.ctx.save();
      this.ctx.shadowOffsetX = this.ctx.shadowOffsetY = this.ctx.shadowBlur = SIZE / 100;
      this.ctx.shadowColor = "#000";
      this.ctx.save();
      this.ctx.fillStyle = "#fff";//this.loser[0].color;
      this.ctx.fillText("GAME OVER", SIZE >> 1, (SIZE >> 1) - SIZE / 7);
      this.ctx.fillText((this.player === HUM ? "BLUE LOSES" : "RED LOSES"), SIZE >> 1, SIZE >> 1);
      this.ctx.restore();

    }
    this.ctx.restore();
  }
}