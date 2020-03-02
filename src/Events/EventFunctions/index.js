import { httpActions } from '@codetanzania/ewea-api-client';
import {
  Connect,
  searchEventFunctions,
  selectEventFunction,
  getEventFunctions,
  openEventFunctionForm,
  closeEventFunctionForm,
  paginateEventFunctions,
  deleteEventFunction,
  refreshEventFunctions,
} from '@codetanzania/ewea-api-states';
import isArray from 'lodash/isArray';
import { Modal, Col } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import NotificationForm from '../../components/NotificationForm';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import Topbar from '../../components/Topbar';
import EventFunctionsFilters from './Filters';
import FunctionForm from './Form';
import { notifyError, notifySuccess, truncateString } from '../../util';
import './styles.css';

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 6, md: 7, sm: 8, xs: 14 };
const typeSpan = { xxl: 3, xl: 3, lg: 3, md: 2, sm: 0, xs: 0 };
const codeSpan = { xxl: 3, xl: 3, lg: 3, md: 2, sm: 2, xs: 5 };
const descriptionSpan = { xxl: 11, xl: 11, lg: 10, md: 10, sm: 10, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...typeSpan, header: 'Type' },
  { ...descriptionSpan, header: 'Description' },
];
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getEventFunctionsExportUrl,
} = httpActions;
const { confirm } = Modal;

/**
 * @class
 * @name EventFunctions
 * @description Render functions list which have search box, actions and list event functions
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventFunctions extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    cached: null,
    notificationBody: undefined,
    showNotificationForm: false,
  };

  componentDidMount() {
    getEventFunctions();
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
   * @name openEventFunctionForm
   * @description Open eventFunction form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventFunctionForm = () => {
    openEventFunctionForm();
  };

  /**
   * @function
   * @name closeEventFunctionForm
   * @description close eventFunction form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventFunctionForm = () => {
    closeEventFunctionForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventFunctions
   * @description Search EventFunctions List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventFunctions = event => {
    searchEventFunctions(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventFunction eventFunction to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventFunction => {
    selectEventFunction(eventFunction);
    this.setState({ isEditForm: true });
    openEventFunctionForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event functions
   *
   * @param {object[]| object} eventFunctions event functions list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = eventFunctions => {
    let message = '';
    if (isArray(eventFunctions)) {
      const eventFunctionsList = eventFunctions.map(
        eventFunction =>
          `Name: ${eventFunction.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventFunction.strings.description.en
          }\n`
      );

      message = eventFunctionsList.join('\n\n\n');
    } else {
      message = `Name: ${eventFunctions.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventFunctions.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify event functions
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
        deleteEventFunction(
          item._id, // eslint-disable-line
          () => notifySuccess('Emergency Function was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Emergency Function, Please contact your system Administrator'
            )
        );
      },
    });
  };

  /**
   * @function
   * @name handleRefreshEventFunctions
   * @description Refresh Event Function list
   *
   * @returns {undefined}
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshEventFunctions = () =>
    refreshEventFunctions(
      () => notifySuccess('Emergency Functions refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Emergency Functions, please contact system administrator'
        )
    );

  render() {
    const {
      eventFunctions,
      eventFunction,
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
      cached,
      notificationBody,
      showNotificationForm,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for emergency functions here ...',
            onChange: this.searchEventFunctions,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Function',
              icon: 'plus',
              size: 'large',
              title: 'Add New Emergency Function',
              onClick: this.openEventFunctionForm,
            },
          ]}
        />
        {/* end Topbar */}

        <ItemList
          itemName="emergency functions"
          items={eventFunctions}
          page={page}
          itemCount={total}
          loading={loading}
          onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventFunctions}
          generateExportUrl={getEventFunctionsExportUrl}
          onPaginate={nextPage => paginateEventFunctions(nextPage)}
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
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...typeSpan}>{item.strings.code}</Col>
              <Col {...descriptionSpan}>
                <span title={item.strings.description.en}>
                  {truncateString(item.strings.description.en, 120)}
                </span>
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />

        {/* filter modal */}
        <Modal
          title="Filter Emergency Function"
          visible={showFilters}
          onCancel={this.closeFiltersModal}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
        >
          <EventFunctionsFilters
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
          title={
            isEditForm
              ? 'Edit Emergency Function'
              : 'Add New Emergency Function'
          }
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventFunctionForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <FunctionForm
            posting={posting}
            isEditForm={isEditForm}
            eventFunction={eventFunction}
            onCancel={this.closeEventFunctionForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventFunctions.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  eventFunctions: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  eventFunction: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

EventFunctions.defaultProps = {
  eventFunction: null,
  searchQuery: undefined,
};

export default Connect(EventFunctions, {
  eventFunctions: 'eventFunctions.list',
  eventFunction: 'eventFunctions.selected',
  loading: 'eventFunctions.loading',
  posting: 'eventFunctions.posting',
  page: 'eventFunctions.page',
  showForm: 'eventFunctions.showForm',
  total: 'eventFunctions.total',
  searchQuery: 'eventFunctions.q',
});
