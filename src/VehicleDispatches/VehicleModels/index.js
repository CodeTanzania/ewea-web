import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import Topbar from '../../components/Topbar';
import VehicleModelForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess } from '../../util';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import './styles.css';

const {
  getVehicleModels,
  openVehicleModelForm,
  searchVehicleModels,
  selectVehicleModel,
  closeVehicleModelForm,
  paginateVehicleModels,
  refreshVehicleModels,
  deleteVehicleModel,
} = reduxActions;
const { confirm } = Modal;

const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getVehicleModelsExportUrl,
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
 * @name VehicleModel
 * @description Render Party(Agency) Ownership types list which have search box,
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class VehicleModel extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
  };

  componentDidMount() {
    getVehicleModels();
  }

  /**
   * @function
   * @name openVehicleModelsForm
   * @description Open vehicle model form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openVehicleModelsForm = () => {
    openVehicleModelForm();
  };

  /**
   * @function
   * @name closeVehicleModelForm
   * @description close vehicle model form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeVehicleModelForm = () => {
    closeVehicleModelForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchVehicleModels
   * @description Search Vehicle models List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchVehicleModels = (event) => {
    searchVehicleModels(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} vehicleModel vehicle model to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (vehicleModel) => {
    selectVehicleModel(vehicleModel);
    this.setState({ isEditForm: true });
    openVehicleModelForm();
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
    selectVehicleModel(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleRefreshVehicleModel
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshVehicleModel = () => {
    refreshVehicleModels(
      () => {
        notifySuccess('Vehicle models were refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Vehicle models please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a vehicle model
   *
   * @param item {object} vehicleModel to archive
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
        deleteVehicleModel(
          item._id, // eslint-disable-line
          () => notifySuccess('Vehicle Model was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Vehicle Model, Please contact your system Administrator'
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
   * @param {object[]| object} vehicleModels event Indicators list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (vehicleModels) => {
    let message = '';
    if (isArray(vehicleModels)) {
      const vehicleModelList = vehicleModels.map(
        (vehicleModel) =>
          `Name: ${vehicleModel.strings.name.en}\nDescription: ${
            // eslint-disable-line
            vehicleModel.strings.description.en
          }\n`
      );

      message = vehicleModelList.join('\n\n\n');
    } else {
      message = `Name: ${vehicleModels.strings.name.en}\nDescription: ${
        // eslint-disable-line
        vehicleModels.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify vehicleModels
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  render() {
    const {
      vehicleModels,
      loading,
      page,
      posting,
      vehicleModel,
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
            placeholder: 'Search for vehicle models here ...',
            onChange: this.searchVehicleModels,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Model',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Vehicle Model',
              onClick: this.openVehicleModelsForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="Vehicle Model"
          items={vehicleModels}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshVehicleModel}
          onPaginate={(nextPage) => paginateVehicleModels(nextPage)}
          generateExportUrl={getVehicleModelsExportUrl}
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
                    name: 'Edit Vehicle Model',
                    title: 'Update vehicle model details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Vehicle Model',
                    title: 'Share vehicle model details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Vehicle Model',
                    title:
                      'Remove vehicle model from list of active vehicle models',
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

        {/* Vehicle Model modal */}
        <Modal
          title="Notify Vehicle Model"
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
        {/* end Vehicle Model modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Vehicle Model' : 'Add New Vehicle Model'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeVehicleModelForm}
          afterClose={this.handleAfterCloseForm}
          maskClosable={false}
          destroyOnClose
        >
          <VehicleModelForm
            posting={posting}
            isEditForm={isEditForm}
            vehicleModel={vehicleModel}
            onCancel={this.closeVehicleModelForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

VehicleModel.propTypes = {
  loading: PropTypes.bool.isRequired,
  vehicleModels: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  vehicleModel: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

VehicleModel.defaultProps = {
  vehicleModel: null,
  searchQuery: undefined,
};

export default Connect(VehicleModel, {
  vehicleModels: 'vehicleModels.list',
  vehicleModel: 'vehicleModels.selected',
  loading: 'vehicleModels.loading',
  posting: 'vehicleModels.posting',
  page: 'vehicleModels.page',
  showForm: 'vehicleModels.showForm',
  total: 'vehicleModels.total',
  searchQuery: 'vehicleModels.q',
});
