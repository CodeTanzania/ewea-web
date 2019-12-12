import {
  Connect,
  searchEventFunctions,
  selectEventFunction,
  getEventFunctions,
  openEventFunctionForm,
  closeEventFunctionForm,
} from '@codetanzania/ewea-api-states';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Topbar from '../../../components/Topbar';
import EventFunctionsFilters from './Filters';
import FunctionForm from './Form';
import FunctionsList from './List';
import './styles.css';

/**
 * @class
 * @name EventFunctions
 * @description Render functions list which have search box, actions and list event functions
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventFunctions extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    cached: null,
  };

  componentDidMount() {
    getEventFunctions();
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
   * @name openEventFunctionForm
   * @description Open eventFunction form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventFunctionForm = () => {
    openEventFunctionForm();
  };

  /**
   * @function
   * @name closeEventFunctionForm
   * @description close eventFunction form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventFunctionForm = () => {
    closeEventFunctionForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventFunctions
   * @description Search EventFunctions List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventFunctions = event => {
    searchEventFunctions(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventFunction eventFunction to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventFunction => {
    selectEventFunction(eventFunction);
    this.setState({ isEditForm: true });
    openEventFunctionForm();
  };

  render() {
    const {
      eventFunctions,
      eventFunction,
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
            onChange: this.searchEventFunctions,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Function',
              icon: 'plus',
              size: 'large',
              title: 'Add New Emergency Function',
              onClick: this.openEventFunctionForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="FunctionsList">
          {/* list starts */}
          <FunctionsList
            total={total}
            page={page}
            eventFunctions={eventFunctions}
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
            <EventFunctionsFilters
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
            onCancel={this.closeEventFunctionForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <FunctionForm
              posting={posting}
              isEditForm={isEditForm}
              eventFunction={eventFunction}
              onCancel={this.closeEventFunctionForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

EventFunctions.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  eventFunctions: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventFunction: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

EventFunctions.defaultProps = {
  eventFunction: null,
  searchQuery: undefined,
};

export default Connect(EventFunctions, {
  eventFunctions: 'eventFunctions.list',
  eventFunction: 'eventFunctions.selected',
  loading: 'eventFunctions.loading',
  posting: 'eventFunctions.posting',
  page: 'eventFunctions.page',
  showForm: 'eventFunctions.showForm',
  total: 'eventFunctions.total',
  searchQuery: 'eventFunctions.q',
});
