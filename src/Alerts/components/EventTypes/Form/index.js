import { putEventType, postEventType } from '@codetanzania/ewea-api-states';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../../util';

/**
 * @class
 * @name EventTypeForm
 * @description  Render form for creating a new event type
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventTypeForm extends Component {
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
      eventType,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const payload = {
          strings: {
            name: {
              en: values.name,
            },
            description: {
              en: values.description,
            },
            group: values.group,
          },
        };
        if (isEditForm) {
          const updatedContact = { ...eventType, ...payload };
          putEventType(
            updatedContact,
            () => {
              notifySuccess('Event Type was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating Event Type, please try again!'
              );
            }
          );
        } else {
          postEventType(
            payload,
            () => {
              notifySuccess('Event Type was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Event Type, please try again!'
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
      eventType,
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
        {/* Event Type name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: isEditForm ? eventType.strings.name.en : undefined,
            rules: [
              {
                required: true,
                message: ' Event Types organization name is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Event Type name */}

        {/* Event Type group */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Group">
          {getFieldDecorator('group', {
            initialValue: isEditForm ? eventType.strings.group : undefined,
            rules: [{ message: 'Event Type group is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end Event Type group */}

        {/* Event type */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm
              ? eventType.strings.description.en
              : undefined,
            rules: [{ required: true, message: 'Description is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end Event Type */}

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

EventTypeForm.propTypes = {
  eventType: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      _id: PropTypes.string,
      group: PropTypes.string,
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

export default Form.create()(EventTypeForm);
