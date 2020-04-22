import { httpActions } from '@codetanzania/ewea-api-client';
import {
  Connect,
  getPartyRoles,
  openPartyRoleForm,
  selectPartyRole,
  closePartyRoleForm,
  refreshPartyRoles,
  paginatePartyRoles,
  deletePartyRole,
} from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isArray from 'lodash/isArray';
import Topbar from '../../components/Topbar';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess } from '../../util';
import RoleForm from './Form';
import './styles.css';

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

const {
  getPartyRolesExportUrl,
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getPartyRoles: getPartyRolesFromAPI,
  getAgencies,
} = httpActions;

const { confirm } = Modal;

/**
 * @class
 * @name Roles
 * @description Render role module which has search box, actions and list of roles
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Roles extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
  };

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    getPartyRoles();
  }

  /**
   * @function
   * @name openPartyRolesForm
   * @description Open role form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openPartyRolesForm = () => {
    openPartyRoleForm();
  };

  /**
   * @function
   * @name closePartyRolesForm
   * @description close role form
   *
   * @returns {undefined} - Nothing is returned
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closePartyRolesForm = () => {
    closePartyRoleForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchRoles
   * @description Search Roles List based on supplied filter word
   *
   * @param {object} event Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchRoles = (event) => {
    getPartyRoles({ q: event.target.value });
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} role - role to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (role) => {
    selectPartyRole(role);
    this.setState({ isEditForm: true });
    openPartyRoleForm();
  };

  /**
   * @function
   * @name openNotificationForm
   * @description Handle open on notify contacts
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = () => {
    this.setState({
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle close on notify contacts
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  /**
   * @function
   * @name handleAfterCloseForm
   * @description Performs after close form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseForm = () => {
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleAfterCloseNotificationForm
   * @description Perform post close notification form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseNotificationForm = () => {
    this.setState({ notificationBody: undefined });
  };

  /**
   * @function
   * @name handleRefreshRoles
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshRoles = () => {
    refreshPartyRoles(
      () => {
        notifySuccess('Roles refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing roles please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple partyroles
   *
   * @param {object[]| object} partyroles partyroles list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (partyroles) => {
    let message = '';
    if (isArray(partyroles)) {
      const partyroleList = partyroles.map(
        (partyrole) =>
          `Name: ${partyrole.strings.name.en}\nDescription: ${
            // eslint-disable-line
            partyrole.strings.description.en
          }\n`
      );

      message = partyroleList.join('\n\n\n');
    } else {
      message = `Name: ${partyroles.strings.name.en}\nDescription: ${
        // eslint-disable-line
        partyroles.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a role
   *
   * @param item {object} role to archive
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
        deletePartyRole(
          item._id, // eslint-disable-line
          () => notifySuccess('Role was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving role, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      roles,
      loading,
      showForm,
      posting,
      page,
      total,
      role,
      searchQuery,
    } = this.props;
    const { isEditForm, showNotificationForm, notificationBody } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for roles here ...',
            onChange: this.searchRoles,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Role',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Role',
              onClick: this.openPartyRolesForm,
            },
          ]}
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
          onNotify={this.openNotificationForm}
          generateExportUrl={getPartyRolesExportUrl}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshRoles}
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
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit role',
                    title: 'Update role Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share role',
                    title: 'Share role details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive role',
                    title: 'Remove role from list of active role',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
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
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          width="40%"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            // recipients={getFocalPeople}
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getPartyRolesFromAPI}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Notification modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Role' : 'Add New Role'}
          visible={showForm}
          footer={null}
          onCancel={this.closePartyRolesForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <RoleForm
            posting={posting}
            isEditForm={isEditForm}
            role={role}
            onCancel={this.closePartyRolesForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

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
