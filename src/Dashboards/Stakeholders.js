import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Row, Col, Table, Spin } from 'antd';
import { getPartiesReport, Connect } from '@codetanzania/ewea-api-states';
import {
  ApartmentOutlined,
  UserOutlined,
  TeamOutlined,
  NumberOutlined,
} from '@ant-design/icons';

import {
  NumberWidget,
  SectionCard,
  PRIMARY_COLOR,
  PURPLE_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
} from '../components/dashboardWidgets';

const levelDataSource = [
  { level: 'Region', agencies: 10, focals: 30 },
  { level: 'Districts', agencies: 10, focals: 30 },
  { level: 'Ward', agencies: 10, focals: 30 },
];
const levelColumns = [
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: 'Agencies',
    dataIndex: 'agencies',
    key: 'agencies',
  },
  {
    title: 'Focal People',
    dataIndex: 'focals',
    key: 'focals',
  },
];

const groupDataSource = [
  { group: 'Defense & Security', agencies: 10, focals: 30 },
  { group: 'Faith Based Organization', agencies: 10, focals: 30 },
  { group: 'Hospitals', agencies: 10, focals: 30 },
  { group: 'Ambulance Services', agencies: 10, focals: 30 },
  { group: 'Scout', agencies: 10, focals: 30 },
  { group: 'Private Sector', agencies: 10, focals: 30 },
];

const groupColumns = [
  {
    title: 'Group',
    dataIndex: 'group',
    key: 'level',
  },
  {
    title: 'Agencies',
    dataIndex: 'agencies',
    key: 'agencies',
  },
  {
    title: 'Focal People',
    dataIndex: 'focals',
    key: 'focals',
  },
];

const StakeholdersDashboard = ({ report, loading }) => {
  useEffect(() => {
    getPartiesReport();
  }, []);

  return (
    <div style={{ backgroundColor: '#f5f5f547', height: '100%' }}>
      <Spin spinning={loading}>
        <Row>
          <Col span={6}>
            <NumberWidget
              title="Total"
              value={get(report, 'overview.total', 0)}
              icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
              secondaryText="Total Registered Stakeholders"
            />
          </Col>
          <Col span={6}>
            <NumberWidget
              title="Agencies"
              value={get(report, 'overview.agency', 0)}
              icon={<ApartmentOutlined style={{ color: SUCCESS_COLOR }} />}
              secondaryText="Registered Agencies"
              bottomBorderColor={SUCCESS_COLOR}
            />
          </Col>
          <Col span={6}>
            <NumberWidget
              title="Focal People"
              value={get(report, 'overview.focal', 0)}
              icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
              secondaryText="Registered Focal People"
              bottomBorderColor={PURPLE_COLOR}
            />
          </Col>
          <Col span={6}>
            <NumberWidget
              title="Groups"
              value={get(report, 'overview.group', 0)}
              icon={<TeamOutlined style={{ color: WARNING_COLOR }} />}
              secondaryText="Registered Stakeholder's Groups"
              bottomBorderColor={WARNING_COLOR}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Overview-Working Level Breakdown">
                  <Table
                    dataSource={levelDataSource}
                    columns={levelColumns}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overview-Working Level Breakdown">
                  <Table
                    dataSource={levelDataSource}
                    columns={levelColumns}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overview-Designated Groups Breakdown">
                  <Table
                    dataSource={groupDataSource}
                    columns={groupColumns}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Overview-Designated Groups Breakdown">
                  <Table
                    dataSource={groupDataSource}
                    columns={groupColumns}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overview-Designated Groups Breakdown">
                  <Table
                    dataSource={groupDataSource}
                    columns={groupColumns}
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

StakeholdersDashboard.propTypes = {
  report: PropTypes.shape({ overview: PropTypes.object }),
  loading: PropTypes.bool.isRequired,
};

StakeholdersDashboard.defaultProps = {
  report: null,
};

export default Connect(StakeholdersDashboard, {
  report: 'partiesReport.data',
  loading: 'partiesReport.loading',
});
