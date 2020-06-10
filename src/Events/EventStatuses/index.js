import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import SettingForm from '../../components/SettingForm';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess } from '../../util';

/* constants */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getEventStatusesExportUrl,
} = httpActions;
const {
  closeEventStatusForm,
  getEventStatuses,
  openEventStatusForm,
  searchEventStatuses,
  selectEventStatus,
  refreshEventStatuses,
  paginateEventStatuses,
  deleteEventStatus,
  postEventStatus,
  putEventStatus,
} = reduxActions;

const nameSpan = { xxl: 4, xl: 5, lg: 6, md: 7, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 18, xl: 17, lg: 16, md: 14, sm: 20, xs: 18 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...descriptionSpan, header: 'Description' },
];

const { confirm } = Modal;

/**
 * @class
 * @name EventStatuses
 * @description Render eventStatus list which have search box, actions and eventStatus list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventStatuses extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getEventStatuses();
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
  handleOnCachedValues = (cached) => {
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
   * @name openEventStatusForm
   * @description Open eventStatus form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventStatusForm = () => {
    openEventStatusForm();
  };

  /**
   * @function
   * @name openEventStatusForm
   * @description close eventStatus form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventStatusForm = () => {
    closeEventStatusForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventStatuses
   * @description Search EventStatuses List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventStatuses = (event) => {
    searchEventStatuses(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventStatus eventStatus to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (eventStatus) => {
    selectEventStatus(eventStatus);
    this.setState({ isEditForm: true });
    openEventStatusForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Actions
   *
   * @param {object[]| object} eventStatuses event Actions list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (eventStatuses) => {
    let message = '';
    if (isArray(eventStatuses)) {
      const eventStatusList = eventStatuses.map(
        (eventStatus) =>
          `Name: ${eventStatus.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventStatus.strings.description.en
          }\n`
      );

      message = eventStatusList.join('\n\n\n');
    } else {
      message = `Name: ${eventStatuses.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventStatuses.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify eventStatus
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
    selectEventStatus(null);
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

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving an event status
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
        deleteEventStatus(
          item._id, // eslint-disable-line
          () => notifySuccess('Event Status was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event Status, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshEventStatuses = () =>
    refreshEventStatuses(
      () => notifySuccess('Event Statuses refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Statuses, please contact system administrator'
        )
    );

  render() {
    const {
      eventStatuses,
      eventStatus,
      loading,
      posting,
      page,
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
            placeholder: 'Search for event status here ...',
            onChange: this.searchEventStatuses,
            value: searchQuery,
          }}
          action={{
            label: 'New Event Status',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Event Status',
            onClick: this.openEventStatusForm,
          }}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="event statuses"
          items={eventStatuses}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventStatuses}
          onPaginate={(nextPage) => paginateEventStatuses(nextPage)}
          generateExportUrl={getEventStatusesExportUrl}
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
              avatarBackgroundColor={item.strings.color}
              item={item}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Event Status',
                    title: 'Update Event Status Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Status',
                    title: 'Share Event Status details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Status',
                    title:
                      'Remove Event Status from list of active event statuses',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable-next-line */}
              <Col {...nameSpan}>{get(item, 'strings.name.en', 'N/A')} </Col>

              {/* eslint-disable-next-line */}
              <Col {...descriptionSpan}>
                {get(item, 'strings.description.en', 'N/A')}{' '}
              </Col>
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Event Statuses"
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
          title={isEditForm ? 'Edit Event Status' : 'Add New Event Status'}
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.closeEventStatusForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <SettingForm
            posting={posting}
            setting={eventStatus}
            onCancel={this.handleAfterCloseForm}
            onCreate={postEventStatus}
            onUpdate={putEventStatus}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventStatuses.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  eventStatuses: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventStatus: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

EventStatuses.defaultProps = {
  eventStatus: null,
  searchQuery: undefined,
};

export default Connect(EventStatuses, {
  eventStatuses: 'eventStatuses.list',
  eventStatus: 'eventStatuses.selected',
  loading: 'eventStatuses.loading',
  posting: 'eventStatuses.posting',
  page: 'eventStatuses.page',
  showForm: 'eventStatuses.showForm',
  total: 'eventStatuses.total',
  searchQuery: 'eventStatuses.q',
});
