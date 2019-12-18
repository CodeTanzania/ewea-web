import {
  clearEventFunctionFilters,
  Connect,
  filterEventFunctions,
} from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SearchableSelectInput from '../../../../components/SearchableSelectInput';

/* declarations */
const { getEventTypes } = httpActions;

/**
 * @class
 * @name EmergencyFunctionsFilters
 * @description Filter modal component for filtering functions
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EmergencyFunctionsFilters extends Component {
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
        filterEventFunctions(values);
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
    clearEventFunctionFilters();

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
        {/* start emergency function type filters */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Form.Item {...formItemLayout} label="By Type">
          {getFieldDecorator('type', {
            initialValue: filter ? filter.nature : [],
          })(
            <SearchableSelectInput
              onSearch={getEventTypes}
              optionLabel={type => type.strings.name.en}
              optionValue="_id"
              mode="multiple"
              onCache={types => this.cacheFilters({ types })}
              initialValue={cached && cached.types ? cached.types : []}
            />
          )}
        </Form.Item>
        {/* end emergency
        function type filters */}

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

EmergencyFunctionsFilters.propTypes = {
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
    types: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
  }),
  onCache: PropTypes.func.isRequired,
  onClearCache: PropTypes.func.isRequired,
};

EmergencyFunctionsFilters.defaultProps = {
  filter: null,
  cached: null,
};

export default Connect(Form.create()(EmergencyFunctionsFilters), {
  filter: 'eventFunctions.filter',
});
