import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tag } from 'antd';

const { Text } = Typography;

/**
 * @function
 * @param props.number
 * @param props.type
 * @param props.description
 * @param props.stage
 * @name EventDetailsViewHeader
 * @description Event Details header for drawer
 * @param {object} props React props
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
