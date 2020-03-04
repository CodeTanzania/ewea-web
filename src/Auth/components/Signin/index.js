import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import { Form } from '@ant-design/compatible';
import { Connect, signin, initializeApp } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';
import logo from '../../../assets/icons/emislogo-blue.png';
import '@ant-design/compatible/assets/index.css';
import './styles.css';

/**
 * @class
 * @name SignInForm
 * @description Sign in component which shows sign in form
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class SignInForm extends Component {
  /**
   * @function
   * @name handleSubmit
   * @description Handle submit event for sign in function
   * @param {object} event Submit event
   * @returns {undefined}
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = event => {
    event.preventDefault();
    const { history } = this.props;
    const {
      form: { validateFields },
    } = this.props;

    validateFields((err, values) => {
      if (!err) {
        signin(
          values,
          () => {
            history.push('/app');

            // populate app store with schemas
            initializeApp();

            notifySuccess('Welcome to EWEA');
          },
          () => {
            notifyError('Invalid Credentials Please Try Again');
          }
        );
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <div className="SignInForm">
        <img alt="EMIS" src={logo} height={60} width={60} />
        <Form onSubmit={this.handleSubmit} autoComplete="off">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  email: true,
                  message: 'Please input your username!',
                },
              ],
            })(
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' },
              ],
            })(
              <Input
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
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
        </Form>
      </div>
    );
  }
}

SignInForm.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Connect(Form.create({ name: 'normal_login' })(SignInForm), {
  loading: 'app.signing',
});
