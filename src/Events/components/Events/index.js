import { httpActions } from '@codetanzania/ewea-api-client';
import {
  closeEventForm,
  Connect,
  getEvents,
  openEventForm,
  searchEvents,
  selectEvent,
} from '@codetanzania/ewea-api-states';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../../components/NotificationForm';
import Topbar from '../../../components/Topbar';
import EventFilters from './Filters';
import EventForm from './Form';
import EventsList from './List';
import './styles.css';

/* constants */
const {
  getEvents: getEventsFromAPI,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;

/**
 * @class
 * @name Events
 * @description Render event list which have search box, actions and event list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Events extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    showNotificationForm: false,
    selectedEvents: [],
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getEvents();
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
   * @name openEventForm
   * @description Open event form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventForm = () => {
    openEventForm();
  };

  /**
   * @function
   * @name openEventForm
   * @description close event form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventForm = () => {
    closeEventForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEvents
   * @description Search Events List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEvents = event => {
    searchEvents(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} event event to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = event => {
    selectEvent(event);
    this.setState({ isEditForm: true });
    openEventForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share single event action
   *
   * @param {object} event event to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = event => {
    const message = `${event.name}\nMobile: ${
      // eslint-disable-line
      event.mobile
    }\nEmail: ${event.email}`;

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name handleBulkShare
   * @description Handle share multiple focal People
   *
   * @param {object[]} events focal People list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleBulkShare = events => {
    const eventList = events.map(
      event =>
        `${event.name}\nMobile: ${event.mobile}\nEmail: ${
          // eslint-disable-line
          event.email
        }`
    );

    const message = eventList.join('\n\n\n');

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name openNotificationForm
   * @description Handle on notify events
   *
   * @param {object[]} events List of events selected to be notified
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = events => {
    this.setState({
      selectedEvents: events,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify events
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
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

  /**
   * @function
   * @name handleAfterCloseNotificationForm
   * @description Perform post close notification form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseNotificationForm = () => {
    this.setState({ notificationBody: undefined });
  };

  render() {
    const {
      events,
      event,
      loading,
      posting,
      page,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const {
      showFilters,
      isEditForm,
      showNotificationForm,
      selectedEvents,
      notificationBody,
      cached,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for events here ...',
            onChange: this.searchEvents,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event',
              onClick: this.openEventForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="EventsList">
          {/* list starts */}
          <EventsList
            total={total}
            page={page}
            events={events}
            loading={loading}
            onEdit={this.handleEdit}
            onFilter={this.openFiltersModal}
            onNotify={this.openNotificationForm}
            onShare={this.handleShare}
            onBulkShare={this.handleBulkShare}
          />
          {/* end list */}

          {/* filter modal */}
          <Modal
            title="Filter Events"
            visible={showFilters}
            onCancel={this.closeFiltersModal}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
          >
            <EventFilters
              onCancel={this.closeFiltersModal}
              cached={cached}
              onCache={this.handleOnCachedValues}
              onClearCache={this.handleClearCachedValues}
            />
          </Modal>
          {/* end filter modal */}

          {/* Notification Modal modal */}
          <Modal
            title="Notify Events"
            visible={showNotificationForm}
            onCancel={this.closeNotificationForm}
            footer={null}
            destroyOnClose
            maskClosable={false}
            className="FormModal"
            afterClose={this.handleAfterCloseNotificationForm}
          >
            <NotificationForm
              recipients={selectedEvents}
              onSearchRecipients={getEventsFromAPI}
              onSearchJurisdictions={getJurisdictions}
              onSearchGroups={getPartyGroups}
              onSearchAgencies={getAgencies}
              onSearchRoles={getRoles}
              body={notificationBody}
              onCancel={this.closeNotificationForm}
            />
          </Modal>
          {/* end Notification modal */}

          {/* create/edit form modal */}
          <Modal
            title={isEditForm ? 'Edit Event' : 'Add New Event'}
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeEventForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <EventForm
              posting={posting}
              isEditForm={isEditForm}
              event={event}
              onCancel={this.closeEventForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

Events.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  event: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

Events.defaultProps = {
  event: null,
  searchQuery: undefined,
};

export default Connect(Events, {
  events: 'events.list',
  event: 'events.selected',
  loading: 'events.loading',
  posting: 'events.posting',
  page: 'events.page',
  showForm: 'events.showForm',
  total: 'events.total',
  searchQuery: 'events.q',
});
