import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'antd';

/**
 * @function
 * @name CaseDetailsViewHeader
 * @description Header section for case details view drawer
 * @param {object} props Component object properties
 * @param {string} props.number Case number
 * @param {string} props.phone Case mobile phone number
 * @param {Function} props.onBack Callback for closing the drawer
 * @returns {object} CaseDetailsViewHeader component
 * @version 0.1.0
 * @since 0.1.0
 */
const CaseDetailsViewHeader = ({ number, phone, onBack }) => {
  return (
    <PageHeader
      title={
        <span
          style={{ fontSize: '16px', fontWeight: 500 }}
        >{`${number} `}</span>
      }
      subTitle={phone}
      onBack={() => onBack()}
    />
  );
};

CaseDetailsViewHeader.propTypes = {
  number: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default CaseDetailsViewHeader;
