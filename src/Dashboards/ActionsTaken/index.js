import React from 'react';
import PropTypes from 'prop-types';
import {
  CheckOutlined,
  ExclamationOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { Row, Col, Card, Progress, Statistic, Typography, Popover } from 'antd';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import DarWards from '../../assets/maps/dar.wards.json';

/* declarations */
const { Text } = Typography;
const ALL_ACTIONS = 300;
const ACTED_UPON = 150;
const NOT_ACTED_UPON = 150;
const AGENCIES = [
  { name: 'TRCS', count: 100, acted: 20, notActed: 80 },
  { name: 'BRT', count: 100, acted: 60, notActed: 40 },
  { name: 'POLICE', count: 100, acted: 50, notActed: 50 },
  { name: 'FIRE', count: 100, acted: 30, notActed: 70 },
];
const WARDS = [
  { name: 'Kigogo', count: 100, acted: 20, notActed: 80 },
  { name: 'Vinguguti', count: 100, acted: 60, notActed: 40 },
  { name: 'Tabata', count: 100, acted: 50, notActed: 50 },
  { name: 'Mburahati', count: 100, acted: 30, notActed: 70 },
  { name: 'Hananasifu', count: 100, acted: 30, notActed: 70 },
  { name: 'Mabibo', count: 100, acted: 30, notActed: 70 },
];
const SELECTED_WARDS = [
  'Kigogo',
  'Mabibo',
  'Tabata',
  'Vingunguti',
  'Hananasifu',
  'Mburahati',
];

const agenciesSummary = { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 24 };
const actionsDissemination = {
  xxl: 24,
  xl: 24,
  lg: 24,
  md: 24,
  sm: 24,
  xs: 24,
};
const actionsSummaryGraph = { xxl: 8, xl: 8, lg: 10, md: 12, sm: 24, xs: 24 };
const actionsSummaryText = { xxl: 16, xl: 16, lg: 14, md: 12, sm: 24, xs: 24 };
const summaryColSpan = { xxl: 8, xl: 8, lg: 8, md: 8, sm: 8, xs: 8 };

const wardsSummary = { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 24 };
const agencySpan = { xxl: 6, xl: 6, lg: 6, md: 7, sm: 7, xs: 7 };
const wardSpan = { xxl: 6, xl: 6, lg: 6, md: 7, sm: 7, xs: 7 };

const disseminatedSpan = { xxl: 4, xl: 4, lg: 4, md: 0, sm: 0, xs: 0 };
const actedUponSpan = { xxl: 4, xl: 4, lg: 4, md: 5, sm: 5, xs: 5 };
const notActedUponSpan = { xxl: 4, xl: 4, lg: 4, md: 5, sm: 5, xs: 5 };
const progressSpan = { xxl: 6, xl: 6, lg: 6, md: 7, sm: 7, xs: 7 };

const mapSpan = { xxl: 24, xl: 24, lg: 24, md: 24, sm: 0, xs: 0 };

/**
 * @function
 * @name WardSummary
 * @description Ward summary component to be shown on popover component on hover map ward
 * @param {object} prop React props object
 * @param {object} prop.details Ward details from react simple map
 * @returns {object} React Component
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const WardSummary = ({ details }) => (
  <div>
    <p>
      <Text strong>District :</Text> {details.District_N}
    </p>
    <p>
      <Text strong>Population :</Text> {details.Ward_Pop}
    </p>
    <p>
      <Text strong>Male Pop. :</Text> {details.Male_Pop}
    </p>
    <p>
      <Text strong>Female Pop. :</Text> {details.Female_Pop}
    </p>
    <p>
      <Text strong>Progress :</Text>
    </p>
    <Progress percent={60} type="circle" status="active" />
  </div>
);

WardSummary.propTypes = {
  details: PropTypes.objectOf({
    District_N: PropTypes.string,
    Ward_Pop: PropTypes.number,
    Male_Pop: PropTypes.number,
    Female_Pop: PropTypes.number,
  }).isRequired,
};

/**
 * @function
 * @name ActionsTaken
 * @description Action Taken visualization Dashboard
 *
 * @returns {object} React Component
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const ActionsTaken = () => (
  <div style={{ padding: '10px' }}>
    <Row>
      {/* eslint-disable react/jsx-props-no-spreading */}
      <Col {...actionsDissemination}>
        <Card title="Actions Dissemination Summary">
          <Row>
            <Col {...actionsSummaryGraph}>
              <Progress
                type="circle"
                percent={(ACTED_UPON / ALL_ACTIONS) * 100}
                width={300}
              />
            </Col>
            <Col {...actionsSummaryText}>
              <Row>
                <Col {...summaryColSpan}>
                  <Statistic
                    title="Disseminated Actions"
                    value={ALL_ACTIONS}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<NotificationOutlined />}
                  />
                  <Statistic
                    title="Acted Upon Actions"
                    value={ACTED_UPON}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<CheckOutlined />}
                  />
                </Col>
                <Col {...summaryColSpan}>
                  <Statistic
                    title="Not Acted Upon Actions"
                    value={NOT_ACTED_UPON}
                    valueStyle={{ color: '#CB904D' }}
                    prefix={<ExclamationOutlined />}
                  />
                  <Statistic
                    title="Agencies Involved"
                    value={ALL_ACTIONS}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<NotificationOutlined />}
                  />
                </Col>
                <Col {...summaryColSpan}>
                  <Statistic
                    title="wards Involved"
                    value={ACTED_UPON}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<CheckOutlined />}
                  />
                  <Statistic
                    title="Responding Focal People "
                    value={NOT_ACTED_UPON}
                    valueStyle={{ color: '#CB904D' }}
                    prefix={<ExclamationOutlined />}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Row gutter={8}>
      <Col {...agenciesSummary}>
        <Card title="Actions Summary for Agencies ">
          <Row>
            <Col {...agencySpan}>
              <Text strong>Agency Name</Text>
            </Col>
            <Col {...disseminatedSpan}>
              <Text strong>Disseminated</Text>
            </Col>
            <Col {...actedUponSpan}>
              <Text strong>Acted Upon</Text>
            </Col>
            <Col {...notActedUponSpan}>
              <Text strong>Not Acted Upon</Text>
            </Col>
            <Col {...progressSpan}>
              <Text strong>Progress</Text>
            </Col>
          </Row>

          {AGENCIES.map((agency) => (
            <Row key={agency.name} style={{ marginTop: '20px' }}>
              <Col {...agencySpan}>{agency.name} </Col>
              <Col {...disseminatedSpan}>{agency.count} </Col>
              <Col {...actedUponSpan}>{agency.acted} </Col>
              <Col {...notActedUponSpan}>{agency.notActed} </Col>
              <Col {...progressSpan}>
                <Progress
                  percent={(agency.acted / agency.count) * 100}
                  status="active"
                />
              </Col>
            </Row>
          ))}
        </Card>
      </Col>
    </Row>

    <Card title="Actions Summary for Wards" style={{ marginTop: '30px' }}>
      <Row>
        <Col {...wardsSummary}>
          <Row>
            <Col {...wardSpan}>
              <Text strong>Ward Name</Text>
            </Col>
            <Col {...disseminatedSpan}>
              <Text strong>Disseminated</Text>
            </Col>
            <Col {...actedUponSpan}>
              <Text strong>Acted Upon</Text>
            </Col>
            <Col {...notActedUponSpan}>
              <Text strong>Not Acted Upon</Text>
            </Col>
            <Col {...progressSpan}>
              <Text strong>Progress</Text>
            </Col>
          </Row>
          {WARDS.map((ward) => (
            <Row key={ward.name} style={{ marginTop: '20px' }}>
              <Col {...wardSpan}>{ward.name} </Col>
              <Col {...disseminatedSpan}>{ward.count} </Col>
              <Col {...actedUponSpan}>{ward.acted} </Col>
              <Col {...notActedUponSpan}>{ward.notActed} </Col>
              <Col {...progressSpan}>
                <Progress
                  percent={(ward.acted / ward.count) * 100}
                  status="active"
                />
              </Col>
            </Row>
          ))}
        </Col>
        <Col {...mapSpan}>
          {/* ward svg map */}
          {/* eslint-disable react/jsx-props-no-spreading */}
          <ComposableMap
            projectionConfig={{
              scale: 80000,
              xOffset: -70,
              yOffset: -50,
            }}
            width={1000}
            height={850}
            style={{
              margin: '10px 50px',
            }}
          >
            <ZoomableGroup center={[39.1037144, -6.7923668]}>
              <Geographies geography={DarWards} disableOptimization>
                {({ geographies, projection }) =>
                  geographies.map((geography) => {
                    const fillColor = SELECTED_WARDS.includes(
                      geography.properties.Ward_Name
                    )
                      ? '#CB904D'
                      : '#ffffff';

                    return (
                      <Popover
                        key={geography.properties.fid}
                        trigger="hover"
                        content={<WardSummary details={geography.properties} />}
                        title={geography.properties.Ward_Name}
                      >
                        <Geography
                          key={geography.properties.fid}
                          geography={geography}
                          projection={projection}
                          style={{
                            default: {
                              fill: fillColor,
                              stroke: '#607D8B',
                              strokeWidth: 0.75,
                              outline: 'none',
                            },
                            hover: {
                              stroke: '#607D8B',
                              strokeWidth: 0.75,
                              outline: 'none',
                            },
                            pressed: {
                              stroke: '#607D8B',
                              strokeWidth: 0.75,
                              outline: 'none',
                            },
                          }}
                        />
                      </Popover>
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          {/* end ward svg map */}
        </Col>
      </Row>
    </Card>
  </div>
);

export default ActionsTaken;
