import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button, Input, InputNumber, Form, Row, Col } from 'antd';
import { httpActions } from '@codetanzania/ewea-api-client';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { notifyError, notifySuccess } from '../../../util';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* http actions */
const { getPartyGroups } = httpActions;

/* state actions */
const { putEventFunction, postEventFunction } = reduxActions;

/* ui */
const { TextArea } = Input;
const labelCol = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};
const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

/* messages */
const MESSAGE_POST_SUCCESS = 'Emergency Function was created successfully';
const MESSAGE_POST_ERROR =
  'Something occurred while saving Emergency Function, Please try again!';
const MESSAGE_PUT_SUCCESS = 'Emergency Function was updated successfully';
const MESSAGE_PUT_ERROR =
  'Something occurred while updating Emergency Function, Please try again!';

/**
 * @function EventFunctionForm
 * @name EventFunctionForm
 * @description Form for create and edit event function
 * @param {object} props Valid form properties
 * @param {object} props.eventFunction Valid event function object
 * @param {boolean} props.isEditForm Flag wether form is on edit mode
 * @param {boolean} props.posting Flag whether form is posting data
 * @param {Function} props.onCancel Form cancel callback
 * @returns {object} EventFunctionForm component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <EventFunctionForm
 *   eventFunction={eventFunction}
 *   isEditForm={isEditForm}
 *   posting={posting}
 *   onCancel={this.handleCloseEventFunctionForm}
 * />
 *
 */
const EventFunctionForm = ({
  eventFunction,
  isEditForm,
  posting,
  onCancel,
}) => {
  // form finish(submit) handler
  const onFinish = (values) => {
    if (isEditForm) {
      const updates = { ...eventFunction, ...values };
      putEventFunction(
        updates,
        () => notifySuccess(MESSAGE_PUT_SUCCESS),
        () => notifyError(MESSAGE_PUT_ERROR)
      );
    } else {
      postEventFunction(
        values,
        () => notifySuccess(MESSAGE_POST_SUCCESS),
        () => notifyError(MESSAGE_POST_ERROR)
      );
    }
  };

  return (
    <Form
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      onFinish={onFinish}
      initialValues={{ ...eventFunction }}
      autoComplete="off"
    >
      {/* start:name */}
      <Form.Item
        label="Name"
        title="Emergency function name e.g Evacuation"
        name={['strings', 'name', 'en']}
        rules={[
          {
            required: true,
            message: 'Emergency function name is required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* end:name */}

      {/* start: number & code */}
      <Row justify="space-between">
        {/* start:number */}
        <Col span={11}>
          <Form.Item
            label="Number"
            title="Emergency function number e.g 3"
            name={['numbers', 'weight']}
            rules={[
              {
                required: true,
                message: 'Emergency function number is required',
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* end:number */}
        {/* start:code */}
        <Col span={11}>
          <Form.Item
            label="Code"
            title="Emergency function code e.g ERF3"
            name={['strings', 'code']}
            rules={[
              {
                required: true,
                message: 'Emergency function code is required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        {/* end:code */}
      </Row>
      {/* end: number & code */}

      {/* start:groups */}
      <Form.Item
        label="Agencies"
        title="Lead and Supporting Agencies e.g Police Force"
        name={['relations', 'groups']}
        rules={[
          {
            required: true,
            message: 'Lead or Supporting Agencies are required',
          },
        ]}
      >
        <SearchableSelectInput
          onSearch={getPartyGroups}
          optionLabel={(group) => get(group, 'strings.name.en')}
          optionValue="_id"
          initialValue={get(eventFunction, 'relations.groups', undefined)}
          mode="multiple"
        />
      </Form.Item>
      {/* end:groups */}

      {/* start:description */}
      <Form.Item
        label="Description"
        title="Emergency function description"
        name={['strings', 'description', 'en']}
      >
        <TextArea autoSize={{ minRows: 4, maxRows: 10 }} />
      </Form.Item>
      {/* end:description */}

      {/* start:form actions */}
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
      {/* end:form actions */}
    </Form>
  );
};

EventFunctionForm.defaultProps = {
  eventFunction: {},
};

EventFunctionForm.propTypes = {
  eventFunction: PropTypes.shape({
    _id: PropTypes.string,
    strings: PropTypes.shape({
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
    }),
    numbers: PropTypes.shape({
      weight: PropTypes.number.isRequired,
    }),
    relations: PropTypes.shape({
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
        })
      ),
    }),
  }),
  isEditForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EventFunctionForm;
