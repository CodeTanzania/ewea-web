import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tag } from 'antd';

const { Text } = Typography;

/**
 * @function
 * @param {object} props props object
 * @param {string} props.number event number
 * @param {string} props.type event type
 * @param {string} props.description event description
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
}) => (
  <div>
    <h5>
      {`${type} - ${number} `} <Tag color="orange">{stage}</Tag>
    </h5>
    <Text type="secondary" style={{ fontSize: '12px' }}>
      {description}
    </Text>
  </div>
);

EventDetailsViewHeader.propTypes = {
  number: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stage: PropTypes.string.isRequired,
};

export default EventDetailsViewHeader;
