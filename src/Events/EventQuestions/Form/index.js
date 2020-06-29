import { reduxActions } from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchableSelectInput from '../../../components/SearchableSelectInput';
import { notifyError, notifySuccess } from '../../../util';

const { getEventIndicators, getEventTopics } = httpActions;
const { putEventQuestion, postEventQuestion } = reduxActions;
const { TextArea } = Input;

/**
 * @class
 * @name EventQuestionForm
 * @description  Render form for creating a new event question
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventQuestionForm extends Component {
  /**
   * @function
   * @name handleSubmit
   * @description  call back function to handle submit action
   *
   * @param {object} e event object
   *
   * @returns {undefined} does not return anything
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const {
      form: { validateFieldsAndScroll },
      eventQuestion,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const payload = {
          strings: {
            code: values.code,
            name: {
              en: values.name,
            },
            description: {
              en: values.description,
            },
          },
          relations: {
            indicator: { _id: values.indicator },
            topic: { _id: values.topic },
          },
        };
        if (isEditForm) {
          const updatedContact = { ...eventQuestion, ...payload };
          putEventQuestion(
            updatedContact,
            () => {
              notifySuccess('Event Question was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating Event Question, please try again!'
              );
            }
          );
        } else {
          postEventQuestion(
            payload,
            () => {
              notifySuccess('Event Question was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving Event Question, please try again!'
              );
            }
          );
        }
      }
    });
  };

  render() {
    const {
      posting,
      onCancel,
      isEditForm,
      eventQuestion,
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
        {/* Event Question name */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            initialValue: isEditForm
              ? eventQuestion.strings.name.en
              : undefined,
            rules: [
              {
                required: true,
                message: ' Event Certainties  name is required',
              },
            ],
          })(<Input />)}
        </Form.Item>
        {/* end Event Question name */}

        {/* Event Question Indicator */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Indicator">
          {getFieldDecorator('indicator', {
            initialValue:
              isEditForm && eventQuestion.relations.indicator // eslint-disable-line
                ? eventQuestion.relations.indicator._id // eslint-disable-line
                : undefined,
            rules: [{ required: true, message: 'Event Indicator is required' }],
          })(
            <SearchableSelectInput
              onSearch={getEventIndicators}
              optionLabel={(indicator) => indicator.strings.name.en}
              optionValue="_id"
              initialValue={
                isEditForm && eventQuestion.relations.indicator
                  ? eventQuestion.relations.indicator
                  : undefined
              }
            />
          )}
        </Form.Item>
        {/* end Event indicator */}

        {/* Event Question Topic */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Topic">
          {getFieldDecorator('topic', {
            initialValue:
              isEditForm && eventQuestion.relations.topic // eslint-disable-line
                ? eventQuestion.relations.topic._id // eslint-disable-line
                : undefined,
          })(
            <SearchableSelectInput
              onSearch={getEventTopics}
              optionLabel={(topic) => topic.strings.name.en}
              optionValue="_id"
              initialValue={
                isEditForm && eventQuestion.relations.topic
                  ? eventQuestion.relations.topic
                  : undefined
              }
            />
          )}
        </Form.Item>
        {/* end Event Topic */}

        {/* Event Question Description */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Description">
          {getFieldDecorator('description', {
            initialValue: isEditForm
              ? eventQuestion.strings.description.en
              : undefined,
          })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
        </Form.Item>
        {/* end Event Question */}

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

EventQuestionForm.propTypes = {
  eventQuestion: PropTypes.shape({
    strings: PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      description: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }),
      _id: PropTypes.string,
    }),
    relations: PropTypes.shape({
      indicator: PropTypes.objectOf(PropTypes.any),
      topic: PropTypes.objectOf(PropTypes.any),
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

export default Form.create()(EventQuestionForm);
