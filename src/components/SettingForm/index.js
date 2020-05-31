import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form } from 'antd';
import get from 'lodash/get';

import { notifyError, notifySuccess } from '../../util';
import ColorPicker from '../ColorPicker';

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
 * @name SettingForm
 * @description Form for creating and editing settings
 * @param {object} props Properties object
 * @param {object|null} props.setting Setting object to be edited
 * @param {boolean} props.posting Flag for showing spinner while posting
 * @param {Function} props.onCancel On Cancel form callback
 * @param {Function} props.onCreate On Create setting callback function
 * @param {Function} props.onUpdate onUpdate setting callback function
 * @returns {object} Setting Form
 * @version 0.1.0
 * @since 0.1.0
 */
const SettingForm = ({ setting, posting, onCancel, onCreate, onUpdate }) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    if (get(setting, '_id')) {
      const updatedSetting = { ...setting, ...values };
      onUpdate(
        updatedSetting,
        () => notifySuccess('Setting was updated successfully'),
        () =>
          notifyError(
            'An error occurred while updating setting, please contact your system administrator'
          )
      );

      return;
    }

    onCreate(
      values,
      () => notifySuccess('Setting was created successfully'),
      () =>
        notifyError(
          'An error occurred while saving setting, please contact your system administrator'
        )
    );
  };

  return (
    <Form
      {...formItemLayout} // eslint-disable-line
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      initialValues={{ ...setting }}
    >
      {/* setting name */}
      <Form.Item
        name={['strings', 'name', 'en']}
        label="Name"
        rules={[{ required: true, message: 'This field is required' }]}
      >
        <Input />
      </Form.Item>
      {/* end setting name */}

      {/* setting code */}
      <Form.Item name={['strings', 'code']} label="Code">
        <Input />
      </Form.Item>
      {/* end setting code */}

      {/* setting description */}
      <Form.Item name={['strings', 'description', 'en']} label="Description">
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end setting description */}

      {/* setting color code */}
      <Form.Item name={['strings', 'color']} label="Color">
        <ColorPicker />
      </Form.Item>
      {/* end setting color code */}

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

SettingForm.propTypes = {
  setting: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

SettingForm.defaultProps = {
  setting: null,
};

export default SettingForm;
