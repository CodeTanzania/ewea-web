import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Col, Row, Spin, Table } from 'antd';
import get from 'lodash/get';

import { NumberWidget, SectionCard } from '../components/dashboardWidgets';
import { DonutChart } from '../components/charts';

const { getCasesReport } = reduxActions;
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
  { title: 'Nationality', dataIndex: ['name', 'en'] },
  { title: 'Total', dataIndex: 'total' },
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
 * @param {object} props Case dashboard properties object
 * @param {object} props.report Case report data from the API
 * @param {boolean} props.loading Flag for showing spinner while loading report
 * @returns {object} Cases Dashboard
 * @version 0.1.0
 * @since 0.1.0
 */
const CasesDashboard = ({ report, loading }) => {
  useEffect(() => {
    getCasesReport();
  }, []);
  return (
    <div>
      <Spin spinning={loading}>
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
                    dataSource={get(report, 'overall.nationalities', [])}
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

CasesDashboard.propTypes = {
  report: PropTypes.shape({ overview: PropTypes.object }),
  loading: PropTypes.bool.isRequired,
};

CasesDashboard.defaultProps = {
  report: null,
};

export default Connect(CasesDashboard, {
  report: 'casesReport.data',
  loading: 'casesReport.loading',
});
