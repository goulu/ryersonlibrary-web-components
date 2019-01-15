/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';


import {
  MapElement,
  MapElementMap,
} from './interface';
import {
  EventEmitter,
} from '@stencil/core';


export namespace Components {

  interface RlMapEditor {
    /**
    * Add a new `MapPoint` element to the map.  Calling this method starts the process.  The user must then click somewhere on the map to add the point.
    */
    'addPoint': () => void;
    /**
    * Add a new `MapRegion` to the map. Calling this method starts the process. The user must then click numerous times on the map to add points.  Only when clicking again on the original point is the region added.
    */
    'addRegion': () => void;
    /**
    * Cancels the current action and returns the map to its default state, ready for futher action.
    */
    'cancelAction': () => void;
    /**
    * Removes the currently active element.  If no element is selected when this method is called, it has no effect.
    */
    'deleteRegion': () => void;
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements': MapElement[];
    /**
    * The image being displayed as the base of the map.
    */
    'mapImage'?: string;
    /**
    * The maximum scale factor.
    */
    'maxScale': number;
    /**
    * The minimum scale factor.
    */
    'minScale': number;
    /**
    * Sets the element with the specified ID to active.
    */
    'setActiveElement': (id: number) => void;
  }
  interface RlMapEditorAttributes extends StencilHTMLAttributes {
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements': MapElement[];
    /**
    * The image being displayed as the base of the map.
    */
    'mapImage'?: string;
    /**
    * The maximum scale factor.
    */
    'maxScale'?: number;
    /**
    * The minimum scale factor.
    */
    'minScale'?: number;
    /**
    * An event fired when a new `MapElement` is created. The event details contains the `MapElement` that was created.
    */
    'onElementCreated'?: (event: CustomEvent<MapElement>) => void;
    /**
    * An event fired when one of the `MapElements` on this map is deleted.
    */
    'onElementDeleted'?: (event: CustomEvent<MapElement>) => void;
    /**
    * An event fired when the user deselects a `MapElement`.
    */
    'onElementDeselected'?: (event: CustomEvent<undefined>) => void;
    /**
    * An even fired when the user selects a `MapElement`. The clicked element's `id` will be passed in the event details.
    */
    'onElementSelected'?: (event: CustomEvent<MapElement>) => void;
    /**
    * An event fired when a `MapElement` is updated (moved or changes shape). The event details contains the `MapElement` that was moved.
    */
    'onElementUpdated'?: (event: CustomEvent<MapElement>) => void;
  }

  interface RlMap {
    /**
    * Clears the currently active element.
    */
    'clearActiveElement': () => void;
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements': MapElementMap;
    /**
    * An image that will be displayed on the Map.
    */
    'mapImage'?: string;
    /**
    * The maximum scale factor.
    */
    'maxScale': number;
    /**
    * The minimum scale factor.
    */
    'minScale': number;
    /**
    * Sets the element with the specified ID to active.
    */
    'setActiveElement': (id: number) => void;
  }
  interface RlMapAttributes extends StencilHTMLAttributes {
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements': MapElementMap;
    /**
    * An image that will be displayed on the Map.
    */
    'mapImage'?: string;
    /**
    * The maximum scale factor.
    */
    'maxScale'?: number;
    /**
    * The minimum scale factor.
    */
    'minScale'?: number;
    /**
    * An event fired when the user deselects the selected MapElement. The clicked element will be passed as the event parameter.
    */
    'onElementDeselected'?: (event: CustomEvent) => void;
    /**
    * An event fired when the user selects a MapElement. The clicked element will be passed as the event parameter.
    */
    'onElementSelected'?: (event: CustomEvent) => void;
    /**
    * An event fired when the map floorplan is updated.
    */
    'onMapRendered'?: (event: CustomEvent) => void;
  }

  interface RlTextLog {
    /**
    * Add a new line to the log.
    */
    'log': (str?: string) => void;
  }
  interface RlTextLogAttributes extends StencilHTMLAttributes {}
}

declare global {
  interface StencilElementInterfaces {
    'RlMapEditor': Components.RlMapEditor;
    'RlMap': Components.RlMap;
    'RlTextLog': Components.RlTextLog;
  }

  interface StencilIntrinsicElements {
    'rl-map-editor': Components.RlMapEditorAttributes;
    'rl-map': Components.RlMapAttributes;
    'rl-text-log': Components.RlTextLogAttributes;
  }


  interface HTMLRlMapEditorElement extends Components.RlMapEditor, HTMLStencilElement {}
  var HTMLRlMapEditorElement: {
    prototype: HTMLRlMapEditorElement;
    new (): HTMLRlMapEditorElement;
  };

  interface HTMLRlMapElement extends Components.RlMap, HTMLStencilElement {}
  var HTMLRlMapElement: {
    prototype: HTMLRlMapElement;
    new (): HTMLRlMapElement;
  };

  interface HTMLRlTextLogElement extends Components.RlTextLog, HTMLStencilElement {}
  var HTMLRlTextLogElement: {
    prototype: HTMLRlTextLogElement;
    new (): HTMLRlTextLogElement;
  };

  interface HTMLElementTagNameMap {
    'rl-map-editor': HTMLRlMapEditorElement
    'rl-map': HTMLRlMapElement
    'rl-text-log': HTMLRlTextLogElement
  }

  interface ElementTagNameMap {
    'rl-map-editor': HTMLRlMapEditorElement;
    'rl-map': HTMLRlMapElement;
    'rl-text-log': HTMLRlTextLogElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}