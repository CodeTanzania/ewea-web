import React from 'react';
import PropTypes from 'prop-types';
import { Tag, PageHeader } from 'antd';

/**
 * @function
 * @param {object} props props object
 * @param {string} props.number event number
 * @param {string} props.type event type
 * @param {string} props.description event description
 * @param {Function} props.onBack Callback function for closing drawer window
 * @param {string} props.stage event stage
 * @name EventDetailsViewHeader
 * @description Event Details header for drawer
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventDetailsViewHeader = ({
  number = 'N/A',
  type = 'N/A',
  description = 'N/A',
  stage,
  onBack,
}) => (
  <PageHeader
    title={
      <span
        style={{ fontSize: '16px', fontWeight: 500 }}
      >{`${type} - ${number} `}</span>
    }
    tags={[
      <Tag key={stage} color="orange">
        {stage}
      </Tag>,
    ]}
    subTitle={description}
    onBack={() => onBack()}
  />
);

EventDetailsViewHeader.propTypes = {
  number: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stage: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default EventDetailsViewHeader;
