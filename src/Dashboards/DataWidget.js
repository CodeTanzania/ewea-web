import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'antd';

/**
 * @function
 * @name DataWidget
 * @description Data widget for action taken dashboard
 *
 * @param {object} props React props
 * @returns {object} React Component
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const DataWidget = ({ label, icon, value, title }) => {
  return (
    <Card className="card-widget">
      <Row>
        <Col span={12}>
          <img src={icon} alt="Icon" />
        </Col>
        <Col span={12}>
          <span className="value" title={title}>
            {value}
          </span>
          <br />
          <span className="label">{label}</span>
        </Col>
      </Row>
    </Card>
  );
};

DataWidget.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default DataWidget;
