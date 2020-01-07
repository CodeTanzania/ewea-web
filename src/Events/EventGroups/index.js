import {
  Connect,
  getEventGroups,
  openEventGroupForm,
  searchEventGroups,
  selectEventGroup,
  closeEventGroupForm,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'antd';
import Topbar from '../../components/Topbar';
import EventGroupForm from './Form';
import EventGroupsList from './List';
import './styles.css';

/* constants */

/**
 * @class
 * @name EventGroups
 * @description Render Event Groups list which have search box,
 * actions and event groups list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventGroups extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
  };

  componentDidMount() {
    getEventGroups();
  }

  /**
   * @function
   * @name openEventGroupsForm
   * @description Open event group form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventGroupsForm = () => {
    openEventGroupForm();
  };

  /**
   * @function
   * @name closeEventGroupsForm
   * @description close event group form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventGroupsForm = () => {
    closeEventGroupForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventGroups
   * @description Search Event Groups List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventGroups = event => {
    searchEventGroups(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventType event group to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventType => {
    selectEventGroup(eventType);
    this.setState({ isEditForm: true });
    openEventGroupForm();
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
      eventGroups,
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
            placeholder: 'Search for Event groups here ...',
            onChange: this.searchEventGroups,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Group',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event Group',
              onClick: this.openEventGroupsForm,
            },
          ]}
        />
        {/* end Topbar */}

        <div className="EventGroupsList">
          {/* list starts */}
          <EventGroupsList
            total={total}
            page={page}
            eventGroups={eventGroups}
            loading={loading}
            onEdit={this.handleEdit}
          />
          {/* end list */}

          {/* create/edit form modal */}
          <Modal
            title={isEditForm ? 'Edit Event Group' : 'Add New Event Group'}
            visible={showForm}
            className="FormModal"
            footer={null}
            onCancel={this.closeEventGroupsForm}
            destroyOnClose
            maskClosable={false}
            afterClose={this.handleAfterCloseForm}
          >
            <EventGroupForm
              posting={posting}
              isEditForm={isEditForm}
              eventType={eventType}
              onCancel={this.closeEventGroupsForm}
            />
          </Modal>
          {/* end create/edit form modal */}
        </div>
      </>
    );
  }
}

EventGroups.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventGroups: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventType: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventGroups.defaultProps = {
  eventType: null,
  searchQuery: undefined,
};

export default Connect(EventGroups, {
  eventGroups: 'eventGroups.list',
  eventType: 'eventGroups.selected',
  loading: 'eventGroups.loading',
  posting: 'eventGroups.posting',
  page: 'eventGroups.page',
  showForm: 'eventGroups.showForm',
  total: 'eventGroups.total',
  searchQuery: 'eventGroups.q',
});
