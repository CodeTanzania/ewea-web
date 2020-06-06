import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';

import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import SettingForm from '../../components/SettingForm';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess } from '../../util';

/* http actions */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getEventCertaintiesExportUrl,
} = httpActions;
/* redux actions */
const {
  closeEventCertaintyForm,
  getEventCertainties,
  openEventCertaintyForm,
  searchEventCertainties,
  selectEventCertainty,
  refreshEventCertainties,
  paginateEventCertainties,
  deleteEventCertainty,
  postEventCertainty,
  putEventCertainty,
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
 * @name EventCertainties
 * @description Render eventCertainty list which have search box, certainties and Event Certainties list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventCertainties extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getEventCertainties();
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
   * @name openEventCertaintyForm
   * @description Open eventCertainty form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventCertaintyForm = () => {
    openEventCertaintyForm();
  };

  /**
   * @function
   * @name openEventCertaintyForm
   * @description close Event Certainties form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventCertaintyForm = () => {
    closeEventCertaintyForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventCertainties
   * @description Search EventCertainties List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventCertainties = (event) => {
    searchEventCertainties(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit certainty for list item
   *
   * @param {object} eventCertainty Event Certainty to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (eventCertainty) => {
    selectEventCertainty(eventCertainty);
    this.setState({ isEditForm: true });
    openEventCertaintyForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Certainties
   *
   * @param {object[]| object} eventCertainties event Certainties list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (eventCertainties) => {
    let message = '';
    if (isArray(eventCertainties)) {
      const eventCertaintyList = eventCertainties.map(
        (eventCertainty) =>
          `Name: ${eventCertainty.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventCertainty.strings.description.en
          }\n`
      );

      message = eventCertaintyList.join('\n\n\n');
    } else {
      message = `Name: ${eventCertainties.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventCertainties.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify eventCertainties
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
    selectEventCertainty(null);
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
        deleteEventCertainty(
          item._id, // eslint-disable-line
          () => notifySuccess('Event Certainty was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event Certainty, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshEventCertainties = () =>
    refreshEventCertainties(
      () => notifySuccess('Event Certainties refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Certainties, please contact system administrator'
        )
    );

  render() {
    const {
      eventCertainties,
      eventCertainty,
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
            placeholder: 'Search for event certainties here ...',
            onChange: this.searchEventCertainties,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Certainty',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Event Certainty',
              onClick: this.openEventCertaintyForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="event certainty"
          items={eventCertainties}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventCertainties}
          onPaginate={(nextPage) => paginateEventCertainties(nextPage)}
          generateExportUrl={getEventCertaintiesExportUrl}
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
              avatarBackgroundColor={item.strings.color}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Event Certainty',
                    title: 'Update Event Certainty Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Certainty',
                    title: 'Share Event Certainty details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Certainty',
                    title:
                      'Remove Event Certainty from list of active focal People',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable-next-line */}
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...descriptionSpan} title={item.strings.description.en}>
                {item.strings.description.en}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Event Certainties"
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
          title={
            isEditForm ? 'Edit Event Certainty' : 'Add New Event Certainty'
          }
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.closeEventCertaintyForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <SettingForm
            setting={eventCertainty}
            posting={posting}
            onCancel={this.closeEventCertaintyForm}
            onCreate={postEventCertainty}
            onUpdate={putEventCertainty}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventCertainties.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  eventCertainties: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  eventCertainty: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
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
