import React from 'react';
import { Row, Col, Table } from 'antd';
import {
  ApartmentOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import { NumberWidget, SectionCard } from '../components/dashboardWidgets';

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

const StakeholdersDashboard = () => {
  return (
    <div style={{ backgroundColor: '#f5f5f547', height: '100%' }}>
      <Row>
        <Col span={8}>
          <NumberWidget
            title="Agencies"
            value="190"
            icon={<ApartmentOutlined />}
          />
        </Col>
        <Col span={8}>
          <NumberWidget
            title="Focal People"
            value="190"
            icon={<UserOutlined />}
          />
        </Col>
        <Col span={8}>
          <NumberWidget title="Teams" value="190" icon={<TeamOutlined />} />
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
    </div>
  );
};

export default StakeholdersDashboard;
