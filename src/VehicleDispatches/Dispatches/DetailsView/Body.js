import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions } from 'antd';
import get from 'lodash/get';
import map from 'lodash/map';

/**
 * @function
 * @name VehicleDispatchViewBody
 * @description Details View for vehicle dispatches
 * @param {object} props Component properties object
 * @param {object} props.dispatch Vehicle Dispatch to be displayed
 * @returns {object} VehicleDispatchView Body details
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleDispatchViewBody = ({ dispatch }) => {
  return (
    <>
      <Descriptions title="General Details" layout="vertical">
        <Descriptions.Item label="Dispatch No.">
          {get(dispatch, 'number', 'N/A')}
        </Descriptions.Item>
        <Descriptions.Item label="Priority">
          {get(dispatch, 'priority.strings.name.en', 'N/A')}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {get(dispatch, 'status.strings.name.en', 'N/A')}
        </Descriptions.Item>

        <Descriptions.Item label="Requester">
          {get(dispatch, 'requester.name')}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {get(dispatch, 'requester.mobile', 'N/A')}
        </Descriptions.Item>
        <br />
        <Descriptions.Item label="Pickup Location">
          {get(dispatch, 'pickup.facility.strings.name.en', 'N/A')}
        </Descriptions.Item>
        <Descriptions.Item label="Drop-Off Location">
          {get(dispatch, 'dropoff.facility.strings.name.en', 'N/A')}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="Victim Details" layout="vertical">
        <Descriptions.Item label="Name">
          {get(dispatch, 'victim.name', 'N/A')}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {get(dispatch, 'victim.mobile', 'N/A')}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          {get(dispatch, 'victim.gender.strings.name.en', 'N/A')}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="Vehicle" layout="vertical">
        <Descriptions.Item label="Vehicle">
          {`${get(dispatch, 'carrier.vehicle.strings.name.en', 'N/A')} - ${get(
            dispatch,
            'carrier.vehicle.relations.type.strings.name.en',
            'N/A'
          )}`}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="Crew" layout="vertical">
        {map(get(dispatch, 'crew', []), (member) => (
          <Descriptions.Item label="Name">
            {`${get(member, 'party.name')} (${get(
              member,
              'party.mobile',
              'N/a'
            )})`}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </>
  );
};

VehicleDispatchViewBody.propTypes = {
  dispatch: PropTypes.shape({ _id: PropTypes.string.isRequired }).isRequired,
};

export default VehicleDispatchViewBody;
