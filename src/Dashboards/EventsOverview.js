import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Row, Col, Table, Spin } from 'antd';
import {
  WarningOutlined,
  AlertOutlined,
  StopOutlined,
} from '@ant-design/icons';

import {
  NumberWidget,
  SectionCard,
  WARNING_COLOR,
  DANGER_COLOR,
  DARK_GREEN,
} from '../components/dashboardWidgets';

const { getEventsReport } = reduxActions;
const titleMap = {
  areas: 'Area',
  certainties: 'Certainty',
  groups: 'Group',
  levels: 'Level',
  responses: 'Response',
  roles: 'Role',
  severities: 'Severity',
  statuses: 'Status',
  types: 'Type',
  urgencies: 'Urgency',
};

const generateColumnsFor = (name, titles) => {
  return [
    {
      title: titles[name],
      dataIndex: ['name', 'en'],
    },
    {
      title: 'Total',
      dataIndex: 'total',
    },
    {
      title: 'Active',
      dataIndex: 'active',
    },
    {
      title: 'Ended',
      dataIndex: 'ended',
    },
  ];
};

/**
 * @function
 * @name EventsOverviewDashboard
 * @description Events Overview Dashboard
 * @param {object} props Event Overview dashboard props
 * @param {object} props.report Events Report data from the API
 * @param {boolean} props.loading Flag for showing spinner while loading report
 * @returns {object} Event Overview React component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventsOverviewDashboard = ({ report, loading }) => {
  useEffect(() => {
    getEventsReport();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
        <Row>
          <Col span={8}>
            <NumberWidget
              title="Total Events"
              value={get(report, 'overview.total', 0)}
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
              value={get(report, 'overview.active', 0)}
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
              value={get(report, 'overview.ended', 0)}
              bottomBorderColor={DARK_GREEN}
              icon={
                <StopOutlined
                  style={{ fontSize: '1.5em', color: DARK_GREEN }}
                />
              }
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Overall - Event Types Breakdown">
                  <Table
                    dataSource={get(report, 'overall.types', [])}
                    columns={generateColumnsFor('types', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Levels Breakdown">
                  <Table
                    dataSource={get(report, 'overall.levels', [])}
                    columns={generateColumnsFor('levels', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Urgencies Breakdown">
                  <Table
                    dataSource={get(report, 'overall.urgencies', [])}
                    columns={generateColumnsFor('urgencies', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Overall - Event Groups Breakdown">
                  <Table
                    dataSource={get(report, 'overall.groups', [])}
                    columns={generateColumnsFor('groups', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Severities Breakdown">
                  <Table
                    dataSource={get(report, 'overall.severities', [])}
                    columns={generateColumnsFor('severities', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Certainty Breakdown">
                  <Table
                    dataSource={get(report, 'overall.certainties', [])}
                    columns={generateColumnsFor('certainties', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Responses Breakdown">
                  <Table
                    dataSource={get(report, 'overall.responses', [])}
                    columns={generateColumnsFor('responses', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
            </Row>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

EventsOverviewDashboard.propTypes = {
  report: PropTypes.shape({ overview: PropTypes.object }),
  loading: PropTypes.bool.isRequired,
};

EventsOverviewDashboard.defaultProps = {
  report: null,
};

export default Connect(EventsOverviewDashboard, {
  report: 'eventsReport.data',
  loading: 'eventsReport.loading',
});
