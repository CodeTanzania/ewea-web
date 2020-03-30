import React from 'react';
import PropTypes from 'prop-types';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Button, Form } from 'antd';
import { Connect, signin, initializeApp } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';
import logo from '../../../assets/icons/emislogo-blue.png';
import './styles.css';

/**
 * @function
 * @name SignInForm
 * @description Sign In form  component
 *
 * @param {object} props React props
 * @returns {object} Sign In Form
 * @version 0.1.0
 * @since 0.1.0
 */
const SignInForm = ({ loading, history }) => {
  const onFinish = (values) => {
    signin(
      values,
      () => {
        history.push('/app');

        // populate app store with schemas
        initializeApp();

        notifySuccess('Welcome to EWEA');
      },
      () => {
        notifyError('Invalid username or password, Please Try Again');
      }
    );
  };

  return (
    <div className="SignInForm">
      <img alt="EMIS" src={logo} height={60} width={60} />
      <Form onFinish={onFinish} autoComplete="off">
        {/* username field */}
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              email: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />
        </Form.Item>
        {/* end username field */}

        {/* password field */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Password"
          />
        </Form.Item>
        {/* end password field */}

        {/* submit button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="signin-form-button"
            loading={loading}
          >
            Sign In
          </Button>
          <div className="version-text">version: 1.0.0</div>
        </Form.Item>
        {/* end submit button */}
      </Form>
    </div>
  );
};

SignInForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Connect(SignInForm, {
  loading: 'app.signing',
});
