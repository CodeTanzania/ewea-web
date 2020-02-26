import {
  Connect,
  getEventLevels,
  openEventLevelForm,
  searchEventLevels,
  selectEventLevel,
  closeEventLevelForm,
  deleteEventLevel,
  refreshEventLevels,
  paginateEventLevels,
} from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Col } from 'antd';
import isArray from 'lodash/isArray';

import Topbar from '../../components/Topbar';
import NotificationForm from '../../components/NotificationForm';
import EventLevelForm from './Form';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess } from '../../util';
import './styles.css';

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 14, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 5 };
const descriptionSpan = { xxl: 14, xl: 14, lg: 15, md: 14, sm: 0, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];

const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getEventLevelsExportUrl,
} = httpActions;

const { confirm } = Modal;

/**
 * @class
 * @name EventLevels
 * @description Render Event Level list which have search box,
 * actions and event types list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventLevels extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    notificationBody: undefined,
    showNotificationForm: false,
    selectedEventActions: [],
  };

  componentDidMount() {
    getEventLevels();
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
    openEventLevelForm();
  };

  /**
   * @function
   * @name closeEventLevelsForm
   * @description close event level form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventLevelsForm = () => {
    closeEventLevelForm();
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
    searchEventLevels(event.target.value);
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
    selectEventLevel(eventType);
    this.setState({ isEditForm: true });
    openEventLevelForm();
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
   * @name handleShare
   * @description Handle share multiple event Types
   *
   * @param {object[]| object} eventTypes event Types list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = eventTypes => {
    let message = '';
    if (isArray(eventTypes)) {
      const eventTypeList = eventTypes.map(
        eventType =>
          `Name: ${eventType.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventType.strings.description.en
          }\n`
      );

      message = eventTypeList.join('\n\n\n');
    } else {
      message = `Name: ${eventTypes.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventTypes.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on share
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
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

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a focal person
   * @param {object} item Resource item to be archived
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  showArchiveConfirm = item => {
    confirm({
      title: `Are you sure you want to archive this record ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteEventLevel(
          item._id, // eslint-disable-line
          () => notifySuccess('Event Type was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event Type, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshEventLevels = () =>
    refreshEventLevels(
      () => notifySuccess('Event Types refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Types, please contact system administrator'
        )
    );

  render() {
    const {
      eventLevels,
      loading,
      page,
      posting,
      eventLevel,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const {
      isEditForm,
      showNotificationForm,
      selectedEventActions,
      notificationBody,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for event levels here ...',
            onChange: this.searchAlerts,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Level',
              icon: 'plus',
              size: 'large',
              title: 'Add New Event Level',
              onClick: this.openEventTypesForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="event level"
          items={eventLevels}
          page={page}
          itemCount={total}
          loading={loading}
          onShare={this.handleShare}
          headerLayout={headerLayout}
          onRefresh={this.handleRefreshEventLevels}
          onPaginate={nextPage => paginateEventLevels(nextPage)}
          generateExportUrl={getEventLevelsExportUrl}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => (
            <ListItem
              key={item._id} // eslint-disable-line
              name={item.strings.name.en}
              item={item}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Event Level',
                    title: 'Update Event Level Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Level',
                    title: 'Share Event Level details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Level',
                    title: 'Remove Event Level from list of active Event Types',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...descriptionSpan}>
                {item.strings.description ? item.strings.description.en : 'N/A'}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Event Actions"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={selectedEventActions}
            onSearchRecipients={getFocalPeople}
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
          title={isEditForm ? 'Edit Event Level' : 'Add New Event Level'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventLevelsForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventLevelForm
            posting={posting}
            isEditForm={isEditForm}
            eventLevel={eventLevel}
            onCancel={this.closeEventLevelsForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventLevels.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventLevels: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventLevel: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventLevels.defaultProps = {
  eventLevel: null,
  searchQuery: undefined,
};

export default Connect(EventLevels, {
  eventLevels: 'eventLevels.list',
  eventLevel: 'eventLevels.selected',
  loading: 'eventLevels.loading',
  posting: 'eventLevels.posting',
  page: 'eventLevels.page',
  showForm: 'eventLevels.showForm',
  total: 'eventLevels.total',
  searchQuery: 'eventLevels.q',
});
