import {
  clearFocalPersonFilters,
  Connect,
  filterIncidentTypes,
} from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchableSelectInput from '../../../../components/SearchableSelectInput';

/* declarations */
const { getIncidentTypes } = httpActions;

/**
 * @class
 * @name EmergencyFunctionsFilters
 * @description Filter modal component for filtering functions
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EmergencyFunctionsFilters extends Component {
  static propTypes = {
    filter: PropTypes.objectOf(
      PropTypes.shape({
        families: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func,
      validateFields: PropTypes.func,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    cached: PropTypes.shape({
      natures: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
      families: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
      codes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
    }),
    onCache: PropTypes.func.isRequired,
    onClearCache: PropTypes.func.isRequired,
  };

  static defaultProps = {
    filter: null,
    cached: null,
  };

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
  handleSubmit = event => {
    event.preventDefault();
    const {
      form: { validateFields },
      onCancel,
    } = this.props;

    validateFields((error, values) => {
      if (!error) {
        filterIncidentTypes(values);
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
    clearFocalPersonFilters();

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
  cacheFilters = values => {
    const { onCache } = this.props;
    onCache(values);
  };

  render() {
    const {
      form: { getFieldDecorator },
      onCancel,
      filter,
      cached,
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
        {/* start contact group filters */}
        <Form.Item {...formItemLayout} label="By Nature">
          {getFieldDecorator('nature', {
            initialValue: filter ? filter.nature : [],
          })(
            <SearchableSelectInput
              onSearch={getIncidentTypes}
              optionLabel="name"
              optionValue="_id"
              mode="multiple"
              onCache={natures => this.cacheFilters({ natures })}
              initialValue={cached && cached.natures ? cached.natures : []}
            />
          )}
        </Form.Item>
        {/* end contact group filters */}

        {/* start contact group filters */}
        <Form.Item {...formItemLayout} label="By Family">
          {getFieldDecorator('family', {
            initialValue: filter ? filter.family : [],
          })(
            <SearchableSelectInput
              onSearch={getIncidentTypes}
              optionLabel="name"
              optionValue="_id"
              mode="multiple"
              onCache={families => this.cacheFilters({ families })}
              initialValue={cached && cached.families ? cached.families : []}
            />
          )}
        </Form.Item>
        {/* end contact group filters */}

        {/* start contact group filters */}
        <Form.Item {...formItemLayout} label="By code(s)">
          {getFieldDecorator('code', {
            initialValue: filter ? filter.codes : [],
          })(
            <SearchableSelectInput
              onSearch={getIncidentTypes}
              optionLabel="name"
              optionValue="_id"
              mode="multiple"
              onCache={codes => this.cacheFilters({ codes })}
              initialValue={cached && cached.codes ? cached.codes : []}
            />
          )}
        </Form.Item>
        {/* end contact group filters */}

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

export default Connect(Form.create()(EmergencyFunctionsFilters), {
  filter: 'incidentTypes.filter',
});