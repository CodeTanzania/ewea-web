import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
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
import './styles.css';

const {
  getVehicleTypes,
  openVehicleTypeForm,
  searchVehicleTypes,
  selectVehicleType,
  closeVehicleTypeForm,
  paginateVehicleTypes,
  refreshVehicleTypes,
  deleteVehicleType,
  postVehicleType,
  putVehicleType,
} = reduxActions;
const { confirm } = Modal;

const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getVehicleTypesExportUrl,
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
 * @name VehicleType
 * @description Render Party(Agency) Ownership types list which have search box,
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class VehicleType extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
  };

  componentDidMount() {
    getVehicleTypes();
  }

  /**
   * @function
   * @name openVehicleTypesForm
   * @description Open vehicle type form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openVehicleTypesForm = () => {
    openVehicleTypeForm();
  };

  /**
   * @function
   * @name closeVehicleTypeForm
   * @description close vehicle type form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeVehicleTypeForm = () => {
    closeVehicleTypeForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchVehicleTypes
   * @description Search Vehicle types List based on supplied filter word
   *
   * @param {object} event Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchVehicleTypes = (event) => {
    searchVehicleTypes(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} vehicleType vehicle type to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (vehicleType) => {
    selectVehicleType(vehicleType);
    this.setState({ isEditForm: true });
    openVehicleTypeForm();
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
    selectVehicleType(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleRefreshVehicleType
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshVehicleType = () => {
    refreshVehicleTypes(
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
   * @description show confirm modal before archiving a vehicle type
   *
   * @param item {object} vehicleType to archive
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
        deleteVehicleType(
          item._id, // eslint-disable-line
          () => notifySuccess('Vehicle Type was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Vehicle Type, Please contact your system Administrator'
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
   * @param {object[]| object} vehicleTypes event Indicators list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (vehicleTypes) => {
    let message = '';
    if (isArray(vehicleTypes)) {
      const vehicleTypeList = vehicleTypes.map(
        (vehicleType) =>
          `Name: ${vehicleType.strings.name.en}\nDescription: ${
            // eslint-disable-line
            vehicleType.strings.description.en
          }\n`
      );

      message = vehicleTypeList.join('\n\n\n');
    } else {
      message = `Name: ${vehicleTypes.strings.name.en}\nDescription: ${
        // eslint-disable-line
        vehicleTypes.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify vehicleTypes
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  render() {
    const {
      vehicleTypes,
      loading,
      page,
      posting,
      vehicleType,
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
            placeholder: 'Search for vehicle types here ...',
            onChange: this.searchVehicleTypes,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Type',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Vehicle Type',
              onClick: this.openVehicleTypesForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="Vehicle Type"
          items={vehicleTypes}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshVehicleType}
          onPaginate={(nextPage) => paginateVehicleTypes(nextPage)}
          generateExportUrl={getVehicleTypesExportUrl}
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
                    name: 'Edit Vehicle Type',
                    title: 'Update vehicle type Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Vehicle Type',
                    title: 'Share vehicle type details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Vehicle Type',
                    title:
                      'Remove vehicle type from list of active vehicle types',
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

        {/* Vehicle Type modal */}
        <Modal
          title="Notify Vehicle Type"
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
        {/* end Vehicle Type modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeVehicleTypeForm}
          afterClose={this.handleAfterCloseForm}
          maskClosable={false}
          destroyOnClose
        >
          <SettingForm
            setting={vehicleType}
            posting={posting}
            onCancel={this.closeVehicleTypeForm}
            onCreate={postVehicleType}
            onUpdate={putVehicleType}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

VehicleType.propTypes = {
  loading: PropTypes.bool.isRequired,
  vehicleTypes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  vehicleType: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

VehicleType.defaultProps = {
  vehicleType: null,
  searchQuery: undefined,
};

export default Connect(VehicleType, {
  vehicleTypes: 'vehicleTypes.list',
  vehicleType: 'vehicleTypes.selected',
  loading: 'vehicleTypes.loading',
  posting: 'vehicleTypes.posting',
  page: 'vehicleTypes.page',
  showForm: 'vehicleTypes.showForm',
  total: 'vehicleTypes.total',
  searchQuery: 'vehicleTypes.q',
});
