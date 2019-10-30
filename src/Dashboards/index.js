import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Row, Button, Col, Card, Icon, Statistic } from 'antd';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

import DataWidget from './DataWidget';
import { getRGBAColor } from '../util';
import MenIcon from '../assets/icons/dashboards/men.svg';
import WomenIcon from '../assets/icons/dashboards/women.svg';
import ChildrenIcon from '../assets/icons/dashboards/children.svg';
import DisabledIcon from '../assets/icons/dashboards/disabled.svg';
import EldersIcon from '../assets/icons/dashboards/elders.svg';
import BuildingsIcon from '../assets/icons/dashboards/buildingsatrisk.svg';
import HouseholdsIcon from '../assets/icons/dashboards/houseatrisk.svg';
import HospitalsIcon from '../assets/icons/dashboards/hospitalsatrisk.svg';
import RoadsIcons from '../assets/icons/dashboards/roadsatrisk.svg';
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
      <Button type="default" shape="round" icon="plus" onClick={handleZoomIn} />
      <Button
        type="default"
        shape="round"
        icon="minus"
        onClick={handleZoomOut}
      />
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
const AlertDashboard = () => {
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
   * @description handle zoom end of svg map
   * @param {object} position zoom position
   *
   * @version 0.1.0
   * @since 0.1.0
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
              <DataWidget
                label="Men"
                value={12}
                title="Men Population"
                icon={MenIcon}
              />
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

            {/* Men data Widget */}
            <Col span={12}>
              <DataWidget
                label="Men"
                value="2M"
                title="Men Population"
                icon={MenIcon}
              />
            </Col>
            {/* Men data Widget */}

            {/* Women Data Widget */}
            <Col span={12}>
              <DataWidget
                label="Women"
                value="1.9M"
                title="Women Population"
                icon={WomenIcon}
              />
            </Col>
            {/* End Women Data Widget */}

            {/* Children Widget */}
            <Col span={12}>
              <DataWidget
                label="Children"
                value="500K"
                title="Children Population"
                icon={ChildrenIcon}
              />
            </Col>
            {/* end Children Widget */}

            {/* Disabled Widget */}
            <Col span={12}>
              <DataWidget
                label="Disabled"
                value="120"
                title="Disabled Population"
                icon={DisabledIcon}
              />
            </Col>
            {/* End Disabled Widget */}

            {/* Elders Widget */}
            <Col span={12}>
              <DataWidget
                label="Elders"
                value="200"
                title="Elders Population"
                icon={EldersIcon}
              />
            </Col>
            {/* end Elders Widget */}

            {/* Responders Widget */}
            <Col span={12}>
              <DataWidget
                label="Responders"
                value="4"
                title="Responders Population"
                icon={MenIcon}
              />
            </Col>
            {/* End Responder Widget */}

            {/* Buildings At Risks */}
            <Col span={12}>
              <DataWidget
                label="Buildings At Risks"
                value="4"
                title="Buildings At Risks"
                icon={BuildingsIcon}
              />
            </Col>
            {/* End Building At Risks */}

            {/* Households at Risk */}
            <Col span={12}>
              <DataWidget
                label="Households At Risks"
                value="4"
                title="Households At Risks"
                icon={HouseholdsIcon}
              />
            </Col>
            {/* End Households at Risks */}

            {/* Hospitals At Risks */}
            <Col span={12}>
              <DataWidget
                label="Hospitals At Risks"
                value="4"
                title="Hospitals At Risks"
                icon={HospitalsIcon}
              />
            </Col>
            {/* Hospital At Risk */}

            {/* Roads At Risks */}
            <Col span={12}>
              <DataWidget
                label="Roads At Risks"
                value="4"
                title="Roads At Risks"
                icon={RoadsIcons}
              />
            </Col>
            {/* Roads At Risk */}
          </Row>
        </Col>
        {/* end ward summary card */}
      </Row>
    </div>
  );
};

export default AlertDashboard;
