import { httpActions } from '@codetanzania/ewea-api-client';
import { postEvent, putEvent, Connect } from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Row, Input, Form, Radio } from 'antd';
import map from 'lodash/map';
import get from 'lodash/get';

import SearchableSelectInput from '../../../components/SearchableSelectInput';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { getEventTypes, getEventLevels, getAdministrativeAreas } = httpActions;
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
 * @name EventForm
 * @description Event Form component for creating and editing event
 * @param {object} props React props
 * @returns {object} React component
 * @version 0.1.0
 * @since 0.1.0
 */
const EventForm = ({
  isEditForm,
  defaultStage,
  stages,
  event,
  posting,
  onCancel,
}) => {
  const onFinish = (values) => {
    if (isEditForm) {
      const updatedEvent = { ...event, ...values };
      putEvent(
        updatedEvent,
        () => {
          notifySuccess('Event was updated successfully');
        },
        () => {
          notifyError(
            'An error occurred while updating event, please try again!'
          );
        }
      );
    } else {
      postEvent(
        { ...values },
        () => {
          notifySuccess('Event was created successfully');
        },
        () => {
          notifyError(
            'An error occurred while saving event, please try again!'
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
        stage: defaultStage,
        ...event,
        type: get(event, 'type._id', undefined),
        level: get(event, 'level._id', undefined),
        areas: map(get(event, 'areas', []), area => area._id), // eslint-disable-line
      }}
      autoComplete="off"
    >
      {/* event type */}
      <Row type="flex" justify="space-between">
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          <Form.Item
            name="type"
            label="Event Type"
            rules={[
              {
                required: true,
                message: 'Event Type is required',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getEventTypes}
              optionLabel={(type) => type.strings.name.en}
              optionValue="_id"
              initialValue={isEditForm && event ? event.type : undefined}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* end event type */}

      {/* event level */}
      <Row type="flex" justify="space-between">
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          <Form.Item name="level" label="Event Level">
            <SearchableSelectInput
              onSearch={getEventLevels}
              optionLabel={(level) => level.strings.name.en}
              optionValue="_id"
              initialValue={isEditForm && event ? event.level : undefined}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* end event level */}

      {/* event area */}
      <Row type="flex" justify="space-between">
        <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
          {/* event description */}
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: 'Event event is required',
              },
            ]}
          >
            <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
          </Form.Item>
          {/* end event description */}

          {/* event instructions */}
          <Form.Item name="instructions" label="Instructions">
            <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
          </Form.Item>
          {/* end event instructions */}

          {/* event areas */}
          <Form.Item name="areas" label="Area(s)">
            <SearchableSelectInput
              onSearch={getAdministrativeAreas}
              optionLabel={(area) =>
                `${area.strings.name.en} (${get(
                  area,
                  'relations.level.strings.name.en',
                  'N/A'
                )})`
              }
              mode="multiple"
              optionValue="_id"
              initialValue={isEditForm && event.areas ? event.areas : []}
            />
          </Form.Item>
          {/* end event areas */}
        </Col>
      </Row>
      {/* end event area */}

      {/* event stage */}
      <Form.Item name="stage" label="Event Stage">
        <Radio.Group>
          {map(stages, (stage) => (
            <Radio key={stage} value={stage}>
              {stage}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      {/* end event stage */}
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

EventForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  stages: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultStage: PropTypes.string.isRequired,
  event: PropTypes.shape({
    type: PropTypes.shape({ _id: PropTypes.string }),
    level: PropTypes.shape({ _id: PropTypes.string }),
    description: PropTypes.string,
    certainty: PropTypes.string,
    urgency: PropTypes.string,
    color: PropTypes.string,
    severity: PropTypes.string,
    areas: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

export default Connect(EventForm, {
  stages: 'events.schema.properties.stage.enum',
  defaultStage: 'events.schema.properties.stage.default',
});
