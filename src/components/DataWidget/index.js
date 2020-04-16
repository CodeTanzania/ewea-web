import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, Typography } from 'antd';
import './styles.css';

const { Text } = Typography;

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
const DataWidget = ({ label, icon, value, title, header, duration }) => {
  return (
    <Card className="data-widget" bodyStyle={{ padding: '18px' }}>
      {header && (
        <Row>
          <Col span={18}>
            <span className="header">{header}</span>
          </Col>
        </Row>
      )}
      <Row>
        <Col span={12}>
          <img src={icon} alt="Icon" />
        </Col>
        <Col span={12}>
          <span className="value" title={title}>
            {value}
          </span>
          <span className="duration">{duration}</span>
          <br />
          <Text className="label">{label}</Text>
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
  header: PropTypes.string,
  duration: PropTypes.string,
};

DataWidget.defaultProps = {
  header: undefined,
  duration: undefined,
};

export default DataWidget;
