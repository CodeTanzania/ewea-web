import React from 'react';
import { Input, Button, Form } from 'antd';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';

/* declarations */
const { putFocalPerson } = reduxActions;
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
 * @param {object} props props object
 * @param {object} props.user user object
 * @param {boolean} props.posting posting flag
 * @param {Function} props.onCancel cancel callback
 * @name ChangePasswordForm
 * @description Change password form to allow current logged in  user to update password
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const ChangePasswordForm = ({ user, posting, onCancel }) => {
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

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Form {...formItemLayout} onFinish={onFinish}>
        {/* New Password input */}
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your new password!',
            },
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
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                // eslint-disable-next-line
                return Promise.reject(
                  'The two passwords that you entered do not  match!'
                );
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password />
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
    </>
  );
};

ChangePasswordForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Connect(ChangePasswordForm, {
  user: 'app.party',
  posting: 'focalPeople.posting',
});
