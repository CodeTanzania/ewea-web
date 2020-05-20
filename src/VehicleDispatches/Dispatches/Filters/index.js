import React from 'react';
import PropTypes from 'prop-types';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Button, Form, Row, Col } from 'antd';
import get from 'lodash/get';
import SearchableSelectInput from '../../../components/SearchableSelectInput';

/* declarations */
const {
  getVehicles,
  getPartyOwnerships,
  getVehicleTypes,
  getFeatures,
  getEventTypes,
  getPriorities,
  getAdministrativeAreas,
  getVehicleStatuses,
} = httpActions;
const { clearDispatchFilters, filterDispatches } = reduxActions;
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
 * @name VehicleDispatchFilters
 * @description Vehicle Dispatch Filters form
 * @param {object} props Filter props
 * @param {object} props.filter Filter object from the store
 * @param {object} props.cached Cached values for lazy loaded values
 * @param {Function} props.onCache Cache value callback
 * @param {Function} props.onClearCache Clear cached values callback
 * @param {Function} props.onCancel Close filter form callback
 * @returns {object} Vehicle dispatch filter component
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleDispatchFilters = ({
  filter,
  cached,
  onCache,
  onClearCache,
  onCancel,
}) => {
  const onFinish = (values) => {
    // TODO remove empty values
    filterDispatches(values);
    onCancel();
  };

  /**
   * @function
   * @name onClearFilters
   * @description On clear form filters callback
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const onClearFilters = () => {
    clearDispatchFilters();
    onClearCache();
    onCancel();
  };

  return (
    <Form
      onFinish={onFinish}
      {...formItemLayout} // eslint-disable-line
      autoComplete="off"
      initialValues={{
        ...filter,
      }}
    >
      <Row justify="space-between">
        <Col xs={24} sm={24} lg={11}>
          {/* start vehicle type  filters */}
          <Form.Item label="By Vehicle Type" name={['carrier', 'type']}>
            <SearchableSelectInput
              onSearch={getVehicleTypes}
              optionLabel={(type) => type.strings.name.en}
              optionValue="_id"
              onCache={(type) => onCache({ carrierType: type })}
              initialValue={get(cached, 'carrierType')}
            />
          </Form.Item>
          {/* end vehicle type filters */}
        </Col>
        <Col xs={24} sm={24} lg={11}>
          {/* vehicle filter */}
          <Form.Item label="By Vehicle" name={['carrier', 'vehicle']}>
            <SearchableSelectInput
              onSearch={getVehicles}
              optionLabel={(vehicle) =>
                `${vehicle.strings.name.en} (${get(
                  vehicle,
                  'relations.type.strings.name.en',
                  'N/A'
                )})`
              }
              optionValue="_id"
              onCache={(vehicle) => onCache({ vehicle })}
              initialValue={get(cached, 'vehicle')}
            />
          </Form.Item>
          {/* end vehicle filter */}
        </Col>
      </Row>

      <Row justify="space-between">
        <Col xs={24} sm={24} lg={11}>
          {/* start event/diagnosis  filters */}
          <Form.Item label="By Event/Diagnosis" name="type">
            <SearchableSelectInput
              onSearch={getEventTypes}
              optionLabel={(eventType) => eventType.strings.name.en}
              optionValue="_id"
              onCache={(type) => onCache({ type })}
              initialValue={get(cached, 'type')}
            />
          </Form.Item>
          {/* end event/diagnosis filters */}
        </Col>
        <Col xs={24} sm={24} lg={11}>
          {/* start contact group filters */}
          <Form.Item label="By Status" name="status">
            <SearchableSelectInput
              onSearch={getVehicleStatuses}
              optionLabel={(status) => status.strings.name.en}
              optionValue="_id"
              onCache={(status) => {
                onCache({ status });
              }}
              initialValue={get(cached, 'status')}
            />
          </Form.Item>
          {/* end contact group filters */}
        </Col>
      </Row>
      <Row justify="space-between">
        <Col xs={24} sm={24} lg={11}>
          {/* start priority  filters */}
          <Form.Item label="By Priority" name="priority">
            <SearchableSelectInput
              onSearch={getPriorities}
              optionLabel={(priority) => priority.strings.name.en}
              optionValue="_id"
              onCache={(priority) => onCache({ priority })}
              initialValue={get(cached, 'priority')}
            />
          </Form.Item>
          {/* end priority filters */}
        </Col>
        <Col xs={24} sm={24} lg={11}>
          {/* start area filters */}
          <Form.Item label="By Area" name={['requester', 'area']}>
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
              onCache={(area) => {
                onCache({ area });
              }}
              initialValue={get(cached, 'area')}
            />
          </Form.Item>
          {/* end area filters */}
        </Col>
      </Row>

      <Row justify="space-between">
        <Col xs={24} sm={24} lg={11}>
          {/* start priority  filters */}
          <Form.Item
            label="By Requester Facility"
            name={['requester', 'facility']}
          >
            <SearchableSelectInput
              onSearch={getFeatures}
              optionLabel={(feature) => feature.strings.name.en}
              optionValue="_id"
              onCache={(facility) => onCache({ facility })}
              initialValue={get(cached, 'facility')}
            />
          </Form.Item>
          {/* end priority filters */}
        </Col>
        <Col xs={24} sm={24} lg={11}>
          {/* start area filters */}
          <Form.Item
            label="By Vehicle Ownership"
            name={['carrier', 'ownership']}
          >
            <SearchableSelectInput
              onSearch={getPartyOwnerships}
              optionLabel={(ownership) => `${ownership.strings.name.en}`}
              optionValue="_id"
              onCache={(ownership) => {
                onCache({ ownership });
              }}
              initialValue={get(cached, 'ownership')}
            />
          </Form.Item>
          {/* end area filters */}
        </Col>
      </Row>

      {/* form actions */}
      <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button style={{ marginLeft: 8 }} onClick={onClearFilters}>
          Clear
        </Button>
        <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
          Filter
        </Button>
      </Form.Item>
      {/* end form actions */}
    </Form>
  );
};

VehicleDispatchFilters.propTypes = {
  filter: PropTypes.objectOf(
    PropTypes.shape({
      groups: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  cached: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
    areas: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
    roles: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
    agencies: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
  }),
  onCache: PropTypes.func.isRequired,
  onClearCache: PropTypes.func.isRequired,
};

VehicleDispatchFilters.defaultProps = {
  filter: null,
  cached: null,
};

export default Connect(VehicleDispatchFilters, {
  filter: 'dispatches.filter',
});
