import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';

import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import FocalPersonFilters from './Filters';
import StakeholderForm from '../../components/StakeholderForm';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import { useList } from '../../hooks';
import { shareDetailsFor } from '../../util';

/* http actions */
const {
  getFocalPeople: getFocalPeopleFromAPI,
  getAdministrativeAreas,
  getPartyGroups,
  getPartyRoles,
  getAgencies,
  getFocalPeopleExportUrl,
} = httpActions;

/* constants */
const nameSpan = { xxl: 3, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const roleSpan = { xxl: 6, xl: 5, lg: 5, md: 0, sm: 0, xs: 0 };
const phoneSpan = { xxl: 4, xl: 5, lg: 5, md: 4, sm: 9, xs: 8 };
const emailSpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const areaSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...roleSpan, header: 'Title & Organization' },
  { ...phoneSpan, header: 'Phone Number' },
  { ...emailSpan, header: 'Email' },
  { ...areaSpan, header: 'Area' },
];
const FIELDS_TO_SHARE = {
  name: { header: 'Name', dataIndex: 'name', defaultValue: 'N/A' },
  role: {
    header: 'Title',
    dataIndex: (item) =>
      `${get(item, 'role.strings.name.en', 'N/A')} (${get(
        item,
        'party.abbreviation',
        'N/A'
      )})`,
    defaultValue: 'N/A',
  },
  mobile: { header: 'Mobile', dataIndex: 'mobile', defaultValue: 'N/A' },
  email: { header: 'Email', dataIndex: 'email', defaultValue: 'N/A' },
};

/* messages */
const SHARE_FOCAL_PERSON_SUBJECT = 'Contact Details for Focal People';

/**
 * @function
 * @name FocalPeople
 * @description Render focalPerson list which have search box, actions
 * and focalPerson list
 * @param { object} props component properties object
 * @param {object[]} props.focalPeople List of focal people from the API
 * @param {object} props.focalPerson Selected focal person from from the API
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Focal people list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const FocalPeople = ({
  focalPeople,
  focalPerson,
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
  } = useList('focalPeople');

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for focal people here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Person',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Focal Person',
          onClick: handleOnOpenForm,
        }}
      />
      {/* end Topbar */}

      {/* list starts */}
      <ItemList
        itemName="focal people"
        items={focalPeople}
        page={page}
        itemCount={total}
        loading={loading}
        onFilter={handleOnOpenFiltersModal}
        onNotify={handleOnOpenNotificationForm}
        onShare={(items) =>
          handleOnShare(items, FIELDS_TO_SHARE, SHARE_FOCAL_PERSON_SUBJECT)
        }
        onRefresh={handleOnRefreshList}
        onPaginate={handleOnPaginate}
        generateExportUrl={getFocalPeopleExportUrl}
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
            title={
              <Row>
                <Col span={15}>
                  <span className="text-sm">{item.name}</span>
                </Col>
                <Col span={6}>
                  <span className="text-xs">{item.mobile}</span>
                </Col>
              </Row>
            }
            secondaryText={
              <span className="text-xs">
                {`${get(item, 'role.strings.name.en', 'N/A')}, ${get(
                  item,
                  'party.abbreviation',
                  'N/A'
                )}`}
              </span>
            }
            isSelected={isSelected}
            onSelectItem={onSelectItem}
            onDeselectItem={onDeselectItem}
            actions={[
              {
                name: 'Edit Focal Person',
                title: 'Update Focal Person Details',
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Share Focal Person',
                title: 'Share Focal Person details with others',
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
                name: 'Archive Focal Person',
                title: 'Remove focal person from list of active focal people',
                onClick: () => handleOnArchiveItem(item),
                icon: 'archive',
              },
            ]}
          >
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Col {...nameSpan}>{item.name}</Col>
            <Col {...roleSpan} title={get(item, 'role.strings.name.en', 'N/A')}>
              {`${get(item, 'role.strings.name.en', 'N/A')}, ${get(
                item,
                'party.abbreviation',
                'N/A'
              )}`}
            </Col>
            <Col {...phoneSpan}>{item.mobile}</Col>
            <Col {...emailSpan}>{item.email}</Col>
            <Col {...areaSpan}>{get(item, 'area.strings.name.en', 'N/A')}</Col>
            {/* eslint-enable react/jsx-props-no-spreading */}
          </ListItem>
        )}
      />
      {/* end list */}

      {/* filter modal */}
      <Modal
        title="Filter Focal People"
        visible={showFilters}
        onCancel={handleOnCloseFiltersModal}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="modal-window-50"
      >
        <FocalPersonFilters
          onCancel={handleOnCloseFiltersModal}
          cached={cachedValues}
          onCache={handleOnCacheValues}
          onClearCache={handleOnClearCachedValues}
        />
      </Modal>
      {/* end filter modal */}

      {/* Notification Modal modal */}
      <Modal
        title="Notify Focal People"
        visible={showNotificationForm}
        onCancel={handleOnCloseNotificationForm}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="modal-window-50"
        afterClose={handleAfterCloseNotificationForm}
      >
        <NotificationForm
          recipients={selectedItems}
          onSearchRecipients={getFocalPeopleFromAPI}
          onSearchJurisdictions={getAdministrativeAreas}
          onSearchGroups={getPartyGroups}
          onSearchAgencies={getAgencies}
          onSearchRoles={getPartyRoles}
          subject={notificationSubject}
          body={notificationBody}
          onCancel={handleOnCloseNotificationForm}
        />
      </Modal>
      {/* end Notification modal */}

      {/* create/edit form modal */}
      <Modal
        title={isEditForm ? 'Edit Focal Person' : 'Add New Focal Person'}
        visible={showForm}
        className="modal-window-80"
        footer={null}
        onCancel={handleOnCloseForm}
        destroyOnClose
        maskClosable={false}
        afterClose={handleAfterCloseForm}
      >
        <StakeholderForm
          stakeholder={focalPerson}
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

FocalPeople.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  focalPeople: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  focalPerson: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

FocalPeople.defaultProps = {
  focalPerson: null,
  searchQuery: undefined,
};

export default Connect(FocalPeople, {
  focalPeople: 'focalPeople.list',
  focalPerson: 'focalPeople.selected',
  loading: 'focalPeople.loading',
  posting: 'focalPeople.posting',
  page: 'focalPeople.page',
  showForm: 'focalPeople.showForm',
  total: 'focalPeople.total',
  searchQuery: 'focalPeople.q',
});
