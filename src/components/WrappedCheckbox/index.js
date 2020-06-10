import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

/**
 * @function
 * @name WrappedCheckbox
 * @description Checkbox component
 * @param {object} props Color picker object properties
 * @param {string} props.checkedValue checked value
 * @param {string} props.unCheckedValue un-checked value
 * @param {string} props.label checkbox label
 * @param {string} props.value Color value
 * @param {Function} props.onChange On change callback
 * @returns {object} Checkbox component
 * @version 0.1.0
 * @since 0.1.0
 */
const WrappedCheckbox = ({
  checkedValue,
  unCheckedValue,
  label,
  value,
  onChange,
}) => {
  return (
    <Checkbox
      checked={checkedValue && value && checkedValue === value}
      onChange={(event) => {
        if (event.target.checked) {
          onChange(checkedValue);
        } else {
          onChange(unCheckedValue);
        }
      }}
    >
      {label}
    </Checkbox>
  );
};

WrappedCheckbox.propTypes = {
  checkedValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  unCheckedValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object,
  ]),
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

WrappedCheckbox.defaultProps = {
  unCheckedValue: undefined,
  value: undefined,
  onChange: undefined,
};

export default WrappedCheckbox;
