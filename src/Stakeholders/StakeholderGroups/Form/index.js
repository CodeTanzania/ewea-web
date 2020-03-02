import { putPartyGroup, postPartyGroup } from '@codetanzania/ewea-api-states';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../util';

/**
 * @class
 * @name StakeholderGroup
 * @description  Render form for creating a new party group
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
   * @param {object} e party object
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
      partyType,
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
          const updatedContact = { ...partyType, ...payload };
          putPartyGroup(
            updatedContact,
            () => {
              notifySuccess('Party Group was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating Party Group, please try again!'
              );
            }
          );
        } else {
          postPartyGroup(
            payload,
            () => {
              notifySuccess('Party Group was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Party Group, please try again!'
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
      partyType,
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
        {/* Party Group name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: isEditForm ? partyType.strings.name.en : undefined,
            rules: [
              {
                required: true,
                message: ' Party Groups  name is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Party Group name */}

        {/* Party Group code */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Party Group code">
          {getFieldDecorator('code', {
            initialValue: isEditForm ? partyType.strings.code : undefined,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Party Group code */}

        {/* Party Group Description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm
              ? partyType.strings.description.en
              : undefined,
            rules: [
              {
                required: true,
                message: 'Party Group Description is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Party Group */}

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
  partyType: PropTypes.shape({
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
