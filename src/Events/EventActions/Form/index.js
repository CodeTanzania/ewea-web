import { postEventAction, putEventAction } from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { TextArea } = Input;

/**
 * @class
 * @name EventActionForm
 * @description Render React Form
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventActionForm extends Component {
  /**
   * @function
   * @name handleSubmit
   * @description Handle form submit action
   *
   * @param {object} event onSubmit event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = event => {
    event.preventDefault();

    const {
      form: { validateFieldsAndScroll },
      eventAction,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
          const updatedEventAction = { ...eventAction, ...values };
          putEventAction(
            updatedEventAction,
            () => {
              notifySuccess('Event action was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating event action, please try again!'
              );
            }
          );
        } else {
          postEventAction(
            values,
            () => {
              notifySuccess('Event action was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving event action, please try again!'
              );
            }
          );
        }
      }
    });
  };

  render() {
    const {
      isEditForm,
      eventAction,
      posting,
      onCancel,
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
        {/* eventAction name and abbreviation */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* event action name */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Name">
              {getFieldDecorator('strings.name.en', {
                initialValue: isEditForm
                  ? eventAction.strings.name.en
                  : undefined,
                rules: [
                  { required: true, message: 'Event Action  name is required' },
                ],
              })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
            </Form.Item>
            {/* end event action name */}
          </Col>
        </Row>
        {/* end event action name and abbreviation */}

        {/* eventAction description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('strings.description.en', {
            initialValue: isEditForm
              ? eventAction.strings.description.en
              : undefined,
          })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
        </Form.Item>
        {/* end eventAction description */}

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

EventActionForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  eventAction: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

EventActionForm.defaultProps = {
  eventAction: null,
};

export default Form.create()(EventActionForm);
