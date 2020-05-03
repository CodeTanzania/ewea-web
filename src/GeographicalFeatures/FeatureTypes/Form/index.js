import { reduxActions } from '@codetanzania/ewea-api-states';
import { Button, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { notifyError, notifySuccess } from '../../../util';

const { putFeatureType, postFeatureType } = reduxActions;

/* constants */
const { TextArea } = Input;
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

/**
 * @function
 * @name FeatureTypeForm
 * @description Feature Type Form
 * @param {object} props React props
 * @returns {object} React Component
 * @version 0.1.0
 * @since 0.1.0
 */
const FeatureTypeForm = ({ featureType, isEditForm, posting, onCancel }) => {
  const onFinish = (values) => {
    if (isEditForm) {
      const updatedEventStatus = { ...featureType, ...values };
      putFeatureType(
        updatedEventStatus,
        () => {
          notifySuccess('Feature type was updated successfully');
        },
        () => {
          notifyError(
            'Something occurred while updating feature type, please try again!'
          );
        }
      );
    } else {
      postFeatureType(
        values,
        () => {
          notifySuccess('Feature type was created successfully');
        },
        () => {
          notifyError(
            'Something occurred while saving feature type, please try again!'
          );
        }
      );
    }
  };

  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout} // eslint-disable-line
      initialValues={{
        ...featureType,
      }}
      autoComplete="off"
    >
      {/* feature type name */}
      <Form.Item
        label="Name"
        name={['strings', 'name', 'en']}
        rules={[{ required: true, message: 'Feature type name is required' }]}
      >
        <Input />
      </Form.Item>
      {/* end feature type name */}

      {/* feature type description */}
      <Form.Item
        {...formItemLayout} // eslint-disable-line
        label="Description"
        name={['strings', 'description', 'en']}
      >
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end feature type description */}

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
};

FeatureTypeForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  featureType: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

FeatureTypeForm.defaultProps = {
  featureType: null,
};

export default FeatureTypeForm;
