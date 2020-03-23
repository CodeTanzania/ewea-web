import {
  putEventSeverity,
  postEventSeverity,
} from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { TextArea } = Input;

/**
 * @class
 * @name EventSeverityForm
 * @description  Render form for creating a new event severity
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventSeverityForm extends Component {
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
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      form: { validateFieldsAndScroll },
      eventSeverity,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const payload = {
          strings: {
            code: values.code,
            name: {
              en: values.name,
            },
            description: {
              en: values.description,
            },
          },
        };
        if (isEditForm) {
          const updatedContact = { ...eventSeverity, ...payload };
          putEventSeverity(
            updatedContact,
            () => {
              notifySuccess('Event Severity was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating Event Severity, please try again!'
              );
            }
          );
        } else {
          postEventSeverity(
            payload,
            () => {
              notifySuccess('Event Severity was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Event Severity, please try again!'
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
      eventSeverity,
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
        {/* Event Severity name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: isEditForm
              ? eventSeverity.strings.name.en
              : undefined,
            rules: [
              {
                required: true,
                message: ' Event Severities  name is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Event Severity name */}

        {/* Event Severity code */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Event Severity code">
          {getFieldDecorator('code', {
            initialValue: isEditForm ? eventSeverity.strings.code : undefined,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Event Severity code */}

        {/* Event Severity Description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm
              ? eventSeverity.strings.description.en
              : undefined,
            rules: [
              {
                required: true,
                message: 'Event Severity Description is required',
              },
            ],
          })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
        </Form.Item>
        {/* end Event Severity */}

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

EventSeverityForm.propTypes = {
  eventSeverity: PropTypes.shape({
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

export default Form.create()(EventSeverityForm);
