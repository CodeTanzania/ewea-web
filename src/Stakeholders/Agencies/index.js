import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect } from '@codetanzania/ewea-api-states';
import { Row, Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';

import Topbar from '../../components/Topbar';
import StakeholderForm from '../../components/StakeholderForm';
import AgencyFilters from './Filters';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import NotificationForm from '../../components/NotificationForm';
import { useList } from '../../hooks';
import { shareDetailsFor } from '../../util';

/* http actions */
const {
  getAgencies: getAgenciesFromAPI,
  getAdministrativeAreas,
  getPartyGroups,
  getAgenciesExportUrl,
} = httpActions;

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 7, sm: 14, xs: 12 };
const abbreviationSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 0, xs: 0 };
const areaSpan = { xxl: 3, xl: 3, lg: 3, md: 0, sm: 0, xs: 0 };
const phoneSpan = { xxl: 3, xl: 3, lg: 3, md: 4, sm: 6, xs: 6 };
const callSignSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 0, xs: 0 };
const emailSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...abbreviationSpan, header: 'Abbreviation' },
  { ...phoneSpan, header: 'Phone Number' },
  { ...callSignSpan, header: 'Call Sign' },
  { ...emailSpan, header: 'Email' },
  { ...areaSpan, header: 'Area' },
];
const FIELDS_TO_SHARE = {
  name: {
    header: 'Name',
    dataIndex: (item) =>
      `${get(item, 'name', 'N/A')} (${get(item, 'abbreviation', 'N/A')})`,
    defaultValue: 'N/A',
  },
  mobile: { header: 'Mobile', dataIndex: 'mobile', defaultValue: 'N/A' },
  email: { header: 'Email', dataIndex: 'email', defaultValue: 'N/A' },
};

/**
 * @function
 * @name Agencies
 * @description Render focalPerson list which have search box, actions
 * and focalPerson list
 * @param { object} props component properties object
 * @param {object[]} props.agencies List of agencies from redux store
 * @param {object} props.agency Selected agency from redux store
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Agencies list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const Agencies = ({
  agencies,
  agency,
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
    selectedItems,
    notificationSubject,
    notificationBody,

    handleOnCacheValues,
    handleOnClearCachedValues,
    handleOnOpenFiltersModal,
    handleOnCloseFiltersModal,
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
    handleShareOnWhatsApp,
  } = useList('agencies');

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for agencies here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Agency',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Agency',
          onClick: handleOnOpenForm,
        }}
      />
      {/* end Topbar */}

      {/* list starts */}
      <ItemList
        itemName="Agencies"
        items={agencies}
        page={page}
        itemCount={total}
        loading={loading}
        onFilter={handleOnOpenFiltersModal}
        onNotify={handleOnOpenNotificationForm}
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onWhatsAppShare={(items) =>
          handleShareOnWhatsApp(items, FIELDS_TO_SHARE)
        }
        onRefresh={handleOnRefreshList}
        onPaginate={handleOnPaginate}
        headerLayout={headerLayout}
        generateExportUrl={getAgenciesExportUrl}
        renderListItem={({
          item,
          isSelected,
          onSelectItem,
          onDeselectItem,
        }) => (
          <ListItem
            key={item._id} // eslint-disable-line
            item={item}
            name={item.name}
            isSelected={isSelected}
            onSelectItem={onSelectItem}
            onDeselectItem={onDeselectItem}
            title={<span className="text-sm">{item.name}</span>}
            secondaryText={
              <Row>
                <Col span={16}>
                  <span className="text-xs">{item.abbreviation}</span>
                </Col>

                <Col span={6}>
                  <span className="text-xs">{item.mobile}</span>
                </Col>
              </Row>
            }
            actions={[
              {
                name: 'Edit Agency',
                title: 'Update Agency Details',
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Share Agency',
                title: 'Share Agency details with others',
                onClick: () => handleOnShare(item, FIELDS_TO_SHARE),
                icon: 'share',
              },
              {
                name: 'Share on WhatsApp',
                title: 'Share Contact on Whatsapp',
                link: `https://wa.me/?text=${encodeURI(
                  shareDetailsFor(item, FIELDS_TO_SHARE)
                )}`,
                icon: 'whatsapp',
              },
              {
                name: 'Archive Agency',
                title: 'Remove Agency from list of active agency',
                onClick: () => handleOnArchiveItem(item),
                icon: 'archive',
              },
            ]}
          >
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Col {...nameSpan}>{item.name}</Col>
            <Col {...abbreviationSpan}>{item.abbreviation}</Col>
            <Col {...phoneSpan}>{item.mobile}</Col>
            <Col {...callSignSpan}>{get(item, 'radio', 'N/A')}</Col>
            <Col {...emailSpan}>{item.email}</Col>
            <Col {...areaSpan}>{get(item, 'area.strings.name.en', 'N/A')}</Col>
            {/* eslint-enable react/jsx-props-no-spreading */}
          </ListItem>
        )}
      />
      {/* end list */}

      {/* Notification Modal modal */}
      <Modal
        title="Notify Agencies"
        visible={showNotificationForm}
        onCancel={handleOnCloseNotificationForm}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="modal-window-50"
        afterClose={handleAfterCloseNotificationForm}
      >
        <NotificationForm
          onSearchRecipients={getAgenciesFromAPI}
          onSearchJurisdictions={getAdministrativeAreas}
          onSearchGroups={getPartyGroups}
          onCancel={handleOnCloseNotificationForm}
          selectedAgencies={selectedItems}
          subject={notificationSubject}
          body={notificationBody}
        />
      </Modal>
      {/* end Notification modal */}

      {/* filter modal */}
      <Modal
        title="Filter Agency"
        visible={showFilters}
        onCancel={handleOnCloseFiltersModal}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="modal-window-50"
      >
        <AgencyFilters
          onCancel={handleOnCloseFiltersModal}
          cached={cachedValues}
          onCache={handleOnCacheValues}
          onClearCache={handleOnClearCachedValues}
        />
      </Modal>
      {/* end filter modal */}

      {/* create/edit form modal */}
      <Modal
        title={isEditForm ? 'Edit Agency' : 'Add New Agency'}
        visible={showForm}
        className="modal-window-80"
        footer={null}
        onCancel={handleOnCloseForm}
        destroyOnClose
        maskClosable={false}
        afterClose={handleAfterCloseForm}
      >
        <StakeholderForm
          isAgency
          stakeholder={agency}
          posting={posting}
          onCancel={handleOnCloseForm}
          onCreate={(data) => handleOnCreateItem(data)}
          onUpdate={(data) => handleOnUpdateItem(data)}
        />
      </Modal>
      {/* end create/edit form modal */}
    </>
  );
};

Agencies.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  agencies: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  agency: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

Agencies.defaultProps = {
  agency: null,
  searchQuery: undefined,
};

export default Connect(Agencies, {
  agencies: 'agencies.list',
  agency: 'agencies.selected',
  loading: 'agencies.loading',
  posting: 'agencies.posting',
  page: 'agencies.page',
  showForm: 'agencies.showForm',
  total: 'agencies.total',
  searchQuery: 'agencies.q',
});
