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
 * @param props.title
 * @param props.secondaryText
 * @param props.value
 * @param props.icon
 * @param props.bottomBorderColor
 * @name NumberWidget
 * @description Number widget for dashboards
 * @param {object} props Number widget props
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
 * @param props.title
 * @param props.children
 * @name SectionCard
 * @description Card component for different sections in dashboard
 * @param {object} props Section Card component props
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
 * @param props.title
 * @param props.shape
 * @param props.center
 * @param props.scale
 * @name MapWidget
 * @description Render SVG map inside sectionCard component
 * @param {object} props Map Widget component props
 * @returns {object} Map Widget component
 * @version 0.1.0
 * @since 0.1.0
 */
export const MapWidget = ({ title, shape, center, scale }) => {
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
              geographies.map((geography) => (
                <Tooltip trigger="hover" title="Area" key={geography.rsmKey}>
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
              ))
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
};
