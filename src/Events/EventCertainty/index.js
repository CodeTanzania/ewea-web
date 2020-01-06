import {
  Connect,
  getEventCertainties,
  openEventCertaintyForm,
  searchEventCertainties,
  selectEventCertainty,
  closeEventCertaintyForm,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'antd';
import Topbar from '../../components/Topbar';
import EventCertaintyForm from './Form';
import EventCertaintiesList from './List';
import './styles.css';

/**
 * @class
 * @name EventCertainties
 * @description Render Event Certainties list which have search box,
 * actions and event certainties list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventCertainties extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
  };

  componentDidMount() {
    getEventCertainties();
  }

  /**
   * @function
   * @name openEventCertaintiesForm
   * @description Open event certainty form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventCertaintiesForm = () => {
    openEventCertaintyForm();
  };

  /**
   * @function
   * @name closeEventCertaintiesForm
   * @description close event certainty form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventCertaintiesForm = () => {
    closeEventCertaintyForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventCertainties
   * @description Search Event Certainties List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventCertainties = event => {
    searchEventCertainties(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventCertainty event certainty to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventCertainty => {
    selectEventCertainty(eventCertainty);
    this.setState({ isEditForm: true });
    openEventCertaintyForm();
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
      eventCertainties,
      loading,
      page,
      posting,
      eventCertainty,
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
            placeholder: 'Search for Event certainties here ...',
            onChange: this.searchEventCertainties,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Certainty',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event Certainty',
              onClick: this.openEventCertaintiesForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="EventCertaintiesList">
          {/* list starts */}
          <EventCertaintiesList
            total={total}
            page={page}
            eventCertainties={eventCertainties}
            loading={loading}
            onEdit={this.handleEdit}
          />
          {/* end list */}

          {/* create/edit form modal */}
          <Modal
            title={
              isEditForm ? 'Edit Event Certainty' : 'Add New Event Certainty'
            }
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeEventCertaintiesForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <EventCertaintyForm
              posting={posting}
              isEditForm={isEditForm}
              eventCertainty={eventCertainty}
              onCancel={this.closeEventCertaintiesForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

EventCertainties.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventCertainties: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  eventCertainty: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventCertainties.defaultProps = {
  eventCertainty: null,
  searchQuery: undefined,
};

export default Connect(EventCertainties, {
  eventCertainties: 'eventCertainties.list',
  eventCertainty: 'eventCertainties.selected',
  loading: 'eventCertainties.loading',
  posting: 'eventCertainties.posting',
  page: 'eventCertainties.page',
  showForm: 'eventCertainties.showForm',
  total: 'eventCertainties.total',
  searchQuery: 'eventCertainties.q',
});
