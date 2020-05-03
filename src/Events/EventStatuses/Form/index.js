import { reduxActions } from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { TextArea } = Input;
const { postEventStatus, putEventStatus } = reduxActions;

/**
 * @class
 * @name EventStatusForm
 * @description Render React Form
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventStatusForm extends Component {
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
  handleSubmit = (event) => {
    event.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      eventStatus,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
          const updatedEventStatus = { ...eventStatus, ...values };
          putEventStatus(
            updatedEventStatus,
            () => {
              notifySuccess('Event status was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating event status, please try again!'
              );
            }
          );
        } else {
          postEventStatus(
            values,
            () => {
              notifySuccess('Event status was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving event status, please try again!'
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
      eventStatus,
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
        {/* event status name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('strings.name.en', {
            initialValue: isEditForm ? eventStatus.strings.name.en : undefined,
            rules: [
              { required: true, message: 'Event status name is required' },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end event status name */}

        {/* event status description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('strings.description.en', {
            initialValue: isEditForm
              ? eventStatus.strings.description.en
              : undefined,
          })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
        </Form.Item>
        {/* end event status description */}

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

EventStatusForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  eventStatus: PropTypes.shape({
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

EventStatusForm.defaultProps = {
  eventStatus: null,
};

export default Form.create()(EventStatusForm);
