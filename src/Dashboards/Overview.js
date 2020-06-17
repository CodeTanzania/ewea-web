import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import get from 'lodash/get';
import { Divider, Row, Col, Spin, Typography, Modal } from 'antd';
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

import ReportFilters from '../components/ReportFilters';
import {
  NumberWidget,
  TimeWidget,
  PRIMARY_COLOR,
  PURPLE_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
  DANGER_COLOR,
} from '../components/dashboardWidgets';
import { FilterFloatingButton } from '../components/FloatingButton';

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
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getOverviewsReport();
  }, []);

  return (
    <div>
      <FilterFloatingButton onClick={() => setShowFilters(true)} />
      <Spin spinning={loading}>
        <Divider orientation="left" plain>
          <Text strong>EVENTS</Text>
        </Divider>
        <Row>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
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
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
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
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
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
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Total"
              value={get(report, 'dispatches.total', 0)}
              icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
              secondaryText="Total Dispatches"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Waiting"
              value={get(report, 'dispatches.waiting', 0)}
              icon={<ApartmentOutlined style={{ color: SUCCESS_COLOR }} />}
              secondaryText="Waiting for Vehicles"
              bottomBorderColor={SUCCESS_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Dispatched"
              value={get(report, 'dispatches.dispatched', 0)}
              icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
              secondaryText="Dispatches in progress"
              bottomBorderColor={PURPLE_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Completed"
              value={get(report, 'dispatches.resolved', 0)}
              icon={<TeamOutlined style={{ color: WARNING_COLOR }} />}
              secondaryText="Completed Dispatches"
              bottomBorderColor={WARNING_COLOR}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <TimeWidget
              title="Avg. Waiting Time"
              days={get(report, 'dispatches.averageWaitTime.days', 0)}
              hours={get(report, 'dispatches.averageWaitTime.hours', 0)}
              minutes={get(report, 'dispatches.averageWaitTime.minutes', 0)}
              icon={<ClockCircleOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <TimeWidget
              title="Avg. Dispatch Time"
              days={get(report, 'dispatches.averageDispatchTime.days', 0)}
              hours={get(report, 'dispatches.averageDispatchTime.hours', 0)}
              minutes={get(report, 'dispatches.averageDispatchTime.minutes', 0)}
              icon={<ClockCircleOutlined style={{ color: SUCCESS_COLOR }} />}
              bottomBorderColor={WARNING_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <TimeWidget
              title="Avg. Response Time"
              days={get(report, 'dispatches.averageResolveTime.days', 0)}
              hours={get(report, 'dispatches.averageResolveTime.hours', 0)}
              minutes={get(report, 'dispatches.averageResolveTime.minutes', 0)}
              icon={<ClockCircleOutlined style={{ color: WARNING_COLOR }} />}
              bottomBorderColor={DANGER_COLOR}
            />
          </Col>
        </Row>
        <Divider orientation="left" plain>
          <Text strong>STAKEHOLDERS</Text>
        </Divider>
        <Row>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Stakeholders"
              value={get(report, 'parties.total', 0)}
              icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
              secondaryText="Total Registered Stakeholders"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Agencies"
              value={get(report, 'parties.agency', 0)}
              icon={<ApartmentOutlined style={{ color: SUCCESS_COLOR }} />}
              secondaryText="Registered Agencies"
              bottomBorderColor={SUCCESS_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Focal People"
              value={get(report, 'parties.focal', 0)}
              icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
              secondaryText="Registered Focal People"
              bottomBorderColor={PURPLE_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
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

      <Modal
        title="Filter Report"
        visible={showFilters}
        onCancel={() => setShowFilters(false)}
        footer={null}
        maskClosable={false}
        className="modal-window-50"
      >
        <ReportFilters
          onFilter={(data) => {
            getOverviewsReport({ filter: { ...data } });
            setShowFilters(false);
          }}
          onCancel={() => setShowFilters(false)}
        />
      </Modal>
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
