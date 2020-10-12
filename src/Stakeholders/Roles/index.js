import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined, KeyOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import NotificationForm from '../../components/NotificationForm';
import { truncateString } from '../../util';
import { useList } from '../../hooks';
import RoleForm from './Form';
import AssignPermissionForm from './AssignPermissionsForm';

/* http actions */
const {
  getPartyRolesExportUrl,
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getPartyRoles: getPartyRolesFromAPI,
  getAgencies,
} = httpActions;
/* redux actions */
const { selectPartyRole, paginatePartyRoles } = reduxActions;

/* constants */
const nameSpan = { xxl: 7, xl: 7, lg: 7, md: 7, sm: 16, xs: 15 };
const abbreviationSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 3, xs: 3 };
const descriptionSpan = { xxl: 11, xl: 11, lg: 11, md: 10, sm: 0, xs: 0 };
const headerLayout = [
  {
    ...nameSpan,
    header: 'Name',
    title: 'Roles name associated with focal people',
  },
  {
    ...abbreviationSpan,
    header: 'Abbreviation',
    title: 'A shortened form of roles',
  },
  {
    ...descriptionSpan,
    header: 'Description',
    title: 'Explanation of roles',
  },
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
 * @name Roles
 * @description Render role module which has search box, actions and list of roles
 * @param { object} props component properties object
 * @param {object[]} props.roles List of party roles from the API
 * @param {object} props.role Selected party role from from the API
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Party Roles list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const Roles = ({
  roles,
  role,
  loading,
  showForm,
  posting,
  page,
  total,
  searchQuery,
}) => {
  const [showAssignPermissionsForm, setShowAssignPermissionForm] = useState(
    false
  );
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
  } = useList('partyRoles', { wellknown: 'roles' });

  /**
   * @function
   * @name handleOnAssignPermissions
   * @description Open Modal window for assigning and revoking permissions
   * @param {object} item Active role to be used
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnAssignPermissions = (item) => {
    selectPartyRole(item);
    setShowAssignPermissionForm(true);
  };

  /**
   * @function
   * @name handleOnCloseAssignPermissionsForm
   * @description close Modal window for assigning and revoking permissions
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleOnCloseAssignPermissionsForm = () => {
    setShowAssignPermissionForm(false);
  };

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for roles here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Role',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Role',
          onClick: handleOnOpenForm,
        }}
      />
      {/* end Topbar */}

      {/* list starts */}
      <ItemList
        itemName="Roles"
        items={roles}
        page={page}
        itemCount={total}
        loading={loading}
        // onFilter={this.openFiltersModal}
        onNotify={handleOnOpenNotificationForm}
        generateExportUrl={getPartyRolesExportUrl}
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onRefresh={handleOnRefreshList}
        onPaginate={(nextPage) => paginatePartyRoles(nextPage)}
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
            avatarBackgroundColor={item.strings.color}
            isSelected={isSelected}
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
                name: 'Edit Stakeholder Role',
                title: 'Update Stakeholder Role Details',
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Update Permissions',
                title: 'Update Role Permissions',
                onClick: () => handleOnAssignPermissions(item),
                icon: <KeyOutlined />,
              },
              {
                name: 'Share Stakeholder Role',
                title: 'Share Stakeholder Role details with others',
                onClick: () => handleOnShare(item, FIELDS_TO_SHARE),
                icon: 'share',
              },
              {
                name: 'Archive Stakeholder Role',
                title:
                  'Remove Stakeholder Role from list of active focal people',
                onClick: () => handleOnArchiveItem(item),
                icon: 'archive',
              },
            ]}
          >
            {/* eslint-disable react/jsx-props-no-spreading */}
            <Col {...nameSpan}>{item.strings.name.en}</Col>
            <Col {...abbreviationSpan}>{item.strings.abbreviation.en}</Col>
            <Col {...descriptionSpan}>{item.strings.description.en}</Col>
            {/* eslint-enable react/jsx-props-no-spreading */}
          </ListItem>
        )}
      />
      {/* end list */}

      {/* Notification Modal modal */}
      <Modal
        title="Notify according to roles"
        visible={showNotificationForm}
        onCancel={handleOnCloseNotificationForm}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="modal-window-50"
        afterClose={handleAfterCloseNotificationForm}
      >
        <NotificationForm
          //
          onSearchRecipients={getFocalPeople}
          onSearchJurisdictions={getJurisdictions}
          onSearchGroups={getPartyGroups}
          onSearchAgencies={getAgencies}
          onSearchRoles={getPartyRolesFromAPI}
          body={notificationBody}
          onCancel={handleOnCloseNotificationForm}
        />
      </Modal>
      {/* end Notification modal */}

      {/* create/edit form modal */}
      <Modal
        className="modal-window-50"
        title={isEditForm ? 'Edit Role' : 'Add New Role'}
        visible={showForm}
        footer={null}
        onCancel={handleOnCloseForm}
        destroyOnClose
        maskClosable={false}
        afterClose={handleAfterCloseForm}
      >
        <RoleForm
          posting={posting}
          role={role}
          onCancel={handleOnCloseForm}
          onCreate={handleOnCreateItem}
          onUpdate={handleOnUpdateItem}
        />
      </Modal>
      {/* end create/edit form modal */}

      {/* create/edit form modal */}
      <Modal
        className="modal-window-80"
        title="Update Role's Permissions"
        visible={showAssignPermissionsForm}
        footer={null}
        onCancel={handleOnCloseAssignPermissionsForm}
        destroyOnClose
        maskClosable={false}
      >
        <AssignPermissionForm onCancel={handleOnCloseAssignPermissionsForm} />
      </Modal>
      {/* end create/edit form modal */}
    </>
  );
};

Roles.propTypes = {
  showForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  role: PropTypes.shape({
    name: PropTypes.string,
    abbreviation: PropTypes.string,
    description: PropTypes.string,
  }),
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      abbreviation: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
};

Roles.defaultProps = {
  role: null,
  searchQuery: undefined,
};

export default Connect(Roles, {
  roles: 'partyRoles.list',
  role: 'partyRoles.selected',
  showForm: 'partyRoles.showForm',
  posting: 'partyRoles.posting',
  loading: 'partyRoles.loading',
  page: 'partyRoles.page',
  total: 'partyRoles.total',
});
