import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { httpActions } from '@codetanzania/ewea-api-client';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';

import Topbar from '../../components/Topbar';
import NotificationForm from '../../components/NotificationForm';
import EventTypeForm from './Form';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess, truncateString } from '../../util';

/* http actions */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getEventTypesExportUrl,
} = httpActions;
/* redux actions */
const {
  getEventTypes,
  openEventTypeForm,
  searchEventTypes,
  selectEventType,
  closeEventTypeForm,
  deleteEventType,
  refreshEventTypes,
  paginateEventTypes,
} = reduxActions;

/* constants */
const { confirm } = Modal;
const nameSpan = { xxl: 7, xl: 7, lg: 7, md: 7, sm: 10, xs: 9 };
const groupSpan = { xxl: 4, xl: 4, lg: 4, md: 5, sm: 10, xs: 9 };
const descriptionSpan = { xxl: 11, xl: 11, lg: 11, md: 9, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...groupSpan, header: 'Group' },
  { ...descriptionSpan, header: 'Description' },
];

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
    notificationBody: undefined,
    showNotificationForm: false,
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
  searchAlerts = (event) => {
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
  handleEdit = (eventType) => {
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
    selectEventType(null);
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
  handleShare = (eventTypes) => {
    let message = '';
    if (isArray(eventTypes)) {
      const eventTypeList = eventTypes.map(
        (eventType) =>
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
  showArchiveConfirm = (item) => {
    confirm({
      title: `Are you sure you want to archive this record ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteEventType(
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

  handleRefreshEventTypes = () =>
    refreshEventTypes(
      () => notifySuccess('Event Types refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Types, please contact system administrator'
        )
    );

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
    const { isEditForm, showNotificationForm, notificationBody } = this.state;
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
          action={{
            label: 'New Event Type',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Event Type',
            onClick: this.openEventTypesForm,
          }}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="event types"
          items={eventTypes}
          page={page}
          itemCount={total}
          loading={loading}
          onShare={this.handleShare}
          headerLayout={headerLayout}
          onRefresh={this.handleRefreshEventTypes}
          onPaginate={(nextPage) => paginateEventTypes(nextPage)}
          generateExportUrl={getEventTypesExportUrl}
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
              avatarBackgroundColor={item.strings.color}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              title={
                <span className="text-sm">
                  {get(item, 'strings.name.en', 'N/A')}
                </span>
              }
              secondaryText={
                <span className="text-xs">
                  {get(item, 'relations.group.strings.name.en', 'N/A')}
                </span>
              }
              actions={[
                {
                  name: 'Edit Event Type',
                  title: 'Update Event Type Details',
                  onClick: () => this.handleEdit(item),
                  icon: 'edit',
                },
                {
                  name: 'Share Event Type',
                  title: 'Share Event Type details with others',
                  onClick: () => this.handleShare(item),
                  icon: 'share',
                },
                {
                  name: 'Archive Event Type',
                  title: 'Remove Event Type from list of active Event Types',
                  onClick: () => this.showArchiveConfirm(item),
                  icon: 'archive',
                },
              ]}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...groupSpan}>
                {get(item, 'relations.group.strings.name.en', 'N/A')}
              </Col>
              <Col {...descriptionSpan} title={item.strings.description.en}>
                {item.strings.description
                  ? truncateString(item.strings.description.en, 100)
                  : 'N/A'}
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
          className="modal-window-50"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
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
          title={isEditForm ? 'Edit Event Type' : 'Add New Event Type'}
          visible={showForm}
          className="modal-window-50"
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
