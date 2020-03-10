import {
  putEventCertainty,
  postEventCertainty,
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
 * @name EventCertaintyForm
 * @description  Render form for creating a new event certainty
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventCertaintyForm extends Component {
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
      eventCertainty,
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
          const updatedContact = { ...eventCertainty, ...payload };
          putEventCertainty(
            updatedContact,
            () => {
              notifySuccess('Event Certainty was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating Event Certainty, please try again!'
              );
            }
          );
        } else {
          postEventCertainty(
            payload,
            () => {
              notifySuccess('Event Certainty was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Event Certainty, please try again!'
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
      eventCertainty,
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
        {/* Event Certainty name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: isEditForm
              ? eventCertainty.strings.name.en
              : undefined,
            rules: [
              {
                required: true,
                message: ' Event Certainties  name is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Event Certainty name */}

        {/* Event Certainty code */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Event Certainty code">
          {getFieldDecorator('code', {
            initialValue: isEditForm ? eventCertainty.strings.code : undefined,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Event Certainty code */}

        {/* Event Certainty Description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm
              ? eventCertainty.strings.description.en
              : undefined,
            rules: [
              {
                required: true,
                message: 'Event Certainty Description is required',
              },
            ],
          })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
        </Form.Item>
        {/* end Event Certainty */}

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

EventCertaintyForm.propTypes = {
  eventCertainty: PropTypes.shape({
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

export default Form.create()(EventCertaintyForm);
