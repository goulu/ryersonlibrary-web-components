import { FunctionalComponent, h } from '@stencil/core';
import merge from 'lodash/merge';
import { SVGEl } from '../../interface';

// export interface SVGEl {
//   elem: string;
//   prefix: string;
//   local: string;
//   attrs: {
//     [key: string]: string | { [key: string]: string },
//     id: string,
//     style: string | { [key: string]: string },
//   };
//   content?: Array<{ text: string }>;
//   type: string;
// }

interface SVGContentProps {
  elements: SVGEl[];
  extra?: {
    [key: string]: {
      [key: string]: string,
    };
  };
}

const parseStyles = styles => styles
    .split(';')
    .filter(style => style.split(':')[0] && style.split(':')[1])
    .map(style => [
        style.split(':')[0].trim().replace(/-./g, c => c.substr(1).toUpperCase()),
        style.split(':')[1].trim()
    ])
    .reduce((styleObj, style) => ({
        ...styleObj,
        [style[0]]: style[1],
    }), {});

// tslint:disable-next-line: variable-name
export const SVGContent: FunctionalComponent<SVGContentProps> = ({ elements, extra }) => {
  return elements.map(el => {
    // Copy attributes, since they're going to be modified.  If the original
    // attributes are referenced, then any modifications are lasting.
    let attrs = { ...el.attrs };

    if (extra !== undefined && extra.hasOwnProperty(el.attrs.id)) {
      // Attrs can have properties that are objects (class and style), so do
      // a deep merge when adding any extra attributes.
      attrs = merge(attrs, extra[el.attrs.id]);
    }

    if (attrs.hasOwnProperty('xlink:href')) {
      // extra can add an xlinkHref to the attributes, so perform this
      // conversion after extras are merged in.
      attrs['xlinkHref'] = attrs['xlink:href'];
      delete attrs['xlink:href'];
    }

    if (attrs.hasOwnProperty('style') && typeof attrs.style === 'string') {
      attrs.style = parseStyles(attrs.style);
    }

    return (
      <el.elem {...attrs}>
        {el.content ?
          el.content.map(content => (content.text)) : undefined}
      </el.elem>
    );
  });
};
