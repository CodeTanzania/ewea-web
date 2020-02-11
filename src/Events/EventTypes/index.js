import {
  Connect,
  getEventTypes,
  openEventTypeForm,
  searchEventTypes,
  selectEventType,
  closeEventTypeForm,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'antd';
import Topbar from '../../components/Topbar';
import EventTypeForm from './Form';
import EventTypesList from './List';
import './styles.css';

/* constants */

/**
 * @class
 * @name EventTypes
 * @description Render Event Types list which have search box,
 * actions and event types list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventTypes extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
  };

  componentDidMount() {
    getEventTypes();
  }

  /**
   * @function
   * @name openEventTypesForm
   * @description Open event type form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventTypesForm = () => {
    openEventTypeForm();
  };

  /**
   * @function
   * @name closeEventTypesForm
   * @description close event type form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventTypesForm = () => {
    closeEventTypeForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchAlerts
   * @description Search Event Types List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchAlerts = event => {
    searchEventTypes(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventType event type to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventType => {
    selectEventType(eventType);
    this.setState({ isEditForm: true });
    openEventTypeForm();
  };

  /**
   * @function
   * @name handleAfterCloseForm
   * @description Perform post close form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseForm = () => {
    this.setState({ isEditForm: false });
  };

  render() {
    const {
      eventTypes,
      loading,
      page,
      posting,
      eventType,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { isEditForm } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for event types here ...',
            onChange: this.searchAlerts,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Type',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event Type',
              onClick: this.openEventTypesForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="EventTypesList">
          {/* list starts */}
          <EventTypesList
            total={total}
            page={page}
            eventTypes={eventTypes}
            loading={loading}
            onEdit={this.handleEdit}
          />
          {/* end list */}

          {/* create/edit form modal */}
          <Modal
            title={isEditForm ? 'Edit Event Type' : 'Add New Event Type'}
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeEventTypesForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <EventTypeForm
              posting={posting}
              isEditForm={isEditForm}
              eventType={eventType}
              onCancel={this.closeEventTypesForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

EventTypes.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventTypes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventType: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventTypes.defaultProps = {
  eventType: null,
  searchQuery: undefined,
};

export default Connect(EventTypes, {
  eventTypes: 'eventTypes.list',
  eventType: 'eventTypes.selected',
  loading: 'eventTypes.loading',
  posting: 'eventTypes.posting',
  page: 'eventTypes.page',
  showForm: 'eventTypes.showForm',
  total: 'eventTypes.total',
  searchQuery: 'eventTypes.q',
});
