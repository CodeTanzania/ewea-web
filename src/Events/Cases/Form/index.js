import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import first from 'lodash/first';
import isFunction from 'lodash/isFunction';
import { Button, Divider, Input, InputNumber, Form, Row, Col } from 'antd';
import { httpActions } from '@codetanzania/ewea-api-client';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const {
  getAdministrativeAreas,
  getPartyGenders,
  getPartyOccupations,
  getPartyNationalities,
  getCaseStages,
} = httpActions;

/* state actions */
const { putCase, postCase } = reduxActions;

/* ui */
const labelCol = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};
const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

/* messages */
const TITLE_VICTIM_INFORMATION = 'Victim/Patient Information';
const TITLE_NEXTOFKIN_INFORMATION = 'Next of Kin / Contact Person';
const MESSAGE_POST_SUCCESS = 'Case was created successfully';
const MESSAGE_POST_ERROR =
  'Something occurred while saving Case, Please try again!';
const MESSAGE_PUT_SUCCESS = 'Case was updated successfully';
const MESSAGE_PUT_ERROR =
  'Something occurred while updating Case, Please try again!';

/**
 * @function CaseForm
 * @name CaseForm
 * @description Form for create and edit case
 * @param {object} props Valid form properties
 * @param {object} props.caze Valid case object
 * @param {boolean} props.isEditForm Flag whether form is on edit mode
 * @param {boolean} props.posting Flag whether form is posting data
 * @param {object} props.cached Cached values for lazy loaded values
 * @param {Function} props.onCache Cache value callback
 * @param {Function} props.onClearCache Clear cached values callback
 * @param {Function} props.onCancel Form cancel callback
 * @returns {object} CaseForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 */
const CaseForm = ({
  caze,
  isEditForm,
  posting,
  cached,
  onCache,
  onClearCache,
  onCancel,
}) => {
  // form scoped cache keys
  const cacheKeys = [
    'form.victim.nationality',
    'form.victim.gender',
    'form.victim.area',
    'form.victim.occupation',
    'form.stage',
    'form.severity',
  ];

  // handle success form save
  const onSuccess = (message) => {
    if (isFunction(onClearCache)) {
      onClearCache(...cacheKeys);
    }
    notifySuccess(message);
  };

  // form finish(submit) handler
  const onFinish = (values) => {
    const formData = { ...values };

    if (isEditForm) {
      const updates = { ...caze, ...formData };
      putCase(
        updates,
        () => onSuccess(MESSAGE_PUT_SUCCESS),
        () => notifyError(MESSAGE_PUT_ERROR)
      );
    } else {
      postCase(
        formData,
        () => onSuccess(MESSAGE_POST_SUCCESS),
        () => notifyError(MESSAGE_POST_ERROR)
      );
    }
  };

  return (
    <Form
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      onFinish={onFinish}
      initialValues={{
        ...caze,
        stage: get(caze, 'stage._id'),
        severity: get(caze, 'severity._id'),
        victim: {
          ...get(caze, 'victim', null),
          area: get(caze, 'victim.area._id'),
          gender: get(caze, 'victim.gender._id'),
          occupation: get(caze, 'victim.occupation._id'),
          nationality: get(caze, 'victim.nationality._id'),
        },
      }}
      autoComplete="off"
    >
      {/* start: name, mobile & email */}
      <Divider orientation="left" title={TITLE_VICTIM_INFORMATION}>
        {TITLE_VICTIM_INFORMATION}
      </Divider>
      <Row justify="space-between">
        <Col xs={24} sm={24} md={10}>
          <Form.Item
            label="Name"
            title="Valid Victim/Patient Full Name e.g Jane Mdoe"
            name={['victim', 'name']}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Phone Number"
            title="Valid Victim/Patient Mobile Phone Number"
            name={['victim', 'mobile']}
            rules={[{ required: true, message: 'Phone is required' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Email"
            title="Valid Victim/Patient Email Address e.g jane.mdoe@example.com"
            name={['victim', 'email']}
            rules={[
              {
                type: 'email',
                message: 'Email is not valid',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {/* end: name, mobile & email */}

      {/* start: nationality, gender & age */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={10}>
          <Form.Item
            label="Nationality"
            title="Victim/Patient Nationality"
            name={['victim', 'nationality']}
            rules={[
              {
                required: true,
                message: 'Nationality is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getPartyNationalities}
              optionLabel={(nationality) => get(nationality, 'strings.name.en')}
              optionValue="_id"
              initialValue={
                get(caze, 'victim.nationality') ||
                get(cached, 'form.victim.nationality')
              }
              onCache={(values) =>
                onCache({ 'form.victim.nationality': first(values) })
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Gender"
            title="Victim/Patient Gender"
            name={['victim', 'gender']}
            rules={[
              {
                required: true,
                message: 'Gender is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getPartyGenders}
              optionLabel={(gender) => `${get(gender, 'strings.name.en')}`}
              optionValue="_id"
              initialValue={
                get(caze, 'victim.gender') || get(cached, 'form.victim.gender')
              }
              onCache={(values) =>
                onCache({ 'form.victim.gender': first(values) })
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            name={['victim', 'age']}
            label="Age"
            title="Victim/Patient Age"
            rules={[
              {
                required: true,
                message: 'Age is required',
              },
            ]}
          >
            <InputNumber min={0} max={150} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      {/* end: nationality, gender & age */}

      {/* start: area, occupation & stage */}
      <Row justify="space-between">
        <Col xs={24} sm={24} md={10}>
          <Form.Item
            label="Area"
            title="Victim/Patient Residential Area"
            name={['victim', 'area']}
            rules={[
              {
                required: true,
                message: 'Area is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getAdministrativeAreas}
              optionLabel={(area) =>
                `${get(area, 'strings.name.en')} (${get(
                  area,
                  'relations.level.strings.name.en',
                  'N/A'
                )})`
              }
              optionValue="_id"
              initialValue={
                get(caze, 'victim.area') || get(cached, 'form.victim.area')
              }
              onCache={(values) =>
                onCache({ 'form.victim.area': first(values) })
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Occupation"
            title="Victim/Patient Occupation e.g Health Worker"
            name={['victim', 'occupation']}
          >
            <SearchableSelectInput
              onSearch={getPartyOccupations}
              optionLabel={(occupation) =>
                `${get(occupation, 'strings.name.en')} `
              }
              optionValue="_id"
              initialValue={
                get(caze, 'victim.occupation') ||
                get(cached, 'form.victim.occupation')
              }
              onCache={(values) =>
                onCache({ 'form.victim.occupation': first(values) })
              }
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Stage"
            title="Case Stage"
            name={['stage']}
            rules={[
              {
                required: true,
                message: 'Stage is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getCaseStages}
              optionLabel={(stage) => get(stage, 'strings.name.en')}
              optionValue="_id"
              initialValue={get(caze, 'stage') || get(cached, 'form.stage')}
              onCache={(values) => onCache({ 'form.stage': first(values) })}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* end: area, occupation & stage */}

      {/* start: next of kin name, mobile & email */}
      <Divider orientation="left" title={TITLE_NEXTOFKIN_INFORMATION}>
        {TITLE_NEXTOFKIN_INFORMATION}
      </Divider>
      <Row justify="space-between">
        <Col xs={24} sm={24} md={10}>
          <Form.Item
            label="Name"
            title="Valid Next of Kin Name e.g Asha Mdoe"
            name={['victim', 'nextOfKin', 'name']}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Phone Number"
            title="Valid Next of Kin Mobile Phone Number e.g 0714112233"
            name={['victim', 'nextOfKin', 'mobile']}
            rules={[{ required: true, message: 'Phone Number is required' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="Email"
            title="Valid Next of Kin Email Address e.g asha.mdoe@example.com"
            name={['victim', 'nextOfKin', 'email']}
            rules={[
              {
                type: 'email',
                message: 'Email is not valid',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {/* end: next of kin name, mobile & email */}

      {/* start:form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          htmlType="submit"
          loading={posting}
        >
          Save
        </Button>
      </Form.Item>
      {/* end:form actions */}
    </Form>
  );
};

CaseForm.defaultProps = {
  caze: null,
  cached: null,
};

CaseForm.propTypes = {
  caze: PropTypes.shape({
    _id: PropTypes.string,
    number: PropTypes.string,
  }),
  isEditForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  cached: PropTypes.shape({
    'form.stage': PropTypes.shape({
      _id: PropTypes.string,
    }),
    'form.victim.gender': PropTypes.shape({
      _id: PropTypes.string,
    }),
    'form.victim.area': PropTypes.shape({
      _id: PropTypes.string,
    }),
    'form.victim.occupation': PropTypes.shape({
      _id: PropTypes.string,
    }),
    'form.victim.nationality': PropTypes.shape({
      _id: PropTypes.string,
    }),
  }),
  onCache: PropTypes.func.isRequired,
  onClearCache: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CaseForm;
