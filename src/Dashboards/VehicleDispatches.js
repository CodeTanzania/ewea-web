import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Row, Col, Table, Spin } from 'antd';
import get from 'lodash/get';
import {
  ClockCircleOutlined,
  NumberOutlined,
  TeamOutlined,
  ApartmentOutlined,
  UserOutlined,
} from '@ant-design/icons';

import {
  NumberWidget,
  TimeWidget,
  SectionCard,
  PRIMARY_COLOR,
  PURPLE_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
  DANGER_COLOR,
} from '../components/dashboardWidgets';

const columns = [
  { title: 'Type', dataIndex: 'type' },
  { title: 'Total', dataIndex: 'total' },
  {
    title: 'Waiting',
    dataIndex: 'waiting',
  },
  {
    title: 'Dispatched',
    dataIndex: 'dispatched',
  },
  {
    title: 'Completed',
    dataIndex: 'completed',
  },
  {
    title: 'Canceled',
    dataIndex: 'cancelled',
  },
];
const vehicleStatusColumns = [
  { title: 'Vehicle', dataIndex: 'vehicle' },
  { title: 'Number', dataIndex: 'number' },
  { title: 'Status', dataIndex: 'status' },
];
const vehicleData = [
  {
    vehicle: 'Ambulance',
    number: 'T 102 ABC',
    status: 'Idle',
  },
  {
    vehicle: 'Ambulance',
    number: 'T 102 ABC',
    status: 'Under Maintenance',
  },
  {
    vehicle: 'Water Tender',
    number: 'T 102 ABC',
    status: 'On Route',
  },
  {
    vehicle: 'Water Tender',
    number: 'T 102 ABC',
    status: 'On Route',
  },
];
const data = [
  {
    type: 'Ambulance',
    total: 10,
    waiting: 4,
    dispatched: 3,
    completed: 2,
    cancelled: 1,
  },
  {
    type: 'Water Tender',
    total: 10,
    waiting: 4,
    dispatched: 3,
    completed: 2,
    cancelled: 1,
  },
];
const { getDispatchesReport } = reduxActions;

/**
 * @function
 * @name VehicleDispatchesDashboard
 * @description Vehicle Dispatch Dashboard
 * @param {object} props Dashboard properties
 * @param {object} props.report Vehicle dispatches dashboard data from the API
 * @param {boolean} props.loading Boolean flag to indicate reports loading state
 * @returns {object} VehicleDispatchesDashboard
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleDispatchesDashboard = ({ report, loading }) => {
  useEffect(() => {
    getDispatchesReport();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Total"
              value={get(report, 'overview.total', 0)}
              icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
              secondaryText="Total Dispatches"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Waiting"
              value={get(report, 'overview.waiting', 0)}
              icon={<ApartmentOutlined style={{ color: SUCCESS_COLOR }} />}
              secondaryText="Waiting for Vehicles"
              bottomBorderColor={SUCCESS_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Dispatched"
              value={get(report, 'overview.dispatched', 0)}
              icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
              secondaryText="Dispatches in progress"
              bottomBorderColor={PURPLE_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Completed"
              value={get(report, 'overview.resolved', 0)}
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
              days={get(report, 'overview.averageWaitTime.days', 0)}
              hours={get(report, 'overview.averageWaitTime.hours', 0)}
              minutes={get(report, 'overview.averageWaitTime.minutes', 0)}
              icon={<ClockCircleOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <TimeWidget
              title="Avg. Dispatch Time"
              days={get(report, 'overview.averageDispatchTime.days', 0)}
              hours={get(report, 'overview.averageDispatchTime.hours', 0)}
              minutes={get(report, 'overview.averageDispatchTime.minutes', 0)}
              icon={<ClockCircleOutlined style={{ color: SUCCESS_COLOR }} />}
              bottomBorderColor={WARNING_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
            <TimeWidget
              title="Avg. Response Time"
              days={get(report, 'overview.averageResolveTime.days', 0)}
              hours={get(report, 'overview.averageResolveTime.hours', 0)}
              minutes={get(report, 'overview.averageResolveTime.minutes', 0)}
              icon={<ClockCircleOutlined style={{ color: WARNING_COLOR }} />}
              bottomBorderColor={DANGER_COLOR}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} lg={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Vehicle Type per Dispatch Status">
                  <Table
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Col span={24}>
              <SectionCard title="Vehicle Dispatch Status">
                <Table
                  dataSource={vehicleData}
                  columns={vehicleStatusColumns}
                  pagination={false}
                />
              </SectionCard>
            </Col>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

VehicleDispatchesDashboard.propTypes = {
  report: PropTypes.shape({ overview: PropTypes.object }),
  loading: PropTypes.bool.isRequired,
};

VehicleDispatchesDashboard.defaultProps = {
  report: null,
};

export default Connect(VehicleDispatchesDashboard, {
  report: 'dispatchesReport.data',
  loading: 'dispatchesReport.loading',
});
