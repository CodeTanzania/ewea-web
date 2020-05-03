import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form } from 'antd';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { putVehicleMake, postVehicleMake } = reduxActions;
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
 * @name VehicleMakeForm
 * @description Render form for creating and editing vehicle makes
 * @param {object} props VehicleMakeForm props
 * @returns {object} VehicleMakeForm component
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleMakeForm = ({ vehicleMake, isEditForm, posting, onCancel }) => {
  const onFinish = (values) => {
    if (isEditForm) {
      const updatedContact = { ...vehicleMake, ...values };
      putVehicleMake(
        updatedContact,
        () => {
          notifySuccess('Vehicle Make was updated successfully');
        },
        () => {
          notifyError(
            'Something occurred while updating Vehicle Make, please try again!'
          );
        }
      );
    } else {
      postVehicleMake(
        values,
        () => {
          notifySuccess('Vehicle Make was created successfully');
        },
        () => {
          notifyError(
            'Something occurred while saving Vehicle Make, please try again!'
          );
        }
      );
    }
  };
  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout} // eslint-disable-line
      initialValues={{ ...vehicleMake }}
      autoComplete="off"
    >
      {/* Vehicle Make name */}
      <Form.Item
        label="Name"
        name={['strings', 'name', 'en']}
        rules={[
          {
            required: true,
            message: 'Vehicle Make name is required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* end Vehicle Make name */}

      {/* Vehicle Make Description */}
      <Form.Item
        label="Description"
        name={['strings', 'description', 'en']}
        rules={[
          {
            required: true,
            message: 'Vehicle Make Description is required',
          },
        ]}
      >
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end Vehicle Make */}

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

VehicleMakeForm.propTypes = {
  vehicleMake: PropTypes.shape({
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

export default VehicleMakeForm;
