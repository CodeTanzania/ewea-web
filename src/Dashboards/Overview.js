import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Connect, getOverviewsReport } from '@codetanzania/ewea-api-states';
import get from 'lodash/get';
import { Row, Col, Spin } from 'antd';
import {
  WarningOutlined,
  AlertOutlined,
  StopOutlined,
  NumberOutlined,
  TeamOutlined,
  ApartmentOutlined,
  UserOutlined,
} from '@ant-design/icons';

import {
  NumberWidget,
  PRIMARY_COLOR,
  PURPLE_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
} from '../components/dashboardWidgets';

const OverviewDashboard = ({ report, loading }) => {
  useEffect(() => {
    getOverviewsReport();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
        <Row>
          <Col span={8}>
            <NumberWidget
              title="Total Events"
              value="100"
              bottomBorderColor="#faad14"
              icon={
                <WarningOutlined
                  style={{ fontSize: '1.5em', color: '#faad14' }}
                />
              }
            />
          </Col>
          <Col span={8}>
            <NumberWidget
              title="Active Events"
              bottomBorderColor="#ff4d4f"
              value="10"
              icon={
                <AlertOutlined
                  style={{ fontSize: '1.5em', color: '#ff4d4f' }}
                />
              }
            />
          </Col>
          <Col span={8}>
            <NumberWidget
              title="Ended Events"
              value="90"
              bottomBorderColor="#388E3C"
              icon={
                <StopOutlined style={{ fontSize: '1.5em', color: '#388E3C' }} />
              }
            />
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <NumberWidget
              title="Stakeholders"
              value={get(report, 'parties.total', 0)}
              icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
              secondaryText="Total Registered Stakeholders"
            />
          </Col>
          <Col span={6}>
            <NumberWidget
              title="Agencies"
              value={get(report, 'parties.agency', 0)}
              icon={<ApartmentOutlined style={{ color: SUCCESS_COLOR }} />}
              secondaryText="Registered Agencies"
              bottomBorderColor={SUCCESS_COLOR}
            />
          </Col>
          <Col span={6}>
            <NumberWidget
              title="Focal People"
              value={get(report, 'parties.focal', 0)}
              icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
              secondaryText="Registered Focal People"
              bottomBorderColor={PURPLE_COLOR}
            />
          </Col>
          <Col span={6}>
            <NumberWidget
              title="Groups"
              value={get(report, 'parties.group', 0)}
              icon={<TeamOutlined style={{ color: WARNING_COLOR }} />}
              secondaryText="Registered Stakeholder's Groups"
              bottomBorderColor={WARNING_COLOR}
            />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

OverviewDashboard.propTypes = {
  report: PropTypes.shape({ overview: PropTypes.object }),
  loading: PropTypes.bool.isRequired,
};

OverviewDashboard.defaultProps = {
  report: null,
};

export default Connect(OverviewDashboard, {
  report: 'overviewsReport.data',
  loading: 'overviewsReport.loading',
});
