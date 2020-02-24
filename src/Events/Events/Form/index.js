import { httpActions } from '@codetanzania/ewea-api-client';
import { postEvent, putEvent } from '@codetanzania/ewea-api-states';
import { Button, Col, Form, Row, Input } from 'antd';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchableSelectInput from '../../../components/SearchableSelectInput';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { getEventTypes, getAdministrativeAreas } = httpActions;
const { TextArea } = Input;

/**
 * @class
 * @name EventForm
 * @description Render Event form for creating and updating stakeholder
 * event details
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
   * @param {object} e onSubmit event object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = e => {
    e.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      event,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
          const updatedEvent = { ...event, ...values };
          putEvent(
            updatedEvent,
            () => {
              notifySuccess('Event was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating event, please try again!'
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
                'Something occurred while saving event, please try again!'
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
      event,
      posting,
      onCancel,
      form: { getFieldDecorator },
    } = this.props;

    // const { certainty, urgency, severity, status } = eventSchema;

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
        {/* event event */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Event Type">
              {getFieldDecorator('type', {
                initialValue:
                  isEditForm && event
                    ? event.type._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event Type is required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getEventTypes}
                  optionLabel={type => type.strings.name.en}
                  optionValue="_id"
                  initialValue={isEditForm && event ? event.type : undefined}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end event event */}

        {/* event area */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}

            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Description">
              {getFieldDecorator('description', {
                initialValue: isEditForm ? event.description : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event event is required',
                  },
                ],
              })(<TextArea autosize={{ minRows: 3, maxRows: 10 }} />)}
            </Form.Item>
            {/* end role description */}

            {/* event areas */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Area(s)">
              {getFieldDecorator('areas', {
                initialValue:
                  isEditForm && event.areas
                    ? map(event.areas, area => area._id) // eslint-disable-line
                    : [],
              })(
                <SearchableSelectInput
                  onSearch={getAdministrativeAreas}
                  optionLabel={areas => areas.strings.name.en}
                  mode="multiple"
                  optionValue="_id"
                  initialValue={isEditForm && event.areas ? event.areas : []}
                />
              )}
            </Form.Item>
            {/* end event areas */}
          </Col>
        </Row>
        {/* end event area */}

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
  event: PropTypes.shape({
    type: PropTypes.shape({ _id: PropTypes.string }),
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

export default Form.create()(EventForm);
