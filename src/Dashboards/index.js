import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Row, Button, Col, Card, Icon, Statistic } from 'antd';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { getRGBAColor } from '../util';
import DarWards from '../assets/maps/dar.wards.json';
import './styles.css';

/* declarations */
const DAR_POPULATION = 4365000;
const BASE_COLOR = '#ff0000';

/**
 * @function
 * @name ZoomControl
 * @description component that renders zoom controls
 *
 * @param {object} props - react props
 * @param {Function}  props.handleZoomIn - handles zoom in
 * @param {Function}  props.handleZoomOut - handles zoom in
 *
 * @returns {object} React Element
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const ZoomControl = ({ handleZoomIn, handleZoomOut }) => {
  return (
    <div className="ZoomControl">
      <Button onClick={handleZoomIn}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Button>
      <Button onClick={handleZoomOut}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Button>
    </div>
  );
};

ZoomControl.propTypes = {
  handleZoomIn: PropTypes.func.isRequired,
  handleZoomOut: PropTypes.func.isRequired,
};

/**
 * @function
 * @name OverviewDashboard
 * @description Simple dashboard to get overview of data in EMIS
 *
 * @returns {object} React Element
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const OverviewDashboard = () => {
  const [ward, setWard] = useState(null);
  const [zoom, setZoom] = useState(1);

  /**
   * @function
   * @name handleZoomIn
   * @description handle zoom in of svg map
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleZoomIn = () => {
    if (zoom >= 4) return;
    setZoom(zoom * 2);
  };

  /**
   * @function
   * @name handleZoomOut
   * @description handle zoom out of svg map
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleZoomOut = () => {
    if (zoom <= 0.25) return;
    setZoom(zoom / 2);
  };

  /**
   * @function
   * @name handleZoomEnd
   * @description {string} handle zoom end of svg map
   * @version 0.1.0
   * @since 0.1.0
   * @param {object} position handle position
   */
  const handleZoomEnd = position => {
    setZoom(position.zoom);
  };

  return (
    <div>
      <Row>
        <Col span={16}>
          <ZoomControl
            handleZoomOut={handleZoomOut}
            handleZoomIn={handleZoomIn}
          />
          {/* ward svg map */}
          <ComposableMap
            projectionConfig={{
              scale: 50000,
            }}
            width={1000}
            className="map-widget"
          >
            <ZoomableGroup
              center={[39.6067144, -6.9699698]}
              zoom={zoom}
              onZoomEnd={handleZoomEnd}
            >
              <Geographies geography={DarWards} disableOptimization>
                {({ geographies, projection }) =>
                  geographies.map(geography => {
                    const defaultColor = getRGBAColor(
                      BASE_COLOR,
                      (geography.properties.Ward_Pop / DAR_POPULATION) * 10
                    );

                    const hoverColor = getRGBAColor(BASE_COLOR, 0.55);
                    const pressedColor = getRGBAColor(BASE_COLOR, 0.75);

                    return (
                      <Tooltip
                        key={geography.properties.fid}
                        trigger="hover"
                        title={geography.properties.Ward_Name}
                      >
                        <Geography
                          key={geography.properties.fid}
                          geography={geography}
                          projection={projection}
                          onClick={() => setWard(geography.properties)}
                          style={{
                            default: {
                              fill:
                                ward && geography.properties.fid === ward.fid
                                  ? pressedColor
                                  : defaultColor,
                              stroke: '#607D8B',
                              strokeWidth: 0.75,
                              outline: 'none',
                            },
                            hover: {
                              fill: hoverColor,
                              stroke: '#607D8B',
                              strokeWidth: 0.75,
                              outline: 'none',
                            },
                            pressed: {
                              fill: pressedColor,
                              stroke: '#607D8B',
                              strokeWidth: 0.75,
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
          {/* end ward svg map */}
          <Row>
            <Col span={6}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Ward summary card */}
        <Col span={8}>
          <Row type="flex">
            <Col span={24}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="card-widget">
                <Statistic
                  title="Active"
                  value={11.28}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<Icon type="arrow-up" />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
        </Col>
        {/* end ward summary card */}
      </Row>
    </div>
  );
};

export default OverviewDashboard;
