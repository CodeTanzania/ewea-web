import React from 'react';
import PropTypes from 'prop-types';

import { reduxActions } from '@codetanzania/ewea-api-states';
import { Button, Col, Row, Typography } from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { notifyError, notifySuccess } from '../../../util';
import './styles.css';
import BaseMap from '../../../components/BaseMap';

/* redux actions */
const { getFeature } = reduxActions;
const { Text } = Typography;

/**
 * @function
 * @name CriticalFacilityToolbar
 * @param props.criticalFacility
 * @param {object} props props object
 * @param {Function} props.onEdit edit callback
 * @description List of actions user can perform on a particular critical facility
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const CriticalFacilityToolbar = ({ criticalFacility, onEdit }) => {
  return (
    <div className="CriticalFacilityToolbar not-printable">
      <Row>
        <Col xs={4} sm={4} md={1}>
          <Button
            shape="circle"
            size="large"
            icon={<ReloadOutlined />}
            title="Refresh CriticalFacility"
            className="actionButton"
            onClick={() =>
              getFeature(
                // eslint-disable-next-line
                criticalFacility._id,
                () =>
                  notifySuccess('CriticalFacility was refreshed successfully'),
                () =>
                  notifyError(
                    'An error occurred while refreshing criticalFacility, please contact your system administrator'
                  )
              )
            }
          />
        </Col>

        <Col xs={0} sm={0} md={1}>
          <Button
            shape="circle"
            size="large"
            icon={<EditOutlined />}
            title="Edit CriticalFacility"
            className="actionButton"
            onClick={() => onEdit()}
          />
        </Col>
      </Row>
    </div>
  );
};

CriticalFacilityToolbar.propTypes = {
  criticalFacility: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

/**
 * @function
 * @name CriticalFacilityMapView
 *  @param {object} props props object
 * @param props.criticalFacility
 * @description visualization of a critical facility on map
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const CriticalFacilityMapView = ({ criticalFacility }) => {
  return criticalFacility?.geos?.point ? (
    <BaseMap />
  ) : (
    `Sorry we can't show map, this critical facility doesn't have spatial data ${JSON.stringify(
      criticalFacility.geos.point
    )}`
  );
};

CriticalFacilityMapView.propTypes = {
  criticalFacility: PropTypes.shape({
    _id: PropTypes.string,
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string,
      }),
      description: PropTypes.shape({
        en: PropTypes.string,
      }),
    }),
    geos: PropTypes.shape({
      point: PropTypes.shape({
        geometry: PropTypes.shape({
          type: PropTypes.string.isRequired,
          coordinates: PropTypes.arrayOf(PropTypes.any).isRequired,
        }),
      }),
    }),
  }).isRequired,
};

/**
 * @function
 * @name CriticalFacilityDetails
 * @param {object} props Props
 * @param {string} props.name critical facility name
 * @param {string} props.description critical facility description
 * @description This is event critical facility details section which will be visible
 * @returns {object} CriticalFacilityDetails Component
 * @version 0.1.0
 * @since 0.1.0
 */
const CriticalFacilityDetails = ({ name, description }) => (
  <>
    <p>
      <Text strong>Name: </Text> {name}
    </p>
    <p>
      <Text strong>Description:</Text> {description} <br />
    </p>
  </>
);

CriticalFacilityDetails.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

/**
 * @function
 * @name CriticalFacilityDetailsViewBody
 * @param {object} props React props
 * @param {object} props.criticalFacility valid event
 * @param {Function} props.onEdit edit callback
 * @description details of a critical facility
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const CriticalFacilityDetailsViewBody = ({ criticalFacility, onEdit }) => {
  return (
    <div className="CriticalFacilityDetailsViewBody">
      <CriticalFacilityToolbar
        criticalFacility={criticalFacility}
        onEdit={onEdit}
      />
      <div className="CriticalFacilityBodyContent">
        <Row>
          <Col xs={24} sm={24} md={24} lg={16}>
            <CriticalFacilityDetails
              description={criticalFacility.strings.description.en}
              name={criticalFacility.strings.name.en}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <CriticalFacilityMapView criticalFacility={criticalFacility} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CriticalFacilityDetailsViewBody;

CriticalFacilityDetailsViewBody.propTypes = {
  criticalFacility: PropTypes.shape({
    _id: PropTypes.string,
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string,
      }),
      description: PropTypes.shape({
        en: PropTypes.string,
      }),
    }),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
