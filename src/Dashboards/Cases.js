import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Col, Row, Spin, Table, Button, Modal } from 'antd';
import { BarChartOutlined, TableOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import map from 'lodash/map';
import randomColor from 'randomcolor';

import ReportFilters from '../components/ReportFilters';
import { NumberWidget, SectionCard } from '../components/dashboardWidgets';
import { FilterFloatingButton } from '../components/FloatingButton';
import {
  EChart,
  generateDonutChartOption,
  generateInvertedBarChartOption,
} from '../components/charts';

/* redux actions */
const { getCasesReport } = reduxActions;

/* constants */
const DISPLAY_TABLE = 'TABLE';
const DISPLAY_CHART = 'CHART';
const OCCUPATION_COLUMNS = [
  { title: 'Occupation', dataIndex: ['name', 'en'] },
  { title: 'Total', dataIndex: 'total' },
];

const STAGE_COLUMNS = [
  { title: 'Stage', dataIndex: ['name', 'en'] },
  { title: 'Total', dataIndex: 'total' },
];
const SEVERITY_COLUMNS = [
  { title: 'Severity', dataIndex: ['name', 'en'] },
  { title: 'Total', dataIndex: 'total' },
];

const NATIONALITY_COLUMNS = [
  { title: 'Nationality', dataIndex: ['name', 'en'] },
  { title: 'Total', dataIndex: 'total' },
];

const AGE_GROUPS_COLUMNS = [
  { title: 'Age Group', dataIndex: 'name' },
  { title: 'Total', dataIndex: 'value' },
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
  const [ageGroupsDisplay, setAgeGroupsDisplay] = useState(DISPLAY_TABLE);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getCasesReport();
  }, []);

  const GENDER_DATA = map(get(report, 'overall.gender', []), (item) => ({
    value: item.total,
    name: item.name.en,
  }));

  const AGE_GROUPS_DATA = map(get(report, 'overall.ageGroups', []), (item) => ({
    name: `${item.lowerBoundary} - ${item.upperBoundary}`,
    value: item.total || 0,
  }));

  return (
    <div>
      <FilterFloatingButton onClick={() => setShowFilters(true)} />
      <Spin spinning={loading}>
        <Row>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget
              title="Total"
              value={0}
              bottomBorderColor={randomColor()}
            />{' '}
          </Col>{' '}
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            {' '}
            <NumberWidget
              title="Suspect"
              value={0}
              bottomBorderColor={randomColor()}
            />{' '}
          </Col>{' '}
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget
              title="Probable"
              value={0}
              bottomBorderColor={randomColor()}
            />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget
              title="Tested"
              value={0}
              bottomBorderColor={randomColor()}
            />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget
              title="Treated"
              value={0}
              bottomBorderColor={randomColor()}
            />
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
            <NumberWidget
              title="Followup"
              value={0}
              bottomBorderColor={randomColor()}
            />
          </Col>
        </Row>
        {/* <Row> */}
        {/*   <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}> */}
        {/*     <NumberWidget title="Recovered" value={0} />{' '} */}
        {/*   </Col>{' '} */}
        {/*   <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}> */}
        {/*     <NumberWidget title="Mild" value={0} /> */}
        {/*   </Col> */}
        {/*   <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}> */}
        {/*     <NumberWidget title="Moderate" value={0} /> */}
        {/*   </Col> */}
        {/*   <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}> */}
        {/*     <NumberWidget title="Critical" value={0} /> */}
        {/*   </Col> */}
        {/*   <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}> */}
        {/*     <NumberWidget title="Severe" value={0} /> */}
        {/*   </Col> */}
        {/*   <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}> */}
        {/*     <NumberWidget title="Died" value={0} /> */}
        {/*   </Col> */}
        {/* </Row> */}
        <Row>
          <Col xs={24} sm={24} md={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Cases Breakdown - Stage">
                  <Table
                    dataSource={get(report, 'overall.stages', [])}
                    columns={STAGE_COLUMNS}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Cases Breakdown - Gender">
                  <EChart
                    option={generateDonutChartOption('Gender', GENDER_DATA)}
                  />
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

              <Col span={24}>
                <SectionCard title="Cases Breakdown - Occupation">
                  <Table
                    dataSource={get(report, 'overall.occupations', [])}
                    columns={OCCUPATION_COLUMNS}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Cases Breakdown - Severity">
                  <Table
                    dataSource={get(report, 'overall.severities', [])}
                    columns={SEVERITY_COLUMNS}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard
                  title="Cases Breakdown - Age Distributions"
                  actions={
                    <Button.Group>
                      <Button
                        icon={<TableOutlined />}
                        onClick={() => setAgeGroupsDisplay(DISPLAY_TABLE)}
                      />
                      <Button
                        icon={
                          <BarChartOutlined
                            onClick={() => setAgeGroupsDisplay(DISPLAY_CHART)}
                          />
                        }
                      />
                    </Button.Group>
                  }
                >
                  {ageGroupsDisplay === DISPLAY_TABLE && (
                    <Table
                      dataSource={AGE_GROUPS_DATA}
                      columns={AGE_GROUPS_COLUMNS}
                      pagination={false}
                    />
                  )}

                  {ageGroupsDisplay === DISPLAY_CHART && (
                    <EChart
                      option={generateInvertedBarChartOption(
                        'Cases Per Age Groups',
                        AGE_GROUPS_DATA,
                        'Cases',
                        'Age Groups'
                      )}
                      style={{ height: '800px' }}
                    />
                  )}
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
            getCasesReport({ filter: { ...data } });
            setShowFilters(false);
          }}
          onCancel={() => setShowFilters(false)}
        />
      </Modal>
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
