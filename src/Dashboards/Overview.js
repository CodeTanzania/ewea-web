import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import get from 'lodash/get';
import { Divider, Row, Col, Spin, Typography } from 'antd';
import {
  WarningOutlined,
  AlertOutlined,
  StopOutlined,
  NumberOutlined,
  TeamOutlined,
  ApartmentOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import {
  NumberWidget,
  TimeWidget,
  PRIMARY_COLOR,
  PURPLE_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
  DANGER_COLOR,
} from '../components/dashboardWidgets';

const { getOverviewsReport } = reduxActions;
const { Text } = Typography;

/**
 * @function
 * @name OverviewDashboard
 * @description Dashboard which renders overviews reports from different dashboards
 * i.e stakeholders, events
 * @param {object} props Overview Dashboard props
 * @param {object} props.report Report object from API
 * @param {boolean} props.loading Flag for showing loading report state
 * @returns {object} Overview Dashboard component
 * @version 0.1.0
 * @since 0.1.0
 */
const OverviewDashboard = ({ report, loading }) => {
  useEffect(() => {
    getOverviewsReport();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
        <Divider orientation="left" plain>
          <Text strong>EVENTS</Text>
        </Divider>
        <Row>
          <Col span={8}>
            <NumberWidget
              title="Total Events"
              value={get(report, 'events.total', 0)}
              bottomBorderColor={WARNING_COLOR}
              icon={
                <WarningOutlined
                  style={{ fontSize: '1.5em', color: WARNING_COLOR }}
                />
              }
            />
          </Col>
          <Col span={8}>
            <NumberWidget
              title="Active Events"
              bottomBorderColor={DANGER_COLOR}
              value={get(report, 'events.active', 0)}
              icon={
                <AlertOutlined
                  style={{ fontSize: '1.5em', color: DANGER_COLOR }}
                />
              }
            />
          </Col>
          <Col span={8}>
            <NumberWidget
              title="Ended Events"
              value={get(report, 'events.ended', 0)}
              bottomBorderColor={SUCCESS_COLOR}
              icon={
                <StopOutlined
                  style={{ fontSize: '1.5em', color: SUCCESS_COLOR }}
                />
              }
            />
          </Col>
        </Row>

        <Divider orientation="left" plain>
          <Text strong>VEHICLE DISPATCHES</Text>
        </Divider>
        <Row>
          <Col span={6}>
            <NumberWidget
              title="Total"
              value={0}
              icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
              secondaryText="Total number of dispatches"
            />
          </Col>
          <Col span={6}>
            <NumberWidget
              title="Waiting"
              value={0}
              icon={<ApartmentOutlined style={{ color: SUCCESS_COLOR }} />}
              secondaryText="Dispatches waiting vehicles"
              bottomBorderColor={SUCCESS_COLOR}
            />
          </Col>
          <Col span={6}>
            <NumberWidget
              title="Dispatched"
              value={0}
              icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
              secondaryText="Dispatches which are in progress"
              bottomBorderColor={PURPLE_COLOR}
            />
          </Col>
          <Col span={6}>
            <NumberWidget
              title="Completed"
              value={0}
              icon={<TeamOutlined style={{ color: WARNING_COLOR }} />}
              secondaryText="Dispatches which are completed"
              bottomBorderColor={WARNING_COLOR}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <TimeWidget
              title="Avg. Waiting Time"
              days={get(report, 'parties.total', 0)}
              hours={0}
              minutes={0}
              icon={<ClockCircleOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
            />
          </Col>
          <Col span={8}>
            <TimeWidget
              title="Avg. Dispatch Time"
              days={0}
              hours={0}
              minutes={0}
              icon={<ClockCircleOutlined style={{ color: SUCCESS_COLOR }} />}
              bottomBorderColor={WARNING_COLOR}
            />
          </Col>
          <Col span={8}>
            <TimeWidget
              title="Avg. Response Time"
              days={0}
              hours={0}
              minutes={0}
              icon={<ClockCircleOutlined style={{ color: WARNING_COLOR }} />}
              bottomBorderColor={DANGER_COLOR}
            />
          </Col>
        </Row>
        <Divider orientation="left" plain>
          <Text strong>STAKEHOLDERS</Text>
        </Divider>
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
