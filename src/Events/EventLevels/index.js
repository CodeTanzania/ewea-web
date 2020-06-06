import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Col } from 'antd';
import isArray from 'lodash/isArray';
import { PlusOutlined } from '@ant-design/icons';

import Topbar from '../../components/Topbar';
import SettingForm from '../../components/SettingForm';
import NotificationForm from '../../components/NotificationForm';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess, truncateString } from '../../util';

/* http actions */
const {
  getEventLevelsExportUrl,
  getFocalPeople,
  getJurisdictions,
  getPartyTopics,
  getRoles,
  getAgencies,
} = httpActions;
/* redux actions */
const {
  getEventLevels,
  openEventLevelForm,
  searchEventLevels,
  selectEventLevel,
  closeEventLevelForm,
  deleteEventLevel,
  refreshEventLevels,
  paginateEventLevels,
  postEventLevel,
  putEventLevel,
} = reduxActions;
/* constants */
const { confirm } = Modal;
const nameSpan = { xxl: 4, xl: 5, lg: 6, md: 7, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 18, xl: 17, lg: 16, md: 14, sm: 20, xs: 18 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...descriptionSpan, header: 'Description' },
];

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
  };

  componentDidMount() {
    getEventLevels();
  }

  /**
   * @function
   * @name openEventLevelsForm
   * @description Open event level form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventLevelsForm = () => {
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
   * @name searchEventLevels
   * @description Search Event Level List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventLevels = (event) => {
    searchEventLevels(event.target.value);
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
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventLevel event level to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (eventLevel) => {
    selectEventLevel(eventLevel);
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
    selectEventLevel(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event levels
   *
   * @param {object[]| object} eventLevels event levels list to be shared
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (eventLevels) => {
    let message = '';
    if (isArray(eventLevels)) {
      const eventLevelsList = eventLevels.map(
        (eventLevel) =>
          `Name: ${eventLevel.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventLevel.strings.description.en
          }\n`
      );

      message = eventLevelsList.join('\n\n\n');
    } else {
      message = `Name: ${eventLevels.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventLevels.strings.description.en
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
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a event levels
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
      () => notifySuccess('Event Levels refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Levels, please contact system administrator'
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
    const { isEditForm, showNotificationForm, notificationBody } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for event levels here ...',
            onChange: this.searchEventLevels,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Level',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Event Level',
              onClick: this.openEventLevelsForm,
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
          generateExportUrl={getEventLevelsExportUrl}
          headerLayout={headerLayout}
          onRefresh={this.handleRefreshEventLevels}
          onPaginate={(nextPage) => paginateEventLevels(nextPage)}
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
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Event Level',
                    title: 'Update Event Level Details',
                    onClick: () => this.handleEdit(item),
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
          title="Notify Event Levels"
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
            onSearchTopics={getPartyTopics}
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
          className="modal-window-50"
          footer={null}
          onCancel={this.closeEventLevelsForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <SettingForm
            setting={eventLevel}
            posting={posting}
            onCancel={this.closeEventLevelsForm}
            onCreate={postEventLevel}
            onUpdate={putEventLevel}
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
