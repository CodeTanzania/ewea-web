import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'antd';

/**
 * @function
 * @name VehicleDispatchViewHeader
 * @description Header for vehicle dispatch details view
 * @param {Function} onBack Callback for closing details view
 * @returns {object} VehicleDispatchViewHeader
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleDispatchViewHeader = ({ dispatchNo, event, onBack }) => {
  return (
    <PageHeader
      title={
        <span
          style={{ fontSize: '16px', fontWeight: 500 }}
        >{`${dispatchNo} `}</span>
      }
      subTitle={event}
      onBack={onBack}
    />
  );
};

VehicleDispatchViewHeader.propTypes = {
  dispatchNo: PropTypes.string.isRequired,
  event: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default VehicleDispatchViewHeader;
