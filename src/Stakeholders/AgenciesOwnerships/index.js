import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';

import Topbar from '../../components/Topbar';
import PartyOwnershipForm from './Form';
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
  getPartyOwnershipsExportUrl,
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
 * @name AgencyOwnership
 * @description Render Party(Agency) Ownership types list which have search box,
 * @param { object} props component properties object
 * @param {object[]} props.agencies List of party ownerships from the API
 * @param {object} props.agency Selected party ownership  from from the API
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * @param props.partyOwnerships
 * @param props.partyOwnership
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Agencies ownerships list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const AgencyOwnership = ({
  partyOwnerships,
  loading,
  page,
  posting,
  partyOwnership,
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
  } = useList('partyOwnerships', { wellknown: 'agencyOwnership' });

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for agencies ownerships here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Ownership',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Agency Ownership',
          onClick: handleOnOpenForm,
        }}
      />
      {/* end Topbar */}

      {/* list starts */}
      <ItemList
        itemName="Agency Ownership"
        items={partyOwnerships}
        page={page}
        itemCount={total}
        loading={loading}
        // onFilter={this.openFiltersModal}
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onRefresh={handleOnRefreshList}
        onPaginate={handleOnPaginate}
        generateExportUrl={getPartyOwnershipsExportUrl}
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
                {truncateString(get(item, 'strings.name.en', 'N/A'), 45)}
              </span>
            }
            secondaryText={
              <span className="text-xs">
                {get(item, 'strings.code', 'N/A')}
              </span>
            }
            actions={[
              {
                name: 'Edit Agency Ownership',
                title: 'Update Agency Ownership Details',
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Share Agency Ownership',
                title: 'Share Agency Ownerships details with others',
                onClick: () => handleOnShare(item),
                icon: 'share',
              },
              {
                name: 'Archive Agency Ownership',
                title: 'Remove Agency Ownership from list of active agencies',
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

      {/* Agency Ownership modal */}
      <Modal
        title="Notify Agency Ownership"
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
      {/* end Agency Ownership modal */}

      {/* create/edit form modal */}
      <Modal
        title={
          isEditForm ? 'Edit Agency Ownership' : 'Add New Agency Ownership'
        }
        visible={showForm}
        className="modal-window-50"
        footer={null}
        onCancel={handleOnCloseForm}
        afterClose={handleAfterCloseForm}
        maskClosable={false}
        destroyOnClose
      >
        <PartyOwnershipForm
          partyOwnership={partyOwnership}
          posting={posting}
          isEditForm={isEditForm}
          onCancel={handleOnCloseForm}
          onCreate={handleOnCreateItem}
          onUpdate={handleOnUpdateItem}
        />
      </Modal>
      {/* end create/edit form modal */}
    </>
  );
};

AgencyOwnership.propTypes = {
  loading: PropTypes.bool.isRequired,
  partyOwnerships: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  partyOwnership: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

AgencyOwnership.defaultProps = {
  partyOwnership: null,
  searchQuery: undefined,
};

export default Connect(AgencyOwnership, {
  partyOwnerships: 'partyOwnerships.list',
  partyOwnership: 'partyOwnerships.selected',
  loading: 'partyOwnerships.loading',
  posting: 'partyOwnerships.posting',
  page: 'partyOwnerships.page',
  showForm: 'partyOwnerships.showForm',
  total: 'partyOwnerships.total',
  searchQuery: 'partyOwnerships.q',
});
