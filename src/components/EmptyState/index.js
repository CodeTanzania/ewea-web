import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import './styles.css';

/**
 * @function
 * @name EmptyState
 * @description Empty state component
 * @param {object} props props object
 * @param {string} props.icon path to state icon
 * @param {string} props.description state description
 * @param {string} props.buttonLabel state button label
 * @param {Function} props.onClick state button onClick callback
 * @returns {object} react element
 * @version 0.1.0
 * @since 0.1.0
 */
const EmptyState = ({ icon, description, buttonLabel, onClick }) => (
  <div className="EmptyState">
    <LegacyIcon type={icon} className="Icon" />
    <p className="description">{description}</p>
    <Button onClick={onClick}>{buttonLabel}</Button>
  </div>
);

/* Props validation */
EmptyState.propTypes = {
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default EmptyState;
