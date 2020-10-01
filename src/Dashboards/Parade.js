import React from 'react';
import { Row, Col } from 'antd';
import get from 'lodash/get';
import {
  NumberOutlined,
  TeamOutlined,
  ApartmentOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { FilterFloatingButton } from '../components/FloatingButton';
import {
  NumberWidget,
  NumbersWidget,
  SectionCard,
  PRIMARY_COLOR,
  PURPLE_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
} from '../components/dashboardWidgets';

const ParadeDashboard = () => {
  const report = {};
  return (
    <div>
      <FilterFloatingButton onClick={() => {}} />
      <Row>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <NumberWidget
            title="Total"
            value={get(report, 'overview.total', 0)}
            icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
            bottomBorderColor={PRIMARY_COLOR}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <NumberWidget
            title="Reachable"
            value={get(report, 'overview.waiting', 0)}
            icon={<ApartmentOutlined style={{ color: SUCCESS_COLOR }} />}
            bottomBorderColor={SUCCESS_COLOR}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <NumberWidget
            title="Not Reachable"
            value={get(report, 'overview.dispatched', 0)}
            icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
            bottomBorderColor={PURPLE_COLOR}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
          <NumberWidget
            title="Coverage"
            value={get(report, 'overview.resolved', 50)}
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
                      value={get(report, 'overview.total', 0)}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Reachable"
                      value={get(report, 'overview.waiting', 0)}
                      icon={
                        <ApartmentOutlined style={{ color: SUCCESS_COLOR }} />
                      }
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Not Reachable"
                      value={get(report, 'overview.dispatched', 0)}
                      icon={<UserOutlined style={{ color: PURPLE_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumberWidget
                      title="Coverage"
                      value={get(report, 'overview.resolved', 50)}
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
                      value={get(report, 'overview.total', 0)}
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
                        { value: 10, label: 'Total' },
                        { value: 5, label: 'Responded' },
                        { value: 5, label: 'Not Responded' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumbersWidget
                      title="Kinondoni"
                      items={[
                        { value: 10, label: 'Total' },
                        { value: 5, label: 'Responded' },
                        { value: 5, label: 'Not Responded' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumbersWidget
                      title="Kigamboni"
                      items={[
                        { value: 10, label: 'Total' },
                        { value: 5, label: 'Responded' },
                        { value: 5, label: 'Not Responded' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumbersWidget
                      title="Temeke"
                      items={[
                        { value: 10, label: 'Total' },
                        { value: 5, label: 'Responded' },
                        { value: 5, label: 'Not Responded' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                    />
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <NumbersWidget
                      title="Ubungo"
                      items={[
                        { value: 10, label: 'Total' },
                        { value: 5, label: 'Responded' },
                        { value: 5, label: 'Not Responded' },
                      ]}
                      icon={<NumberOutlined style={{ color: PRIMARY_COLOR }} />}
                    />
                  </Col>
                </Row>
              </SectionCard>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ParadeDashboard;
