import { httpActions } from '@codetanzania/ewea-api-client';
import {
  closeEventActionForm,
  Connect,
  getEventActions,
  openEventActionForm,
  searchEventActions,
  selectEventAction,
  refreshEventActions,
  paginateEventActions,
  deleteEventAction,
} from '@codetanzania/ewea-api-states';
import { Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import EventActionFilters from './Filters';
import EventActionForm from './Form';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess } from '../../util';
import './styles.css';

/* constants */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getEventActionsExportUrl,
} = httpActions;

const functionSpan = { xxl: 4, xl: 5, lg: 6, md: 7, sm: 0, xs: 0 };
const nameSpan = { xxl: 18, xl: 17, lg: 16, md: 14, sm: 20, xs: 18 };

const headerLayout = [
  { ...functionSpan, header: 'Function' },
  { ...nameSpan, header: 'Name' },
];

const { confirm } = Modal;

/**
 * @class
 * @name EventActions
 * @description Render eventAction list which have search box, actions and eventAction list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventActions extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getEventActions();
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
   * @name openEventActionForm
   * @description Open eventAction form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventActionForm = () => {
    openEventActionForm();
  };

  /**
   * @function
   * @name openEventActionForm
   * @description close eventAction form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventActionForm = () => {
    closeEventActionForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventActions
   * @description Search EventActions List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventActions = event => {
    searchEventActions(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventAction eventAction to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventAction => {
    selectEventAction(eventAction);
    this.setState({ isEditForm: true });
    openEventActionForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Actions
   *
   * @param {object[]| object} eventActions event Actions list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = eventActions => {
    let message = '';
    if (isArray(eventActions)) {
      const eventActionList = eventActions.map(
        eventAction =>
          `Name: ${eventAction.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventAction.strings.description.en
          }\n`
      );

      message = eventActionList.join('\n\n\n');
    } else {
      message = `Name: ${eventActions.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventActions.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify eventActions
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
        deleteEventAction(
          item._id, // eslint-disable-line
          () => notifySuccess('Focal Person was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Focal Person, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshEventActions = () =>
    refreshEventActions(
      () => notifySuccess('Event Actions refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Event Actions, please contact system administrator'
        )
    );

  render() {
    const {
      eventActions,
      eventAction,
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
      notificationBody,
      cached,
    } = this.state;

    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for event actions here ...',
            onChange: this.searchEventActions,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Event Action',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Event Action',
              onClick: this.openEventActionForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="event actions"
          items={eventActions}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventActions}
          onPaginate={nextPage => paginateEventActions(nextPage)}
          generateExportUrl={getEventActionsExportUrl}
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
                    name: 'Edit Event Action',
                    title: 'Update Event Action Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Action',
                    title: 'Share Event Action details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Action',
                    title:
                      'Remove Event Action from list of active focal People',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable-next-line */}
              <Col {...functionSpan}>
                {get(item, 'relations.function.strings.name.en', 'N/A')}{' '}
              </Col>

              {/* eslint-disable-next-line */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
            </ListItem>
          )}
        />
        {/* end list */}

        {/* filter modal */}
        <Modal
          title="Filter Event Actions"
          visible={showFilters}
          onCancel={this.closeFiltersModal}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
        >
          <EventActionFilters
            onCancel={this.closeFiltersModal}
            cached={cached}
            onCache={this.handleOnCachedValues}
            onClearCache={this.handleClearCachedValues}
          />
        </Modal>
        {/* end filter modal */}

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
          title={isEditForm ? 'Edit Event Action' : 'Add New Event Action'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventActionForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventActionForm
            posting={posting}
            isEditForm={isEditForm}
            eventAction={eventAction}
            onCancel={this.closeEventActionForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventActions.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  eventActions: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventAction: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

EventActions.defaultProps = {
  eventAction: null,
  searchQuery: undefined,
};

export default Connect(EventActions, {
  eventActions: 'eventActions.list',
  eventAction: 'eventActions.selected',
  loading: 'eventActions.loading',
  posting: 'eventActions.posting',
  page: 'eventActions.page',
  showForm: 'eventActions.showForm',
  total: 'eventActions.total',
  searchQuery: 'eventActions.q',
});
