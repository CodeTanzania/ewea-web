import {
  postEventResponse,
  putEventResponse,
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
 * @name EventResponseForm
 * @description Render React Form
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventResponseForm extends Component {
  /**
   * @function
   * @name handleSubmit
   * @description Handle form submit action
   *
   * @param {object} event onSubmit event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = event => {
    event.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      eventResponse,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
          const updatedEventResponse = { ...eventResponse, ...values };
          putEventResponse(
            updatedEventResponse,
            () => {
              notifySuccess('Event response was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating event response, please try again!'
              );
            }
          );
        } else {
          postEventResponse(
            values,
            () => {
              notifySuccess('Event response was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving event response, please try again!'
              );
            }
          );
        }
      }
    });
  };

  render() {
    const {
      isEditForm,
      eventResponse,
      posting,
      onCancel,
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
        {/* event response name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('strings.name.en', {
            initialValue: isEditForm
              ? eventResponse.strings.name.en
              : undefined,
            rules: [
              { required: true, message: 'Event Response name is required' },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end event response name */}

        {/* event response description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('strings.description.en', {
            initialValue: isEditForm
              ? eventResponse.strings.description.en
              : undefined,
          })(<TextArea autosize={{ minRows: 3, maxRows: 10 }} />)}
        </Form.Item>
        {/* end event response description */}

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

EventResponseForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  eventResponse: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

EventResponseForm.defaultProps = {
  eventResponse: null,
};

export default Form.create()(EventResponseForm);
