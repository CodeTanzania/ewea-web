import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  Progress,
  Statistic,
  Icon,
  Typography,
  Popover,
} from 'antd';
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
    <Row gutter={8}>
      <Col span={8}>
        <Card title="Actions Dissemination Summary">
          <Row>
            <Col span={12}>
              <Progress
                type="circle"
                percent={(ACTED_UPON / ALL_ACTIONS) * 100}
                width={300}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Disseminated Actions"
                value={ALL_ACTIONS}
                valueStyle={{ color: '#1890ff' }}
                prefix={<Icon type="notification" />}
              />
              <Statistic
                title="Acted Upon Actions"
                value={ACTED_UPON}
                valueStyle={{ color: '#3f8600' }}
                prefix={<Icon type="check" />}
              />
              <Statistic
                title="Not Acted Upon Actions"
                value={NOT_ACTED_UPON}
                valueStyle={{ color: '#CB904D' }}
                prefix={<Icon type="exclamation" />}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={16}>
        <Card title="Agencies Summary">
          <Row>
            <Col span={4}>
              <Text strong>Agency Name</Text>
            </Col>
            <Col span={4}>
              <Text strong>Total Actions Disseminated</Text>
            </Col>
            <Col span={4}>
              <Text strong>Action Acted Upon</Text>
            </Col>
            <Col span={4}>
              <Text strong>Action Not Acted Upon</Text>
            </Col>
            <Col span={8}>
              <Text strong>Progress</Text>
            </Col>
          </Row>

          {AGENCIES.map(agency => (
            <Row key={agency.name} style={{ marginTop: '20px' }}>
              <Col span={4}>{agency.name} </Col>
              <Col span={4}>{agency.count} </Col>
              <Col span={4}>{agency.acted} </Col>
              <Col span={4}>{agency.notActed} </Col>
              <Col span={8}>
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

    <Card title="Wards Summary" style={{ marginTop: '30px' }}>
      <Row>
        <Col span={12}>
          <Row>
            <Col span={4}>
              <Text strong>Ward Name</Text>
            </Col>
            <Col span={4}>
              <Text strong>Total Actions Disseminated</Text>
            </Col>
            <Col span={4}>
              <Text strong>Action Acted Upon</Text>
            </Col>
            <Col span={4}>
              <Text strong>Action Not Acted Upon</Text>
            </Col>
            <Col span={8}>
              <Text strong>Progress</Text>
            </Col>
          </Row>
          {WARDS.map(ward => (
            <Row key={ward.name} style={{ marginTop: '20px' }}>
              <Col span={4}>{ward.name} </Col>
              <Col span={4}>{ward.count} </Col>
              <Col span={4}>{ward.acted} </Col>
              <Col span={4}>{ward.notActed} </Col>
              <Col span={8}>
                <Progress
                  percent={(ward.acted / ward.count) * 100}
                  status="active"
                />
              </Col>
            </Row>
          ))}
        </Col>
        <Col span={12}>
          {/* ward svg map */}
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
                  geographies.map(geography => {
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
