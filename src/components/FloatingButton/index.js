import React from 'react';
import PropTypes from 'prop-types';
import { Affix, Button } from 'antd';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';

/**
 * @function
 * @name FilterFloatingButton
 * @description Generic  floating button
 * @param {object} props Component object properties
 * @param {object} props.icon Icon component for floating button
 * @param {string} props.title Button title
 * @param {Function} props.onClick On click callback
 * @returns {object} FloatingButton
 * @version 0.1.0
 * @since 0.1.0
 */
export const FloatingButton = ({ icon, title, onClick }) => {
  return (
    <Affix
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '25px',
        zIndex: 1000,
      }}
    >
      <Button
        shape="circle"
        type="primary"
        title={title}
        icon={icon}
        size="large"
        onClick={onClick}
      />
    </Affix>
  );
};

/**
 * @function
 * @name FilterFloatingButton
 * @description Floating button for opening filters
 * @param {object} props Component object properties
 * @param {Function} props.onClick On click callback
 * @returns {object} FilterFloatingButton
 * @version 0.1.0
 * @since 0.1.0
 */
export const FilterFloatingButton = ({ onClick }) => {
  return (
    <FloatingButton
      icon={<FilterOutlined />}
      onClick={onClick}
      title="Click to Filter"
    />
  );
};

/**
 * @function
 * @name CreateFloatingButton
 * @description Floating button for opening create form
 * @param {object} props Component object properties
 * @param {Function} props.onClick On click callback
 * @returns {object} CreateFloatingButton
 * @version 0.1.0
 * @since 0.1.0
 */
export const CreateFloatingButton = ({ onClick }) => {
  return (
    <FloatingButton
      icon={<PlusOutlined />}
      onClick={onClick}
      title="Click to Create New"
    />
  );
};

FloatingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

FilterFloatingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

CreateFloatingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
