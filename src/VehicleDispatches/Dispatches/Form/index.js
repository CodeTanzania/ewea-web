import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { reduxActions } from '@codetanzania/ewea-api-states';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Steps,
  DatePicker,
} from 'antd';
import moment from 'moment';
import get from 'lodash/get';
import map from 'lodash/map';

import SearchableSelectInput from '../../../components/SearchableSelectInput';
import { notifySuccess, notifyError } from '../../../util';

const {
  getFeatures,
  getAdministrativeAreas,
  getVehicles,
  getEventTypes,
  getPartyGenders,
  getFocalPeople,
} = httpActions;
const { postDispatch, putDispatch } = reduxActions;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
};
const { Step } = Steps;

/**
 * @function
 * @name VehicleDispatchForm
 * @description Vehicle Dispatch form for ambulances and fire
 * @param {object} props Dispatch Form props
 * @returns {object} Render Vehicle Dispatch Form
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleDispatchForm = ({ dispatch, isEditForm, posting, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  // const [selectedVehicle, selectVehicle] = useState(null);
  const onStepChange = (step) => setCurrentStep(step);
  const onFinish = (values) => {
    if (isEditForm) {
      const updatedDispatch = { ...dispatch, ...values };
      putDispatch(
        updatedDispatch,
        () => notifySuccess('Vehicle dispatch was updated successfully'),
        () =>
          notifyError(
            'An error occurred while updating vehicle dispatch, please contact your system administrator'
          )
      );
    } else {
      postDispatch(
        values,
        () => notifySuccess('Vehicle Dispatch was created successfully'),
        () =>
          notifyError(
            'An error occurred while saving vehicle dispatch, please contact your system administrator'
          )
      );
    }
  };

  return (
    <>
      <Steps type="navigation" current={currentStep} onChange={onStepChange}>
        <Step title="Request/Call Details" status="wait" />
        <Step title="Patient/Victim" status="wait" />
        <Step title="Pickup Location" status="wait" />
        <Step title="Pickup Location" status="wait" />
        <Step title="Vehicle Details" status="wait" />
      </Steps>
      <Form
        onFinish={onFinish}
        {...formItemLayout} // eslint-disable-line
        style={{ marginTop: '30px' }}
        initialValues={{
          ...dispatch,
          crew: map(get(dispatch, 'crew', []), '_id'),
        }}
      >
        {currentStep === 0 && (
          <>
            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name="number" label="Dispatch Number">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name="reportedAt" label="Request Time">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item
                  name={['requester', 'name']}
                  label="Name"
                  rules={[
                    { required: true, message: 'This field is required' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name={['requester', 'mobile']}
                  label="Phone"
                  rules={[
                    { required: true, message: 'This field is required' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item
                  name={['requester', 'facility', '_id']}
                  label="Facility"
                >
                  <SearchableSelectInput
                    onSearch={getFeatures}
                    optionLabel={(facility) => facility.strings.name.en}
                    optionValue="_id"
                    initialValue={get(
                      dispatch,
                      'requester.facility',
                      undefined
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name={['requester', 'area', '_id']}
                  label="Area"
                  rules={[
                    { required: true, message: 'This field is required' },
                  ]}
                >
                  <SearchableSelectInput
                    onSearch={getAdministrativeAreas}
                    optionLabel={(area) =>
                      `${area.strings.name.en} (${get(
                        area,
                        'relations.level.strings.name.en',
                        'N/A'
                      )})`
                    }
                    optionValue="_id"
                    initialValue={get(dispatch, 'requester.area', undefined)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name={['requester', 'address']} label="Address">
              <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
            </Form.Item>

            <Form.Item name="description" label="Description/Notes">
              <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
            </Form.Item>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Row justify="space-between">
              <Col span={11}>
                <Form.Item
                  name={['victim', 'name']}
                  label="Name"
                  rules={[
                    { required: true, message: 'This field is required' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name={['type', '_id']}
                  label="Event/Diagnosis"
                  rules={[
                    { required: true, message: 'This field is required' },
                  ]}
                >
                  <SearchableSelectInput
                    onSearch={getEventTypes}
                    optionLabel={(type) => `${type.strings.name.en} `}
                    optionValue="_id"
                    initialValue={get(dispatch, 'type', undefined)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name={['victim', 'mobile']} label="Phone">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['victim', 'gender', '_id']} label="Gender">
                  <SearchableSelectInput
                    onSearch={getPartyGenders}
                    optionLabel={(gender) => `${gender.strings.name.en} `}
                    optionValue="_id"
                    initialValue={get(dispatch, 'victim.gender', undefined)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name={['victim', 'age']} label="Age">
                  <InputNumber min={0} max={150} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['victim', 'weight']} label="Weight (kg)">
                  <InputNumber min={0} max={1000} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item name={['victim', 'pcr']} label="PCR #">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['victim', 'referral']} label="Referral #">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={['victim', 'area', '_id']}
              label="Area"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <SearchableSelectInput
                onSearch={getAdministrativeAreas}
                optionLabel={(area) =>
                  `${area.strings.name.en} (${get(
                    area,
                    'relations.level.strings.name.en',
                    'N/A'
                  )})`
                }
                optionValue="_id"
                initialValue={get(dispatch, 'victim.area', undefined)}
              />
            </Form.Item>

            <Form.Item name={['victim', 'description']} label="Chief Complaint">
              <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
            </Form.Item>

            <Form.Item name={['victim', 'address']} label="Address">
              <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
            </Form.Item>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Row justify="space-between">
              <Col span={11}>
                <Form.Item
                  name={['pickup', 'facility', '_id']}
                  label="Facility"
                >
                  <SearchableSelectInput
                    onSearch={getFeatures}
                    optionLabel={(facility) => facility.strings.name.en}
                    optionValue="_id"
                    initialValue={get(dispatch, 'pickup.facility', undefined)}
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['pickup', 'area', '_id']} label="Area">
                  <SearchableSelectInput
                    onSearch={getAdministrativeAreas}
                    optionLabel={(area) =>
                      `${area.strings.name.en} (${get(
                        area,
                        'relations.level.strings.name.en',
                        'N/A'
                      )})`
                    }
                    optionValue="_id"
                    initialValue={get(dispatch, 'pickup.area', undefined)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item
                  name={['pickup', 'correspondent']}
                  label="Correspondent"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['pickup', 'address']} label="Address">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item
                  name={['pickup', 'dispatchedAt']}
                  label="Dispatched Time"
                >
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['pickup', 'arrivedAt']} label="Arrived Time">
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name={['pickup', 'remarks']} label="Remarks">
              <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
            </Form.Item>
          </>
        )}

        {currentStep === 3 && (
          <>
            <Row justify="space-between">
              <Col span={11}>
                <Form.Item
                  name={['dropoff', 'facility', '_id']}
                  label="Facility"
                >
                  <SearchableSelectInput
                    onSearch={getFeatures}
                    optionLabel={(facility) => facility.strings.name.en}
                    optionValue="_id"
                    initialValue={get(dispatch, 'dropoff.facility', undefined)}
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['dropoff', 'area', '_id']} label="Area">
                  <SearchableSelectInput
                    onSearch={getAdministrativeAreas}
                    optionLabel={(area) =>
                      `${area.strings.name.en} (${get(
                        area,
                        'relations.level.strings.name.en',
                        'N/A'
                      )})`
                    }
                    optionValue="_id"
                    initialValue={get(dispatch, 'dropoff.area', undefined)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item
                  name={['dropoff', 'correspondent']}
                  label="Correspondent"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['dropoff', 'address']} label="Address">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="space-between">
              <Col span={11}>
                <Form.Item
                  name={['dropoff', 'dispatchedAt']}
                  label="Dispatched Time"
                >
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['dropoff', 'arrivedAt']} label="Arrived Time">
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name={['pickup', 'remarks']} label="Remarks">
              <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
            </Form.Item>
          </>
        )}

        {currentStep === 4 && (
          <>
            <Form.Item name={['carrier', 'vehicle', '_id']} label="Vehicle">
              <SearchableSelectInput
                onSearch={getVehicles}
                optionLabel={(vehicle) =>
                  `${vehicle.strings.name.en} (${get(
                    vehicle,
                    'relations.type.strings.name.en',
                    'N/A'
                  )}) - ${get(
                    vehicle,
                    'relations.status.strings.name.en',
                    'N/A'
                  )}`
                }
                optionValue="_id"
                initialValue={get(dispatch, 'carrier.vehicle', undefined)}
              />
            </Form.Item>

            {/* <Row justify="space-between">
              <Col span={11}>
                <Form.Item name={['carrier', 'owner', '_id']} label="Owner">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['carrier', 'ownership']} label="Ownership">
                  <Input />
                </Form.Item>
              </Col>
            </Row> */}
            <Form.Item
              name={['requester', 'area', '_id']}
              label="Area"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <SearchableSelectInput
                onSearch={getAdministrativeAreas}
                optionLabel={(area) =>
                  `${area.strings.name.en} (${get(
                    area,
                    'relations.level.strings.name.en',
                    'N/A'
                  )})`
                }
                optionValue="_id"
                initialValue={get(dispatch, 'requester.area', undefined)}
              />
            </Form.Item>
            <Form.Item name="crew" label="Crew">
              <SearchableSelectInput
                onSearch={getFocalPeople}
                optionLabel={(person) =>
                  `${person.name} (${get(
                    person,
                    'role.strings.name.en',
                    'N/A'
                  )})`
                }
                optionValue="_id"
                mode="multiple"
                initialValue={get(dispatch, 'crew', [])}
              />
            </Form.Item>

            <Form.Item name="remarks" label="Remarks/Notes">
              <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
            </Form.Item>
          </>
        )}

        {/* form actions */}
        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            style={{ marginLeft: 8 }}
            type="primary"
            htmlType="submit"
            loading={posting}
          >
            Save
          </Button>
        </Form.Item>
        {/* end form actions */}
      </Form>
    </>
  );
};

VehicleDispatchForm.propTypes = {
  dispatch: PropTypes.shape({ _id: PropTypes.string }),
  isEditForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

VehicleDispatchForm.defaultProps = {
  dispatch: null,
};

export default VehicleDispatchForm;
