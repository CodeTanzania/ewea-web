import React from 'react';
import { Row, Col, Modal } from 'antd';
import get from 'lodash/get';
import {
  NumberOutlined,
  TeamOutlined,
  ApartmentOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { FilterFloatingButton } from '../components/FloatingButton';
import ReportFilters from '../components/ReportFilters';
import {
  NumberWidget,
  NumbersWidget,
  SectionCard,
  PRIMARY_COLOR,
  PURPLE_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
} from '../components/dashboardWidgets';
import useFilters from '../hooks/filters';

// TODO extract this to common file
/* constants */
const DEFAULT_FILTERS = {
  createdAt: {
    from: new Date(),
    to: new Date(),
  },
};

/**
 * @function
 * @name ParadeDashboard
 * @description Parade dashboard UI
 * @returns {object} Parade dashboard UI
 * @version 0.1.0
 * @since 0.1.0
 */
const ParadeDashboard = () => {
  const report = {};
  const { filters, setFilters, showFilters, setShowFilters } = useFilters(
    DEFAULT_FILTERS
  );

  return (
    <div>
      <FilterFloatingButton onClick={() => setShowFilters(true)} />
      <Row>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <NumberWidget
            title="Total"
            value={get(report, 'overview.total', 72)}
            icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
            bottomBorderColor={PRIMARY_COLOR}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <NumberWidget
            title="Reachable"
            value={get(report, 'overview.waiting', 33)}
            icon={<ApartmentOutlined style={{ color: SUCCESS_COLOR }} />}
            bottomBorderColor={SUCCESS_COLOR}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <NumberWidget
            title="Not Reachable"
            value={get(report, 'overview.dispatched', 39)}
            icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
            bottomBorderColor={PURPLE_COLOR}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <NumberWidget
            title="Coverage"
            value={get(report, 'overview.resolved', (33 / 72) * 100).toFixed(1)}
            suffix="%"
            icon={<TeamOutlined style={{ color: WARNING_COLOR }} />}
            bottomBorderColor={WARNING_COLOR}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} lg={12}>
          <Row>
            <Col span={24}>
              <SectionCard title="Ambulances">
                <Row>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Total"
                      value={get(report, 'overview.total', 10)}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Reachable"
                      value={get(report, 'overview.waiting', 8)}
                      icon={
                        <ApartmentOutlined style={{ color: SUCCESS_COLOR }} />
                      }
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Not Reachable"
                      value={get(report, 'overview.dispatched', 2)}
                      icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Coverage"
                      value={get(
                        report,
                        'overview.resolved',
                        ((8 / 10) * 100).toFixed(1)
                      )}
                      suffix="%"
                      icon={<TeamOutlined style={{ color: WARNING_COLOR }} />}
                    />
                  </Col>
                </Row>
              </SectionCard>
            </Col>
            <Col span={24}>
              <SectionCard title="Responders">
                <Row>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Total"
                      value={get(report, 'overview.total', 70)}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Drivers"
                      value={get(report, 'overview.waiting', 10)}
                      icon={
                        <ApartmentOutlined style={{ color: SUCCESS_COLOR }} />
                      }
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Nurses"
                      value={get(report, 'overview.dispatched', 10)}
                      icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Fire Fighters"
                      value={get(report, 'overview.resolved', 50)}
                      icon={<TeamOutlined style={{ color: WARNING_COLOR }} />}
                    />
                  </Col>
                </Row>
              </SectionCard>
            </Col>
          </Row>
        </Col>

        <Col xs={24} sm={24} lg={12}>
          <Row>
            <Col span={24}>
              <SectionCard title="Municipals">
                <Row>
                  <Col xs={24} sm={24} md={12}>
                    <NumbersWidget
                      title="Ilala"
                      items={[
                        { value: 12, label: 'Total' },
                        { value: 3, label: 'Reachable' },
                        { value: 8, label: 'Not Reachable' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                      progressValue={((3 / 12) * 100).toFixed(1)}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumbersWidget
                      title="Kinondoni"
                      items={[
                        { value: 10, label: 'Total' },
                        { value: 6, label: 'Reachable' },
                        { value: 4, label: 'Not Reachable' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                      progressValue={((6 / 10) * 100).toFixed(1)}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumbersWidget
                      title="Kigamboni"
                      items={[
                        { value: 22, label: 'Total' },
                        { value: 11, label: 'Reachable' },
                        { value: 11, label: 'Not Reachable' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                      progressValue={((11 / 22) * 100).toFixed(1)}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumbersWidget
                      title="Temeke"
                      items={[
                        { value: 12, label: 'Total' },
                        { value: 8, label: 'Reachable' },
                        { value: 4, label: 'Not Reachable' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                      progressValue={((8 / 12) * 100).toFixed(1)}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumbersWidget
                      title="Ubungo"
                      items={[
                        { value: 16, label: 'Total' },
                        { value: 5, label: 'Reachable' },
                        { value: 11, label: 'Not Reachable' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                      progressValue={((5 / 16) * 100).toFixed(1)}
                    />
                  </Col>
                </Row>
              </SectionCard>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        title="Filter Report"
        visible={showFilters}
        onCancel={() => setShowFilters(false)}
        footer={null}
        maskClosable={false}
        className="modal-window-50"
        destroyOnClose
      >
        <ReportFilters
          filters={filters}
          onFilter={(data) => {
            setFilters(data);
            setShowFilters(false);
          }}
          onClear={() => {
            setFilters(DEFAULT_FILTERS);
            setShowFilters(false);
          }}
          onCancel={() => setShowFilters(false)}
        />
      </Modal>
    </div>
  );
};

export default ParadeDashboard;
