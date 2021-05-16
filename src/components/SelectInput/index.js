import { Select } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

/* constants */
const { Option } = Select;

/**
 * @function
 * @name SelectInput
 * @description Render Select input wrapper on top of antd select input
 * @param {object} properties Select Input Component props
 * @returns {object} React Element
 * @version 0.1.0
 * @since 0.1.0
 */
const SelectInput = (properties) => {
  const { options, ...props } = properties;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Select {...props}>
      {options.map((option) => (
        <Option key={option} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  );
};
/* props validation */
SelectInput.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SelectInput;
