import { putFeature, postFeature } from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../util';

/**
 * @class
 * @name FeaturesForm
 * @description  Render form for creating a new critical facility
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class FeaturesForm extends Component {
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
      feature,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const payload = {
          strings: {
            name: {
              en: values.name,
            },
            code: values.code,
            description: {
              en: values.description,
            },
          },
          properties: {
            amenity: values.amenity,
            address_city: values.address_city,
          },
        };
        if (isEditForm) {
          const updatedContact = { ...feature, ...payload };
          putFeature(
            updatedContact,
            () => {
              notifySuccess('Critical facility was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating Critical facility, please try again!'
              );
            }
          );
        } else {
          postFeature(
            payload,
            () => {
              notifySuccess('Critical facility was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Critical facility, please try again!'
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
      feature,
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
        {/* critical facility name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: isEditForm ? feature.strings.name.en : undefined,
            rules: [
              {
                required: true,
                message: ' Critical facility name is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end critical facility name */}

        {/* critical facility code */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="code">
          {getFieldDecorator('code', {
            initialValue:
              isEditForm && feature.strings.code // eslint-disable-line
                ? feature.strings.code // eslint-disable-line
                : undefined,
            rules: [{ message: 'critical facility code is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end critical facility code */}

        {/* Critical facility amenity */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Amenity">
          {getFieldDecorator('amenity', {
            initialValue: isEditForm ? feature.properties.amenity : undefined,
            rules: [{ required: true, message: 'Amenity is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end critical facility amenity */}

        {/* Critical facility address */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Address">
          {getFieldDecorator('address_city', {
            initialValue: isEditForm
              ? feature.properties.address_city
              : undefined,
            rules: [{ required: true, message: 'Address is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end critical facility address */}

        {/* Critical facility description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm
              ? feature.strings.description.en
              : undefined,
            rules: [{ required: true, message: 'Description is required' }],
          })(<Input />)}
        </Form.Item>
        {/* end critical facility description */}

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

FeaturesForm.propTypes = {
  feature: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      _id: PropTypes.string,
    }),
    properties: PropTypes.shape({
      amenity: PropTypes.string,
      address_city: PropTypes.string,
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

export default Form.create()(FeaturesForm);
