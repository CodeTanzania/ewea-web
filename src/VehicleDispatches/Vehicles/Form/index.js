import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Input, Form, Row, Col } from 'antd';
import get from 'lodash/get';

import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* constants */
const {
  getAdministrativeAreas,
  getAgencies,
  getPartyOwnerships,
  getVehicleTypes,
  getVehicleModels,
  getVehicleMakes,
  getVehicleStatuses,
} = httpActions;

/* constants */
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

/**
 * @function
 * @name VehicleForm
 * @description Render form for creating and editing vehicle types
 * @param {object} props props object
 * @param {object} props.vehicle valid vehicle
 * @param {boolean} props.posting posting flag
 * @param {Function} props.onCreate Callback for creating new resource
 * @param {Function} props.onUpdate Callback for updating existing resource
 * @param {Function} props.onCancel cancel callback
 * @returns {object} VehicleForm component
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleForm = ({ vehicle, posting, onCancel, onCreate, onUpdate }) => {
  const onFinish = (values) => {
    if (get(vehicle, '_id')) {
      const updatedContact = { ...vehicle, ...values };
      onUpdate(updatedContact);
      return;
    }

    onCreate(values);
  };

  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout} // eslint-disable-line
      initialValues={{ ...vehicle }}
      autoComplete="off"
    >
      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Type"
            name={['relations', 'type', '_id']}
            rules={[{ required: true, message: 'Vehicle type is required' }]}
          >
            <SearchableSelectInput
              onSearch={getVehicleTypes}
              optionLabel={(type) => type.strings.name.en}
              optionValue="_id"
              initialValue={get(vehicle, 'relations.type', undefined)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Plate No."
            name={['strings', 'name', 'en']}
            rules={[
              {
                required: true,
                message: 'Vehicle Plate No. name is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item label="Model" name={['relations', 'model', '_id']}>
            <SearchableSelectInput
              onSearch={getVehicleModels}
              optionLabel={(model) => model.strings.name.en}
              optionValue="_id"
              initialValue={get(vehicle, 'relations.model', undefined)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item label="Make" name={['relations', 'make', '_id']}>
            <SearchableSelectInput
              onSearch={getVehicleMakes}
              optionLabel={(make) => make.strings.name.en}
              optionValue="_id"
              initialValue={get(vehicle, 'relations.make', undefined)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Owner"
            name={['relations', 'owner', '_id']}
            rules={[{ required: true, message: 'Vehicle owner is required' }]}
          >
            <SearchableSelectInput
              onSearch={getAgencies}
              optionLabel={(agency) => agency.name}
              optionValue="_id"
              initialValue={get(vehicle, 'relations.owner', undefined)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Ownership"
            name={['relations', 'ownership', '_id']}
            rules={[
              { required: true, message: 'Vehicle Ownership is required' },
            ]}
          >
            <SearchableSelectInput
              onSearch={getPartyOwnerships}
              optionLabel={(ownership) => ownership.strings.name.en}
              optionValue="_id"
              initialValue={get(vehicle, 'relations.ownership', undefined)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="space-between">
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Status"
            name={['relations', 'status', '_id']}
            rules={[{ required: true, message: 'Vehicle status is required' }]}
          >
            <SearchableSelectInput
              onSearch={getVehicleStatuses}
              optionLabel={(status) => status.strings.name.en}
              optionValue="_id"
              initialValue={get(vehicle, 'relations.status', undefined)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Form.Item
            label="Area"
            name={['relations', 'area', '_id']}
            rules={[{ required: true, message: 'Vehicle is required' }]}
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
              initialValue={get(vehicle, 'relations.area', undefined)}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Facility */}
      <Form.Item label="Facility" name={['properties', 'facility']}>
        <Input />
      </Form.Item>
      {/* end facility */}

      {/* Vehicle Type Description */}
      <Form.Item
        label="Description"
        name={['strings', 'description', 'en']}
        rules={[
          {
            required: true,
            message: 'Vehicle Type Description is required',
          },
        ]}
      >
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end Vehicle Type */}

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
  );
};

VehicleForm.propTypes = {
  vehicle: PropTypes.shape({
    strings: PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      _id: PropTypes.string,
    }),
  }),
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

VehicleForm.defaultProps = {
  vehicle: null,
};

export default VehicleForm;
