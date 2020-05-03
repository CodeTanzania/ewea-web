import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form } from 'antd';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { putVehicleType, postVehicleType } = reduxActions;
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
 * @name VehicleTypeForm
 * @description Render form for creating and editing vehicle types
 * @param {object} props VehicleTypeForm props
 * @returns {object} VehicleTypeForm component
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleTypeForm = ({ vehicleType, isEditForm, posting, onCancel }) => {
  const onFinish = (values) => {
    if (isEditForm) {
      const updatedContact = { ...vehicleType, ...values };
      putVehicleType(
        updatedContact,
        () => {
          notifySuccess('Vehicle Type was updated successfully');
        },
        () => {
          notifyError(
            'Something occurred while updating Vehicle Type, please try again!'
          );
        }
      );
    } else {
      postVehicleType(
        values,
        () => {
          notifySuccess('Vehicle Type was created successfully');
        },
        () => {
          notifyError(
            'Something occurred while saving Vehicle Type, please try again!'
          );
        }
      );
    }
  };
  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout} // eslint-disable-line
      initialValues={{ ...vehicleType }}
      autoComplete="off"
    >
      {/* Vehicle Type name */}
      <Form.Item
        label="Name"
        name={['strings', 'name', 'en']}
        rules={[
          {
            required: true,
            message: 'Vehicle Type name is required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* end Vehicle Type name */}

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

VehicleTypeForm.propTypes = {
  vehicleType: PropTypes.shape({
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
  }).isRequired,
  isEditForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
};

export default VehicleTypeForm;
