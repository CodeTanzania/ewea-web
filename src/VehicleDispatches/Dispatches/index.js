import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col, Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import get from 'lodash/get';

import NotificationForm from '../../components/NotificationForm';
import FilterForm from './Filters';
import Topbar from '../../components/Topbar';
import DispatchForm from './Form';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import VehicleDispatchViewHeader from './DetailsView/Header';
import VehicleDispatchViewBody from './DetailsView/Body';
import { notifyError, notifySuccess } from '../../util';
import { useList } from '../../hooks';

/* http actions */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getDispatchesExportUrl,
} = httpActions;
/* redux actions */
const { paginateDispatches, putDispatch } = reduxActions;

/* ui */
const { confirm } = Modal;
/* constants */
const numberSpan = { xxl: 3, xl: 3, lg: 4, md: 4, sm: 10, xs: 10 };
const vehicleSpan = { xxl: 4, xl: 4, lg: 5, md: 6, sm: 0, xs: 0 };
const eventSpan = { xxl: 5, xl: 5, lg: 5, md: 5, sm: 9, xs: 8 };
const prioritySpan = { xxl: 2, xl: 2, lg: 3, md: 0, sm: 0, xs: 0 };
const statusSpan = { xxl: 2, xl: 2, lg: 3, md: 3, sm: 0, xs: 0 };
const pickupSpan = { xxl: 3, xl: 3, lg: 1, md: 1, sm: 0, xs: 0 };
const dropOffSpan = { xxl: 3, xl: 3, lg: 1, md: 1, sm: 0, xs: 0 };
const headerLayout = [
  { ...numberSpan, header: 'Dispatch No.' },
  { ...vehicleSpan, header: 'Vehicle' },
  { ...eventSpan, header: 'Diagnosis / Event' },
  { ...pickupSpan, header: 'Pickup Location' },
  { ...dropOffSpan, header: 'Drop-Off Location' },
  { ...prioritySpan, header: 'Priority' },
  { ...statusSpan, header: 'Status' },
];
const FIELDS_TO_SHARE = {
  number: { header: 'Number', dataIndex: 'number', defaultValue: 'N/A' },
  dispatcher: {
    header: 'Dispatcher',
    dataIndex: (item) => get(item, 'dispatcher.party.name', 'N/A'),
  },
  createdAt: {
    header: 'Requested Date',
    dataIndex: (item) => moment(item.createdAt, 'YYYY-MM-DD HH:mm:ss'),
  },
};

/**
 * @function
 * @name VehicleDispatches
 * @description Render dispatch list which have search box, actions and
 * dispatch list
 * @param { object} props component properties object
 * @param {object[]} props.dispatches List of vehicle dispatches from the API
 * @param {object} props.focalPerson Selected vehicle dispatch
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Vehicle Dispatches list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const VehicleDispatches = ({
  dispatches,
  selectedDispatch,
  loading,
  posting,
  page,
  showForm,
  searchQuery,
  total,
}) => {
  const {
    cachedValues,
    showFilters,
    isEditForm,
    showNotificationForm,
    notificationSubject,
    notificationBody,
    showView,

    handleOnCacheValues,
    handleOnClearCachedValues,
    handleOnOpenFiltersModal,
    handleOnCloseFiltersModal,
    handleOnOpenForm,
    handleOnCloseForm,
    handleOnSearch,
    handleOnEdit,
    handleOnView,
    handleOnCloseView,
    handleOnCloseNotificationForm,
    handleAfterCloseForm,
    handleAfterCloseNotificationForm,
    handleOnRefreshList,
    handleOnArchiveItem,
    handleOnCreateItem,
    handleOnUpdateItem,
    handleOnShare,
  } = useList('dispatches', { wellknown: 'vehicleDispatches' });
  const [openFormInStep, setOpenFormInStep] = useState(0);

  /**
   * @function
   * @name handleDispatch
   * @description Show confirmation modal window based on dispatch action
   * it can be complete, cancel, atPickup, atDropOff, fromPickup, fromDropOff
   * @param {object} dispatch Dispatch to be marked as dispatched
   * @param {string} action Dispatch action
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnDispatch = (dispatch, action) => {
    let data = {
      _id: dispatch._id, // eslint-disable-line
    };
    let confirmMessage;

    // prevent further actions on dispatch when vehicle is not set
    if (!get(dispatch, 'carrier.vehicle') && action !== 'cancel') {
      setOpenFormInStep(4);
      handleOnEdit(dispatch);
      return;
    }

    if (action === 'dispatch') {
      confirmMessage = 'Are you sure you want to dispatch this';
      data = { ...data, dispatchedAt: new Date() };
    } else if (action === 'atPickup') {
      confirmMessage =
        'Are you sure you want to mark vehicle is at pickup location';
      data = {
        ...data,
        pickup: {
          arrivedAt: new Date(),
        },
      };
    } else if (action === 'fromPickup') {
      confirmMessage =
        'Are you sure you want to mark vehicle is leaving pickup location';
      data = { ...data, pickup: { dispatchedAt: new Date() } };
    } else if (action === 'atDropOff') {
      confirmMessage =
        'Are you sure you want to mark vehicle is at drop off location';
      data = { ...data, dropoff: { arrivedAt: new Date() } };
    } else if (action === 'fromDropOff') {
      confirmMessage =
        'Are you sure you want to mark vehicle is leaving drop off location';
      data = { ...data, dropoff: { dispatchedAt: new Date() } };
    } else if (action === 'complete') {
      confirmMessage = 'Are you sure you want to complete this dispatch';
      data = { ...data, resolvedAt: new Date() };
    } else if (action === 'cancel') {
      confirmMessage = 'Are you sure you want to cancel this dispatch';
      data = { ...data, canceledAt: new Date() };
    }

    confirm({
      title: `${confirmMessage}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        return new Promise((resolve, reject) => {
          putDispatch(
            data, // eslint-disable-line
            () => {
              resolve();
              notifySuccess('Vehicle Dispatch was updated successfully');
            },
            () => {
              reject();
              notifyError(
                'An error occurred while updating dispatch, Please contact your system Administrator'
              );
            }
          );
        });
      },
    });
  };

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for vehicle dispatches here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Dispatch',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Vehicle Dispatch',
          onClick: handleOnOpenForm,
        }}
      />
      {/* end Topbar */}

      {/* list starts */}
      <ItemList
        itemName="vehicle dispatches"
        items={dispatches}
        page={page}
        itemCount={total}
        loading={loading}
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onFilter={handleOnOpenFiltersModal}
        onRefresh={handleOnRefreshList}
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
            name={get(item, 'type.strings.name.en', 'A')}
            avatarBackgroundColor={get(item, 'type.strings.color', '#d16666')}
            item={item}
            isSelected={isSelected}
            onSelectItem={onSelectItem}
            onDeselectItem={onDeselectItem}
            title={
              <Row>
                <Col span={14}>
                  <span className="text-sm">{item.number}</span>
                </Col>
                <Col span={9}>
                  <span className="text-xs">
                    {get(item, 'type.strings.name.en', 'N/A')}
                  </span>
                </Col>
              </Row>
            }
            secondaryText={
              <span className="text-xs">{`${get(
                item,
                'carrier.vehicle.strings.name.en',
                'N/A'
              )} - ${get(
                item,
                'carrier.vehicle.relations.type.strings.name.en',
                'N/A'
              )}`}</span>
            }
            actions={[
              {
                name: 'View Dispatch',
                title: 'View Vehicle Dispatch Details',
                onClick: () => handleOnView(item),
                icon: 'view',
              },
              {
                name: 'Edit Dispatch',
                title: 'Update Vehicle Dispatch Details',
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Dispatch Vehicle',
                title: 'Mark dispatch as dispatched',
                onClick: () => handleOnDispatch(item, 'dispatch'),
                icon: 'vehicle',
              },
              {
                name: 'Vehicle At Pickup',
                title: 'Mark vehicle is at pickup location',
                onClick: () => handleOnDispatch(item, 'atPickup'),
                icon: 'vehicle',
              },
              {
                name: 'Vehicle From Pickup',
                title: 'Mark vehicle is leaving pickup location',
                onClick: () => handleOnDispatch(item, 'fromPickup'),
                icon: 'vehicle',
              },
              {
                name: 'Vehicle At Dropoff',
                title: 'Mark vehicle is at drop off location',
                onClick: () => handleOnDispatch(item, 'atDropOff'),
                icon: 'vehicle',
              },
              {
                name: 'Vehicle From Dropoff',
                title: 'Mark vehicle is leaving drop off location',
                onClick: () => handleOnDispatch(item, 'fromDropOff'),
                icon: 'vehicle',
              },
              {
                name: 'Complete Dispatch',
                title: 'Mark dispatch as complete',
                onClick: () => handleOnDispatch(item, 'complete'),
                icon: 'complete',
              },
              {
                name: 'Cancel Dispatch',
                title: 'Cancel dispatch',
                onClick: () => handleOnDispatch(item, 'cancel'),
                icon: 'cancel',
              },
              {
                name: 'Archive Dispatch',
                title:
                  'Remove vehicle dispatch from list of active vehicle dispatches',
                onClick: () => handleOnArchiveItem(item),
                icon: 'archive',
              },
            ]}
          >
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Col {...numberSpan}>
              <Button
                type="link"
                onClick={() => handleOnView(item)}
                style={{
                  padding: 0,
                  color: 'rgba(0, 0, 0, 0.65)',
                  whiteSpace: 'normal',
                  textAlign: 'left',
                  wordWrap: 'break-word',
                }}
              >
                {item.number}
              </Button>
            </Col>
            <Col
              {...vehicleSpan}
              title={get(item, 'role.strings.name.en', 'N/A')}
            >
              {`${get(item, 'carrier.vehicle.strings.name.en', 'N/A')} - ${get(
                item,
                'carrier.vehicle.relations.type.strings.name.en',
                'N/A'
              )}`}
            </Col>
            <Col {...eventSpan}>{get(item, 'type.strings.name.en', 'N/A')}</Col>

            <Col {...pickupSpan}>
              {get(item, 'pickup.facility.strings.name.en', 'N/A')}
            </Col>
            <Col {...dropOffSpan}>
              {get(item, 'dropoff.facility.strings.name.en', 'N/A')}
            </Col>
            <Col {...prioritySpan}>
              {get(item, 'priority.strings.name.en', 'N/A')}
            </Col>
            <Col {...statusSpan}>{`${get(
              item,
              'status.strings.name.en',
              'N/A'
            )}`}</Col>
            {/* eslint-enable react/jsx-props-no-spreading */}
          </ListItem>
        )}
      />
      {/* end list */}

      {/* Notification Modal modal */}
      <Modal
        title="Notify Vehicle Dispatches"
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
          subject={notificationSubject}
          body={notificationBody}
          onCancel={handleOnCloseNotificationForm}
        />
      </Modal>
      {/* end Notification modal */}

      {/* Filters modal */}
      <Modal
        title="Filter Dispatches"
        visible={showFilters}
        width="80%"
        footer={null}
        onCancel={handleOnCloseFiltersModal}
        destroyOnClose
        maskClosable={false}
      >
        <FilterForm
          cached={cachedValues}
          onCache={handleOnCacheValues}
          onCancel={handleOnCloseFiltersModal}
          onClearCache={handleOnClearCachedValues}
        />
      </Modal>
      {/* Filters modal */}

      {/* create/edit form modal */}
      <Modal
        title={
          isEditForm ? 'Edit Vehicle Dispatch' : 'Add New Vehicle Dispatch'
        }
        visible={showForm}
        width="90%"
        footer={null}
        onCancel={handleOnCloseForm}
        destroyOnClose
        maskClosable={false}
        afterClose={handleAfterCloseForm}
      >
        <DispatchForm
          posting={posting}
          isEditForm={isEditForm}
          dispatch={selectedDispatch}
          onCancel={handleOnCloseForm}
          openInStep={openFormInStep}
          onCreate={handleOnCreateItem}
          onUpdate={handleOnUpdateItem}
        />
      </Modal>
      {/* end create/edit form modal */}

      {/* start: case details view */}
      <Drawer
        title={
          <VehicleDispatchViewHeader
            dispatchNo={get(selectedDispatch, 'number')}
            event={get(selectedDispatch, 'type.strings.name.en', 'N/A')}
            onBack={handleOnCloseView}
          />
        }
        placement="right"
        width="100%"
        drawerStyle={{ overflow: 'hidden' }}
        headerStyle={{ padding: 0 }}
        bodyStyle={{ overflow: 'hidden', height: '100%', padding: '15px' }}
        visible={showView}
        onClose={handleOnCloseView}
        destroyOnClose
      >
        <VehicleDispatchViewBody dispatch={selectedDispatch} />
      </Drawer>
      {/* end: case details view */}
    </>
  );
};

VehicleDispatches.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  dispatches: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  selectedDispatch: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

VehicleDispatches.defaultProps = {
  selectedDispatch: null,
  searchQuery: undefined,
};

export default Connect(VehicleDispatches, {
  dispatches: 'dispatches.list',
  selectedDispatch: 'dispatches.selected',
  loading: 'dispatches.loading',
  posting: 'dispatches.posting',
  page: 'dispatches.page',
  showForm: 'dispatches.showForm',
  total: 'dispatches.total',
  searchQuery: 'dispatches.q',
});
