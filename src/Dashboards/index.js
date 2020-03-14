import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Tooltip, Row, Button, Col } from 'antd';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

import DataWidget from '../components/DataWidget';
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
import RecentlyIssuedIcon from '../assets/icons/dashboards/recentlyissued.svg';
import RecentlyUpdatedIcon from '../assets/icons/dashboards/recentlyupdated.svg';
import ActiveAlertsIcon from '../assets/icons/dashboards/activealerts.svg';
import PopulationIcon from '../assets/icons/dashboards/population.svg';
import RespondersIcon from '../assets/icons/dashboards/responders.svg';
import ProneAreasIcon from '../assets/icons/dashboards/proneareas.svg';
import DarWards from '../assets/maps/dar.wards.json';
import './styles.css';

/* declarations */
const DAR_POPULATION = 4365000;
const BASE_COLOR = '#ff0000';

const horizontalWidgetSpan = { xxl: 6, xl: 6, lg: 12, md: 12, sm: 12, xs: 12 };
const verticalWidgetSpan = { xxl: 12, xl: 12, lg: 12, md: 12, sm: 12, xs: 12 };
const mapRowSpan = { xxl: 24, xl: 24, lg: 0, md: 0, sm: 0, xs: 0 };
const mapColSpan = { xxl: 16, xl: 16, lg: 24, md: 24, sm: 24, xs: 24 };
const populationColSpan = { xxl: 8, xl: 8, lg: 24, md: 24, sm: 24, xs: 24 };

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
      <Row>
        <Col>
          <Button
            type="default"
            shape="round"
            icon={<PlusOutlined />}
            size="small"
            onClick={handleZoomIn}
          />
        </Col>
        <Col>
          <Button
            type="default"
            shape="round"
            icon={<MinusOutlined />}
            size="small"
            onClick={handleZoomOut}
          />
        </Col>
      </Row>
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
        {/* eslint-disable react/jsx-props-no-spreading */}
        <Col {...mapColSpan}>
          <Row>
            <Col {...mapRowSpan}>
              <ZoomControl
                handleZoomOut={handleZoomOut}
                handleZoomIn={handleZoomIn}
              />
              {/* ward svg map */}
              <ComposableMap
                projectionConfig={{
                  scale: 50000,
                }}
                className="map-widget"
              >
                <ZoomableGroup
                  center={[39.3067144, -6.8699698]}
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
                                    ward &&
                                    geography.properties.fid === ward.fid
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
            </Col>
            {/* end ward svg map */}
            <Col {...horizontalWidgetSpan}>
              <DataWidget
                label="Strong Winds"
                value={12}
                title="Recently Issued Alert"
                header="Recently Issued"
                duration="2 days ago"
                icon={RecentlyIssuedIcon}
              />
            </Col>
            <Col {...horizontalWidgetSpan}>
              <DataWidget
                label="Heavy Rainfall"
                value={12}
                title="Recently Updated Alert"
                header="Recently Updated"
                duration="1 hour ago"
                icon={RecentlyUpdatedIcon}
              />
            </Col>
            <Col {...horizontalWidgetSpan}>
              <DataWidget
                label="Active Alerts"
                value={12}
                title="Active Alerts"
                icon={ActiveAlertsIcon}
              />
            </Col>
            <Col {...horizontalWidgetSpan}>
              <DataWidget
                label="Prone Areas"
                value={12}
                title="Prone Areas"
                icon={ProneAreasIcon}
              />
            </Col>
          </Row>
        </Col>

        {/* Ward summary card */}
        <Col {...populationColSpan}>
          <Row type="flex">
            <Col span={24}>
              <DataWidget
                label="Population"
                value={12}
                title="Population"
                icon={PopulationIcon}
              />
            </Col>

            {/* Men data Widget */}
            <Col {...verticalWidgetSpan}>
              <DataWidget
                label="Men"
                value="2M"
                title="Men Population"
                icon={MenIcon}
              />
            </Col>
            {/* Men data Widget */}

            {/* Women Data Widget */}
            <Col {...verticalWidgetSpan}>
              <DataWidget
                label="Women"
                value="1.9M"
                title="Women Population"
                icon={WomenIcon}
              />
            </Col>
            {/* End Women Data Widget */}

            {/* Children Widget */}
            <Col {...verticalWidgetSpan}>
              <DataWidget
                label="Children"
                value="500K"
                title="Children Population"
                icon={ChildrenIcon}
              />
            </Col>
            {/* end Children Widget */}

            {/* Disabled Widget */}
            <Col {...verticalWidgetSpan}>
              <DataWidget
                label="Disabled"
                value="120"
                title="Disabled Population"
                icon={DisabledIcon}
              />
            </Col>
            {/* End Disabled Widget */}

            {/* Elders Widget */}
            <Col {...verticalWidgetSpan}>
              <DataWidget
                label="Elders"
                value="200"
                title="Elders Population"
                icon={EldersIcon}
              />
            </Col>
            {/* end Elders Widget */}

            {/* Responders Widget */}
            <Col {...verticalWidgetSpan}>
              <DataWidget
                label="Responders"
                value="4"
                title="Responders Population"
                icon={RespondersIcon}
              />
            </Col>
            {/* End Responder Widget */}

            {/* Buildings At Risks */}
            <Col {...verticalWidgetSpan}>
              <DataWidget
                label="Buildings At Risks"
                value="4"
                title="Buildings At Risks"
                icon={BuildingsIcon}
              />
            </Col>
            {/* End Building At Risks */}

            {/* Households at Risk */}
            <Col {...verticalWidgetSpan}>
              <DataWidget
                label="Households At Risks"
                value="4"
                title="Households At Risks"
                icon={HouseholdsIcon}
              />
            </Col>
            {/* End Households at Risks */}

            {/* Hospitals At Risks */}
            <Col {...verticalWidgetSpan}>
              <DataWidget
                label="Hospitals At Risks"
                value="4"
                title="Hospitals At Risks"
                icon={HospitalsIcon}
              />
            </Col>
            {/* Hospital At Risk */}

            {/* Roads At Risks */}
            <Col {...verticalWidgetSpan}>
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
