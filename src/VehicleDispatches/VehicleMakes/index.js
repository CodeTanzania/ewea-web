import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';

import Topbar from '../../components/Topbar';
import SettingForm from '../../components/SettingForm';
import NotificationForm from '../../components/NotificationForm';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import { useList } from '../../hooks';

/* http actions */
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
 * @name VehicleMakes
 * @description Render Party(Agency) Ownership types list which have search box,
 * @param { object} props component properties object
 * @param {object[]} props.focalPeople List of vehicle makes from the API
 * @param {object} props.focalPerson Selected vehicle make from from the API
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * @param props.vehicleMakes
 * @param props.vehicleMake
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Vehicle make list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleMakes = ({
  vehicleMakes,
  loading,
  page,
  posting,
  vehicleMake,
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
    handleOnCloseNotificationForm,
    handleAfterCloseForm,
    handleAfterCloseNotificationForm,
    handleOnRefreshList,
    handleOnArchiveItem,
    handleOnCreateItem,
    handleOnUpdateItem,
    handleOnShare,
    handleOnPaginate,
  } = useList('vehicleMakes');

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for vehicle makes here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Make',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Vehicle Make',
          onClick: handleOnOpenForm,
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
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onRefresh={handleOnRefreshList}
        onPaginate={handleOnPaginate}
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
            title={
              <span className="text-sm">
                {get(item, 'strings.name.en', 'N/A')}
              </span>
            }
            secondaryText={
              <span className="text-xs">
                {get(item, 'strings.code', 'N/A')}
              </span>
            }
            actions={[
              {
                name: 'Edit Vehicle Makes',
                title: 'Update Vehicle Makes Details',
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Share Vehicle Makes',
                title: 'Share Vehicle Makes details with others',
                onClick: () => handleOnShare(item, FIELDS_TO_SHARE),
                icon: 'share',
              },
              {
                name: 'Archive Vehicle Makes',
                title: 'Remove Vehicle Makes from list of active vehicle makes',
                onClick: () => handleOnArchiveItem(item),
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

      {/* Vehicle Make modal */}
      <Modal
        title="Notify Vehicle Make"
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
      {/* end Vehicle Make modal */}

      {/* create/edit form modal */}
      <Modal
        title={isEditForm ? 'Edit Vehicle Make' : 'Add New Vehicle Make'}
        visible={showForm}
        className="modal-window-50"
        footer={null}
        onCancel={handleOnCloseForm}
        afterClose={handleAfterCloseForm}
        maskClosable={false}
        destroyOnClose
      >
        <SettingForm
          setting={vehicleMake}
          posting={posting}
          onCancel={handleOnCloseForm}
          onCreate={handleOnCreateItem}
          onUpdate={handleOnUpdateItem}
        />
      </Modal>
      {/* end create/edit form modal */}
    </>
  );
};

VehicleMakes.propTypes = {
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

VehicleMakes.defaultProps = {
  vehicleMake: null,
  searchQuery: undefined,
};

export default Connect(VehicleMakes, {
  vehicleMakes: 'vehicleMakes.list',
  vehicleMake: 'vehicleMakes.selected',
  loading: 'vehicleMakes.loading',
  posting: 'vehicleMakes.posting',
  page: 'vehicleMakes.page',
  showForm: 'vehicleMakes.showForm',
  total: 'vehicleMakes.total',
  searchQuery: 'vehicleMakes.q',
});
