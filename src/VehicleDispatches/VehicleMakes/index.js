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

const {
  getVehicleMakes,
  openVehicleMakeForm,
  searchVehicleMakes,
  selectVehicleMake,
  closeVehicleMakeForm,
  paginateVehicleMakes,
  refreshVehicleMakes,
  deleteVehicleMake,
  postVehicleMake,
  putVehicleMake,
} = reduxActions;
const { confirm } = Modal;

const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getVehicleMakesExportUrl,
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
 * @name VehicleMake
 * @description Render Party(Agency) Ownership types list which have search box,
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class VehicleMake extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
  };

  componentDidMount() {
    getVehicleMakes();
  }

  /**
   * @function
   * @name openVehicleMakesForm
   * @description Open vehicle make form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openVehicleMakesForm = () => {
    openVehicleMakeForm();
  };

  /**
   * @function
   * @name closeVehicleMakeForm
   * @description close vehicle make form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeVehicleMakeForm = () => {
    closeVehicleMakeForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchVehicleMakes
   * @description Search Vehicle makes List based on supplied filter word
   *
   * @param {object} event Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchVehicleMakes = (event) => {
    searchVehicleMakes(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} vehicleMake vehicle make to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (vehicleMake) => {
    selectVehicleMake(vehicleMake);
    this.setState({ isEditForm: true });
    openVehicleMakeForm();
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
    selectVehicleMake(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleRefreshVehicleMake
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshVehicleMake = () => {
    refreshVehicleMakes(
      () => {
        notifySuccess('Vehicle makes were refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Vehicle makes please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a vehicle make
   *
   * @param item {object} vehicleMake to archive
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
        deleteVehicleMake(
          item._id, // eslint-disable-line
          () => notifySuccess('Vehicle Make was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Vehicle Make, Please contact your system Administrator'
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
   * @param {object[]| object} vehicleMakes event Indicators list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (vehicleMakes) => {
    let message = '';
    if (isArray(vehicleMakes)) {
      const vehicleMakeList = vehicleMakes.map(
        (vehicleMake) =>
          `Name: ${vehicleMake.strings.name.en}\nDescription: ${
            // eslint-disable-line
            vehicleMake.strings.description.en
          }\n`
      );

      message = vehicleMakeList.join('\n\n\n');
    } else {
      message = `Name: ${vehicleMakes.strings.name.en}\nDescription: ${
        // eslint-disable-line
        vehicleMakes.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify vehicleMakes
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  render() {
    const {
      vehicleMakes,
      loading,
      page,
      posting,
      vehicleMake,
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
            placeholder: 'Search for vehicle makes here ...',
            onChange: this.searchVehicleMakes,
            value: searchQuery,
          }}
          action={{
            label: 'New Make',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Vehicle Make',
            onClick: this.openVehicleMakesForm,
          }}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="Vehicle Make"
          items={vehicleMakes}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshVehicleMake}
          onPaginate={(nextPage) => paginateVehicleMakes(nextPage)}
          generateExportUrl={getVehicleMakesExportUrl}
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
                    name: 'Edit Vehicle Make',
                    title: 'Update vehicle make Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Vehicle Make',
                    title: 'Share vehicle make details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Vehicle Make',
                    title:
                      'Remove vehicle make from list of active vehicle makes',
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

        {/* Vehicle Make modal */}
        <Modal
          title="Notify Vehicle Make"
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
        {/* end Vehicle Make modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Vehicle Make' : 'Add New Vehicle Make'}
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.closeVehicleMakeForm}
          afterClose={this.handleAfterCloseForm}
          maskClosable={false}
          destroyOnClose
        >
          <SettingForm
            setting={vehicleMake}
            posting={posting}
            onCancel={this.closeVehicleMakeForm}
            onCreate={postVehicleMake}
            onUpdate={putVehicleMake}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

VehicleMake.propTypes = {
  loading: PropTypes.bool.isRequired,
  vehicleMakes: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  vehicleMake: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

VehicleMake.defaultProps = {
  vehicleMake: null,
  searchQuery: undefined,
};

export default Connect(VehicleMake, {
  vehicleMakes: 'vehicleMakes.list',
  vehicleMake: 'vehicleMakes.selected',
  loading: 'vehicleMakes.loading',
  posting: 'vehicleMakes.posting',
  page: 'vehicleMakes.page',
  showForm: 'vehicleMakes.showForm',
  total: 'vehicleMakes.total',
  searchQuery: 'vehicleMakes.q',
});
