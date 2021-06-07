import React from 'react';
import { PageHeader } from 'antd';
import PropTypes from 'prop-types';

/**
 * @function
 * @name CriticalFacilityDetailsViewHeader
 * @param {object} props props object
 * @param {string} props.name
 * @param {string} props.description
 * @param {Function} props.onBack
 * @function
 * @description header details of a critical facility
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const CriticalFacilityDetailsViewHeader = ({ name, description, onBack }) => (
  <PageHeader
    title={<span style={{ fontSize: '16px', fontWeight: 500 }}>{name}</span>}
    subTitle={description}
    onBack={() => onBack()}
  />
);

export default CriticalFacilityDetailsViewHeader;
CriticalFacilityDetailsViewHeader.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};
