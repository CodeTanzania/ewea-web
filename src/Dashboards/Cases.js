import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Col, Row, Spin, Table, Button, Modal, Divider } from 'antd';
import { BarChartOutlined, TableOutlined } from '@ant-design/icons';
import randomColor from 'randomcolor';
import get from 'lodash/get';
import map from 'lodash/map';

import ReportFilters from '../components/ReportFilters';
import {
  NumberWidget,
  SectionCard,
  FilterFloatingButton,
  Grid,
} from '../components/dashboardWidgets';
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
  { title: 'Occupation', dataIndex: ['name', 'en'], key: 'name' },
  { title: 'Total', dataIndex: 'total', key: 'total' },
];
const STAGE_COLUMNS = [
  { title: 'Stage', dataIndex: 'name', key: 'name' },
  { title: 'Total', dataIndex: 'value', key: 'total' },
];
const SEVERITY_COLUMNS = [
  { title: 'Severity', dataIndex: 'name', key: 'name' },
  { title: 'Total', dataIndex: 'value', key: 'total' },
];
const NATIONALITY_COLUMNS = [
  { title: 'Nationality', dataIndex: ['name', 'en'], key: 'name' },
  { title: 'Total', dataIndex: 'total', key: 'total' },
];
const AGE_GROUPS_COLUMNS = [
  { title: 'Age Group', dataIndex: 'name', key: 'name' },
  { title: 'Total', dataIndex: 'value', key: 'total' },
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
  const [severitiesDisplay, setSeveritiesDisplay] = useState(DISPLAY_CHART);
  const [stagesDisplay, setStagesDisplay] = useState(DISPLAY_CHART);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getCasesReport();
  }, []);

  const GENDER_DATA = map(get(report, 'overall.gender', []), (item) => ({
    value: item.total,
    name: item.name.en,
  }));

  const SEVERITY_DATA = map(get(report, 'overall.severities', []), (item) => ({
    value: item.total,
    name: get(item, 'name.en', 'N/A'),
  }));

  const STAGE_DATA = map(get(report, 'overall.stages', []), (item) => ({
    value: item.total,
    name: get(item, 'name.en', 'N/A'),
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
          <Col xs={24} sm={24} md={24}>
            <NumberWidget
              title="Total"
              value={get(report, 'overview.total', 0)}
              bottomBorderColor={randomColor()}
            />
          </Col>
        </Row>
        <Grid
          header="Case Stages"
          items={get(report, 'overall.stages', [])}
          colPerRow={4}
        />
        <Grid
          header="Case Severities"
          items={get(report, 'overall.severities', [])}
          colPerRow={4}
        />
        <Divider orientation="left" plain>
          Overall Breakdown
        </Divider>
        <Row>
          <Col xs={24} sm={24} md={12}>
            <Row>
              <Col span={24}>
                <SectionCard
                  title="Cases Breakdown - Stage"
                  actions={
                    <Button.Group>
                      <Button
                        icon={<TableOutlined />}
                        onClick={() => setStagesDisplay(DISPLAY_TABLE)}
                      />
                      <Button
                        icon={
                          <BarChartOutlined
                            onClick={() => setStagesDisplay(DISPLAY_CHART)}
                          />
                        }
                      />
                    </Button.Group>
                  }
                >
                  {stagesDisplay === DISPLAY_TABLE && (
                    <Table
                      dataSource={STAGE_DATA}
                      columns={STAGE_COLUMNS}
                      pagination={false}
                    />
                  )}

                  {stagesDisplay === DISPLAY_CHART && (
                    <EChart
                      option={generateDonutChartOption(
                        'Case Stages',
                        STAGE_DATA
                      )}
                    />
                  )}
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
                <SectionCard
                  title="Cases Breakdown - Severity"
                  actions={
                    <Button.Group>
                      <Button
                        icon={<TableOutlined />}
                        onClick={() => setSeveritiesDisplay(DISPLAY_TABLE)}
                      />
                      <Button
                        icon={
                          <BarChartOutlined
                            onClick={() => setSeveritiesDisplay(DISPLAY_CHART)}
                          />
                        }
                      />
                    </Button.Group>
                  }
                >
                  {severitiesDisplay === DISPLAY_TABLE && (
                    <Table
                      dataSource={SEVERITY_DATA}
                      columns={SEVERITY_COLUMNS}
                      pagination={false}
                    />
                  )}

                  {severitiesDisplay === DISPLAY_CHART && (
                    <EChart
                      option={generateDonutChartOption(
                        'Case Severity',
                        SEVERITY_DATA
                      )}
                    />
                  )}
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
                      style={{ height: '850px' }}
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
