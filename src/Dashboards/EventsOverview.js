import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Row, Col, Table, Spin, Modal } from 'antd';
import {
  WarningOutlined,
  AlertOutlined,
  StopOutlined,
} from '@ant-design/icons';
import get from 'lodash/get';

import ReportFilters from '../components/ReportFilters';
import {
  NumberWidget,
  SectionCard,
  WARNING_COLOR,
  DANGER_COLOR,
  DARK_GREEN,
} from '../components/dashboardWidgets';
import { FilterFloatingButton } from '../components/FloatingButton';

/* redux actions */
const { getEventsReport } = reduxActions;

/**
 * @function
 * @name generateColumnsFor
 * @description Generate table columns name
 * @param {string} resource Resource name for displaying data
 * @returns {object[]} Columns array for table
 * @version 0.1.0
 * @since 0.1.0
 */
const generateColumnsFor = (resource) => {
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

  return [
    {
      title: titleMap[resource],
      dataIndex: ['name', 'en'],
      key: 'name',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
    },
    {
      title: 'Ended',
      dataIndex: 'ended',
      key: 'ended',
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
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getEventsReport();
  }, []);

  return (
    <div>
      <FilterFloatingButton onClick={() => setShowFilters(true)} />
      <Spin spinning={loading}>
        <Row>
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
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
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
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
          <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
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
          <Col xs={24} sm={24} lg={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Overall - Event Types Breakdown">
                  <Table
                    dataSource={get(report, 'overall.types', [])}
                    columns={generateColumnsFor('types')}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Levels Breakdown">
                  <Table
                    dataSource={get(report, 'overall.levels', [])}
                    columns={generateColumnsFor('levels')}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Urgencies Breakdown">
                  <Table
                    dataSource={get(report, 'overall.urgencies', [])}
                    columns={generateColumnsFor('urgencies')}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Overall - Event Groups Breakdown">
                  <Table
                    dataSource={get(report, 'overall.groups', [])}
                    columns={generateColumnsFor('groups')}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Severities Breakdown">
                  <Table
                    dataSource={get(report, 'overall.severities', [])}
                    columns={generateColumnsFor('severities')}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Certainty Breakdown">
                  <Table
                    dataSource={get(report, 'overall.certainties', [])}
                    columns={generateColumnsFor('certainties')}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Event Responses Breakdown">
                  <Table
                    dataSource={get(report, 'overall.responses', [])}
                    columns={generateColumnsFor('responses')}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
            </Row>
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
            getEventsReport({ filter: { ...data } });
            setShowFilters(false);
          }}
          onCancel={() => setShowFilters(false)}
        />
      </Modal>
    </div>
  );
};

EventsOverviewDashboard.propTypes = {
  report: PropTypes.shape({ overview: PropTypes.objectOf(PropTypes.any) }),
  loading: PropTypes.bool.isRequired,
};

EventsOverviewDashboard.defaultProps = {
  report: null,
};

export default Connect(EventsOverviewDashboard, {
  report: 'eventsReport.data',
  loading: 'eventsReport.loading',
});
