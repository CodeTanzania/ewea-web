import { putAlert, postAlert } from '@codetanzania/emis-api-states';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../../util';

/**
 * @class
 * @name AlertTypeForm
 * @description  Render form for creating a new alert type
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AlertTypeForm extends Component {
  static propTypes = {
    alertType: PropTypes.shape({
      type: PropTypes.string,
      scope: PropTypes.string,
      severity: PropTypes.string,
      _id: PropTypes.string,
      category: PropTypes.string,
      status: PropTypes.string,
    }).isRequired,
    isEditForm: PropTypes.bool.isRequired,
    posting: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFieldsAndScroll: PropTypes.func,
    }).isRequired,
  };

  /**
   * @function
   * @name handleSubmit
   * @description  call back function to handle submit action
   *
   * @param {object} e event object
   *
   * @returns {undefined} does not return anything
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = e => {
    e.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      alertType,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
          const updatedContact = Object.assign({}, alertType, values);
          putAlert(
            updatedContact,
            () => {
              notifySuccess('Alert Type was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating Alert Type, please try again!'
              );
            }
          );
        } else {
          postAlert(
            values,
            () => {
              notifySuccess('Alert Type was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Alert Type, please try again!'
              );
            }
          );
        }
      }
    });
  };

  render() {
    const {
      posting,
      onCancel,
      isEditForm,
      alertType,
      form: { getFieldDecorator },
    } = this.props;

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

    return (
      <Form onSubmit={this.handleSubmit} autoComplete="off">
        {/* Alert Type name */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('type', {
            initialValue: isEditForm ? alertType.type : undefined,
            rules: [
              {
                required: true,
                message: ' Alert Types organization name is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Alert Type name */}

        {/* Alert Type category */}
        <Form.Item {...formItemLayout} label="Category">
          {getFieldDecorator('category', {
            initialValue: isEditForm ? alertType.category : undefined,
            rules: [
              { required: true, message: 'Alert Type Category is required' },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Alert Type category */}

        {/* Alert type */}
        <Form.Item {...formItemLayout} label="Scope">
          {getFieldDecorator('scope', {
            initialValue: isEditForm ? alertType.scope : undefined,
            rules: [{ required: true, message: 'Scope is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end Alert Type */}

        {/* Alert Type severity */}
        <Form.Item {...formItemLayout} label="Severity">
          {getFieldDecorator('severity', {
            initialValue: isEditForm ? alertType.severity : undefined,
            rules: [{ required: true, message: 'Severity is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end Alert Type severity */}

        {/* Alert Type status */}
        <Form.Item {...formItemLayout} label="Status">
          {getFieldDecorator('status', {
            initialValue: isEditForm ? alertType.status : undefined,
            rules: [{ required: true, message: 'status is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end Alert Type status */}

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
  }
}

export default Form.create()(AlertTypeForm);
