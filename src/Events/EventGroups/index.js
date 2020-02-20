import { httpActions } from '@codetanzania/ewea-api-client';
import {
  Connect,
  getEventGroups,
  openEventGroupForm,
  searchEventGroups,
  selectEventGroup,
  closeEventGroupForm,
  refreshEventGroups,
  paginateEventGroups,
  deleteEventGroup,
} from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isArray from 'lodash/isArray';
import { Modal, Col } from 'antd';
import Topbar from '../../components/Topbar';
import EventGroupForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import { notifyError, notifySuccess, truncateString } from '../../util';
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

const { confirm } = Modal;

const {
  getEventGroupsExportUrl,
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;

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
    notificationBody: undefined,
    showNotificationForm: false,
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

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify event groups
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
   * @name handleShare
   * @description Handle share multiple event groups
   *
   * @param {object[]| object} eventGroups event groups list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = eventGroups => {
    let message = '';
    if (isArray(eventGroups)) {
      const eventGroupsList = eventGroups.map(
        eventGroup =>
          `Name: ${eventGroup.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventGroup.strings.description.en
          }\n`
      );

      message = eventGroupsList.join('\n\n\n');
    } else {
      message = `Name: ${eventGroups.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventGroups.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name handleRefreshEventGroups
   * @description Refresh Event Groups list
   *
   * @returns {undefined}
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshEventGroups = () =>
    refreshEventGroups(
      () => notifySuccess('Event groups refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event groups, please contact system administrator'
        )
    );

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a event group
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
        deleteEventGroup(
          item._id, // eslint-disable-line
          () => notifySuccess('Event group was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event group, Please contact your system Administrator'
            )
        );
      },
    });
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
    const { isEditForm, notificationBody, showNotificationForm } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for event groups here ...',
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

        <ItemList
          itemName="Event Groups"
          items={eventGroups}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          // onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventGroups}
          generateExportUrl={getEventGroupsExportUrl}
          onPaginate={nextPage => paginateEventGroups(nextPage)}
          headerLayout={headerLayout}
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
                    name: 'Edit Event Group',
                    title: 'Update Event Group Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Group',
                    title: 'Share Event Group details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Group',
                    title:
                      'Remove Event Group from list of active event groups',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...descriptionSpan}>
                <span title={item.strings.description.en}>
                  {truncateString(item.strings.description.en, 120)}
                </span>
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />

        {/* Notification Modal modal */}
        <Modal
          title="Notify Event Groups"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
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
