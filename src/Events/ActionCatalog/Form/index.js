import { httpActions } from '@codetanzania/ewea-api-client';
import {
  postEventActionCatalogue,
  putEventActionCatalogue,
} from '@codetanzania/ewea-api-states';
import { Button, Col, Form, Input, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import map from 'lodash/map';
import SearchableSelectInput from '../../../components/SearchableSelectInput';
import { notifyError, notifySuccess } from '../../../util';

/* constants */
const {
  getAdministrativeAreas,
  getEventTypes,
  getEventFunctions,
  getPartyRoles,
  getPartyGroups,
  getAgencies,
  getParties,
  getEventActions,
} = httpActions;
const { TextArea } = Input;

/**
 * @class
 * @name EventActionCatalogueForm
 * @description Render Event Action Catalogue form for creating and updating action catalogue details
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventActionCatalogueForm extends Component {
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
      eventActionCatalogue,
      isEditForm,
    } = this.props;

    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (isEditForm) {
          const updatedEventActionCatalogue = {
            ...eventActionCatalogue,
            ...values,
          };
          putEventActionCatalogue(
            updatedEventActionCatalogue,
            () => {
              notifySuccess('Action Catalogue was updated successfully');
            },
            () => {
              notifyError(
                'Something occurred while updating action catalogue, please try again!'
              );
            }
          );
        } else {
          postEventActionCatalogue(
            values,
            () => {
              notifySuccess('Action Catalogue was created successfully');
            },
            () => {
              notifyError(
                'Something occurred while saving action catalogue, please try again!'
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
      eventActionCatalogue,
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
        {/* event action catalogue type */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Type">
              {getFieldDecorator('type', {
                initialValue:
                  isEditForm && eventActionCatalogue
                    ? eventActionCatalogue.type._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Type is required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getEventTypes}
                  optionLabel={type => type.strings.name.en}
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue
                      ? eventActionCatalogue.type
                      : undefined
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end event action catalogue type */}

        {/* event action catalogue areas */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="Area(s)">
          {getFieldDecorator('areas', {
            initialValue:
              isEditForm && eventActionCatalogue.areas
                ? map(eventActionCatalogue.areas, area => area._id) // eslint-disable-line
                : [],
          })(
            <SearchableSelectInput
              onSearch={getAdministrativeAreas}
              optionLabel={areas => areas.strings.name.en}
              mode="multiple"
              optionValue="_id"
              initialValue={
                isEditForm && eventActionCatalogue.areas
                  ? eventActionCatalogue.areas
                  : []
              }
            />
          )}
        </Form.Item>
        {/* end event action catalogue areas */}

        {/* event action catalogue function */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Function">
              {getFieldDecorator('function', {
                initialValue:
                  isEditForm && eventActionCatalogue
                    ? eventActionCatalogue.function._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Function is required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getEventFunctions}
                  optionLabel={eventFunction => eventFunction.strings.name.en}
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue
                      ? eventActionCatalogue.function
                      : undefined
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end event action catalogue function */}

        {/* event  action catalogue role */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Role">
              {getFieldDecorator('roles', {
                initialValue:
                  isEditForm && eventActionCatalogue.roles
                    ? map(eventActionCatalogue.roles, role => role._id) // eslint-disable-line
                    : [],
                rules: [
                  {
                    required: true,
                    message: 'Event Action Catalogue role is required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getPartyRoles}
                  optionLabel={role => role.strings.name.en}
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.roles
                      ? eventActionCatalogue.roles
                      : []
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end event action catalogue role */}

        {/* event  action catalogue groups */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Groups">
              {getFieldDecorator('groups', {
                initialValue:
                  isEditForm && eventActionCatalogue.groups
                    ? eventActionCatalogue.group._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event Action Catalogue group is required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getPartyGroups}
                  optionLabel={group => group.strings.name.en}
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.groups
                      ? eventActionCatalogue.groups
                      : undefined
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end event action catalogue groups */}

        {/* event  action catalogue agencies */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Agency">
              {getFieldDecorator('agencies', {
                initialValue:
                  isEditForm && eventActionCatalogue.agencies
                    ? eventActionCatalogue.agencies._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event Action Catalogue agencies are required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getAgencies}
                  optionLabel="name"
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.agencies
                      ? eventActionCatalogue.agencies
                      : undefined
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end event action catalogue agencies */}

        {/* event  action catalogue focals */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Focals">
              {getFieldDecorator('focals', {
                initialValue:
                  isEditForm && eventActionCatalogue.focals
                    ? eventActionCatalogue.focals._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event Action Catalogue focals are required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getParties}
                  optionLabel="name"
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.focals
                      ? eventActionCatalogue.focals
                      : undefined
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end event action catalogue focals */}

        {/* event  action catalogue actions */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Action">
              {getFieldDecorator('actions', {
                initialValue:
                  isEditForm && eventActionCatalogue.actions
                    ? eventActionCatalogue.actions._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event Action Catalogue actions are required',
                  },
                ],
              })(
                <SearchableSelectInput
                  onSearch={getEventActions}
                  optionLabel={action => action.strings.name.en}
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.actions
                      ? eventActionCatalogue.actions
                      : undefined
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* end event action catalogue actions */}

        {/* event  action catalogue action name */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Action Name">
              {getFieldDecorator('name', {
                initialValue: isEditForm
                  ? eventActionCatalogue.name
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Action  name is required',
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        {/* end event action catalogue action name */}

        {/* event  action catalogue action description */}
        <Row type="flex" justify="space-between">
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Form.Item {...formItemLayout} label="Action Description">
              {getFieldDecorator('description', {
                initialValue: isEditForm
                  ? eventActionCatalogue.name
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Action  description is required',
                  },
                ],
              })(<TextArea autosize={{ minRows: 1, maxRows: 10 }} />)}
            </Form.Item>
          </Col>
        </Row>
        {/* end event action catalogue action name */}

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

EventActionCatalogueForm.propTypes = {
  isEditForm: PropTypes.bool.isRequired,
  eventActionCatalogue: PropTypes.shape({
    areas: PropTypes.arrayOf(PropTypes.object),
    roles: PropTypes.arrayOf(PropTypes.object),
    groups: PropTypes.arrayOf(PropTypes.object),
    actions: PropTypes.arrayOf(PropTypes.object),
    focals: PropTypes.arrayOf(PropTypes.object),
    agencies: PropTypes.arrayOf(PropTypes.object),
    function: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string,
    type: PropTypes.shape({
      _id: PropTypes.string,
    }).isRequired,
    action: PropTypes.shape({
      strings: PropTypes.shape({
        name: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
  }).isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

export default Form.create()(EventActionCatalogueForm);
