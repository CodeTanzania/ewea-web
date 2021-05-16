import { httpActions } from '@codetanzania/ewea-api-client';
import { reduxActions } from '@codetanzania/ewea-api-states';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import {
  InboxOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { Button, Input, Upload, Form } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import SearchableSelectInput from '../../../components/SearchableSelectInput';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const { postChangelog, getEvent, getEvents, putEvent, closeChangelogForm } =
  reduxActions;
const {
  getFocalPeople,
  getAgencies,
  getEventIndicators,
  getEventQuestions,
  getAdministrativeAreas,
  getEventTopics,
} = httpActions;
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
 * @param {object} props Event Changelog Form properties
 * @param {object} props.event event object
 * @param {boolean} props.posting posting flag
 * @param {Function} props.onCancel cancel callback
 * @param {string} props.action valid action
 * @name EventChangelogForm
 * @description Render Event form for creating and updating stakeholder
 * event details
 * @returns {object} Event Changelog Form
 * @version 0.2.1
 * @since 0.1.0
 */
const EventChangelogForm = ({ event, posting, onCancel, action }) => {
  const onFinish = (values) => {
    let data = { ...values, event };

    // ensure areas key is an array
    if (data.areas) {
      data.areas = isArray(data.areas) ? data.areas : [data.areas];
    }

    if (action === 'file') {
      data = new FormData(); // eslint-disable-line

      data.append('image', values.file[0].originFileObj);
      data.append('comment', values.comment);
      data.append('event', event._id); // eslint-disable-line
    }

    if (['remarks', 'constraints', 'interventions'].includes(action)) {
      const update = [...event[action], ...values[action]];
      putEvent(
        { _id: event._id, [action]: update }, // eslint-disable-line
        () => {
          notifySuccess('Event was updated successfully');
          getEvent(event._id); // eslint-disable-line
          closeChangelogForm();
        },
        () => {
          notifyError(
            'Something occurred while updating event, please try again!'
          );
        }
      );
    } else {
      postChangelog(
        data,
        () => {
          notifySuccess('Event Feed was created successfully');
          getEvent(event._id); // eslint-disable-line
          getEvents();
        },
        () => {
          notifyError(
            'Something occurred while saving event feed, please try again!'
          );
        },
        { filters: { event: event._id } } // eslint-disable-line
      );
    }
  };

  return (
    <>
      <Form
        onFinish={onFinish}
        {...formItemLayout} // eslint-disable-line
        // initialValues={{
        //   remarks: get(event, 'remarks', []),
        //   constraints: get(event, 'constraints', []),
        //   interventions: get(event, 'constraints', []),
        // }}
      >
        {/* add areas */}
        {action === 'areas' && (
          <Form.Item
            label="Areas"
            name="areas"
            rules={[
              {
                required: true,
                message: 'Please select one or more affected areas',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getAdministrativeAreas}
              optionLabel={(area) =>
                `${area.strings.name.en} (${get(
                  area,
                  'relations.level.strings.name.en',
                  'N/A'
                )})`
              }
              optionValue="_id"
              mode="multiple"
            />
          </Form.Item>
        )}
        {/* end areas */}

        {/*  focal people */}
        {action === 'focalPeople' && (
          <Form.Item
            label="Focal People"
            name="focals"
            rules={[
              {
                required: true,
                message: 'Please select one or more focal people',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getFocalPeople}
              optionLabel="name"
              optionValue="_id"
              mode="multiple"
            />
          </Form.Item>
        )}
        {/* end focal people input */}

        {/* agencies input */}
        {action === 'agencies' && (
          <Form.Item
            label="Agencies"
            name="agencies"
            rules={[
              {
                required: true,
                message: 'Please select one or more agencies',
              },
            ]}
          >
            <SearchableSelectInput
              onSearch={getAgencies}
              optionLabel="name"
              optionValue="_id"
              mode="multiple"
            />
          </Form.Item>
        )}
        {/* end agencies input */}

        {/* needs inputs */}
        {action === 'damage' && (
          <>
            <Form.Item
              label="Area"
              name="areas"
              rules={[
                {
                  required: true,
                  message: 'Please select area',
                },
              ]}
            >
              <SearchableSelectInput
                onSearch={getAdministrativeAreas}
                optionLabel={(area) =>
                  `${area.strings.name.en} (${get(
                    area,
                    'relations.level.strings.name.en',
                    'N/A'
                  )})`
                }
                optionValue="_id"
              />
            </Form.Item>

            <Form.Item
              label="Indicator"
              name="indicator"
              rules={[
                {
                  required: true,
                  message: 'Please select indicator',
                },
              ]}
            >
              <SearchableSelectInput
                onSearch={getEventIndicators}
                optionLabel={(indicator) => indicator.strings.name.en}
                optionValue="_id"
              />
            </Form.Item>

            <Form.Item
              label="Topic"
              name="topic"
              rules={[
                {
                  required: true,
                  message: 'Please select indicator',
                },
              ]}
            >
              <SearchableSelectInput
                onSearch={(options) =>
                  getEventTopics({
                    ...options,
                    // filter: {
                    //   'relations.indicator': getFieldValue('indicator'),
                    // },
                  })
                }
                optionLabel={(topic) => topic.strings.name.en}
                optionValue="_id"
              />
            </Form.Item>

            <Form.Item
              label="Question"
              name="question"
              rules={[
                {
                  required: true,
                  message: 'Please select question',
                },
              ]}
            >
              <SearchableSelectInput
                onSearch={(options) =>
                  getEventQuestions({
                    ...options,
                    // filter: {
                    //   relations: {
                    //     indicator: getFieldValue('indicator'),
                    //   },
                    // },
                  })
                }
                optionLabel={(question) => question.strings.name.en}
                optionValue="_id"
              />
            </Form.Item>

            <Form.Item
              label="Value"
              name="value"
              rules={[
                {
                  required: true,
                  message: 'Please enter value',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}
        {/* end needs inputs */}

        {/* image upload */}
        {action === 'file' && (
          <Form.Item
            label="Image"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload.Dragger
              name="image"
              beforeUpload={() => {
                return false;
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
            </Upload.Dragger>
          </Form.Item>
        )}
        {/* end image upload input */}

        {/* comment input */}
        {(action === 'comment' || action === 'file') && (
          <Form.Item
            label="Comment"
            name="comment"
            rules={[
              {
                required: true,
                message: 'comment is required',
              },
            ]}
          >
            <TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
          </Form.Item>
        )}
        {/* end comments input */}

        {/* recommendation input */}
        {action === 'remarks' && (
          <Form.List name="remarks">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Form.Item
                      label={index === 0 ? 'Comments and Recommendations' : ''}
                      required
                    >
                      <Form.Item
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'This field can not be empty',
                          },
                        ]}
                        noStyle
                      >
                        <TextArea
                          autoSize={{ minRows: 1, maxRows: 10 }}
                          style={{ width: '90%' }}
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          style={{ margin: '0 8px' }}
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      size="large"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: '90%' }}
                    >
                      <PlusCircleOutlined /> Add Recommendation
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        )}
        {/* end recommendation input */}

        {/* event constraints input */}
        {action === 'constraints' && (
          <Form.List name="constraints">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Form.Item
                      label={index === 0 ? 'Gaps and Constraints' : ''}
                      required
                    >
                      <Form.Item
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'This field can not be empty',
                          },
                        ]}
                        noStyle
                      >
                        <TextArea
                          autoSize={{ minRows: 1, maxRows: 10 }}
                          style={{ width: '90%' }}
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          style={{ margin: '0 8px' }}
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      size="large"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: '90%' }}
                    >
                      <PlusCircleOutlined /> Add Gap/Constraint
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        )}
        {/* end event constraints input */}

        {/* interventions */}
        {action === 'interventions' && (
          <Form.List name="interventions">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Form.Item
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      // {...(index === 0
                      //   ? formItemLayout
                      //   : formItemLayoutWithOutLabel)}
                      label={index === 0 ? 'Interventions/Action Taken' : ''}
                      required
                    >
                      <Form.Item
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'This field can not be empty',
                          },
                        ]}
                        noStyle
                      >
                        <TextArea
                          autoSize={{ minRows: 1, maxRows: 10 }}
                          style={{ width: '90%' }}
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          style={{ margin: '0 8px' }}
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      size="large"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: '90%' }}
                    >
                      <PlusCircleOutlined /> Add New Intervention
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        )}
        {/* end interventions */}

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
    </>
  );
};

EventChangelogForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  event: PropTypes.shape({
    type: PropTypes.shape({ _id: PropTypes.string }),
    description: PropTypes.string,
    color: PropTypes.string,
    certainty: PropTypes.shape({
      _id: PropTypes.string,
      strings: PropTypes.objectOf(PropTypes.any),
    }),
    urgency: PropTypes.shape({
      _id: PropTypes.string,
      strings: PropTypes.objectOf(PropTypes.any),
    }),
    severity: PropTypes.shape({
      _id: PropTypes.string,
      strings: PropTypes.objectOf(PropTypes.any),
    }),
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

export default EventChangelogForm;
