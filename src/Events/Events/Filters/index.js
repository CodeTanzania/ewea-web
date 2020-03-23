import {
  clearEventFilters,
  Connect,
  filterEvents,
} from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchableSelectInput from '../../../components/SearchableSelectInput';
import SelectInput from '../../../components/SelectInput';

/* declarations */
const { getIncidentTypes, getJurisdictions } = httpActions;

/**
 * @class
 * @name EventFilters
 * @description Filter modal component for filtering events
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventFilters extends Component {
  /**
   * @function
   * @name handleSubmit
   * @description Handle filter action
   *
   * @param {object} event onSubmit event object
   * @returns {undefined}
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleSubmit = (event) => {
    event.preventDefault();
    const {
      form: { validateFields },
      onCancel,
    } = this.props;

    validateFields((error, values) => {
      if (!error) {
        filterEvents(values);
        onCancel();
      }
    });
  };

  /**
   * @function
   * @name handleClearFilter
   * @description Action handle when clear
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleClearFilter = () => {
    const { onCancel, onClearCache } = this.props;
    clearEventFilters();

    onClearCache();
    onCancel();
  };

  /**
   * @function
   * @name cacheFilters
   * @description cache lazy loaded value from filters
   *
   * @param {object} values Object with key value of what is to be cached
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  cacheFilters = (values) => {
    const { onCache } = this.props;
    onCache(values);
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
  renderSelectOptions = (options) =>
    options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));

  render() {
    const {
      form: { getFieldDecorator },
      onCancel,
      filter,
      cached,
      alertSchema,
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
        {/* start alert event filters */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="By Event(s)">
          {getFieldDecorator('event', {
            initialValue: filter ? filter.group : [],
          })(
            <SearchableSelectInput
              onSearch={getIncidentTypes}
              optionLabel="name"
              optionValue="_id"
              mode="multiple"
              onCache={(events) => this.cacheFilters({ events })}
              initialValue={cached && cached.events ? cached.events : []}
            />
          )}
        </Form.Item>
        {/* end alert event filters */}

        {/* start alert area filters */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="By Area(s)">
          {getFieldDecorator('location', {
            initialValue: filter ? filter.location : [],
          })(
            <SearchableSelectInput
              onSearch={getJurisdictions}
              optionLabel="name"
              optionValue="_id"
              mode="multiple"
              onCache={(locations) => this.cacheFilters({ locations })}
              initialValue={cached && cached.locations ? cached.locations : []}
            />
          )}
        </Form.Item>
        {/* end alert area filters */}

        {/* start alert certainty filters */}
        {/* eslint-disable react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="By  Certainity">
          {getFieldDecorator('certainty', {
            initialValue: filter ? filter.certainty : [],
          })(<SelectInput options={certainty.enum} mode="multiple" />)}
        </Form.Item>
        {/* end alert certainty filters */}
        {/* start alert status filters */}
        <Form.Item {...formItemLayout} label="By  Status">
          {getFieldDecorator('status', {
            initialValue: filter ? filter.status : [],
          })(<SelectInput options={status.enum} mode="multiple" />)}
        </Form.Item>
        {/* end alert status filters */}

        {/* start alert urgency filters */}
        <Form.Item {...formItemLayout} label="By  Urgency">
          {getFieldDecorator('urgency', {
            initialValue: filter ? filter.urgency : [],
          })(<SelectInput options={urgency.enum} mode="multiple" />)}
        </Form.Item>
        {/* end alert urgency filters */}

        {/* start alert severity filters */}
        <Form.Item {...formItemLayout} label="By  Severity">
          {getFieldDecorator('severity', {
            initialValue: filter ? filter.severity : [],
          })(<SelectInput options={severity.enum} mode="multiple" />)}
        </Form.Item>
        {/* end alert severity filters */}
        {/* eslint-enable react/jsx-props-no-spreading */}

        {/* form actions */}
        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleClearFilter}>
            Clear
          </Button>
          <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
            Filter
          </Button>
        </Form.Item>
        {/* end form actions */}
      </Form>
    );
  }
}

EventFilters.propTypes = {
  filter: PropTypes.objectOf(
    PropTypes.shape({
      groups: PropTypes.arrayOf(PropTypes.string),
    })
  ),
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
    validateFields: PropTypes.func,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  cached: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
    locations: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
  }),
  onCache: PropTypes.func.isRequired,
  onClearCache: PropTypes.func.isRequired,
};

EventFilters.defaultProps = {
  filter: null,
  cached: null,
};

export default Connect(Form.create()(EventFilters), {
  filter: 'events.filter',
  alertSchema: 'events.schema.properties',
});
