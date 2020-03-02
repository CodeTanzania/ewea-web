import { httpActions } from '@codetanzania/ewea-api-client';
import { postChangelog } from '@codetanzania/ewea-api-states';
import { Button, Col, Form, Row, Input, Upload, Icon } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchableSelectInput from '../../../components/SearchableSelectInput';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const {
  getFocalPeople,
  getAgencies,
  getEventIndicators,
  getEventQuestions,
  getAdministrativeAreas,
  getEventTopics,
} = httpActions;
const { TextArea } = Input;

/**
 * @class
 * @name EventChangelogForm
 * @description Render Event form for creating and updating stakeholder
 * event details
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventChangelogForm extends Component {
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
      action,
      event,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      let data = { ...values, event };
      if (action === 'file') {
        data = new FormData(); // eslint-disable-line

        data.append('image', values.file[0].originFileObj);
        data.append('comment', values.comment);
        data.append('event', event._id); // eslint-disable-line
      }

      if (!error) {
        postChangelog(
          data,
          () => {
            notifySuccess('Event Feed was created successfully');
          },
          () => {
            notifyError(
              'Something occurred while saving event feed, please try again!'
            );
          },
          { filters: { event: event._id } } // eslint-disable-line
        );
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
      posting,
      onCancel,
      form: { getFieldDecorator, getFieldValue },
      action,
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
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* add areas */}
            {action === 'areas' && (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Form.Item {...formItemLayout} label="Areas">
                {getFieldDecorator('areas')(
                  <SearchableSelectInput
                    onSearch={getAdministrativeAreas}
                    optionLabel={area => `${area.strings.name.en}`}
                    optionValue="_id"
                    mode="multiple"
                  />
                )}
              </Form.Item>
            )}
            {/* end areas */}

            {/*  focal people */}
            {action === 'focalPeople' && (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Form.Item {...formItemLayout} label="Focal People">
                {getFieldDecorator('focals')(
                  <SearchableSelectInput
                    onSearch={getFocalPeople}
                    optionLabel="name"
                    optionValue="_id"
                    mode="multiple"
                  />
                )}
              </Form.Item>
            )}

            {action === 'agencies' && (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Form.Item {...formItemLayout} label="Agencies">
                {getFieldDecorator('agencies')(
                  <SearchableSelectInput
                    onSearch={getAgencies}
                    optionLabel="name"
                    optionValue="_id"
                    mode="multiple"
                  />
                )}
              </Form.Item>
            )}
            {/* end focal people */}

            {action === 'damage' && (
              <>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Indicator">
                  {getFieldDecorator('indicator', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select indicator',
                      },
                    ],
                  })(
                    <SearchableSelectInput
                      onSearch={getEventIndicators}
                      optionLabel={indicator => indicator.strings.name.en}
                      optionValue="_id"
                    />
                  )}
                </Form.Item>

                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Question">
                  {getFieldDecorator('question', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select question',
                      },
                    ],
                  })(
                    <SearchableSelectInput
                      onSearch={options =>
                        getEventQuestions({
                          ...options,
                          filter: {
                            relations: {
                              indicator: getFieldValue('indicator'),
                            },
                          },
                        })
                      }
                      optionLabel={question => question.strings.name.en}
                      optionValue="_id"
                    />
                  )}
                </Form.Item>

                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Topic">
                  {getFieldDecorator('topic')(
                    <SearchableSelectInput
                      onSearch={options =>
                        getEventTopics({
                          ...options,
                          filter: {
                            'relations.indicator': getFieldValue('indicator'),
                          },
                        })
                      }
                      optionLabel={topic => topic.strings.name.en}
                      optionValue="_id"
                    />
                  )}
                </Form.Item>

                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Form.Item {...formItemLayout} label="Value">
                  {getFieldDecorator('value', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter value',
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
              </>
            )}
            {/* file upload */}

            {action === 'file' && (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Form.Item label="Dragger">
                {getFieldDecorator('file', {
                  valuePropName: 'fileList',
                  getValueFromEvent: event => {
                    if (Array.isArray(event)) {
                      return event;
                    }
                    return event && event.fileList;
                  },
                })(
                  <Upload.Dragger
                    name="image"
                    beforeUpload={() => {
                      return false;
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload.
                    </p>
                  </Upload.Dragger>
                )}
              </Form.Item>
            )}
            {/* file upload */}

            {(action === 'comment' || action === 'file') && (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Form.Item {...formItemLayout} label="Comment">
                {getFieldDecorator('comment', {
                  rules: [
                    {
                      required: true,
                      message: 'comment is required',
                    },
                  ],
                })(<TextArea autosize={{ minRows: 3, maxRows: 10 }} />)}
              </Form.Item>
            )}
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

EventChangelogForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  event: PropTypes.shape({
    type: PropTypes.shape({ _id: PropTypes.string }),
    description: PropTypes.string,
    certainty: PropTypes.string,
    urgency: PropTypes.string,
    color: PropTypes.string,
    severity: PropTypes.string,
  }).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
    setFieldsValue: PropTypes.func,
    getFieldValue: PropTypes.func,
  }).isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  action: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

export default Form.create()(EventChangelogForm);
