import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect } from '@codetanzania/ewea-api-states';
import get from 'lodash/get';
import { Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Topbar from '../../components/Topbar';
import VehicleForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import { truncateString } from '../../util';
import { useList } from '../../hooks';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';

/* http actions */
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
const plateNumberSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 8, xs: 7 };
const statusSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 0, xs: 0 };
const ownershipSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 0, xs: 0 };
const ownerSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 4, xs: 0 };
const descriptionSpan = { xxl: 6, xl: 6, lg: 6, md: 4, sm: 0, xs: 0 };
const headerLayout = [
  { ...typeSpan, header: 'Type' },
  { ...plateNumberSpan, header: 'Plate No.' },
  { ...statusSpan, header: 'Status' },
  { ...ownershipSpan, header: 'Ownership' },
  { ...ownerSpan, header: 'Owner' },
  { ...descriptionSpan, header: 'Description' },
];
const FIELDS_TO_SHARE = {
  name: { header: 'Name', dataIndex: 'strings.name.en', defaultValue: 'N/A' },
  description: {
    header: 'Description',
    dataIndex: 'strings.description.en',
    defaultValue: 'N/A',
  },
};

/**
 * @function
 * @name Vehicles
 * @description Render Party(Agency) Ownership types list which have search box,
 * @param { object} props component properties object
 * @param {object[]} props.focalPeople List of vehicles from the API
 * @param {object} props.focalPerson Selected vehicle from from the API
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * @param props.vehicles
 * @param props.vehicle
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Vehicle list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const Vehicles = ({
  vehicles,
  vehicle,
  loading,
  page,
  posting,
  showForm,
  searchQuery,
  total,
}) => {
  const {
    isEditForm,
    showNotificationForm,
    notificationBody,

    handleOnOpenForm,
    handleOnCloseForm,
    handleOnSearch,
    handleOnEdit,
    handleOnOpenNotificationForm,
    handleOnCloseNotificationForm,
    handleAfterCloseForm,
    handleAfterCloseNotificationForm,
    handleOnRefreshList,
    handleOnArchiveItem,
    handleOnCreateItem,
    handleOnUpdateItem,
    handleOnShare,
    handleOnPaginate,
  } = useList('vehicles');

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for vehicles here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Vehicle',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Vehicle',
          onClick: handleOnOpenForm,
        }}
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
        onNotify={handleOnOpenNotificationForm}
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onRefresh={handleOnRefreshList}
        onPaginate={handleOnPaginate}
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
            title={
              <Row>
                <Col span={16}>
                  <span className="text-sm">
                    {get(item, 'relations.type.strings.name.en', 'N/A')}
                  </span>
                </Col>
                <Col span={6}>
                  <span className="text-xs">
                    {get(item, 'strings.name.en', 'N/A')}
                  </span>
                </Col>
              </Row>
            }
            secondaryText={
              <Row>
                <Col span={16}>
                  <span className="text-xs">
                    {get(item, 'relations.status.strings.name.en', 'N/A')}
                  </span>
                </Col>
                <Col span={6}>
                  <span className="text-xs">
                    {get(item, 'relations.ownership.strings.name.en', 'N/A')}
                  </span>
                </Col>
              </Row>
            }
            actions={[
              {
                name: 'Edit Vehicle',
                title: 'Update vehicle Details',
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Share Vehicle',
                title: 'Share vehicle details with others',
                onClick: () => handleOnShare(item, FIELDS_TO_SHARE),
                icon: 'share',
              },
              {
                name: 'Archive Vehicle',
                title: 'Remove vehicle from list of active vehicles',
                onClick: () => handleOnArchiveItem(item),
                icon: 'archive',
              },
            ]}
          >
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Col {...typeSpan}>
              {get(item, 'relations.type.strings.name.en', 'N/A')}
            </Col>
            <Col {...plateNumberSpan}>{item.strings.name.en}</Col>
            <Col {...statusSpan}>
              {get(item, 'relations.status.strings.name.en', 'N/A')}
            </Col>
            <Col {...ownershipSpan}>
              {get(item, 'relations.ownership.strings.name.en', 'N/A')}
            </Col>
            <Col {...ownerSpan}>
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
        onCancel={handleOnCloseNotificationForm}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="modal-window-50"
        afterClose={handleAfterCloseNotificationForm}
      >
        <NotificationForm
          onSearchRecipients={getFocalPeople}
          onSearchJurisdictions={getJurisdictions}
          onSearchGroups={getPartyGroups}
          onSearchAgencies={getAgencies}
          onSearchRoles={getRoles}
          body={notificationBody}
          onCancel={handleOnCloseNotificationForm}
        />
      </Modal>
      {/* end Vehicle modal */}

      {/* create/edit form modal */}
      <Modal
        title={isEditForm ? 'Edit Vehicle' : 'Add New Vehicle'}
        visible={showForm}
        className="modal-window-50"
        footer={null}
        onCancel={handleOnCloseForm}
        afterClose={handleAfterCloseForm}
        maskClosable={false}
        destroyOnClose
      >
        <VehicleForm
          posting={posting}
          vehicle={vehicle}
          onCancel={handleOnCloseForm}
          onCreate={handleOnCreateItem}
          onUpdate={handleOnUpdateItem}
        />
      </Modal>
      {/* end create/edit form modal */}
    </>
  );
};

Vehicles.propTypes = {
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

Vehicles.defaultProps = {
  vehicle: null,
  searchQuery: undefined,
};

export default Connect(Vehicles, {
  vehicles: 'vehicles.list',
  vehicle: 'vehicles.selected',
  loading: 'vehicles.loading',
  posting: 'vehicles.posting',
  page: 'vehicles.page',
  showForm: 'vehicles.showForm',
  total: 'vehicles.total',
  searchQuery: 'vehicles.q',
});
