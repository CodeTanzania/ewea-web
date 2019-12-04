import {
  Connect,
  searchIncidentTypes,
  selectIncidentType,
  getIncidentTypes,
  openIncidentTypeForm,
  closeIncidentTypeForm,
} from '@codetanzania/ewea-api-states';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Topbar from '../../../components/Topbar';
import EmergencyFunctionsFilters from './Filters';
import FunctionForm from './Form';
import FunctionsList from './List';
import './styles.css';

/**
 * @class
 * @name EmergencyFunctions
 * @description Render functions list which have search box, actions and list emergency functions
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EmergencyFunctions extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    cached: null,
  };

  componentDidMount() {
    getIncidentTypes();
  }

  /**
   * @function
   * @name handleOnCachedValues
   * @description Cached selected values for filters
   *
   * @param {object} cached values to be cached from filter
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnCachedValues = cached => {
    const { cached: previousCached } = this.state;
    const values = { ...previousCached, ...cached };
    this.setState({ cached: values });
  };

  /**
   * @function
   * @name handleClearCachedValues
   * @description Clear cached values
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleClearCachedValues = () => {
    this.setState({ cached: null });
  };

  /**
   * @function
   * @name openFiltersModal
   * @description open filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openFiltersModal = () => {
    this.setState({ showFilters: true });
  };

  /**
   * @function
   * @name closeFiltersModal
   * @description Close filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeFiltersModal = () => {
    this.setState({ showFilters: false });
  };

  /**
   * @function
   * @name openEmergencyFunctionForm
   * @description Open emergencyFunction form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEmergencyFunctionForm = () => {
    openIncidentTypeForm();
  };

  /**
   * @function
   * @name closeEmergencyFunctionForm
   * @description close emergencyFunction form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEmergencyFunctionForm = () => {
    closeIncidentTypeForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEmergencyFunctions
   * @description Search EmergencyFunctions List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEmergencyFunctions = event => {
    searchIncidentTypes(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} emergencyFunction emergencyFunction to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = emergencyFunction => {
    selectIncidentType(emergencyFunction);
    this.setState({ isEditForm: true });
    openIncidentTypeForm();
  };

  render() {
    const {
      emergencyFunctions,
      emergencyFunction,
      loading,
      posting,
      page,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { showFilters, isEditForm, cached } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Emergency Functions here ...',
            onChange: this.searchEmergencyFunctions,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Function',
              icon: 'plus',
              size: 'large',
              title: 'Add New Emergency Function',
              onClick: this.openEmergencyFunctionForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="FunctionsList">
          {/* list starts */}
          <FunctionsList
            total={total}
            page={page}
            emergencyFunctions={emergencyFunctions}
            loading={loading}
            onEdit={this.handleEdit}
            onFilter={this.openFiltersModal}
          />
          {/* end list */}

          {/* filter modal */}
          <Modal
            title="Filter Emergency Function"
            visible={showFilters}
            onCancel={this.closeFiltersModal}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
          >
            <EmergencyFunctionsFilters
              onCancel={this.closeFiltersModal}
              cached={cached}
              onCache={this.handleOnCachedValues}
              onClearCache={this.handleClearCachedValues}
            />
          </Modal>
          {/* end filter modal */}

          {/* create/edit form modal */}
          <Modal
            title={
              isEditForm
                ? 'Edit Emergency Function'
                : 'Add New Emergency Function'
            }
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeEmergencyFunctionForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <FunctionForm
              posting={posting}
              isEditForm={isEditForm}
              emergencyFunction={emergencyFunction}
              onCancel={this.closeEmergencyFunctionForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

EmergencyFunctions.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  emergencyFunctions: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  emergencyFunction: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

EmergencyFunctions.defaultProps = {
  emergencyFunction: null,
  searchQuery: undefined,
};

export default Connect(EmergencyFunctions, {
  emergencyFunctions: 'incidentTypes.list',
  emergencyFunction: 'incidentTypes.selected',
  loading: 'incidentTypes.loading',
  posting: 'incidentTypes.posting',
  page: 'incidentTypes.page',
  showForm: 'incidentTypes.showForm',
  total: 'incidentTypes.total',
  searchQuery: 'incidentTypes.q',
});
