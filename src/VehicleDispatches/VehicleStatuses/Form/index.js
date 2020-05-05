import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form } from 'antd';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { putVehicleStatus, postVehicleStatus } = reduxActions;
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
 * @name VehicleStatusForm
 * @description Render form for creating and editing party ownerships
 * @param {object} props VehicleStatusForm props
 * @returns {object} VehicleStatusForm component
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleStatusForm = ({
  vehicleStatus,
  isEditForm,
  posting,
  onCancel,
}) => {
  const onFinish = (values) => {
    if (isEditForm) {
      const updatedContact = { ...vehicleStatus, ...values };
      putVehicleStatus(
        updatedContact,
        () => {
          notifySuccess('Vehicle Status was updated successfully');
        },
        () => {
          notifyError(
            'Something occurred while updating Vehicle Status, please try again!'
          );
        }
      );
    } else {
      postVehicleStatus(
        values,
        () => {
          notifySuccess('Vehicle Status was created successfully');
        },
        () => {
          notifyError(
            'Something occurred while saving Vehicle Status, please try again!'
          );
        }
      );
    }
  };
  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout} // eslint-disable-line
      initialValues={{ ...vehicleStatus }}
      autoComplete="off"
    >
      {/* Vehicle Status name */}
      <Form.Item
        label="Name"
        name={['strings', 'name', 'en']}
        rules={[
          {
            required: true,
            message: 'Vehicle Status name is required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* end Vehicle Status name */}

      {/* Vehicle Status Description */}
      <Form.Item
        label="Description"
        name={['strings', 'description', 'en']}
        rules={[
          {
            required: true,
            message: 'Vehicle Status Description is required',
          },
        ]}
      >
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end Vehicle Status */}

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

VehicleStatusForm.propTypes = {
  vehicleStatus: PropTypes.shape({
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

export default VehicleStatusForm;
