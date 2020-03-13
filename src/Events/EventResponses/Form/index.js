import React from 'react';
import PropTypes from 'prop-types';
import {
  postEventResponse,
  putEventResponse,
} from '@codetanzania/ewea-api-states';
import { Button, Input, Form } from 'antd';
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

const EventResponseForm = ({
  eventResponse,
  isEditForm,
  posting,
  onCancel,
}) => {
  const onFinish = values => {
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
  };

  return (
    <Form
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formItemLayout}
      autoComplete="off"
      onFinish={onFinish}
      initialValues={{
        ...eventResponse,
      }}
    >
      {/* event response name */}
      <Form.Item
        label="Name"
        name={['strings', 'name', 'en']}
        rules={[{ required: true, message: 'Event Response name is required' }]}
      >
        <Input />
      </Form.Item>
      {/* end event response name */}

      {/* event response description */}
      <Form.Item label="Description" name={['strings', 'description', 'en']}>
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
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
};

EventResponseForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  eventResponse: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

EventResponseForm.defaultProps = {
  eventResponse: null,
};

export default EventResponseForm;
