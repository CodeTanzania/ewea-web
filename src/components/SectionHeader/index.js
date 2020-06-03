import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

/**
 * @function
 * @name SectionHeader
 * @description Section Header component for details view
 * @param {object} props Component properties object
 * @param {string} props.title Header title
 * @param {object} props.actions Additional actions appended on the header
 * @returns {object} SectionHeader component
 * @version 0.1.0
 * @since 0.1.0
 */
const SectionHeader = ({ title, actions }) => {
  return (
    <div className="SectionHeader">
      <span className="SectionHeaderText">{title}</span>
      {actions}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.node,
};

SectionHeader.defaultProps = {
  actions: null,
};

export default SectionHeader;
