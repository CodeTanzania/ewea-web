import React, { useState } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import map from 'lodash/map';
import { Button, Input, InputNumber, Form, Row, Col } from 'antd';
import { httpActions } from '@codetanzania/ewea-api-client';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const {
  getAgencies,
  getAdministrativeAreas,
  getFeatureTypes,
  getPartyOwnerships,
} = httpActions;

/* state actions */
const { putFeature, postFeature } = reduxActions;

/* ui */
const { TextArea } = Input;
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
const MESSAGE_POST_SUCCESS = 'Critical Infrastructure was created successfully';
const MESSAGE_POST_ERROR =
  'Something occurred while saving Critical Infrastructure, Please try again!';
const MESSAGE_PUT_SUCCESS = 'Critical Infrastructure was updated successfully';
const MESSAGE_PUT_ERROR =
  'Something occurred while updating Critical Infrastructure, Please try again!';

/**
 * @function FeatureForm
 * @name FeatureForm
 * @description Form for create and edit feature
 * @param {object} props Valid form properties
 * @param {object} props.feature Valid feature object
 * @param {boolean} props.isEditForm Flag whether form is on edit mode
 * @param {boolean} props.posting Flag whether form is posting data
 * @param {Function} props.onCancel Form cancel callback
 * @returns {object} FeatureForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 */
const FeatureForm = ({ feature, isEditForm, posting, onCancel }) => {
  // form finish(submit) handler
  const onFinish = (values) => {
    const formData = { ...values };

    // TODO: fix clearing custodians relations
    // TODO: fix form ref geos.point.coordinates[0]
    const longitude = get(formData, 'geos.longitude');
    const latitude = get(formData, 'geos.latitude');
    if (longitude && latitude) {
      formData.geos.point = { coordinates: [longitude, latitude] };
    }

    if (isEditForm) {
      const updates = { ...feature, ...formData };
      putFeature(
        updates,
        () => notifySuccess(MESSAGE_PUT_SUCCESS),
        () => notifyError(MESSAGE_PUT_ERROR)
      );
    } else {
      postFeature(
        formData,
        () => notifySuccess(MESSAGE_POST_SUCCESS),
        () => notifyError(MESSAGE_POST_ERROR)
      );
    }
  };

  const [moreOptions, setMoreOptions] = useState(false);

  return (
    <Form
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      onFinish={onFinish}
      initialValues={{
        ...feature,
        relations: {
          ...get(feature, 'relations', {}),
          custodians: map(get(feature, 'relations.custodians', []), '_id'),
        },
      }}
      autoComplete="off"
    >
      {/* start: type & code */}
      <Row justify="space-between">
        {/* start:type */}
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Type"
            title="Critical infrastructure type e.g Hospital"
            name={['relations', 'type', '_id']}
            rules={[
              {
                required: true,
                message: 'Critical infrastructure type is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return getFeatureTypes(optns);
              }}
              optionLabel={(type) => get(type, 'strings.name.en')}
              optionValue="_id"
              initialValue={get(feature, 'relations.type', undefined)}
            />
          </Form.Item>
        </Col>
        {/* end:type */}
        {/* start:code */}
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Code/Number"
            title="Critical infrastructure code e.g DSM001"
            name={['strings', 'code']}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* end:code */}
      </Row>
      {/* end: type & code */}

      {/* start: name & area */}
      <Row justify="space-between">
        {/* start:name */}
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Name"
            title="Critical infrastructure name e.g Dar es Salaam"
            name={['strings', 'name', 'en']}
            rules={[
              {
                required: true,
                message: 'Critical infrastructure name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* end:name */}
        {/* start:area */}
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Area"
            title="Critical infrastructure area e.g Dar es Salaam"
            initialValue={null}
            name={['relations', 'area', '_id']}
            rules={[
              {
                required: true,
                message: 'Critical infrastructure area is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return getAdministrativeAreas(optns);
              }}
              optionLabel={(area) => {
                return `${get(area, 'strings.name.en')} (${get(
                  area,
                  'relations.level.strings.name.en',
                  'N/A'
                )})`;
              }}
              optionValue="_id"
              initialValue={get(feature, 'relations.area', undefined)}
            />
          </Form.Item>
        </Col>
        {/* end:area */}
      </Row>
      {/* end: name & area */}

      {/* start: longitude & latitude */}
      {moreOptions && (
        <Row justify="space-between">
          {/* start:longitude */}
          <Col span={11}>
            <Form.Item
              label="Longitude"
              title="Critical infrastructure longitude(x-coordinate) e.g 39.2858"
              name={['geos', 'longitude']}
              initialValue={get(feature, 'geos.point.coordinates[0]')}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {/* end:longitude */}
          {/* start:latitude */}
          <Col span={11}>
            <Form.Item
              label="Latitude"
              title="Critical infrastructure latitude(y-coordinate) e.g -6.8188"
              name={['geos', 'latitude']}
              initialValue={get(feature, 'geos.point.coordinates[1]')}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          {/* end:latitude */}
        </Row>
      )}
      {/* end: longitude & latitude */}

      {/* start: custodians & ownership */}
      <Row justify="space-between">
        {/* start:custodians */}
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Custodians"
            title="Responsible Agencies e.g Police Force"
            name={['relations', 'custodians']}
          >
            <SearchableSelectInput
              onSearch={(optns = {}) => {
                return getAgencies(optns);
              }}
              optionLabel={(custodian) => get(custodian, 'name')}
              optionValue="_id"
              initialValue={get(feature, 'relations.custodians', [])}
              mode="multiple"
            />
          </Form.Item>
        </Col>
        {/* end:custodians */}

        {/* start:ownership */}
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Ownership"
            name={['relations', 'ownership']}
            rules={[
              {
                required: true,
                message: 'Critical infrastructure Ownership is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getPartyOwnerships}
              optionLabel={(ownership) => ownership.strings.name.en}
              optionValue="_id"
              initialValue={get(feature, 'relations.ownership', undefined)}
            />
          </Form.Item>
        </Col>
        {/* end:ownership */}
      </Row>
      {/* end: custodians & ownership */}

      {/* start:description */}
      <Form.Item
        label="Description"
        title="Critical infrastructure description"
        name={['strings', 'description', 'en']}
      >
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end:description */}

      {/* start:form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button type="link" onClick={() => setMoreOptions(!moreOptions)}>
          {moreOptions ? 'Less Options' : 'More Options'}
        </Button>
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

FeatureForm.defaultProps = {
  feature: {},
};

FeatureForm.propTypes = {
  feature: PropTypes.shape({
    _id: PropTypes.string,
    strings: PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
    }),
    relations: PropTypes.shape({
      type: PropTypes.shape({
        _id: PropTypes.string,
      }),
      area: PropTypes.shape({
        _id: PropTypes.string,
      }),
      custodians: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
        })
      ),
    }),
  }),
  isEditForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default FeatureForm;
