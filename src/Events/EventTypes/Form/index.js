import React from 'react';
import PropTypes from 'prop-types';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Form, Input } from 'antd';
import get from 'lodash/get';

import SearchableSelectInput from '../../../components/SearchableSelectInput';
import { notifyError, notifySuccess } from '../../../util';

/* http actions */
const { getEventGroups } = httpActions;
/* redux actions */
const { putEventType, postEventType } = reduxActions;
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
 * @name EventTypeForm
 * @description Form for creating and editing event type
 * @param {object} props Form properties object
 * @param {object|null} props.eventType Event Type object to be edited if null it will be created
 * @param {boolean} props.posting Boolean flag for showing spinner while sending data to the api
 * @param {Function} props.onCancel Callback for closing form
 * @returns {object} Render Event Type form
 * @version 0.2.0
 * @since 0.1.0
 */
const EventTypeForm = ({ eventType, posting, onCancel }) => {
  const onFinish = (values) => {
    if (get(eventType, '_id')) {
      const updatedContact = { ...eventType, ...values };
      putEventType(
        updatedContact,
        () => {
          notifySuccess('Event Type was updated successfully');
        },
        () => {
          notifyError(
            'Something occurred while updating Event Type, please try again!'
          );
        }
      );
      return;
    }

    postEventType(
      values,
      () => {
        notifySuccess('Event Type was created successfully');
      },
      () => {
        notifyError(
          'Something occurred while saving Event Type, please try again!'
        );
      }
    );
  };

  return (
    <Form
      {...formItemLayout} // eslint-disable-line
      onFinish={onFinish}
      autoComplete="off"
      initialValues={{
        ...eventType,
        relations: {
          group: get(eventType, 'relations.group._id'),
        },
      }}
    >
      <Form.Item
        name={['strings', 'name', 'en']}
        label="Name"
        rules={[
          {
            required: true,
            message: ' Event Types organization name is required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* end Event Type name */}

      {/* Event Type group */}
      <Form.Item
        name={['relations', 'group']}
        label="Group"
        rules={[{ message: 'Event Type group is required' }]}
      >
        <SearchableSelectInput
          onSearch={getEventGroups}
          optionLabel={(group) => group.strings.name.en}
          optionValue="_id"
          initialValue={get(eventType, 'relations.group')}
        />
      </Form.Item>
      {/* end Event Type group */}

      {/* Event type */}
      <Form.Item
        name={['strings', 'description', 'en']}
        label="Description"
        rules={[{ required: true, message: 'Description is required' }]}
      >
        <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
      </Form.Item>
      {/* end Event Type */}

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

EventTypeForm.propTypes = {
  eventType: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      _id: PropTypes.string,
    }),
    relations: PropTypes.shape({
      group: PropTypes.string,
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

export default EventTypeForm;
