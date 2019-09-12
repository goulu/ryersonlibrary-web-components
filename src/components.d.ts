/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  MapElementData,
  MapElementDataMap,
  MapElementDetail,
  MapElementDetailMap,
  MapElementDetailType,
} from './interface';
import {
  FunctionalComponent,
} from '@stencil/core';

export namespace Components {
  interface RlDetailDialog {
    /**
    * The different categories that each item can display.  Each category has a set of Detailtypes.
    */
    'categories': { label: string, name: string, id: number, items: MapElementDetailType[] }[];
    /**
    * The details that will be displayed in this dialog.
    */
    'details'?: MapElementDetailMap;
    /**
    * An array of strings that will be used to create action buttons for the dialog.  When the corresponding button is clicked by the user, MDCDialog will emit an event with the lowercase version of the action. For example the action `Yes` would emit the `MDCDialog:closing` with the property `event.detail.action === 'yes'`.
    */
    'dialogActions': string[];
    /**
    * The title of the dialog window.
    */
    'dialogTitle': string;
    /**
    * Returns the values of all the DetailDialogItems as an array of `MapElementDetails`
    */
    'getDetails': () => Promise<MapElementDetail[]>;
    /**
    * Opens this dialog.
    */
    'open': () => Promise<void>;
  }
  interface RlDetailDialogItem {
    /**
    * An array of all the different categories that can be selected.
    */
    'categoryOptions': { label: string, name: string, id: number, items: MapElementDetailType[] }[];
    /**
    * The `MapElementDetail` that this item is displaying the information of.
    */
    'detail'?: MapElementDetail;
    /**
    * Returns a `Promise` that resolves to a `MapElementDetail` object with values set as those of this `DetailDialogItem`.
    */
    'getDetail': () => Promise<MapElementDetail>;
    /**
    * Returns a `Promise` that resolves to whether or not this `DetailDialogItem` is to be removed or not.
    */
    'toRemove': () => Promise<boolean>;
  }
  interface RlMap {
    /**
    * The ID of the currently active element.
    */
    'activeElementId'?: number;
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements': MapElementDataMap;
    /**
    * The image displayed on the Map.
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
  }
  interface RlMapEditor {
    /**
    * Add a new `MapPoint` element to the map.  Calling this method starts the process.  The user must then click somewhere on the map to add the point.
    */
    'addPoint': () => Promise<void>;
    /**
    * Add a new `MapRegion` to the map. Calling this method starts the process. The user must then click numerous times on the map to add points.  Only when clicking again on the original point is the region added.
    */
    'addRegion': () => Promise<void>;
    /**
    * Cancels the current action and returns the map to its default state, ready for futher action.
    */
    'cancelAction': () => Promise<void>;
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements': MapElementData[];
    /**
    * The image displayed on the Map.
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
    * @param id The ID of the element to set as active.
    */
    'setActiveElement': (id: number) => Promise<void>;
  }
  interface RlPanZoom {
    /**
    * The largest factor allowed when scaling the content.  Calculated as a factor of the original size.  So a value of `3` would limit the scale to three times the original size.
    */
    'maxScale': number;
    /**
    * The smallest scale factor allowed when scaling the content.
    */
    'minScale': number;
    /**
    * If true, the content of the `PanZoom` will be scaled so that it fills the parent container initially.
    */
    'scaled': boolean;
    /**
    * If true, the content of the `PanZoom` will be able to move beyond the bounds of the parent container.
    */
    'unbound': boolean;
  }
  interface RlSelectMenu {
    /**
    * The label displayed on the select.
    */
    'label': string;
    /**
    * An array of the different options displayed in the select menu.
    */
    'options': { label: string, value: number }[];
    /**
    * The index of the currently selected option or undefined if nothing selected.
    */
    'selectedOption'?: number;
  }
  interface RlSvgFloorplan {
    /**
    * The ID of the active (selected) element.
    */
    'activeId': string;
    /**
    * The height for the SVG element.
    */
    'height': string;
    /**
    * The contents of the SVG, as a `FunctionalComponent`.
    */
    'svg'?: FunctionalComponent;
    /**
    * Setting to true adds a viewbox attribute to the SVG element.
    */
    'useViewbox': boolean;
    /**
    * The width of the SVG viewbox.
    */
    'vbHeight': string;
    /**
    * The height of the SVG viewbox.
    */
    'vbWidth': string;
    /**
    * The width for the SVG element.
    */
    'width': string;
  }
  interface RlTextField {
    /**
    * A flag indicating if the text field is disabled and does not allow user input.
    */
    'disabled': boolean;
    /**
    * A flag indicating if the text field uses the full-width style.
    */
    'fullwidth': boolean;
    /**
    * Additional text displayed below the main text field.
    */
    'helperText': string;
    /**
    * An icon displayed within the text field.
    */
    'icon': string;
    /**
    * The location of the icon displayed within the text field.
    */
    'iconLocation': 'trailing' | 'leading';
    /**
    * The supplemental label for the text field.
    */
    'label': string;
    /**
    * A flag indicating if the text field has an outlined style.
    */
    'outlined': boolean;
    /**
    * A flag indicating if the text field uses a textarea instead of an input.
    */
    'textarea': boolean;
    /**
    * The current value of the text field input or text area.
    */
    'value': string;
  }
  interface RlTextLog {
    /**
    * Add a new line to the log.
    * @param str A string to write to the log
    */
    'log': (str?: string) => Promise<void>;
  }
}

declare global {


  interface HTMLRlDetailDialogElement extends Components.RlDetailDialog, HTMLStencilElement {}
  var HTMLRlDetailDialogElement: {
    prototype: HTMLRlDetailDialogElement;
    new (): HTMLRlDetailDialogElement;
  };

  interface HTMLRlDetailDialogItemElement extends Components.RlDetailDialogItem, HTMLStencilElement {}
  var HTMLRlDetailDialogItemElement: {
    prototype: HTMLRlDetailDialogItemElement;
    new (): HTMLRlDetailDialogItemElement;
  };

  interface HTMLRlMapElement extends Components.RlMap, HTMLStencilElement {}
  var HTMLRlMapElement: {
    prototype: HTMLRlMapElement;
    new (): HTMLRlMapElement;
  };

  interface HTMLRlMapEditorElement extends Components.RlMapEditor, HTMLStencilElement {}
  var HTMLRlMapEditorElement: {
    prototype: HTMLRlMapEditorElement;
    new (): HTMLRlMapEditorElement;
  };

  interface HTMLRlPanZoomElement extends Components.RlPanZoom, HTMLStencilElement {}
  var HTMLRlPanZoomElement: {
    prototype: HTMLRlPanZoomElement;
    new (): HTMLRlPanZoomElement;
  };

  interface HTMLRlSelectMenuElement extends Components.RlSelectMenu, HTMLStencilElement {}
  var HTMLRlSelectMenuElement: {
    prototype: HTMLRlSelectMenuElement;
    new (): HTMLRlSelectMenuElement;
  };

  interface HTMLRlSvgFloorplanElement extends Components.RlSvgFloorplan, HTMLStencilElement {}
  var HTMLRlSvgFloorplanElement: {
    prototype: HTMLRlSvgFloorplanElement;
    new (): HTMLRlSvgFloorplanElement;
  };

  interface HTMLRlTextFieldElement extends Components.RlTextField, HTMLStencilElement {}
  var HTMLRlTextFieldElement: {
    prototype: HTMLRlTextFieldElement;
    new (): HTMLRlTextFieldElement;
  };

  interface HTMLRlTextLogElement extends Components.RlTextLog, HTMLStencilElement {}
  var HTMLRlTextLogElement: {
    prototype: HTMLRlTextLogElement;
    new (): HTMLRlTextLogElement;
  };
  interface HTMLElementTagNameMap {
    'rl-detail-dialog': HTMLRlDetailDialogElement;
    'rl-detail-dialog-item': HTMLRlDetailDialogItemElement;
    'rl-map': HTMLRlMapElement;
    'rl-map-editor': HTMLRlMapEditorElement;
    'rl-pan-zoom': HTMLRlPanZoomElement;
    'rl-select-menu': HTMLRlSelectMenuElement;
    'rl-svg-floorplan': HTMLRlSvgFloorplanElement;
    'rl-text-field': HTMLRlTextFieldElement;
    'rl-text-log': HTMLRlTextLogElement;
  }
}

declare namespace LocalJSX {
  interface RlDetailDialog extends JSXBase.HTMLAttributes<HTMLRlDetailDialogElement> {
    /**
    * The different categories that each item can display.  Each category has a set of Detailtypes.
    */
    'categories': { label: string, name: string, id: number, items: MapElementDetailType[] }[];
    /**
    * The details that will be displayed in this dialog.
    */
    'details'?: MapElementDetailMap;
    /**
    * An array of strings that will be used to create action buttons for the dialog.  When the corresponding button is clicked by the user, MDCDialog will emit an event with the lowercase version of the action. For example the action `Yes` would emit the `MDCDialog:closing` with the property `event.detail.action === 'yes'`.
    */
    'dialogActions'?: string[];
    /**
    * The title of the dialog window.
    */
    'dialogTitle'?: string;
    /**
    * An event emitted when a new `DetailDialogItem` is added to the dialog.
    */
    'onAddDetail'?: (event: CustomEvent<any>) => void;
  }
  interface RlDetailDialogItem extends JSXBase.HTMLAttributes<HTMLRlDetailDialogItemElement> {
    /**
    * An array of all the different categories that can be selected.
    */
    'categoryOptions': { label: string, name: string, id: number, items: MapElementDetailType[] }[];
    /**
    * The `MapElementDetail` that this item is displaying the information of.
    */
    'detail'?: MapElementDetail;
  }
  interface RlMap extends JSXBase.HTMLAttributes<HTMLRlMapElement> {
    /**
    * The ID of the currently active element.
    */
    'activeElementId'?: number;
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements': MapElementDataMap;
    /**
    * The image displayed on the Map.
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
    * An event fired when the user deselects the selected `MapElement`.
    */
    'onElementDeselected'?: (event: CustomEvent<any>) => void;
    /**
    * An event fired when the user selects a `MapElement`. The clicked element will be passed as the event parameter.
    */
    'onElementSelected'?: (event: CustomEvent<MapElementData>) => void;
  }
  interface RlMapEditor extends JSXBase.HTMLAttributes<HTMLRlMapEditorElement> {
    /**
    * An array of the elements that will be displayed on the Map.
    */
    'elements'?: MapElementData[];
    /**
    * The image displayed on the Map.
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
    'onElementCreated'?: (event: CustomEvent<MapElementData>) => void;
    /**
    * An event fired when one of the `MapElements` on this map is deleted.
    */
    'onElementDeleted'?: (event: CustomEvent<MapElementData>) => void;
    /**
    * An event fired when the user deselects a `MapElement`.
    */
    'onElementDeselected'?: (event: CustomEvent<any>) => void;
    /**
    * An event fired when one of the `MapElement`s on the map is double clicked.
    */
    'onElementDoubleClicked'?: (event: CustomEvent<MapElementData>) => void;
    /**
    * An event fired when the user selects a MapElement. The clicked element will be passed as the event parameter.
    */
    'onElementSelected'?: (event: CustomEvent<MapElementData>) => void;
    /**
    * An event fired when a `MapElement` is updated (moved or changes shape). The event details contains the `MapElement` that was updated.
    */
    'onElementUpdated'?: (event: CustomEvent<MapElementData>) => void;
  }
  interface RlPanZoom extends JSXBase.HTMLAttributes<HTMLRlPanZoomElement> {
    /**
    * The largest factor allowed when scaling the content.  Calculated as a factor of the original size.  So a value of `3` would limit the scale to three times the original size.
    */
    'maxScale'?: number;
    /**
    * The smallest scale factor allowed when scaling the content.
    */
    'minScale'?: number;
    /**
    * If true, the content of the `PanZoom` will be scaled so that it fills the parent container initially.
    */
    'scaled'?: boolean;
    /**
    * If true, the content of the `PanZoom` will be able to move beyond the bounds of the parent container.
    */
    'unbound'?: boolean;
  }
  interface RlSelectMenu extends JSXBase.HTMLAttributes<HTMLRlSelectMenuElement> {
    /**
    * The label displayed on the select.
    */
    'label'?: string;
    /**
    * An event emitted when an item is selected.  The detail of the event is set to the index of the item selected.
    */
    'onSelected'?: (event: CustomEvent<number>) => void;
    /**
    * An array of the different options displayed in the select menu.
    */
    'options'?: { label: string, value: number }[];
    /**
    * The index of the currently selected option or undefined if nothing selected.
    */
    'selectedOption'?: number;
  }
  interface RlSvgFloorplan extends JSXBase.HTMLAttributes<HTMLRlSvgFloorplanElement> {
    /**
    * The ID of the active (selected) element.
    */
    'activeId'?: string;
    /**
    * The height for the SVG element.
    */
    'height'?: string;
    /**
    * Event fired when the SVG is clicked but no specific element is targeted, that is, the active element is cleared.
    */
    'onRlElementCleared'?: (event: CustomEvent<void>) => void;
    /**
    * Event fired when an element in the SVG is clicked (if it is clickable). Details will be the `id` of the clicked element.
    */
    'onRlElementClicked'?: (event: CustomEvent<string>) => void;
    /**
    * The contents of the SVG, as a `FunctionalComponent`.
    */
    'svg'?: FunctionalComponent;
    /**
    * Setting to true adds a viewbox attribute to the SVG element.
    */
    'useViewbox'?: boolean;
    /**
    * The width of the SVG viewbox.
    */
    'vbHeight'?: string;
    /**
    * The height of the SVG viewbox.
    */
    'vbWidth'?: string;
    /**
    * The width for the SVG element.
    */
    'width'?: string;
  }
  interface RlTextField extends JSXBase.HTMLAttributes<HTMLRlTextFieldElement> {
    /**
    * A flag indicating if the text field is disabled and does not allow user input.
    */
    'disabled'?: boolean;
    /**
    * A flag indicating if the text field uses the full-width style.
    */
    'fullwidth'?: boolean;
    /**
    * Additional text displayed below the main text field.
    */
    'helperText'?: string;
    /**
    * An icon displayed within the text field.
    */
    'icon'?: string;
    /**
    * The location of the icon displayed within the text field.
    */
    'iconLocation'?: 'trailing' | 'leading';
    /**
    * The supplemental label for the text field.
    */
    'label'?: string;
    /**
    * An event emitted when the value of the input or textarea changes.
    */
    'onChangeValue'?: (event: CustomEvent<any>) => void;
    /**
    * A flag indicating if the text field has an outlined style.
    */
    'outlined'?: boolean;
    /**
    * A flag indicating if the text field uses a textarea instead of an input.
    */
    'textarea'?: boolean;
    /**
    * The current value of the text field input or text area.
    */
    'value'?: string;
  }
  interface RlTextLog extends JSXBase.HTMLAttributes<HTMLRlTextLogElement> {}

  interface IntrinsicElements {
    'rl-detail-dialog': RlDetailDialog;
    'rl-detail-dialog-item': RlDetailDialogItem;
    'rl-map': RlMap;
    'rl-map-editor': RlMapEditor;
    'rl-pan-zoom': RlPanZoom;
    'rl-select-menu': RlSelectMenu;
    'rl-svg-floorplan': RlSvgFloorplan;
    'rl-text-field': RlTextField;
    'rl-text-log': RlTextLog;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


