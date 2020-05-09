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

// FIXME fix on filling multiple section without saving

/**
 * @function
 * @name VehicleDispatchForm
 * @description Vehicle Dispatch form for ambulances and fire
 * @param {object} props Dispatch Form props
 * @param {object} props.dispatch Dispatch instance
 * @param {boolean} props.isEditForm Flag for edit form (true) if editing dispatch
 * @param {boolean} props.posting Flag from the store marking posting data to the api
 * @param {Function} props.onCancel Function to be invoked on cancelling the form
 * @returns {object} Render Vehicle Dispatch Form
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleDispatchForm = ({ dispatch, isEditForm, posting, onCancel }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [cached, setCache] = useState({}); // for caching lazy component values
  const pickupDispatchedTime = get(dispatch, 'pickup.dispatchedAt', undefined)
    ? moment(get(dispatch, 'pickup.dispatchedAt'))
    : undefined;
  const pickupArrivedTime = get(dispatch, 'pickup.arrivedAt', undefined)
    ? moment(get(dispatch, 'pickup.dispatchedAt'))
    : undefined;
  const dropOffDispatchedTime = get(dispatch, 'dropoff.dispatchedAt', undefined)
    ? moment(get(dispatch, 'dropoff.dispatchedAt'))
    : undefined;
  const dropOffArrivedTime = get(dispatch, 'dropoff.arrivedAt', undefined)
    ? moment(get(dispatch, 'dropoff.dispatchedAt'))
    : undefined;

  const onStepChange = (step) => {
    setFormValues({ ...formValues, ...form.getFieldsValue() });
    setCurrentStep(step);
  };

  const onFinish = (sectionValues) => {
    const values = { ...formValues, ...sectionValues };
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
        <Step title="Pick-Up Location" status="wait" />
        <Step title="Drop-Off Location" status="wait" />
        <Step title="Vehicle Details" status="wait" />
      </Steps>
      <Form
        form={form}
        onFinish={onFinish}
        {...formItemLayout} // eslint-disable-line
        style={{ marginTop: '30px' }}
        initialValues={{
          ...dispatch,
          reportedAt: moment(get(dispatch, 'reportedAt', undefined)).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          type: get(dispatch, 'type._id', undefined),
          crew: map(get(dispatch, 'crew', []), '_id'),
          requester: {
            ...get(dispatch, 'requester', null),
            facility: get(dispatch, 'requester.facility._id', undefined),
            area: get(dispatch, 'requester.area._id', undefined),
          },
          victim: {
            ...get(dispatch, 'victim', null),
            gender: get(dispatch, 'victim.gender._id', undefined),
            area: get(dispatch, 'victim.area._id', undefined),
          },
          pickup: {
            ...get(dispatch, 'pickup', null),
            facility: get(dispatch, 'pickup.facility._id', undefined),
            area: get(dispatch, 'pickup.area._id', undefined),
            dispatchedAt: pickupDispatchedTime,
            arrivedAt: pickupArrivedTime,
          },
          dropoff: {
            ...get(dispatch, 'dropoff', null),
            facility: get(dispatch, 'dropoff.facility._id', undefined),
            area: get(dispatch, 'dropoff.area._id', undefined),
            dispatchedAt: dropOffDispatchedTime,
            arrivedAt: dropOffArrivedTime,
          },
          carrier: {
            ...get(dispatch, 'carrier', null),
            vehicle: get(dispatch, 'carrier.vehicle._id', undefined),
          },
        }}
      >
        {currentStep === 0 && (
          <>
            {dispatch && (
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
            )}

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
                <Form.Item name={['requester', 'facility']} label="Facility">
                  <SearchableSelectInput
                    onSearch={getFeatures}
                    optionLabel={(facility) => facility.strings.name.en}
                    optionValue="_id"
                    initialValue={
                      get(dispatch, 'requester.facility', undefined) ||
                      get(cached, 'requesterFacility', undefined)
                    }
                    onCache={(values) =>
                      setCache({ ...cached, requesterFacility: values[0] })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name={['requester', 'area']}
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
                    initialValue={
                      get(dispatch, 'requester.area', undefined) ||
                      get(cached, 'requesterArea', undefined)
                    }
                    onCache={(values) =>
                      setCache({ ...cached, requesterArea: values[0] })
                    }
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
                  name={['type']}
                  label="Event/Diagnosis"
                  rules={[
                    { required: true, message: 'This field is required' },
                  ]}
                >
                  <SearchableSelectInput
                    onSearch={getEventTypes}
                    optionLabel={(type) => `${type.strings.name.en} `}
                    optionValue="_id"
                    initialValue={
                      get(dispatch, 'type', undefined) ||
                      get(cached, 'type', undefined)
                    }
                    onCache={(values) =>
                      setCache({ ...cached, type: values[0] })
                    }
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
                <Form.Item name={['victim', 'gender']} label="Gender">
                  <SearchableSelectInput
                    onSearch={getPartyGenders}
                    optionLabel={(gender) => `${gender.strings.name.en} `}
                    optionValue="_id"
                    initialValue={
                      get(dispatch, 'victim.gender', undefined) ||
                      get(cached, 'victimGender', undefined)
                    }
                    onCache={(values) =>
                      setCache({ ...cached, victimGender: values[0] })
                    }
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
              name={['victim', 'area']}
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
                initialValue={
                  get(dispatch, 'victim.area') || get(cached, 'victimArea')
                }
                onCache={(values) =>
                  setCache({ ...cached, victimArea: values[0] })
                }
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
                <Form.Item name={['pickup', 'facility']} label="Facility">
                  <SearchableSelectInput
                    onSearch={getFeatures}
                    optionLabel={(facility) => facility.strings.name.en}
                    optionValue="_id"
                    initialValue={
                      get(dispatch, 'pickup.facility') ||
                      get(cached, 'pickupFacility')
                    }
                    onCache={(values) =>
                      setCache({ ...cached, pickupFacility: values[0] })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['pickup', 'area']} label="Area">
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
                    initialValue={
                      get(dispatch, 'pickup.area') || get(cached, 'pickupArea')
                    }
                    onCache={(values) =>
                      setCache({ ...cached, pickupArea: values[0] })
                    }
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
                    showTime
                    style={{ width: '100%' }}
                    placeholder="Select vehicle dispatched time"
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['pickup', 'arrivedAt']} label="Arrived Time">
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    placeholder="Select vehicle arrival time"
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
                <Form.Item name={['dropoff', 'facility']} label="Facility">
                  <SearchableSelectInput
                    onSearch={getFeatures}
                    optionLabel={(facility) => facility.strings.name.en}
                    optionValue="_id"
                    initialValue={
                      get(dispatch, 'dropoff.facility') ||
                      get(cached, 'dropOffFacility')
                    }
                    onCache={(values) =>
                      setCache({ ...cached, dropOffFacility: values[0] })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['dropoff', 'area']} label="Area">
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
                    initialValue={
                      get(dispatch, 'dropoff.area') ||
                      get(cached, 'dropOffArea')
                    }
                    onCache={(values) =>
                      setCache({ ...cached, dropOffArea: values[0] })
                    }
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
                    showTime
                    style={{ width: '100%' }}
                    placeholder="Select vehicle dispatched time"
                  />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item name={['dropoff', 'arrivedAt']} label="Arrived Time">
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    placeholder="Select vehicle arrival time"
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
            <Form.Item
              name={['carrier', 'vehicle']}
              label="Vehicle"
              rules={[
                {
                  required: true,
                  message: 'This field is required',
                },
              ]}
            >
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
                initialValue={
                  get(dispatch, 'carrier.vehicle') ||
                  get(cached, 'carrierVehicle')
                }
                onCache={(values) =>
                  setCache({ ...cached, carrierVehicle: values[0] })
                }
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
              name="crew"
              label="Crew"
              rules={[
                {
                  required: true,
                  message: 'There should be at least one crew member',
                },
              ]}
            >
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
                initialValue={get(dispatch, 'crew', get(cached, 'crew', []))}
                onCache={(values) => setCache({ ...cached, crew: values })}
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
