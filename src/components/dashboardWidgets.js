import React from 'react';
import PropTypes from 'prop-types';
import toUpper from 'lodash/toUpper';
import map from 'lodash/map';
import {
  Affix,
  Button,
  Card,
  Typography,
  Col,
  Row,
  Tooltip,
  Progress,
} from 'antd';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { FilterOutlined } from '@ant-design/icons';

const { Text } = Typography;
export const PRIMARY_COLOR = '#1890FF';
export const WARNING_COLOR = '#FAAD14';
export const DANGER_COLOR = '#FF4D4F';
export const SECONDARY_COLOR = '#979797';
export const SUCCESS_COLOR = '#52C41A';
export const PURPLE_COLOR = '#3F51B5';
export const DARK_GREEN = '#388E3C';

// TODO extract inline styles to external file

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
 * @param {string} props.suffix Symbol or text to be appended after value
 * @returns {object} Render Number widget component
 * @version 0.1.0
 * @since 0.1.0
 */
export const NumberWidget = ({
  title,
  secondaryText,
  value,
  icon,
  bottomBorderColor,
  suffix,
}) => {
  return (
    <Card
      style={{
        borderBottom: bottomBorderColor
          ? `3px solid  ${bottomBorderColor}`
          : 'none',
        margin: '5px',
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
      <Text style={{ fontSize: '3.0em', fontWeight: '500' }}>
        {value}
        {suffix}
      </Text>
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
  suffix: PropTypes.string,
};

NumberWidget.defaultProps = {
  secondaryText: undefined,
  icon: null,
  bottomBorderColor: undefined,
  suffix: undefined,
};

/**
 * @function
 * @name NumbersWidget
 * @description Display multiple numbers on the same card
 * @param {props} props Component properties object
 * @param {string} props.title Widget title
 * @param {object} props.icon Antd Icon or file icon | image
 * @param {string} props.secondaryText Widget muted secondary text
 * @param {object[]} props.items Items to be displayed
 * @param {string} props.bottomBorderColor Bottom border color
 * @returns {object} Render Number widget component
 * @version 0.1.0
 * @since 0.1.0
 */
export const NumbersWidget = ({
  icon,
  title,
  secondaryText,
  items,
  bottomBorderColor,
  progressValue,
}) => {
  return (
    <Card
      style={{
        borderBottom: `3px solid  ${bottomBorderColor}`,
        margin: '5px',
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
        {map(items, (item) => (
          <Col xs={8} sm={8} lg={8} xl={8}>
            <Row style={{ paddingTop: '10px' }}>
              <Col xs={24} sm={24} style={{ textAlign: 'center' }}>
                <Text
                  style={{
                    fontSize: '1.5em',
                    fontWeight: '500',
                  }}
                >
                  {item.value}
                </Text>
              </Col>
              <Col xs={24} sm={24} style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: '0.8em' }}>
                  {item.label}
                </Text>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
      <br />
      <Text type="secondary">{secondaryText}</Text>
      {progressValue >= 0 && (
        <div style={{ margin: '0 auto', width: '50%' }}>
          <Progress type="circle" percent={progressValue} />
        </div>
      )}
    </Card>
  );
};

NumbersWidget.propTypes = {
  title: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  icon: PropTypes.node,
  bottomBorderColor: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.value, label: PropTypes.string })
  ),
  progressValue: PropTypes.number,
};

NumbersWidget.defaultProps = {
  secondaryText: undefined,
  icon: null,
  bottomBorderColor: undefined,
  items: [],
  progressValue: undefined,
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
 * @param {string} props.bottomBorderColor Bottom border color
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
        <Col xs={8} sm={8} lg={8} xl={6}>
          <Text style={{ fontSize: '2em', fontWeight: '500' }}>{days}</Text>
          <Text type="secondary"> days</Text>
        </Col>
        <Col xs={8} sm={8} lg={8} xl={6}>
          <Text style={{ fontSize: '2em', fontWeight: '500' }}>{hours}</Text>
          <Text type="secondary"> hours</Text>
        </Col>
        <Col xs={8} sm={8} lg={8} xl={6}>
          <Text style={{ fontSize: '2em', fontWeight: '500' }}>{minutes}</Text>
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
 * @param {object} props.actions Card extra actions
 * @param {object|object[]} props.children React Nodes
 * @returns {object} Section Card component
 * @version 0.1.0
 * @since 0.1.0
 */
export const SectionCard = ({ title, children, actions }) => {
  return (
    <Card
      title={title}
      style={{
        margin: '5px',
        boxShadow: '0 0 10px #e9e9e9',
      }}
      bodyStyle={{ overflow: 'auto', padding: '15px' }}
      extra={actions}
    >
      {children}
    </Card>
  );
};

SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]).isRequired,
  actions: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};

SectionCard.defaultProps = {
  actions: null,
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

/**
 * @function
 * @name FilterFloatingButton
 * @description Floating button for opening filters
 * @param {object} props Component object properties
 * @param {Function} props.onClick On click callback
 * @returns {object} FilterFloatingButton
 * @version 0.1.0
 * @since 0.1.0
 */
export const FilterFloatingButton = ({ onClick }) => {
  return (
    <Affix
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '35px',
        zIndex: 1000,
      }}
    >
      <Button
        shape="circle"
        type="primary"
        title="Click to filter"
        icon={<FilterOutlined />}
        size="large"
        style={{
          height: '60px',
          width: '60px',
          fontSize: '25px',
        }}
        onClick={onClick}
      />
    </Affix>
  );
};

FilterFloatingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
