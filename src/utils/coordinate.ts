/**
 * Class for representing coordinates and positions.
 * Adapted from Google Closure Library.
 */
export class Coordinate {
  /**
   * The X-value
   */
  x = 0;

  /**
   * The Y-value
   */
  y = 0;

  /**
   * Create a new Coordinate.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns a new copy of the coordinate.
   */
  clone() {
    return new Coordinate(this.x, this.y);
  }

  /**
   * Returns a nice string representation the coordinate.
   */
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

  /**
   * Returns a basic string representation of the Coordinate used to easily
   * create SVG path strings.
   */
  toPathString() {
    return this.x + ' ' + this.y;
  }

  /**
   * Returns whether the specified value is equal to this coordinate.
   * @param other Some other value.
   */
  equals(other: Coordinate): boolean {
    return other instanceof Coordinate && Coordinate.equals(this, other);
  }

  /**
   * Rounds the x and y fields to the next larger integer values.
   */
  ceil(): Coordinate {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  /**
   * Rounds the x and y fields to the next smaller integer values.
   */
  floor(): Coordinate {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  /**
   * Translates this coordinate by the given offsets. If a `Coordinate`
   * is given, then the x and y values are translated by the coordinate's x
   * and y. Otherwise, x and y are translated by `tx` and `ty` respectively.
   *
   * @param tx The value to translate x by or the
   *     the coordinate to translate this coordinate by.
   * @param ty The value to translate y by.
   */
  translate(tx: number | Coordinate, ty?: number): Coordinate {
    if (tx instanceof Coordinate) {
      this.x += tx.x;
      this.y += tx.y;
    } else {
      this.x += Number(tx);
      if (typeof ty === 'number') {
        this.y += ty;
      }
    }
    return this;
  }

  /**
   * Scales this coordinate by the given scale factors. The x and y values are
   * scaled by `sx` and `sy` respectively.  If `sy` is not given, then `sx` is
   * used for both x and y.
   *
   * @param sx The scale factor to use for the x dimension.
   * @param opt_sy The scale factor to use for the y dimension.
   */
  scale(sx: number, sy?: number): Coordinate {
    sy = typeof sy === 'number' ? sy : sx;
    this.x *= sx;
    this.y *= sy;
    return this;
  }

  /**
   * Rotates this coordinate clockwise about the origin (or, optionally, the
   * given center) by the given angle, in radians.
   *
   * @param radians The angle by which to rotate this coordinate
   *     clockwise about the given center, in radians.
   * @param center The center of rotation. Defaults
   *     to (0, 0) if not given.
   */
  rotateRadians(radians: number, center?: Coordinate) {
    center = center || new Coordinate(0, 0);

    const x = this.x;
    const y = this.y;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    this.x = (x - center.x) * cos - (y - center.y) * sin + center.x;
    this.y = (x - center.x) * sin + (y - center.y) * cos + center.y;
    return this;
  }

  /**
   * Rotates this coordinate clockwise about the origin (or, optionally, the
   * given center) by the given angle, in degrees.
   *
   * @param degrees The angle by which to rotate this coordinate
   *     clockwise about the given center, in degrees.
   * @param opt_center The center of rotation. Defaults
   *     to (0, 0) if not given.
   */
  rotateDegrees(degrees: number, center?: Coordinate) {
    return this.rotateRadians(degrees * Math.PI / 180, center);
  }

  /**
   * Restricts each parameter of the Coordinate such that
   * `left <= x <= left + width` and `top <= y <= top + height`.
   *
   * @param limits A rectangle to restrict the Coordinate to.
   */
  limit(limits: DOMRect) {
    // Limit in the x direction.
    const left = !isNaN(limits.left) ? limits.left : undefined;
    const width = !isNaN(limits.width) ? limits.width : 0;
    const maxX = left !== undefined ? left + width : Infinity;
    const minX = left !== undefined ? left : -Infinity;
    this.x = Math.min(maxX, Math.max(minX, this.x));

    // Limit in the y direction.
    const top = !isNaN(limits.top) ? limits.top : undefined;
    const height = !isNaN(limits.height) ? limits.height : 0;
    const maxY = top !== undefined ? top + height : Infinity;
    const minY = top !== undefined ? top : -Infinity;
    this.y = Math.min(maxY, Math.max(minY, this.y));
    return this;
  }

  /**
   * Round the values of the `Coordinate` to a given precision (number of
   * decimals).  Defaults to a precision of 0, or rounding to the nearest
   * integer.
   *
   * @param precision The number of decimals to round to
   */
  round(precision = 0) {
    const factor = Math.pow(10, precision);
    this.x = Math.round(this.x * factor) / factor;
    this.y = Math.round(this.y * factor) / factor;
    return this;
  }

  /**
   * Compares two `Coordinate`s for equlaity.
   * @param a The first `Coordinate`.
   * @param b The second `Coordinate`.
   */
  static equals(a: Coordinate, b: Coordinate) {
    if (a === b) {
      return true;
    }

    return a.x === b.x && a.y === b.y;
  }

  /**
   * Returns the distance between two `Coordinate`s.
   * @param a The first `Coordinate`.
   * @param b The second `Coordinate`.
   */
  static distance(a: Coordinate, b: Coordinate) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Returns the magnitude (distance from origin) of a `Coordinate`.
   * @param a The first `Coordinate`.
   */
  static magnitude(a: Coordinate) {
    return Math.sqrt(a.x * a.x + a.y * a.y);
  }

  /**
   * Returns the squared distance between two `Coordinate`s. Squared distances
   * can be used for comparisons when the actual value is not required.
   *
   * Performance note: eliminating the square root is an optimization often used
   * in lower-level languages, but the speed difference is not nearly as
   * pronounced in JavaScript (only a few percent.)
   *
   * @param a The first `Coordinate`.
   * @param b The second `Coordinate`.
   */
  static squareDistance(a: Coordinate, b: Coordinate) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  /**
   * Returns the difference between two `Coordinate`s.
   * @param a The first `Coordinate`.
   * @param b The second `Coordinate`.
   */
  static difference(a: Coordinate, b?: Coordinate) {
    if (!b) {
      return new Coordinate(0, 0);
    }
    return new Coordinate(a.x - b.x, a.y - b.y);
  }

  /**
   * Returns the sum of two coordinates as a new `Coordinate`.
   * @param a The first `Coordinate`.
   * @param b The second `Coordinate`.
   */
  static sum(a: Coordinate, b: Coordinate) {
    return new Coordinate(a.x + b.x, a.y + b.y);
  }

  /**
   * Returns the midpoint of two coordinates as a new `Coordinate`.
   * @param a The first `Coordinate`.
   * @param b The second `Coordinate`.
   */
  static midpoint = (a: Coordinate, b: Coordinate) => {
    return new Coordinate((a.x + b.x) / 2, (a.y + b.y) / 2);
  }

  /**
   * Create a `Coordinate` from the top-left corner of a `DOMRect` or
   * `ClientRect` object.
   */
  static fromRectTopLeft = (rect: DOMRect | ClientRect) => {
    return new Coordinate(rect.left, rect.top);
  }

  /**
   * Create a `Coordinate` from a `MouseEvent` or `Touch` object (both having
   * the `x` and `y` values from `pageX` and `pageY` respectively).
   */
  static fromEvent = (evt: MouseEvent | Touch) => {
    return new Coordinate(evt.pageX, evt.pageY);
  }
}
