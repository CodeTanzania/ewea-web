import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';

import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import FocalPersonFilters from './Filters';
import DispatchForm from './Form';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import {
  notifyError,
  notifySuccess,
  generateFocalPersonVCard,
} from '../../util';
import './styles.css';

/* constants */
const {
  getDispatches: getDispatchesFromAPI,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getDispatchesExportUrl,
} = httpActions;
const {
  closeDispatchForm,
  getDispatches,
  openDispatchForm,
  searchDispatches,
  selectFocalPerson,
  refreshDispatches,
  paginateDispatches,
  deleteFocalPerson,
} = reduxActions;
const { confirm } = Modal;

const numberSpan = { xxl: 4, xl: 4, lg: 4, md: 6, sm: 10, xs: 10 };
const vehicleSpan = { xxl: 6, xl: 5, lg: 5, md: 0, sm: 0, xs: 0 };
const eventSpan = { xxl: 4, xl: 5, lg: 5, md: 4, sm: 9, xs: 8 };
const statusSpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const areaSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };

const headerLayout = [
  { ...numberSpan, header: 'Number' },
  { ...vehicleSpan, header: 'Vehicle' },
  { ...eventSpan, header: 'Event' },
  { ...statusSpan, header: 'Status' },
];

/**
 * @class
 * @name Dispatches
 * @description Render dispatch list which have search box, actions and dispatch list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Dispatches extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    showNotificationForm: false,
    selectedDispatches: [],
    notificationSubject: undefined,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getDispatches();
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
   * @name openDispatchForm
   * @description Open dispatch form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openDispatchForm = () => {
    openDispatchForm();
  };

  /**
   * @function
   * @name openDispatchForm
   * @description close dispatch form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeDispatchForm = () => {
    closeDispatchForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchDispatches
   * @description Search Dispatches List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchDispatches = (event) => {
    searchDispatches(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} dispatch dispatch to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (dispatch) => {
    selectFocalPerson(dispatch);
    this.setState({ isEditForm: true });
    openDispatchForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share single dispatch action
   *
   * @param {object| object[]} dispatches dispatch to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (dispatches) => {
    let message = '';
    let subject = '';
    if (isArray(dispatches)) {
      subject = 'Contact Details for Focals';
      const dispatchesList = dispatches.map(
        (dispatch) => generateFocalPersonVCard(dispatch).body
      );

      message = dispatchesList.join('\n\n\n');
    } else {
      const { subject: title, body } = generateFocalPersonVCard(dispatches);
      subject = title;
      message = body;
    }

    this.setState({
      notificationSubject: subject,
      notificationBody: message,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name openNotificationForm
   * @description Handle on notify dispatches
   *
   * @param {object[]} dispatches List of dispatches selected to be notified
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = (dispatches) => {
    this.setState({
      selectedDispatches: dispatches,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify dispatches
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
   * @name handleRefreshDispatches
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshDispatches = () => {
    refreshDispatches(
      () => {
        notifySuccess('Vehicle Dispatches refreshed successfully');
      },
      () => {
        notifyError(
          'An error occurred while refreshing vehicle dispatches please contact system administrator'
        );
      }
    );
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
        deleteFocalPerson(
          item._id, // eslint-disable-line
          () => notifySuccess('Vehicle Dispatch was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Vehicle Dispatch, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      dispatches,
      dispatch,
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
      selectedDispatches,
      notificationSubject,
      notificationBody,
      cached,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for vehicle dispatches here ...',
            onChange: this.searchDispatches,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Vehicle Dispatch',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Vehicle Dispatch',
              onClick: this.openDispatchForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="vehicle dispatches"
          items={dispatches}
          page={page}
          itemCount={total}
          loading={loading}
          onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshDispatches}
          onPaginate={(nextPage) => paginateDispatches(nextPage)}
          generateExportUrl={getDispatchesExportUrl}
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
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Vehicle Dispatch',
                    title: 'Update Vehicle Dispatch Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Vehicle Dispatch',
                    title: 'Share Vehicle Dispatch details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Vehicle Dispatch',
                    title:
                      'Remove focal person from list of active vehicle dispatches',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...numberSpan}>{item.name}</Col>
              <Col
                {...vehicleSpan}
                title={get(item, 'role.strings.name.en', 'N/A')}
              >
                {`${get(item, 'role.strings.name.en', 'N/A')}, ${get(
                  item,
                  'party.abbreviation',
                  'N/A'
                )}`}
              </Col>
              <Col {...eventSpan}>{item.mobile}</Col>
              <Col {...statusSpan}>{item.email}</Col>
              <Col {...areaSpan}>
                {get(item, 'area.strings.name.en', 'N/A')}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* filter modal */}
        <Modal
          title="Filter Vehicle Dispatches"
          visible={showFilters}
          onCancel={this.closeFiltersModal}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
        >
          <FocalPersonFilters
            onCancel={this.closeFiltersModal}
            cached={cached}
            onCache={this.handleOnCachedValues}
            onClearCache={this.handleClearCachedValues}
          />
        </Modal>
        {/* end filter modal */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Vehicle Dispatches"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={selectedDispatches}
            onSearchRecipients={getDispatchesFromAPI}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            subject={notificationSubject}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Notification modal */}

        {/* create/edit form modal */}
        <Modal
          title={
            isEditForm ? 'Edit Vehicle Dispatch' : 'Add New Vehicle Dispatch'
          }
          visible={showForm}
          width="70%"
          footer={null}
          onCancel={this.closeDispatchForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <DispatchForm
            posting={posting}
            isEditForm={isEditForm}
            dispatch={dispatch}
            onCancel={this.closeDispatchForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

Dispatches.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  dispatches: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  dispatch: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

Dispatches.defaultProps = {
  dispatch: null,
  searchQuery: undefined,
};

export default Connect(Dispatches, {
  dispatches: 'dispatches.list',
  dispatch: 'dispatches.selected',
  loading: 'dispatches.loading',
  posting: 'dispatches.posting',
  page: 'dispatches.page',
  showForm: 'dispatches.showForm',
  total: 'dispatches.total',
  searchQuery: 'dispatches.q',
});
