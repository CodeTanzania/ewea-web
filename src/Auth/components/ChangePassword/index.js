import React, { useState } from 'react';
import { Input, Button, Form } from 'antd';
import PropTypes from 'prop-types';
import { Connect, putFocalPerson } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';

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

const ChangePasswordForm = ({ user, posting, onCancel }) => {
  const [isConfirmDirty, setConfirmDirty] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const updatedUser = { ...user, password: values.password };
    putFocalPerson(
      updatedUser,
      () => {
        notifySuccess('Password was changed successfully');
        onCancel();
      },
      () => {
        notifyError(
          'Something occurred while changing your password, please try again!'
        );
      }
    );
  };

  /**
   * @function
   * @name handleConfirmBlur
   * @description Handle blur event to compare password
   *
   * @param {object} event  event
   * @returns {undefined}
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleConfirmBlur = (event) => {
    const { value } = event.target;
    setConfirmDirty(isConfirmDirty || !!value);
  };

  /**
   * @function
   * @name compareToFirstPassword
   * @description Compare password and confirm password if they are equal
   *
   * @param {object} rule validation rule
   * @param {string} value confirm value
   * @param {Function} callback  callback after validation
   * @returns {undefined}
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter are not the same!');
    } else {
      callback();
    }
  };

  /**
   * @function
   * @name validateToNextPassword
   * @description Validate password
   *
   * @param {object} rule validation rule
   * @param {string} value confirm value
   * @param {Function} callback  callback after validation
   * @returns {undefined}
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const validateToNextPassword = (rule, value, callback) => {
    if (value && isConfirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Form form={form} {...formItemLayout} onFinish={onFinish}>
      {/* New Password input */}
      <Form.Item
        label="New Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your new password!',
          },
          { validator: validateToNextPassword },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      {/* end new password input */}

      {/* confirm password input */}
      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          { validator: compareToFirstPassword },
        ]}
        hasFeedback
      >
        <Input.Password onBlur={handleConfirmBlur} />
      </Form.Item>
      {/* end confirm password input */}

      {/* form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          htmlType="submit"
          loading={posting}
        >
          Change Password
        </Button>
      </Form.Item>
      {/* end form actions */}
    </Form>
  );
};

ChangePasswordForm.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    validateFieldsAndScroll: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

export default Connect(ChangePasswordForm, {
  user: 'app.party',
  posting: 'focalPeople.posting',
});
