import React from 'react';
import PropTypes from 'prop-types';
import toUpper from 'lodash/toUpper';
import { Card, Typography, Col, Row } from 'antd';

const { Text } = Typography;

export const PRIMARY_COLOR = '#1890FF';
export const WARNING_COLOR = '#FAAD14';
export const DANGER_COLOR = '#FF4D4F';
export const SECONDARY_COLOR = '#979797';
export const SUCCESS_COLOR = '#52C41A';
export const PURPLE_COLOR = '#3F51B5';

export const NumberWidget = ({
  title,
  secondaryText,
  value,
  icon,
  bottomBorderColor = SECONDARY_COLOR,
}) => {
  return (
    <Card
      style={{
        borderBottom: `3px solid  ${bottomBorderColor}`,
        margin: '10px',
        boxShadow: '2px 2px 5px #e9e9e9',
      }}
    >
      <Row>
        <Col span={22}>
          <Text style={{ color: '#8c8c8c', fontWeight: '600' }}>
            {toUpper(title)}
          </Text>
        </Col>
        <Col span={2}>{icon}</Col>
      </Row>
      <Text style={{ fontSize: '3.5em', fontWeight: '500' }}>{value}</Text>
      <br />
      <Text type="secondary">{secondaryText}</Text>
    </Card>
  );
};

NumberWidget.propTypes = {
  title: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  icon: PropTypes.node,
  value: PropTypes.number.isRequired,
  bottomBorderColor: PropTypes.string,
};

NumberWidget.defaultProps = {
  secondaryText: undefined,
  icon: null,
  bottomBorderColor: undefined,
};

export const SectionCard = ({ title, children }) => {
  return (
    <Card
      title={title}
      style={{ margin: '10px', boxShadow: '2px 2px 5px #e9e9e9' }}
    >
      {children}
    </Card>
  );
};

SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.instanceOf(PropTypes.node).isRequired,
};