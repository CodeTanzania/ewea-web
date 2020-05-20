import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input } from 'antd';
import { notifyError, notifySuccess } from '../../../util';

const { postNotificationTemplate, putNotificationTemplate } = reduxActions;
const { TextArea } = Input;

/**
 * @class
 * @name NotificationTemplateForm
 * @description Render form for creating and updating notification templates
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class NotificationTemplateForm extends Component {
  /**
   * @function
   * @name handleSubmit
   * @description Handle submit form action
   *
   * @param {object} event onSubmit event object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = (event) => {
    event.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      notificationTemplate,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const payload = {
          strings: {
            name: { en: values.name },
            description: { en: values.description },
          },
        };
        if (isEditForm) {
          const updatedNotificationTemplate = {
            ...notificationTemplate,
            ...payload,
          };
          putNotificationTemplate(
            updatedNotificationTemplate,
            () => {
              notifySuccess('Notification template was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating Notification template, please try again!'
              );
            }
          );
        } else {
          postNotificationTemplate(
            payload,
            () => {
              notifySuccess('Notification template was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Notification template, please try again!'
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
      notificationTemplate,
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
        {/* notification template name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: isEditForm
              ? notificationTemplate.strings.name.en
              : undefined,
            rules: [
              {
                required: true,
                message: 'Notification Template name is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end notification template name */}
        {/* notification template description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm
              ? notificationTemplate.strings.description.en
              : undefined,
            rules: [
              {
                required: true,
                message: 'Notification Template description is required',
              },
            ],
          })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
        </Form.Item>
        {/* end notification template description */}

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

NotificationTemplateForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  notificationTemplate: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string,
        sw: PropTypes.string,
      }),
      description: PropTypes.shape({
        en: PropTypes.string,
        sw: PropTypes.string,
      }),
    }),
  }).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

export default Form.create()(NotificationTemplateForm);
