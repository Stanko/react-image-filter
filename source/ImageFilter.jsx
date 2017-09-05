import React, { Component } from 'react';
import PropTypes from 'prop-types';

const WRAPPER_STYLE = {
  position: 'relative',
};

const IMAGE_STYLE = {
  display: 'block',
  visibility: 'hidden',
  width: '100%',
};

const SVG_STYLE = {
  display: 'block',
  height: '100%',
  width: '100%',
  overflow: 'hidden',
};

const SVG_ABSOLUTE_STYLE = {
  left: 0,
  position: 'absolute',
  top: 0,
};

const NONE = [
  1, 0, 0, 0, 0,
  0, 1, 0, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 0, 1, 0,
];

const INVERT = [
  -1, 0, 0, 0, 1,
  0, -1, 0, 0, 1,
  0, 0, -1, 0, 1,
  0, 0, 0, 1, 0,
];

const GRAYSCALE = [
  1, 0, 0, 0, 0,
  1, 0, 0, 0, 0,
  1, 0, 0, 0, 0,
  0, 0, 0, 1, 0,
];

const SEPIA = [
  0.3, 0.45, 0.1, 0, 0,
  0.2, 0.45, 0.1, 0, 0,
  0.1, 0.3, 0.1, 0, 0,
  0, 0, 0, 1, 0,
];

function omit(object, keysToOmit) {
  const result = {};

  Object.keys(object).forEach(key => {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  });

  return result;
}

const types = {
  DUOTONE: 'duotone',
  INVERT: 'invert',
  GRAYSCALE: 'grayscale',
  SEPIA: 'sepia',
};

export default class ImageFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: `${ new Date().getTime() }${ Math.random() }`.replace('.', ''),
      filter: this.getMatrix(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      filter,
      colorOne,
      colorTwo,
    } = this.props;

    if (
      filter !== nextProps.filter ||
      (nextProps.filter === 'duotone' && (colorOne !== nextProps.colorOne || colorTwo !== nextProps.colorTwo))
    ) {
      this.setState({
        filter: this.getMatrix(nextProps, true),
      });
    }
  }

  getMatrix(props, triggerCallback = false) {
    let filter = props.filter;

    if (filter === types.GRAYSCALE) {
      filter = GRAYSCALE;
    } else if (filter === types.INVERT) {
      filter = INVERT;
    } else if (filter === types.SEPIA) {
      filter = SEPIA;
    } else if (filter === types.DUOTONE) {
      filter = this.convertToDueTone(props.colorOne, props.colorTwo);
    }

    if (triggerCallback && props.onChange && typeof props.onChange === 'function') {
      props.onChange(filter);
    }

    return filter;
  }

  convertToDueTone(color1, color2) {
    return [
      (color2[0] / 256) - (color1[0] / 256), 0, 0, 0, color1[0] / 256,
      (color2[1] / 256) - (color1[1] / 256), 0, 0, 0, color1[1] / 256,
      (color2[2] / 256) - (color1[2] / 256), 0, 0, 0, color1[2] / 256,
      0, 0, 0, 1, 0,
    ];
  }

  render() {
    const {
      image,
      preserveAspectRatio,
      className,
      style,
      svgStyle,
      svgProps,
    } = this.props;

    const {
      id,
      filter,
    } = this.state;

    const aspectRatio = preserveAspectRatio === 'cover' ? 'xMidYMid slice' : preserveAspectRatio;
    const renderImage = preserveAspectRatio === 'none';

    const svgMergedStyle = renderImage ? {
      ...SVG_STYLE,
      ...SVG_ABSOLUTE_STYLE,
      ...svgStyle,
    } : {
      ...SVG_STYLE,
      ...svgStyle,
    };

    const otherProps = omit(this.props, [
      'image',
      'filter',
      'preserveAspectRatio',
      'className',
      'style',
      'svgStyle',
      'svgProps',
      'colorOne',
      'colorTwo',
    ]);

    return (
      <div
        { ...otherProps }
        className={ `ImageFilter ${ className }` }
        style={ { ...WRAPPER_STYLE, ...style } }
      >
        { renderImage &&
          <img
            alt=''
            aria-hidden={ true }
            style={ IMAGE_STYLE }
            src={ image }
            className='ImageFilter-image'
          /> }
        <svg
          { ...svgProps }
          className='ImageFilter-svg'
          style={ svgMergedStyle }
        >
          <filter
            id={ `filter-image-${ id }` }
            colorInterpolationFilters='sRGB'
          >
            <feColorMatrix
              type='matrix'
              values={ filter.join(' ') }
            />
          </filter>
          <image
            filter={ `url(#filter-image-${ id })` }
            preserveAspectRatio={ aspectRatio }
            xlinkHref={ image }
            x='0'
            y='0'
            width='100%'
            height='100%'
          />
        </svg>
      </div>
    );
  }
}

ImageFilter.propTypes = {
  image: PropTypes.string.isRequired,
  filter: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  // Check https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
  preserveAspectRatio: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  svgStyle: PropTypes.object,
  svgProps: PropTypes.object,
  colorOne: PropTypes.array,
  colorTwo: PropTypes.array,
  onChange: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
};

ImageFilter.defaultProps = {
  filter: NONE,
  preserveAspectRatio: 'none',
  className: '',
  style: {},
  svgStyle: {},
  svgProps: {},
};
