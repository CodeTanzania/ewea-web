import { httpActions } from '@codetanzania/ewea-api-client';
import {
  Connect,
  getEventAction,
  postEventActionCatalogue,
  putEventActionCatalogue,
} from '@codetanzania/ewea-api-states';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Row } from 'antd';
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
  componentDidUpdate(prevProps) {
    const { selectedEventAction: prevSelectedEventAction } = prevProps;
    const { selectedEventAction } = this.props;
    if (prevSelectedEventAction !== selectedEventAction) {
      this.autoFillActionDetails(selectedEventAction);
    }
  }

  /**
   * @function
   * @name autoFillActionDetails
   * @description auto fills event action details
   *
   * @param {object} eventAction event action object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  autoFillActionDetails = eventAction => {
    const {
      strings: { name, description },
    } = eventAction;
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ name: name.en });
    setFieldsValue({ description: description.en });
  };

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
        const payload = {
          strings: {
            name: {
              en: values.name,
            },
            abbreviation: {
              en: values.name,
            },
            description: {
              en: values.description,
            },
          },
          relations: {
            groups: values.groups,
            type: values.type,
            area: values.area,
            agencies: values.agencies,
            focals: values.focals,
            roles: values.roles,
            action: values.action,
            function: values.function,
          },
        };
        if (isEditForm) {
          const updatedEventActionCatalogue = {
            ...eventActionCatalogue,
            ...payload,
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
            payload,
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
            <Form.Item {...formItemLayout} label="Event">
              {getFieldDecorator('type', {
                initialValue:
                  isEditForm &&
                  eventActionCatalogue &&
                  eventActionCatalogue.relations.type
                    ? eventActionCatalogue.relations.type._id // eslint-disable-line
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
                      ? eventActionCatalogue.relations.type
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
        <Form.Item {...formItemLayout} label="Area">
          {getFieldDecorator('area', {
            initialValue:
              isEditForm && eventActionCatalogue.relations.area
                ? eventActionCatalogue.relations.area._id // eslint-disable-line
                : undefined,
          })(
            <SearchableSelectInput
              onSearch={getAdministrativeAreas}
              optionLabel={area => area.strings.name.en}
              optionValue="_id"
              initialValue={
                isEditForm && eventActionCatalogue.relations.area
                  ? eventActionCatalogue.relations.area
                  : undefined
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
                    ? eventActionCatalogue.relations.function._id // eslint-disable-line
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
                      ? eventActionCatalogue.relations.function
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
                  isEditForm && eventActionCatalogue.relations.roles
                    ? map(
                        eventActionCatalogue.relations.roles,
                        role => role._id // eslint-disable-line
                      )
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
                  mode="multiple"
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.relations.roles
                      ? eventActionCatalogue.relations.roles
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
                  isEditForm && eventActionCatalogue.relations.groups
                    ? map(
                        eventActionCatalogue.relations.groups,
                        group => group._id // eslint-disable-line
                      )
                    : [],
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
                  mode="multiple"
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.relations.groups
                      ? eventActionCatalogue.relations.groups
                      : []
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
                  isEditForm && eventActionCatalogue.relations.agencies
                    ? map(
                        eventActionCatalogue.relations.agencies,
                        agency => agency._id // eslint-disable-line
                      )
                    : [],
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
                  mode="multiple"
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.relations.agencies
                      ? eventActionCatalogue.relations.agencies
                      : []
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
                  isEditForm && eventActionCatalogue.relations.focals
                    ? map(
                        eventActionCatalogue.relations.focals,
                        focal => focal._id // eslint-disable-line
                      )
                    : [],
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
                  mode="multiple"
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.relations.focals
                      ? eventActionCatalogue.relations.focals
                      : []
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
              {getFieldDecorator('action', {
                initialValue:
                  isEditForm && eventActionCatalogue.relations.action
                    ? eventActionCatalogue.relations.action._id // eslint-disable-line
                    : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Event Action Catalogue action is required',
                  },
                ],
                onChange: e => getEventAction(e),
              })(
                <SearchableSelectInput
                  onSearch={getEventActions}
                  optionLabel={action => action.strings.name.en}
                  optionValue="_id"
                  initialValue={
                    isEditForm && eventActionCatalogue.relations.action
                      ? eventActionCatalogue.relations.action
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
                  ? eventActionCatalogue.strings.name.en
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
                  ? eventActionCatalogue.strings.description.en
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: 'Action  description is required',
                  },
                ],
              })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} />)}
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
  selectedEventAction: PropTypes.shape({
    strings: PropTypes.shape({
      name: PropTypes.shape({ en: PropTypes.string }),
      abbreviation: PropTypes.shape({ en: PropTypes.string }),
      description: PropTypes.shape({ en: PropTypes.string }),
    }),
  }),
  isEditForm: PropTypes.bool.isRequired,
  eventActionCatalogue: PropTypes.shape({
    strings: PropTypes.object,
    relations: PropTypes.shape({
      area: PropTypes.arrayOf(PropTypes.object),
      roles: PropTypes.arrayOf(PropTypes.object),
      groups: PropTypes.arrayOf(PropTypes.object),
      actions: PropTypes.arrayOf(PropTypes.object),
      focals: PropTypes.arrayOf(PropTypes.object),
      agencies: PropTypes.arrayOf(PropTypes.object),
      function: PropTypes.arrayOf(PropTypes.object),
      type: PropTypes.shape({
        _id: PropTypes.string,
      }).isRequired,
      action: PropTypes.shape({
        strings: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    }).isRequired,
  }).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
    setFieldsValue: PropTypes.func,
  }).isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  posting: PropTypes.bool.isRequired,
};

EventActionCatalogueForm.defaultProps = {
  selectedEventAction: null,
};

export default Connect(Form.create()(EventActionCatalogueForm), {
  selectedEventAction: 'eventActions.selected',
});
