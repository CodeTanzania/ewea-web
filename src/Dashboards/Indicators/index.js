import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Connect, getEventIndicators } from '@codetanzania/ewea-api-states';
import { Card, Typography, Space } from 'antd';

import './styles.css';

const { Text } = Typography;
const Section = ({ name }) => {
  return (
    <div className="indicator-section">
      <div className="indicator-section-header">{name}</div>

      <div className="indicator-section-body">
        <Space direction="vertical">
          <Card
            title="Amana Hospital"
            extra={<a href="/">More</a>}
            style={{ width: 300 }}
          >
            <p>
              <Text strong>Status: </Text> Operational
            </p>
            <p>
              <Text strong>Capacity: </Text> <Text type="danger">124 %</Text>
            </p>
            <p>
              <Text strong>Notes: </Text>
              <Text type="danger">
                Facility, Supplies and staff severely overburdened. Restock,
                volunteer nursing assistants, and move overflow facility
                urgently needed
              </Text>
            </p>
          </Card>
          <Card
            size="small"
            title="Muhimbili Hospital"
            extra={<a href="/">More</a>}
            style={{ width: 300 }}
          >
            <p>
              <Text strong>Status: </Text> Finalizing Preparation
            </p>
            <p>
              <Text strong>Capacity: </Text> <Text type="success">95 %</Text>
            </p>
            <p>
              <Text strong>Notes: </Text>
              <Text type="danger">
                Water now connected, TANESCO reports electricity to be connected
                by tomorrow
              </Text>
            </p>
          </Card>

          <Card
            size="small"
            title="Temporary Hospital"
            extra={<a href="/">More</a>}
            style={{ width: 300 }}
          >
            <p>
              <Text strong>Status: </Text> Early Preparation
            </p>
            <p>
              <Text strong>Capacity: </Text> <Text type="warning">45 %</Text>
            </p>
          </Card>
        </Space>
      </div>
    </div>
  );
};

const IndicatorDashboard = ({ indicators = [] }) => {
  useEffect(() => {
    getEventIndicators();
  }, []);

  return (
    <div className="indicators-wrapper">
      {indicators.map((indicator) => (
        <Section key={indicator._id} name={indicator.strings.name.en} /> // eslint-disable-line
      ))}
    </div>
  );
};

Section.propTypes = {
  name: PropTypes.string.isRequired,
};

IndicatorDashboard.propTypes = {
  indicators: PropTypes.arrayOf(
    PropTypes.shape({ strings: PropTypes.object, _id: PropTypes.string })
  ).isRequired,
};

export default Connect(IndicatorDashboard, {
  indicators: 'eventIndicators.list',
});
