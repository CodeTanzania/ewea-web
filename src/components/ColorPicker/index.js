import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';

/**
 * @function
 * @name ColorPicker
 * @description Color Picker component that wrap react-color for antd use
 * @param {object} props Color picker object properties
 * @param {string} props.value Color value
 * @param {Function} props.onChange On color change callback
 * @returns {object} Color component
 * @see {@link https://casesandberg.github.io/react-color/}
 * @version 0.1.0
 * @since 0.1.0
 */
const ColorPicker = ({ value, onChange }) => {
  return (
    <SketchPicker
      width={250}
      color={value}
      onChangeComplete={(color) => onChange(color.hex)}
    />
  );
};

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

ColorPicker.defaultProps = {
  value: undefined,
};

export default ColorPicker;
