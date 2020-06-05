import React from 'react';
import { Col, Row, Spin, Table } from 'antd';

import { NumberWidget, SectionCard } from '../components/dashboardWidgets';
import { DonutChart } from '../components/charts';

const OCCUPATION_COLUMNS = [
  { title: 'Occupation', dataIndex: 'occupation' },
  { title: 'Total', dataIndex: 'number' },
];

const OCCUPATION_DATA = [
  { occupation: 'Student', number: 20 },
  { occupation: 'Health Worker', number: 29 },
  { occupation: 'Businessman', number: 10 },
  { occupation: 'Health Worker', number: 2 },
];

const NATIONALITY_COLUMNS = [
  { title: 'Nationality', dataIndex: 'name' },
  { title: 'Total', dataIndex: 'number' },
];

const NATIONALITY_DATA = [
  { name: 'Tanzanian', number: 20 },
  { name: 'Kenyan', number: 29 },
  { name: 'Ugandan', number: 10 },
  { name: 'American', number: 2 },
];

const AGE_GROUPS_COLUMNS = [
  { title: 'Age Group', dataIndex: 'group' },
  { title: 'Total', dataIndex: 'number' },
];
const AGE_GROUPS_DATA = [
  { group: '0-9', number: 2 },
  { group: '10-19', number: 3 },
  { group: '20-29', number: 10 },
  { group: '30-39', number: 49 },
  { group: '40-49', number: 31 },
  { group: '50-59', number: 5 },
  { group: '60-69', number: 1 },
];

/**
 * @function
 * @name CasesDashboard
 * @description Cases Dashboard
 * @returns {object} Cases Dashboard
 * @version 0.1.0
 * @since 0.1.0
 */
const CasesDashboard = () => {
  return (
    <div>
      <Spin spinning={false}>
        <Row>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Total" value={0} />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Suspect" value={0} />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Probable" value={0} />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Tested" value={0} />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Treated" value={0} />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Followup" value={0} />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Recovered" value={0} />
          </Col>

          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Mild" value={0} />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Moderate" value={0} />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Critical" value={0} />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Severe" value={0} />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget title="Died" value={0} />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} md={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Cases Breakdown - Gender">
                  <DonutChart />
                </SectionCard>
              </Col>

              <Col span={24}>
                <SectionCard title="Cases Breakdown - Nationality">
                  <Table
                    dataSource={NATIONALITY_DATA}
                    columns={NATIONALITY_COLUMNS}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Cases Breakdown - Age Distributions">
                  <Table
                    dataSource={AGE_GROUPS_DATA}
                    columns={AGE_GROUPS_COLUMNS}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Cases Breakdown - Occupation">
                  <Table
                    dataSource={OCCUPATION_DATA}
                    columns={OCCUPATION_COLUMNS}
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

export default CasesDashboard;
