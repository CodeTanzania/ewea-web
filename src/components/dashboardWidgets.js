import React from 'react';
import PropTypes from 'prop-types';
import toUpper from 'lodash/toUpper';
import { Card, Typography, Col, Row, Tooltip } from 'antd';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';

const { Text } = Typography;

export const PRIMARY_COLOR = '#1890FF';
export const WARNING_COLOR = '#FAAD14';
export const DANGER_COLOR = '#FF4D4F';
export const SECONDARY_COLOR = '#979797';
export const SUCCESS_COLOR = '#52C41A';
export const PURPLE_COLOR = '#3F51B5';
export const DARK_GREEN = '#388E3C';

/**
 * @function
 * @name NumberWidget
 * @description Number widget for dashboards
 * @param {object} props Number widget props
 * @param {string} props.title Widget title
 * @param {string} props.secondaryText Widget muted secondary text
 * @param {number} props.value Number to be displayed on the card
 * @param {object} props.icon Antd Icon or file icon | image
 * @param {object} props.bottomBorderColor Bottom border color
 * @returns {object} Render Number widget component
 * @version 0.1.0
 * @since 0.1.0
 */
export const NumberWidget = ({
  title,
  secondaryText,
  value,
  icon,
  bottomBorderColor = SECONDARY_COLOR,
}) => {
  return (
    <Card
      style={{
        borderBottom: `3px solid  ${bottomBorderColor}`,
        margin: '10px',
        boxShadow: '0 0 10px #e9e9e9',
      }}
    >
      <Row>
        <Col span={22}>
          <Text style={{ color: '#8c8c8c', fontWeight: '600' }}>
            {toUpper(title)}
          </Text>
        </Col>
        <Col span={2}>{icon}</Col>
      </Row>
      <Text style={{ fontSize: '3.5em', fontWeight: '500' }}>{value}</Text>
      <br />
      <Text type="secondary">{secondaryText}</Text>
    </Card>
  );
};

NumberWidget.propTypes = {
  title: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  icon: PropTypes.node,
  value: PropTypes.number.isRequired,
  bottomBorderColor: PropTypes.string,
};

NumberWidget.defaultProps = {
  secondaryText: undefined,
  icon: null,
  bottomBorderColor: undefined,
};

/**
 * @function
 * @name TimeWidget
 * @description Time widget for dashboards
 * @param {object} props Number widget props
 * @param {string} props.title Widget title
 * @param {string} props.secondaryText Widget muted secondary text
 * @param {number} props.days Days on provided time
 * @param {number} props.hours Hours on provided time
 * @param {number} props.minutes Minutes on provided time
 * @param {object} props.icon Antd Icon or file icon | image
 * @param {object} props.bottomBorderColor Bottom border color
 * @returns {object} Render Number widget component
 * @version 0.1.0
 * @since 0.1.0
 */
export const TimeWidget = ({
  title,
  secondaryText,
  days,
  hours,
  minutes,
  icon,
  bottomBorderColor = SECONDARY_COLOR,
}) => {
  return (
    <Card
      style={{
        borderBottom: `3px solid  ${bottomBorderColor}`,
        margin: '10px',
        boxShadow: '0 0 10px #e9e9e9',
      }}
    >
      <Row>
        <Col span={22}>
          <Text style={{ color: '#8c8c8c', fontWeight: '600' }}>
            {toUpper(title)}
          </Text>
        </Col>
        <Col span={2}>{icon}</Col>
      </Row>
      <Row>
        <Col span={6}>
          <Text style={{ fontSize: '3em', fontWeight: '500' }}>{days}</Text>
          <Text type="secondary"> days</Text>
        </Col>
        <Col span={6}>
          <Text style={{ fontSize: '3em', fontWeight: '500' }}>{hours}</Text>
          <Text type="secondary"> hours</Text>
        </Col>
        <Col span={6}>
          <Text style={{ fontSize: '3em', fontWeight: '500' }}>{minutes}</Text>
          <Text type="secondary"> minutes</Text>
        </Col>
      </Row>

      <br />
      <Text type="secondary">{secondaryText}</Text>
    </Card>
  );
};

TimeWidget.propTypes = {
  title: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  icon: PropTypes.node,
  days: PropTypes.number,
  hours: PropTypes.number,
  minutes: PropTypes.number,
  bottomBorderColor: PropTypes.string,
};

TimeWidget.defaultProps = {
  secondaryText: undefined,
  icon: null,
  bottomBorderColor: undefined,
  days: 0,
  hours: 0,
  minutes: 0,
};
/**
 * @function
 * @name SectionCard
 * @description Card component for different sections in dashboard
 * @param {object} props Section Card component props
 * @param {string} props.title Card title
 * @param {object|object[]} props.children React Nodes
 * @returns {object} Section Card component
 * @version 0.1.0
 * @since 0.1.0
 */
export const SectionCard = ({ title, children }) => {
  return (
    <Card
      title={title}
      style={{ margin: '10px', boxShadow: '0 0 10px #e9e9e9' }}
    >
      {children}
    </Card>
  );
};

SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.instanceOf(PropTypes.node).isRequired,
};

/**
 * @function
 * @name MapWidget
 * @description Render SVG map inside sectionCard component
 * @param {object} props Map Widget component props
 * @param {string} props.title Title for section card
 * @param {string} props.shape Path to topojson file can be url or uri for file system
 * @param {number[]} props.center Center coordinates to position the map
 * @param {number} props.scale Scale number for the map
 * @param {Function} props.getGeographyAttributes Function to extract map attributes
 * @returns {object} Map Widget component
 * @version 0.1.0
 * @since 0.1.0
 */
export const MapWidget = ({
  title,
  shape,
  center,
  scale,
  getGeographyAttributes,
}) => {
  return (
    <SectionCard title={title}>
      <ComposableMap
        projectionConfig={{
          scale,
        }}
      >
        <ZoomableGroup center={center}>
          <Geographies geography={shape} disableOptimization>
            {({ geographies }) =>
              geographies.map((geography) => {
                const attributes = getGeographyAttributes(geography);
                return (
                  <Tooltip
                    trigger="hover"
                    title={attributes.name}
                    key={geography.rsmKey}
                  >
                    <Geography
                      key={geography.rsmKey}
                      geography={geography}
                      style={{
                        default: {
                          fill: '#ddd',
                          stroke: '#fff',
                          outline: 'none',
                        },
                        hover: {
                          fill: DARK_GREEN,
                          stroke: '#fff',
                          outline: 'none',
                        },
                        pressed: {
                          fill: SUCCESS_COLOR,
                          stroke: '#fff',
                          outline: 'none',
                        },
                      }}
                    />
                  </Tooltip>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </SectionCard>
  );
};

MapWidget.propTypes = {
  scale: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  shape: PropTypes.string.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  getGeographyAttributes: PropTypes.func.isRequired,
};
