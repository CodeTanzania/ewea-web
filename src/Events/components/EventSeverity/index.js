import {
  Connect,
  getEventSeverities,
  openEventSeverityForm,
  searchEventSeverities,
  selectEventSeverity,
  closeEventSeverityForm,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'antd';
import Topbar from '../../../components/Topbar';
import EventSeverityForm from './Form';
import EventSeveritiesList from './List';
import './styles.css';

/* constants */

/**
 * @class
 * @name EventSeverities
 * @description Render Event Severities list which have search box,
 * actions and event severities list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventSeverities extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
  };

  componentDidMount() {
    getEventSeverities();
  }

  /**
   * @function
   * @name openEventSeveritiesForm
   * @description Open event severity form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventSeveritiesForm = () => {
    openEventSeverityForm();
  };

  /**
   * @function
   * @name closeEventSeveritiesForm
   * @description close event severity form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventSeveritiesForm = () => {
    closeEventSeverityForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventSeverities
   * @description Search Event Severities List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventSeverities = event => {
    searchEventSeverities(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventSeverity event severity to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventSeverity => {
    selectEventSeverity(eventSeverity);
    this.setState({ isEditForm: true });
    openEventSeverityForm();
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
      eventSeverities,
      loading,
      page,
      posting,
      eventSeverity,
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
            placeholder: 'Search for Event severities here ...',
            onChange: this.searchEventSeverities,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Severity',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event Severity',
              onClick: this.openEventSeveritiesForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="EventSeveritiesList">
          {/* list starts */}
          <EventSeveritiesList
            total={total}
            page={page}
            eventSeverities={eventSeverities}
            loading={loading}
            onEdit={this.handleEdit}
          />
          {/* end list */}

          {/* create/edit form modal */}
          <Modal
            title={
              isEditForm ? 'Edit Event Severity' : 'Add New Event Severity'
            }
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeEventSeveritiesForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <EventSeverityForm
              posting={posting}
              isEditForm={isEditForm}
              eventSeverity={eventSeverity}
              onCancel={this.closeEventSeveritiesForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

EventSeverities.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventSeverities: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  eventSeverity: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventSeverities.defaultProps = {
  eventSeverity: null,
  searchQuery: undefined,
};

export default Connect(EventSeverities, {
  eventSeverities: 'eventSeverities.list',
  eventSeverity: 'eventSeverities.selected',
  loading: 'eventSeverities.loading',
  posting: 'eventSeverities.posting',
  page: 'eventSeverities.page',
  showForm: 'eventSeverities.showForm',
  total: 'eventSeverities.total',
  searchQuery: 'eventSeverities.q',
});
