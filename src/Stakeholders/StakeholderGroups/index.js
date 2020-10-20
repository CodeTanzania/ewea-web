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
import { truncateString } from '../../util';
import { useList } from '../../hooks';

/* http actions */
const {
  getPartyGroups,
  getPartyGroupsExportUrl,
  getFocalPeople,
  getJurisdictions,
  getRoles,
  getAgencies,
} = httpActions;

/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 4 };
const descriptionSpan = { xxl: 15, xl: 15, lg: 15, md: 14, sm: 9, xs: 0 };
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
 * @name PartyGroups
 * @description Render Stakeholder Groups list which have search box,
 * actions and party groups list
 * @param { object} props component properties object
 * @param {object[]} props.partyGroups List of partyGroup from the API
 * @param {object} props.partyGroup Selected partyGroup
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Party Occupations list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const PartyGroups = ({
  partyGroups,
  loading,
  page,
  posting,
  partyGroup,
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
  } = useList('partyGroups', { wellknown: 'stakeholderGroups' });

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for stakeholder groups here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Stakeholder Group',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Stakeholder Group',
          onClick: handleOnOpenForm,
        }}
      />
      {/* end Topbar */}

      <ItemList
        itemName="Stakeholder Groups"
        items={partyGroups}
        page={page}
        itemCount={total}
        loading={loading}
        // onFilter={this.openFiltersModal}
        // onNotify={this.openNotificationForm}
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onRefresh={handleOnRefreshList}
        generateExportUrl={getPartyGroupsExportUrl}
        onPaginate={handleOnPaginate}
        headerLayout={headerLayout}
        renderListItem={({
          item,
          isSelected,
          onSelectItem,
          onDeselectItem,
        }) => (
          <ListItem
            key={item._id} // eslint-disable-line
            name={item.strings.name.en}
            item={item}
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
                {get(item, 'strings.abbreviation.en', 'N/A')}
              </span>
            }
            actions={[
              {
                name: 'Edit Stakeholder Group',
                title: 'Update Stakeholder Group Details',
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Share Stakeholder Group',
                title: 'Share Stakeholder Group details with others',
                onClick: () => handleOnShare(item, FIELDS_TO_SHARE),
                icon: 'share',
              },
              {
                name: 'Archive Stakeholder Group',
                title:
                  'Remove Stakeholder Group from list of active focal people',
                onClick: () => handleOnArchiveItem(item),
                icon: 'archive',
              },
            ]}
          >
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Col {...nameSpan}>{item.strings.name.en}</Col>
            <Col {...codeSpan}>{item.strings.code}</Col>
            <Col {...descriptionSpan}>
              <span title={item.strings.description.en}>
                {truncateString(item.strings.description.en, 120)}
              </span>
            </Col>
            {/* eslint-enable react/jsx-props-no-spreading */}
          </ListItem>
        )}
      />

      {/* Notification Modal modal */}
      <Modal
        title="Notify Stakeholder Groups"
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
      {/* end Notification modal */}

      {/* create/edit form modal */}
      <Modal
        title={
          isEditForm ? 'Edit Stakeholder Group' : 'Add New Stakeholder Group'
        }
        visible={showForm}
        className="modal-window-50"
        footer={null}
        onCancel={handleOnCloseForm}
        destroyOnClose
        maskClosable={false}
        afterClose={handleAfterCloseForm}
      >
        <SettingForm
          setting={partyGroup}
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

PartyGroups.propTypes = {
  loading: PropTypes.bool.isRequired,
  partyGroups: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  partyGroup: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
  posting: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

PartyGroups.defaultProps = {
  partyGroup: null,
  searchQuery: undefined,
};

export default Connect(PartyGroups, {
  partyGroups: 'partyGroups.list',
  partyGroup: 'partyGroups.selected',
  loading: 'partyGroups.loading',
  posting: 'partyGroups.posting',
  page: 'partyGroups.page',
  showForm: 'partyGroups.showForm',
  total: 'partyGroups.total',
  searchQuery: 'partyGroups.q',
});
