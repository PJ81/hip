import Point from "./point.js";

export default class Square {

  lt: Point;
  rt: Point;
  lb: Point;
  rb: Point;

  constructor() {
    this.lt = new Point();
    this.rt = new Point();
    this.lb = new Point();
    this.rb = new Point();
  }

  set(a: Point, b: Point, c: Point, d: Point): void {
    this.lt.setPt(a);
    this.rt.setPt(b);
    this.lb.setPt(c);
    this.rb.setPt(d);
  }

  equals(s: Square): boolean {
    return s.lt.equals(this.lt) && s.lb.equals(this.lb) && s.rt.equals(this.rt) && s.rb.equals(this.rb);
  }

  hasPoint(pt: Point): boolean {
    return pt.equals(this.lt) || pt.equals(this.lb) || pt.equals(this.rt) || pt.equals(this.rb);
  }

  toString(): string {
    return `[lt: ${this.lt.x}, ${this.lt.y}]
      [rt: ${this.rt.x}, ${this.rt.y}]
      [lb: ${this.lb.x}, ${this.lb.y}]
      [rb: ${this.rb.x}, ${this.rb.y}]`;
  }
}