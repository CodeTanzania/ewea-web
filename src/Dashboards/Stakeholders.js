import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Row, Col, Table, Spin, Modal } from 'antd';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import {
  ApartmentOutlined,
  UserOutlined,
  TeamOutlined,
  NumberOutlined,
} from '@ant-design/icons';

import ReportFilters from '../components/ReportFilters';
import {
  NumberWidget,
  MapWidget,
  SectionCard,
  PRIMARY_COLOR,
  PURPLE_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
} from '../components/dashboardWidgets';
import { FilterFloatingButton } from '../components/FloatingButton';
import DarDistricts from '../assets/maps/dar.districts.json';

const { getPartiesReport } = reduxActions;
const titleMap = {
  groups: 'Group',
  levels: 'Level',
  areas: 'Area',
  roles: 'Role',
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
      title: 'Agencies',
      dataIndex: 'agency',
    },
    {
      title: 'Focal People',
      dataIndex: 'focal',
    },
  ];
};

const StakeholdersDashboard = ({ report, loading }) => {
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getPartiesReport();
  }, []);

  return (
    <div>
      <FilterFloatingButton onClick={() => setShowFilters(true)} />
      <Spin spinning={loading}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Total"
              value={get(report, 'overview.total', 0)}
              icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
              bottomBorderColor={PRIMARY_COLOR}
              secondaryText="Total Registered Stakeholders"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Agencies"
              value={get(report, 'overview.agency', 0)}
              icon={<ApartmentOutlined style={{ color: SUCCESS_COLOR }} />}
              secondaryText="Registered Agencies"
              bottomBorderColor={SUCCESS_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Focal People"
              value={get(report, 'overview.focal', 0)}
              icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
              secondaryText="Registered Focal People"
              bottomBorderColor={PURPLE_COLOR}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            <NumberWidget
              title="Groups"
              value={get(report, 'overview.group', 0)}
              icon={<TeamOutlined style={{ color: WARNING_COLOR }} />}
              secondaryText="Stakeholder's Groups"
              bottomBorderColor={WARNING_COLOR}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24} lg={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Overall - Working Level Breakdown">
                  <Table
                    dataSource={get(report, 'overall.levels', [])}
                    columns={generateColumnsFor('levels', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <SectionCard title="Overall - Designated Groups Breakdown">
                  <Table
                    dataSource={get(report, 'overall.groups', [])}
                    columns={generateColumnsFor('groups', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Row>
              <Col span={24}>
                <SectionCard title="Overall - Performing Roles Breakdown">
                  <Table
                    dataSource={get(report, 'overall.roles', [])}
                    columns={generateColumnsFor('roles', titleMap)}
                    pagination={false}
                  />
                </SectionCard>
              </Col>
              <Col span={24}>
                <MapWidget
                  title="Overall - Area District breakdown"
                  shape={DarDistricts}
                  center={[39.3067144, -6.8699698]}
                  scale={50000}
                  getGeographyAttributes={(geography) => ({
                    name: get(geography, 'properties.District_N', 'N/A'),
                  })}
                />
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
            getPartiesReport({ filter: { ...data } });
            setShowFilters(false);
          }}
          onCancel={() => setShowFilters(false)}
        />
      </Modal>
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
