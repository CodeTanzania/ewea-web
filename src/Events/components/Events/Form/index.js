import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, postEvent, putEvent } from '@codetanzania/ewea-api-states';
import { Button, Col, Form, Row } from 'antd';
import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchableSelectInput from '../../../../components/SearchableSelectInput';
import { notifyError, notifySuccess } from '../../../../util';
import SelectInput from '../../../../components/SelectInput';

/* constants */
const { getEventTypes, getFeatures } = httpActions;

/**
 * @class
 * @name EventForm
 * @description Render Event form for creating and updating stakeholder
 * alert details
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventForm extends Component {
  /**
   * @function
   * @name handleSubmit
   * @description Handle submit form action
   *
   * @param {object} event onSubmit event object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = event => {
    event.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      alert,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
          const updatedEvent = { ...alert, ...values };
          putEvent(
            updatedEvent,
            () => {
              notifySuccess('Event was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating alert, please try again!'
              );
            }
          );
        } else {
          postEvent(
            values,
            () => {
              notifySuccess('Event was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving alert, please try again!'
              );
            }
          );
        }
      }
    });
  };

  /**
   * @function
   * @name renderSelectOptions
   * @description  display select options
   * @param {Array} options select options
   *
   * @returns {object[]} Selected options components
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  renderSelectOptions = options =>
    options.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ));

  render() {
    const {
      isEditForm,
      alert,
      posting,
      onCancel,
      alertSchema,
      form: { getFieldDecorator },
    } = this.props;

    const { certainty, urgency, severity, status } = alertSchema;

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
        {/* alert event */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Event">
              {getFieldDecorator('event', {
                initialValue:
                  isEditForm && alert
                    ? alert._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event event is required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getEventTypes}
                  optionLabel={type => type.strings.name.en}
                  optionValue="_id"
                  initialValue={isEditForm && alert ? alert : undefined}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end alert event */}

        {/* alert area */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Area">
              {getFieldDecorator('area', {
                initialValue:
                  isEditForm && alert
                    ? alert._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event area is required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getFeatures}
                  optionLabel={feature =>
                    `${feature.name} (${upperFirst(feature.type)})`
                  }
                  optionValue="_id"
                  initialValue={
                    isEditForm && alert
                      ? alert._id // eslint-disable-line
                      : undefined
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end alert area */}

        {/* alert status and severity section */}
        <Row type="flex" justify="space-between">
          <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
            {/* alert status */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Status">
              {getFieldDecorator('status', {
                initialValue:
                  isEditForm && alert
                    ? alert.status // eslint-disable-line
                    : undefined,
              })(<SelectInput options={status.enum} />)}
            </Form.Item>
            {/* end alert status */}
          </Col>
          <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
            {/* alert severity */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Severity">
              {getFieldDecorator('severity', {
                initialValue:
                  isEditForm && alert
                    ? alert.severity // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event severity is required',
                  },
                ],
              })(<SelectInput options={severity.enum} />)}
            </Form.Item>
            {/* end alert severity */}
          </Col>
        </Row>
        {/* end alert status and severity section */}
        {/* alert urgency and certainty section */}
        <Row type="flex" justify="space-between">
          <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
            {/* alert urgency */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Urgency">
              {getFieldDecorator('urgency', {
                initialValue:
                  isEditForm && alert
                    ? alert.urgency // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event urgency is required',
                  },
                ],
              })(<SelectInput options={urgency.enum} />)}
            </Form.Item>
            {/* end alert urgency */}
          </Col>
          <Col xxl={11} xl={11} lg={11} md={11} sm={24} xs={24}>
            {/* alert certainty */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Certainty">
              {getFieldDecorator('certainty', {
                initialValue:
                  isEditForm && alert
                    ? alert.certainty // eslint-disable-line
                    : undefined,
              })(<SelectInput options={certainty.enum} />)}
            </Form.Item>
            {/* end alert certainty */}
          </Col>
        </Row>
        {/* end alert urgency and certainty section */}
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

EventForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  alert: PropTypes.shape({
    event: PropTypes.string,
    description: PropTypes.string,
    certainty: PropTypes.string,
    urgency: PropTypes.string,
    color: PropTypes.string,
    severity: PropTypes.string,
  }).isRequired,
  alertSchema: PropTypes.shape({
    urgency: PropTypes.arrayOf(
      PropTypes.shape({ enum: PropTypes.arrayOf(PropTypes.string) })
    ),
    severity: PropTypes.arrayOf(
      PropTypes.shape({ enum: PropTypes.arrayOf(PropTypes.string) })
    ),
    certainty: PropTypes.arrayOf(
      PropTypes.shape({ enum: PropTypes.arrayOf(PropTypes.string) })
    ),
    status: PropTypes.shape({ enum: PropTypes.arrayOf(PropTypes.string) }),
  }).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

export default Form.create()(
  Connect(EventForm, {
    alertSchema: 'alerts.schema.properties',
  })
);
