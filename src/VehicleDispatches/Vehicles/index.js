import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import get from 'lodash/get';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import Topbar from '../../components/Topbar';
import VehicleForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess, truncateString } from '../../util';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import './styles.css';

const {
  getVehicles,
  openVehicleForm,
  searchVehicles,
  selectVehicle,
  closeVehicleForm,
  paginateVehicles,
  refreshVehicles,
  deleteVehicle,
} = reduxActions;
const { confirm } = Modal;

const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getVehiclesExportUrl,
} = httpActions;

/* constants */
const typeSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 8, xs: 7 };
const nameSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 8, xs: 7 };
const statusSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 0, xs: 0 };
const ownershipSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 0, xs: 0 };
const ownerSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 4, xs: 4 };
const descriptionSpan = { xxl: 6, xl: 6, lg: 6, md: 4, sm: 0, xs: 0 };
const headerLayout = [
  { ...typeSpan, header: 'Type' },
  { ...nameSpan, header: 'Plate No.' },
  { ...statusSpan, header: 'Status' },
  { ...ownershipSpan, header: 'Ownership' },
  { ...ownerSpan, header: 'Owner' },
  { ...descriptionSpan, header: 'Description' },
];

/**
 * @class
 * @name Vehicle
 * @description Render Party(Agency) Ownership types list which have search box,
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Vehicle extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
  };

  componentDidMount() {
    getVehicles();
  }

  /**
   * @function
   * @name openVehiclesForm
   * @description Open vehicle form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openVehiclesForm = () => {
    openVehicleForm();
  };

  /**
   * @function
   * @name closeVehicleForm
   * @description close vehicle form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeVehicleForm = () => {
    closeVehicleForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchVehicles
   * @description Search Vehicle types List based on supplied filter word
   *
   * @param {object} event Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchVehicles = (event) => {
    searchVehicles(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} vehicle vehicle to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (vehicle) => {
    selectVehicle(vehicle);
    this.setState({ isEditForm: true });
    openVehicleForm();
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
    selectVehicle(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleRefreshVehicle
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshVehicle = () => {
    refreshVehicles(
      () => {
        notifySuccess('Vehicle types were refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Vehicle types please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a vehicle
   *
   * @param item {object} vehicle to archive
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
        deleteVehicle(
          item._id, // eslint-disable-line
          () => notifySuccess('Vehicle was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Vehicle, Please contact your system Administrator'
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
   * @param {object[]| object} vehicles event Indicators list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (vehicles) => {
    let message = '';
    if (isArray(vehicles)) {
      const vehicleList = vehicles.map(
        (vehicle) =>
          `Name: ${vehicle.strings.name.en}\nDescription: ${
            // eslint-disable-line
            vehicle.strings.description.en
          }\n`
      );

      message = vehicleList.join('\n\n\n');
    } else {
      message = `Name: ${vehicles.strings.name.en}\nDescription: ${
        // eslint-disable-line
        vehicles.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify vehicles
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  render() {
    const {
      vehicles,
      loading,
      page,
      posting,
      vehicle,
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
            placeholder: 'Search for vehicles here ...',
            onChange: this.searchVehicles,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Vehicle',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Vehicle',
              onClick: this.openVehiclesForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="Vehicle"
          items={vehicles}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshVehicle}
          onPaginate={(nextPage) => paginateVehicles(nextPage)}
          generateExportUrl={getVehiclesExportUrl}
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
                    name: 'Edit Vehicle',
                    title: 'Update vehicle Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Vehicle',
                    title: 'Share vehicle details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Vehicle',
                    title: 'Remove vehicle from list of active vehicles',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...typeSpan}>
                {get(item, 'relations.type.strings.name.en', 'N/A')}
              </Col>
              <Col {...nameSpan}>{item.strings.name.en}</Col>
              <Col {...statusSpan}>
                {get(item, 'relations.status.strings.name.en', 'N/A')}
              </Col>
              <Col {...ownershipSpan}>
                {get(item, 'relations.ownership.strings.name.en', 'N/A')}
              </Col>
              <Col {...ownershipSpan}>
                {get(item, 'relations.owner.abbreviation', 'N/A')}
              </Col>
              <Col {...descriptionSpan} title={item.strings.description.en}>
                {truncateString(item.strings.description.en, 50)}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Vehicle modal */}
        <Modal
          title="Notify Vehicle"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
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
        {/* end Vehicle modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Vehicle' : 'Add New Vehicle'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeVehicleForm}
          afterClose={this.handleAfterCloseForm}
          maskClosable={false}
          destroyOnClose
        >
          <VehicleForm
            posting={posting}
            isEditForm={isEditForm}
            vehicle={vehicle}
            onCancel={this.closeVehicleForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

Vehicle.propTypes = {
  loading: PropTypes.bool.isRequired,
  vehicles: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  vehicle: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

Vehicle.defaultProps = {
  vehicle: null,
  searchQuery: undefined,
};

export default Connect(Vehicle, {
  vehicles: 'vehicles.list',
  vehicle: 'vehicles.selected',
  loading: 'vehicles.loading',
  posting: 'vehicles.posting',
  page: 'vehicles.page',
  showForm: 'vehicles.showForm',
  total: 'vehicles.total',
  searchQuery: 'vehicles.q',
});
