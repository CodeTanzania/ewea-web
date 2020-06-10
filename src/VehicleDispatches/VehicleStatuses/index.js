import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import Topbar from '../../components/Topbar';
import SettingForm from '../../components/SettingForm';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess } from '../../util';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';

const {
  getVehicleStatuses,
  openVehicleStatusForm,
  searchVehicleStatuses,
  selectVehicleStatus,
  closeVehicleStatusForm,
  paginateVehicleStatuses,
  refreshVehicleStatuses,
  deleteVehicleStatus,
  postVehicleStatus,
  putVehicleStatus,
} = reduxActions;
const { confirm } = Modal;

const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getVehicleStatusesExportUrl,
} = httpActions;

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
 * @name VehicleStatus
 * @description Render Party(Agency) Ownership types list which have search box,
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class VehicleStatus extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
  };

  componentDidMount() {
    getVehicleStatuses();
  }

  /**
   * @function
   * @name openVehicleStatusesForm
   * @description Open vehicle status form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openVehicleStatusesForm = () => {
    openVehicleStatusForm();
  };

  /**
   * @function
   * @name closeVehicleStatusForm
   * @description close vehicle status form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeVehicleStatusForm = () => {
    closeVehicleStatusForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchVehicleStatuses
   * @description Search Vehicle statuses List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchVehicleStatuses = (event) => {
    searchVehicleStatuses(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} vehicleStatus vehicle status to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (vehicleStatus) => {
    selectVehicleStatus(vehicleStatus);
    this.setState({ isEditForm: true });
    openVehicleStatusForm();
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
    selectVehicleStatus(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleRefreshVehicleStatus
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshVehicleStatus = () => {
    refreshVehicleStatuses(
      () => {
        notifySuccess('Vehicle statuses were refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Vehicle statuses please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a vehicle status
   *
   * @param item {object} vehicleStatus to archive
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
        deleteVehicleStatus(
          item._id, // eslint-disable-line
          () => notifySuccess('Vehicle Status was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Vehicle Status, Please contact your system Administrator'
            )
        );
      },
    });
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Indicators
   *
   * @param {object[]| object} vehicleStatuses event Indicators list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (vehicleStatuses) => {
    let message = '';
    if (isArray(vehicleStatuses)) {
      const vehicleStatusList = vehicleStatuses.map(
        (vehicleStatus) =>
          `Name: ${vehicleStatus.strings.name.en}\nDescription: ${
            // eslint-disable-line
            vehicleStatus.strings.description.en
          }\n`
      );

      message = vehicleStatusList.join('\n\n\n');
    } else {
      message = `Name: ${vehicleStatuses.strings.name.en}\nDescription: ${
        // eslint-disable-line
        vehicleStatuses.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify vehicleStatuses
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  render() {
    const {
      vehicleStatuses,
      loading,
      page,
      posting,
      vehicleStatus,
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
            placeholder: 'Search for vehicle statuses here ...',
            onChange: this.searchVehicleStatuses,
            value: searchQuery,
          }}
          action={{
            label: 'New Status',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Vehicle Status',
            onClick: this.openVehicleStatusesForm,
          }}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="Vehicle Status"
          items={vehicleStatuses}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshVehicleStatus}
          onPaginate={(nextPage) => paginateVehicleStatuses(nextPage)}
          generateExportUrl={getVehicleStatusesExportUrl}
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
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Vehicle Status',
                    title: 'Update vehicle status details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Vehicle Status',
                    title: 'Share vehicle status details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Vehicle Status',
                    title:
                      'Remove vehicle status from list of active vehicle statuses',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
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

        {/* Vehicle Status modal */}
        <Modal
          title="Notify Vehicle Status"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={getFocalPeople}
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Vehicle Status modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Vehicle Status' : 'Add New Vehicle Status'}
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.closeVehicleStatusForm}
          afterClose={this.handleAfterCloseForm}
          maskClosable={false}
          destroyOnClose
        >
          <SettingForm
            setting={vehicleStatus}
            posting={posting}
            onCancel={this.closeVehicleStatusForm}
            onCreate={postVehicleStatus}
            onUpdate={putVehicleStatus}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

VehicleStatus.propTypes = {
  loading: PropTypes.bool.isRequired,
  vehicleStatuses: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  vehicleStatus: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

VehicleStatus.defaultProps = {
  vehicleStatus: null,
  searchQuery: undefined,
};

export default Connect(VehicleStatus, {
  vehicleStatuses: 'vehicleStatuses.list',
  vehicleStatus: 'vehicleStatuses.selected',
  loading: 'vehicleStatuses.loading',
  posting: 'vehicleStatuses.posting',
  page: 'vehicleStatuses.page',
  showForm: 'vehicleStatuses.showForm',
  total: 'vehicleStatuses.total',
  searchQuery: 'vehicleStatuses.q',
});
