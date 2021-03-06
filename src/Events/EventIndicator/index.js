import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import EventIndicatorForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess } from '../../util';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';

/* http actions */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getEventIndicatorsExportUrl,
} = httpActions;
/* redux actions */
const {
  getEventIndicators,
  openEventIndicatorForm,
  searchEventIndicators,
  selectEventIndicator,
  closeEventIndicatorForm,
  paginateEventIndicators,
  refreshEventIndicators,
  deleteEventIndicator,
} = reduxActions;

/* ui */
const { confirm } = Modal;
/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 5, sm: 16, xs: 14 };
const codeSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 4, xs: 4 };
const descriptionSpan = { xxl: 14, xl: 14, lg: 14, md: 13, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];

/**
 * @class
 * @name EventIndicator
 * @description Render Event Indicators list which have search box,
 * actions and event indicators list
 * @version 0.1.0
 * @since 0.1.0
 */
class EventIndicator extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
  };

  componentDidMount() {
    getEventIndicators();
  }

  /**
   * @function
   * @name openEventIndicatorsForm
   * @description Open event indicator form
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventIndicatorsForm = () => {
    openEventIndicatorForm();
  };

  /**
   * @function
   * @name closeEventIndicatorForm
   * @description close event indicator form
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventIndicatorForm = () => {
    closeEventIndicatorForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventIndicators
   * @description Search Event Indicators List based on supplied filter word
   * @param {object} event Event instance
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventIndicators = (event) => {
    searchEventIndicators(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   * @param {object} eventIndicator event indicator to be edited
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (eventIndicator) => {
    selectEventIndicator(eventIndicator);
    this.setState({ isEditForm: true });
    openEventIndicatorForm();
  };

  /**
   * @function
   * @name handleAfterCloseForm
   * @description Perform post close form cleanups
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseForm = () => {
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleRefreshEventIndicator
   * @description Handle list refresh action
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshEventIndicator = () => {
    refreshEventIndicators(
      () => {
        notifySuccess('Event Indicator refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Event Indicator please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a event indicator
   * @param {object} item  eventIndicator to archive
   * @returns {undefined}
   * @version 0.1.0
   * @since 0.1.0
   */
  showArchiveConfirm = (item) => {
    confirm({
      title: `Are you sure you want to archive ${item.strings.name.en} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        return new Promise((resolve) => {
          deleteEventIndicator(
            item._id, // eslint-disable-line
            () => {
              resolve();
              notifySuccess('Event Indicator was archived successfully');
            },
            () => {
              resolve();
              notifyError(
                'An error occurred while archiving Event Indicator, Please contact your system Administrator'
              );
            }
          );
        });
      },
    });
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Indicators
   * @param {object[]| object} eventIndicators event Indicators list to be shared
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (eventIndicators) => {
    let message = '';
    if (isArray(eventIndicators)) {
      const eventIndicatorList = eventIndicators.map(
        (eventIndicator) =>
          `Name: ${eventIndicator.strings.name.en}\nDescription: ${
            // eslint-disable-line
            eventIndicator.strings.description.en
          }\n`
      );

      message = eventIndicatorList.join('\n\n\n');
    } else {
      message = `Name: ${eventIndicators.strings.name.en}\nDescription: ${
        // eslint-disable-line
        eventIndicators.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify eventIndicators
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  render() {
    const {
      eventIndicators,
      loading,
      page,
      posting,
      eventIndicator,
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
            placeholder: 'Search for event indicators here ...',
            onChange: this.searchEventIndicators,
            value: searchQuery,
          }}
          action={{
            label: 'New Event Indicator',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Event Indicator',
            onClick: this.openEventIndicatorsForm,
          }}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="Event Indicator"
          items={eventIndicators}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventIndicator}
          onPaginate={(nextPage) => paginateEventIndicators(nextPage)}
          generateExportUrl={getEventIndicatorsExportUrl}
          headerLayout={headerLayout}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => (
            <ListItem
              key={item._id} // eslint-disable-line
              item={item}
              name={item.strings.name.en}
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
                  {get(item, 'strings.description.en', 'N/A')}
                </span>
              }
              actions={[
                {
                  name: 'Edit Event Indicator',
                  title: 'Update Event Indicator Details',
                  onClick: () => this.handleEdit(item),
                  icon: 'edit',
                },
                {
                  name: 'Share Event Indicator',
                  title: 'Share Event Indicator details with others',
                  onClick: () => this.handleShare(item),
                  icon: 'share',
                },
                {
                  name: 'Archive Event Indicator',
                  title:
                    'Remove Event Indicator from list of active event indicators',
                  onClick: () => this.showArchiveConfirm(item),
                  icon: 'archive',
                },
              ]}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...codeSpan}>{item.strings.code}</Col>
              <Col {...descriptionSpan}>{item.strings.description.en}</Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Event Indicator modal */}
        <Modal
          title="Notify Event Indicator"
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
        {/* end Event Indicator modal */}

        {/* create/edit form modal */}
        <Modal
          title={
            isEditForm ? 'Edit Event Indicator' : 'Add New Event Indicator'
          }
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.closeEventIndicatorForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventIndicatorForm
            posting={posting}
            isEditForm={isEditForm}
            eventIndicator={eventIndicator}
            onCancel={this.closeEventIndicatorForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

EventIndicator.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventIndicators: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  eventIndicator: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

EventIndicator.defaultProps = {
  eventIndicator: null,
  searchQuery: undefined,
};

export default Connect(EventIndicator, {
  eventIndicators: 'eventIndicators.list',
  eventIndicator: 'eventIndicators.selected',
  loading: 'eventIndicators.loading',
  posting: 'eventIndicators.posting',
  page: 'eventIndicators.page',
  showForm: 'eventIndicators.showForm',
  total: 'eventIndicators.total',
  searchQuery: 'eventIndicators.q',
});
