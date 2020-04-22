import {
  putAdministrativeLevel,
  postAdministrativeLevel,
} from '@codetanzania/ewea-api-states';
import { Button, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { notifyError, notifySuccess } from '../../../util';

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
 * @name AdministrativeLevelForm
 * @description Administrative Level Form
 * @param {object} props React props
 * @returns {object} React Component
 * @version 0.1.0
 * @since 0.1.0
 */
const AdministrativeLevelForm = ({
  administrativeLevel,
  isEditForm,
  posting,
  onCancel,
}) => {
  const onFinish = (values) => {
    if (isEditForm) {
      const updatedEventStatus = { ...administrativeLevel, ...values };
      putAdministrativeLevel(
        updatedEventStatus,
        () => {
          notifySuccess('Administrative level was updated successfully');
        },
        () => {
          notifyError(
            'Something occurred while updating administrative level, please try again!'
          );
        }
      );
    } else {
      postAdministrativeLevel(
        values,
        () => {
          notifySuccess('Administrative level was created successfully');
        },
        () => {
          notifyError(
            'Something occurred while saving administrative level, please try again!'
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
        ...administrativeLevel,
      }}
      autoComplete="off"
    >
      {/* administrative level name */}
      <Form.Item
        label="Name"
        name={['strings', 'name', 'en']}
        rules={[
          { required: true, message: 'Administrative level name is required' },
        ]}
      >
        <Input />
      </Form.Item>
      {/* end administrative level name */}

      {/* administrative level description */}
      <Form.Item
        {...formItemLayout} // eslint-disable-line
        label="Description"
        name={['strings', 'description', 'en']}
      >
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end administrative level description */}

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

AdministrativeLevelForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  administrativeLevel: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

AdministrativeLevelForm.defaultProps = {
  administrativeLevel: null,
};

export default AdministrativeLevelForm;
