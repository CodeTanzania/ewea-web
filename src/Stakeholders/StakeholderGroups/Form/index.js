import { putEventGroup, postEventGroup } from '@codetanzania/ewea-api-states';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../util';

/**
 * @class
 * @name StakeholderGroup
 * @description  Render form for creating a new event group
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class StakeholderGroup extends Component {
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
          const updatedContact = { ...eventType, ...payload };
          putEventGroup(
            updatedContact,
            () => {
              notifySuccess('Event Group was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating Event Group, please try again!'
              );
            }
          );
        } else {
          postEventGroup(
            payload,
            () => {
              notifySuccess('Event Group was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Event Group, please try again!'
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
        {/* Event Group name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: isEditForm ? eventType.strings.name.en : undefined,
            rules: [
              {
                required: true,
                message: ' Event Groups  name is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Event Group name */}

        {/* Event Group code */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Event Group code">
          {getFieldDecorator('code', {
            initialValue: isEditForm ? eventType.strings.code : undefined,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Event Group code */}

        {/* Event Group Description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm
              ? eventType.strings.description.en
              : undefined,
            rules: [
              {
                required: true,
                message: 'Event Group Description is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Event Group */}

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

StakeholderGroup.propTypes = {
  eventType: PropTypes.shape({
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

export default Form.create()(StakeholderGroup);
