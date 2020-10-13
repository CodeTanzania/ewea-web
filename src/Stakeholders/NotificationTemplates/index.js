import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';

import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import SettingForm from '../../components/SettingForm';
import { useList } from '../../hooks';

/* http Actions */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;
/* redux actions */
const { paginateNotificationTemplates } = reduxActions;

/* ui */
/* constants */
const nameSpan = { xxl: 6, xl: 6, lg: 6, md: 7, sm: 7, xs: 7 };
const descriptionSpan = { xxl: 12, xl: 12, lg: 12, md: 10, sm: 10, xs: 11 };
const codeSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 3, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...descriptionSpan, header: 'Description' },
  { ...codeSpan, header: 'Code' },
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
 * @name NotificationTemplates
 * @description Render notification templates list which have search box, actions and Notification template list
 * @param { object} props component properties object
 * @param {object[]} props.notificationTemplates List of notification templates from the API
 * @param {object} props.notificationTemplate Selected notification template from from the API
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Notification Templates list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const NotificationTemplates = ({
  notificationTemplates,
  notificationTemplate,
  loading,
  posting,
  page,
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
  } = useList('notificationTemplates');

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for notification templates here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Template',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Notification Template',
          onClick: handleOnOpenForm,
        }}
      />
      {/* end Topbar */}

      {/* list starts */}
      <ItemList
        itemName="notification template"
        items={notificationTemplates}
        page={page}
        itemCount={total}
        loading={loading}
        // onFilter={this.openFiltersModal}
        // onNotify={this.openNotificationForm}
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onRefresh={handleOnRefreshList}
        onPaginate={(nextPage) => paginateNotificationTemplates(nextPage)}
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
            avatarBackgroundColor={get(item, 'strings.color')}
            isSelected={isSelected}
            onSelectItem={onSelectItem}
            onDeselectItem={onDeselectItem}
            title={
              <span className="text-sm">
                {get(item, 'strings.name.en', 'N/A')}
              </span>
            }
            secondaryText={
              <span className="text-xs">
                {get(item, 'strings.description.en', 'N/A')}
              </span>
            }
            actions={[
              {
                name: 'Edit Notification Template',
                title: 'Update Notification Template Details',
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Share Notification Template',
                title: 'Share Notification Template details with others',
                onClick: () => handleOnShare(item, FIELDS_TO_SHARE),
                icon: 'share',
              },
              {
                name: 'Archive Notification Template',
                title:
                  'Remove Notification Template from list of active notification templates',
                onClick: () => handleOnArchiveItem(item),
                icon: 'archive',
              },
            ]}
          >
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Col {...nameSpan}>{item.strings.name.en}</Col>
            <Col {...descriptionSpan}>{item.strings.description.en}</Col>
            <Col {...codeSpan}>{item.strings.code}</Col>
            {/* eslint-enable react/jsx-props-no-spreading */}
          </ListItem>
        )}
      />
      {/* end list */}

      {/* Notification Modal modal */}
      <Modal
        title="Notify Notification Template"
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
          isEditForm
            ? 'Edit Notification Template'
            : 'Add New Notification Template'
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
          setting={notificationTemplate}
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

NotificationTemplates.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  notificationTemplates: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  notificationTemplate: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

NotificationTemplates.defaultProps = {
  notificationTemplate: null,
  searchQuery: undefined,
};

export default Connect(NotificationTemplates, {
  notificationTemplates: 'notificationTemplates.list',
  notificationTemplate: 'notificationTemplates.selected',
  loading: 'notificationTemplates.loading',
  posting: 'notificationTemplates.posting',
  page: 'notificationTemplates.page',
  showForm: 'notificationTemplates.showForm',
  total: 'notificationTemplates.total',
  searchQuery: 'notificationTemplates.q',
});
