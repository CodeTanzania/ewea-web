import React from 'react';
import PropTypes from 'prop-types';

import { reduxActions } from '@codetanzania/ewea-api-states';
import { Button, Col, Row } from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { notifyError, notifySuccess } from '../../../util';

/* redux actions */
const { getFeature } = reduxActions;

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
    </div>
  );
};

export default CriticalFacilityDetailsViewBody;

CriticalFacilityDetailsViewBody.propTypes = {
  criticalFacility: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

CriticalFacilityToolbar.propTypes = {
  criticalFacility: PropTypes.shape({
    _id: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
