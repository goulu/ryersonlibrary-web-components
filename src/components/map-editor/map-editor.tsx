import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { MapMarker } from '../../classes/map-marker';
import { MapPolygon } from '../../classes/map-polygon';
import { MapElementData } from '../../interface';
import { Coordinate } from '../../utils/coordinate';
import {
  coordinateFromEvent,
  encodeCoordinates,
} from '../../utils/helpers';
import {
  DEFAULT_MAX_SCALE,
  DEFAULT_MIN_SCALE,
  HYSTERESIS,
  STATES,
  computeLimits,
  getTargetId,
  parseElements,
} from '../../utils/map-base';

@Component({
  tag: 'rl-map-editor',
  styleUrl: 'map-editor.scss',
})

export class RLMapEditor {
  /**
   * The array of MapElements currently being displayed.  Created from the
   * `elements` Prop with additional internal information added.
   */
  private processedElements: (MapMarker | MapPolygon)[] = [];

  // The element being targeted by user interaction.
  private targetElement: MapMarker | MapPolygon | undefined;

  // The control point being targeted by user interaction.
  private targetControl: number | undefined;

  // The full size of the image being displayed by the map.
  private imgSize!: DOMRect;

  // The original scale factor used to size the SVG so it fits.
  private initialScale = 1;

  // The position of the most recent user interaction (mouse/touch-move).
  private last: Coordinate | undefined;

  // The bounds used to restrict how far the SVG can be dragged.
  private limits: DOMRect | undefined;

  // Timer reference used to debounce multiple resize events.
  private resizeDebounce: any;

  // The initial position of a user interaction (mousedown/touchstart).
  private start: Coordinate | undefined;

  // The current state of the Map.
  private state = STATES.NORMAL;

  // The current size of the SVG element used to display the map.
  private svgSize!: DOMRect;

  // Reference to the root node (`rula-map`).
  @Element() root!: HTMLStencilElement;

  /**
   * The currently active element.
   */
  @State() activeElement: MapMarker | MapPolygon | undefined;

  /**
   * The factor by which the Map contents are changed to fit within the SVG.
   */
  @State() svgScale = 1;

  /**
   * The x,y translation applied to move the map contents within the bounds of
   * the SVG.
   */
  @State() svgTransform = new Coordinate(0, 0);

  /**
   * An array of the elements that will be displayed on the Map.
   */
  @Prop({ mutable: true }) elements?: MapElementData[];

  /**
   * The image being displayed as the base of the map.
   */
  @Prop() mapImage?: string;
  @Watch('mapImage')
  onMapImageChanged() {
    if (this.mapImage === undefined) {
      return;
    }

    const img = new Image();
    img.src = this.mapImage;
    img.onload = () => {
      if (this.imgSize &&
        this.imgSize.width === img.width &&
        this.imgSize.height === img.height) {
          return;
      }

      this.imgSize = new DOMRect(0, 0, img.width, img.height);
      this.computeSvgSize();
      this.computeScale();
      this.updateLimits();
    };
  }

  /**
   *  The maximum scale factor.
   */
  @Prop() maxScale: number = DEFAULT_MAX_SCALE;

  /**
   * The minimum scale factor.
   */
  @Prop() minScale: number = DEFAULT_MIN_SCALE;

  /**
   * An even fired when the user selects a `MapElement`. The clicked element's
   * `id` will be passed in the event details.
   */
  @Event() elementSelected!: EventEmitter<MapElementData>;
  /**
   * An event fired when a `MapElement` is updated (moved or changes shape).
   * The event details contains the `MapElement` that was moved.
   */
  @Event() elementUpdated!: EventEmitter<MapElementData>;

  /**
   * An event fired when a new `MapElement` is created. The event details
   * contains the `MapElement` that was created.
   */
  @Event() elementCreated!: EventEmitter<MapElementData>;

  /**
   * An event fired when the user deselects a `MapElement`.
   */
  @Event() elementDeselected!: EventEmitter<undefined>;

  /**
   * An event fired when one of the `MapElements` on this map is deleted.
   */
  @Event() elementDeleted!: EventEmitter<MapElementData>;

  /**
   * An event fired when one of the `MapElement`s on the map is double clicked.
   */
  @Event() elementDoubleClicked!: EventEmitter<MapElementData>;

  /**
   * Handle when the list of specified elements changes. The event details
   * contains the `MapElement` that was deleted.
   */
  @Watch('elements')
  onElementsChanged() {
    if (this.elements !== undefined) {
      this.processedElements = parseElements(this.elements, this.svgScale);
    }
  }

  componentDidLoad() {
    this.onMapImageChanged();
    this.onElementsChanged();
  }

  /**
   * Handles when the user triggers a touch/down event to start interaction with
   * the map.
   * @param e The triggering event.
   */
  @Listen('mousedown')
  @Listen('touchstart')
  onGestureDown(e: Event) {
    this.start = this.last = coordinateFromEvent(e, this.root);

    if (this.state === STATES.NORMAL) {
      this.state = STATES.GESTURE_DOWN;
    }

    if (this.state === STATES.ADD_REGION_INIT) {
      if (this.activeElement && this.activeElement instanceof MapPolygon) {
        this.activeElement.addPoint(this.toSvgSpace(this.start));
        this.root.forceUpdate();
      }
      this.state = STATES.ADD_REGION_FIRST;
    } else if (this.state !== STATES.ADD_POINT) {
      // Get the ID of the event target, if it is the correct type.
      const id = getTargetId(e.target);
      if (id !== undefined) {
        this.targetElement = this.processedElements.find(i => i.id === id);
      }

      if (e.target && e.target instanceof SVGCircleElement) {
        if (e.target.classList.contains('rl-map-control') ||
            e.target.classList.contains('rl-map-midpoint')) {
          this.targetControl = Number(e.target.getAttribute('index'));
        }
      }
    }
  }

  /**
   * Handles when the user triggers a movement event.
   * @param e The triggering event.
   */
  @Listen('mousemove')
  @Listen('touchmove')
  onGestureMove(e: Event) {
    if (this.state === STATES.NORMAL || this.state === STATES.ADD_REGION_INIT) {
      return;
    }

    // Convert the coordinate to SVG coordinate space.
    const point = coordinateFromEvent(e, this.root);
    const delta = Coordinate.difference(point, this.last);
    let dist = 0;

    if (this.start) {
      switch (this.state) {
        case STATES.GESTURE_DOWN:
          if (this.targetControl !== undefined || this.activeElement && this.targetElement === this.activeElement) {
            dist = Coordinate.squareDistance(this.start, point);
            if (dist > HYSTERESIS) {
              this.state = STATES.DRAGGING;
            }
            break;
          }
        case STATES.DRAGGING:
          if (this.targetControl !== undefined && this.activeElement !== undefined && this.activeElement instanceof MapPolygon) {
            if (this.targetControl % 2 === 1) {
              // If the target control is a midpoint, Add it to the array of
              // controls.
              const i = Math.floor(this.targetControl / 2) + 1;

              this.activeElement.addPoint(
                Coordinate.difference(
                  this.toSvgSpace(point),
                  this.toSvgSpace(this.svgTransform)
                ),
                i
              );

              // Update the targetControl to be the index of the new control.
              this.targetControl = i * 2;
            } else {
              this.activeElement.movePoint(
                this.toSvgScale(delta),
                this.targetControl / 2
              );
              this.root.forceUpdate();
            }
          } else if (this.targetElement && this.activeElement &&
              this.activeElement.id === this.targetElement.id) {
            this.targetElement.move(this.toSvgScale(delta));
            this.root.forceUpdate();
          } else {
            // Move the canvas otherwise.
            this.state = STATES.DRAGGING;
            this.svgTransform = Coordinate.sum(this.svgTransform, delta).limit(this.limits).round();
          }
          break;
        case STATES.ADD_REGION_FIRST:
          dist = Coordinate.squareDistance(this.start, point);
          if (this.activeElement && this.activeElement instanceof MapPolygon && dist > HYSTERESIS) {
            this.state = STATES.ADD_REGION;
            this.activeElement.addPoint(this.toSvgSpace(point));
            this.root.forceUpdate();
          }
          break;
        case STATES.ADD_REGION:
          if (this.activeElement && this.activeElement instanceof MapPolygon) {
            const idx = this.activeElement.points.length - 1;
            this.activeElement.movePoint(this.toSvgScale(delta), idx);
            this.root.forceUpdate();
          }
          break;
        default:
      }
    }

    this.last = point;
  }

  /**
   * Handles when the user ends their interaction with the Map.
   * @param e The triggering event.
   */
  @Listen('mouseup')
  @Listen('touchend')
  onGestureUp(e: Event) {
      // Convert the coordinate to SVG coordinate space.
      const point = coordinateFromEvent(e, this.root);

      switch (this.state) {
        case STATES.GESTURE_DOWN:
          if (this.targetElement) {
            if (this.targetElement !== this.activeElement) {
              this._setActiveElement(this.targetElement);
            }
          } else {
            this._clearActiveElement();
            this.elementDeselected.emit();
          }
          this.state = STATES.NORMAL;
          break;
        case STATES.DRAGGING:
          const delta = Coordinate.difference(point, this.last);
          if (this.activeElement && this.activeElement instanceof MapPolygon && this.targetControl !== undefined) {
            this.activeElement.movePoint(
              this.toSvgScale(delta),
              this.targetControl / 2
            );
            this.elementUpdated.emit(
                this.mapElementFromParsedElement(this.activeElement));
          } else if (this.targetElement && this.activeElement &&
              this.activeElement.id === this.targetElement.id) {
            // Move the targeted element, if there is one.
            this.activeElement.move(this.toSvgScale(delta));

            this.elementUpdated.emit(
                this.mapElementFromParsedElement(this.activeElement));
          } else {
            // Move the canvas otherwise.
            this.svgTransform = Coordinate.sum(this.svgTransform, delta).limit(this.limits).round();
          }
          this.state = STATES.NORMAL;
          break;
        case STATES.ADD_REGION_FIRST:
          if (this.activeElement && this.activeElement instanceof MapPolygon) {
            this.activeElement.addPoint(this.toSvgSpace(point));
          }
          // this.activeControls = [...this.activeControls, this.toSvgSpace(point)];
          this.state = STATES.ADD_REGION;
          break;
        case STATES.ADD_REGION:
          if (this.activeElement && this.activeElement instanceof MapPolygon) {
            if (this.targetControl === 0) {
              // Remove the last point, it was used as a placeholder for drawing
              // a line to the cursor.
              this.activeElement.removePoint();
              this.state = STATES.NORMAL;
              this.root.forceUpdate();
              this.elementCreated.emit(
                  this.mapElementFromParsedElement(this.activeElement)
              );
            } else {
              // Add a new point to the active controls array.
              this.activeElement.addPoint(this.toSvgSpace(point));
            }
          }
          break;
        case STATES.ADD_POINT:
          if (this.activeElement && this.activeElement instanceof MapMarker && this.root) {
            this.activeElement.position = this.toSvgSpace(point);
            this.state = STATES.NORMAL;
            this.root.forceUpdate();
            this.elementCreated.emit(
              this.mapElementFromParsedElement(this.activeElement)
            );
          }
        default:
      }

      this.targetControl = undefined;
      this.targetElement = undefined;
    // }
  }

  /**
   * Handles when the user leaves the bounds of the Map entirely.
   * @param e The triggering event.
   */
  @Listen('mouseleave')
  onMouseLeave(e: Event) {
    if (this.state === STATES.DRAGGING ||
        this.state === STATES.GESTURE_DOWN) {
      this.state = STATES.NORMAL;
      const point = coordinateFromEvent(e, this.root);

      if (this.state === STATES.DRAGGING && this.activeElement) {
        const delta = Coordinate.difference(point, this.last);
        if (this.activeElement && this.activeElement instanceof MapPolygon && this.targetControl !== undefined) {
          this.activeElement.movePoint(
            this.toSvgScale(delta),
            this.targetControl
          );

          this.elementUpdated.emit(
              this.mapElementFromParsedElement(this.activeElement));
        } else if (this.targetElement && this.activeElement &&
            this.activeElement.id === this.targetElement.id) {
          // Move the targeted element, if there is one.
          this.activeElement.move(this.toSvgScale(delta));

          this.elementUpdated.emit(
              this.mapElementFromParsedElement(this.activeElement));
        } else {
          // Move the canvas otherwise.
          this.svgTransform = Coordinate.sum(this.svgTransform, delta).limit(this.limits).round();
        }
        this.state = STATES.NORMAL;
      }
    }
  }

  @Listen('dblclick')
  onDoubleClick(e: Event) {
    if (this.state === STATES.NORMAL) {
      const id = getTargetId(e.target);
      if (id !== undefined && this.elements !== undefined) {
        this.elementDoubleClicked.emit(this.elements[id]);
      }
    }
  }

  /**
   * Handles when the window is resized.
   */
  @Listen('window:resize')
  onResize() {
    clearTimeout(this.resizeDebounce);
    this.resizeDebounce = setTimeout(_ => {
      // Use a 150ms delay to debounce multiple resize calls and effectively
      // perform the resize action only when the user is 'done' resizing.
      this.computeSvgSize();
      this.computeScale();
      this.updateLimits();
      this.svgTransform = this.svgTransform.clone().limit(this.limits);
    }, 150);
  }

  /**
   * Handles when the user performs a mouse wheen event.  The Map will be zoomed
   * in or out depending on the direction of the wheel.
   *
   * @param e The triggering event.
   */
  @Listen('wheel')
  onWheel(e: WheelEvent) {
    const oldPos = this.toSvgSpace(new Coordinate(e.clientX, e.clientY));

    if (e.deltaY < 0) {
      if (this.svgScale * 1.05263157895 < this.initialScale * this.maxScale) {
        this.svgScale *= 1.05263157895;
      }
    } else {
      if (this.svgScale * 0.95 > this.initialScale * this.minScale) {
        this.svgScale *= 0.95;
      }
    }

    this.updateLimits();
    this.processedElements.forEach(el => el.scale = this.svgScale);
    const newPos = this.toSvgSpace(new Coordinate(e.clientX, e.clientY));
    const delta = Coordinate.difference(newPos, oldPos).scale(this.svgScale);
    this.svgTransform.translate(delta).limit(this.limits).round();
  }

  /**
   * Handle when the user pressses the Enter key.
   * @param e The triggering event
   */
  @Listen('keydown')
  onEnter(e: KeyboardEvent) {
    if (e.key === 'enter' && e.target && e.target instanceof SVGElement &&
      e.target.classList.contains('rl-map-element')) {
      const id = Number(e.target.id);
      const el = this.processedElements.find(i => i.id === id);
      this._setActiveElement(el);
    }
  }

  /**
   * Add a new `MapRegion` to the map. Calling this method starts the process.
   * The user must then click numerous times on the map to add points.  Only
   * when clicking again on the original point is the region added.
   */
  @Method()
  addRegion() {
    this._clearActiveElement();
    this.state = STATES.ADD_REGION_INIT;
    this.activeElement = new MapPolygon();
    this.activeElement.open = true;
    this.activeElement.scale = this.svgScale;
    this.processedElements = [...this.processedElements, this.activeElement];
  }

  /**
   * Add a new `MapPoint` element to the map.  Calling this method starts the
   * process.  The user must then click somewhere on the map to add the point.
   */
  @Method()
  addPoint() {
    this._clearActiveElement();
    this.state = STATES.ADD_POINT;
    this.activeElement = new MapMarker();
    this.processedElements = [...this.processedElements, this.activeElement];
  }

  /**
   * Cancels the current action and returns the map to its default state, ready
   * for futher action.
   */
  @Method()
  cancelAction() {
    this._clearActiveElement();
    this.state = STATES.NORMAL;
  }

  /**
   * Removes the currently active element.  If no element is selected when
   * this method is called, it has no effect.
   */
  @Method()
  deleteRegion() {
    if (this.elements !== undefined && this.state === STATES.NORMAL &&
        this.activeElement) {
      this.elementDeleted.emit(this.elements[this.activeElement.id]);
      this._clearActiveElement();
    }
  }

  /**
   * Sets the element with the specified ID to active.
   *
   * @param id The ID of the element to set as active.
   */
  @Method()
  setActiveElement(id: number) {
    if (this.processedElements.length > 0) {
      this._setActiveElement(this.processedElements.find(i => i.id === id));
    }
  }

  private mapElementFromParsedElement(el: MapMarker | MapPolygon): MapElementData | undefined {
    if (this.elements === undefined) {
      return undefined;
    }

    const originalEl = this.elements[el.id] || {
      altText: '',
      description: '',
      details: undefined,
      floorId: 0,
      iconPath: [],
      enabled: true,
    };
    return {
      altText: originalEl.altText,
      description: originalEl.description,
      details: originalEl.details,
      enabled: originalEl.enabled,
      floorId: originalEl.floorId,
      id: el.id,
      icon: originalEl.icon,
      symbol: originalEl.symbol,
      name: el.name,
      points: el instanceof MapPolygon ? encodeCoordinates(el.points) : encodeCoordinates(el.position),
    };
  }

  /**
   * Clears the currently active element.
   */
  private _clearActiveElement() {
    if (this.activeElement) {
      this.activeElement.active = false;
    }
    this.activeElement = undefined;
  }

  /**
   * Updates the limits used to restrict the how far the SVG transform can be
   * moved keeping the map from being panning beyond the edge of the image.
   */
  private updateLimits() {
    this.limits = computeLimits(this.imgSize, this.svgSize, this.svgScale);
  }

  /**
   * Computes the scale factor needed to resize the full map image to be as
   * large as possible, and cropping it vertically/horizontally so no empty
   * space exists if the container has different aspect from the image. This is
   * like CSS `background-size: cover` or SVG `aspectRatio xMidYMid slice`.
   */
  private computeScale() {
    const img = this.imgSize;
    const svg = this.svgSize;

    // if (img) {
    this.svgScale = this.initialScale =
        Math.max(svg.width / img.width, svg.height / img.height);
    // } else {
    //   this.svgScale = this.initialScale = 1;
    // }

    this.processedElements.forEach(el => el.scale = this.svgScale);
  }

  protected computeSvgSize() {
    const svg = this.root.querySelector('svg');

    if (svg) {
      const rect = svg.getBoundingClientRect();
      this.svgSize = new DOMRect(0, 0, rect.width, rect.height);
    }
  }

  /**
   * Sets the currently active element of the Map.
   *
   * @param el The Element that will be set as the active element.
   */
  private _setActiveElement(el?: MapMarker | MapPolygon) {
    if (!el) {
      this._clearActiveElement();
      this.elementDeselected.emit();
      return;
    }

    this._clearActiveElement();
    this.activeElement = el;
    this.activeElement.active = true;

    if (this.elements !== undefined) {
      this.elementSelected.emit(this.elements[this.activeElement.id]);
    }
  }

  /**
   * Scales a given `Coordinate` by the inverse of the current `svgScale`.
   * Returns a new `Coordinate` with its values scaled and rounded.
   * @param c A `Coordinate` scale.
   */
  private toSvgScale(c: Coordinate) {
    return c.clone().scale(1 / this.svgScale).round();
  }

  /**
   * Converts a given `Coordinate` object in screen coordinate space to SVG
   * coordinate space.
   * @param c A `Coordinate` to convert to SVG coordinate space.
   */
  private toSvgSpace(c: Coordinate) {
    return Coordinate.difference(this.toSvgScale(c), this.toSvgScale(this.svgTransform));
  }

  hostData() {
    return {
      class: {
        'rl-map': true,
        'rl-map-editor': true,
      },
    };
  }

  render() {
    const m = [
      this.svgScale, 0, 0, this.svgScale,
      this.svgTransform.x,
      this.svgTransform.y,
    ];
    const matrix = 'matrix(' + m.join(',') + ')';

    return (
      <svg class="rl-map__svg">
        <g class="rl-map__transform" transform={matrix}>
          <g class="rl-map__image-wrapper">
            <image
              class="rl-map__image"
              xlinkHref={this.mapImage !== undefined ? this.mapImage : undefined}
            >
            </image>
          </g>
          <g class="rl-map__elements">
            {this.processedElements.map(el => el.render())}
          </g>
          {this.activeElement && this.activeElement instanceof MapPolygon && this.activeElement.renderControls()}
        </g>
      </svg>
    );
  }
}
