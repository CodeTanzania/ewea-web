import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import SettingForm from '../../components/SettingForm';
import NotificationForm from '../../components/NotificationForm';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import { notifyError, notifySuccess, truncateString } from '../../util';

/* http actions */
const {
  getPartyGroupsExportUrl,
  getFocalPeople,
  getJurisdictions,
  getRoles,
  getAgencies,
} = httpActions;
/* redux actions */
const {
  getPartyGroups,
  openPartyGroupForm,
  searchPartyGroups,
  selectPartyGroup,
  closePartyGroupForm,
  refreshPartyGroups,
  paginatePartyGroups,
  deletePartyGroup,
  postPartyGroup,
  putPartyGroup,
} = reduxActions;

/* ui */
const { confirm } = Modal;
/* constants */
const nameSpan = { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6, xs: 14 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 4 };
const descriptionSpan = { xxl: 15, xl: 15, lg: 15, md: 14, sm: 9, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...codeSpan, header: 'Code' },
  { ...descriptionSpan, header: 'Description' },
];

/**
 * @class
 * @name PartyGroups
 * @description Render Stakeholder Groups list which have search box,
 * actions and party groups list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class PartyGroups extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    notificationBody: undefined,
    showNotificationForm: false,
  };

  componentDidMount() {
    getPartyGroups();
  }

  /**
   * @function
   * @name openPartyGroupsForm
   * @description Open party group form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openPartyGroupsForm = () => {
    openPartyGroupForm();
  };

  /**
   * @function
   * @name closePartyGroupsForm
   * @description close party group form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closePartyGroupsForm = () => {
    closePartyGroupForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchPartyGroups
   * @description Search Stakeholder Groups List based on supplied filter word
   *
   * @param {object} party Party instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchPartyGroups = (party) => {
    searchPartyGroups(party.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} partyType party group to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (partyType) => {
    selectPartyGroup(partyType);
    this.setState({ isEditForm: true });
    openPartyGroupForm();
  };

  /**
   * @function
   * @name handleAfterCloseForm
   * @description Perform post close form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseForm = () => {
    selectPartyGroup(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify party groups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
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
   * @name handleShare
   * @description Handle share multiple party groups
   *
   * @param {object[]| object} partyGroups party groups list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (partyGroups) => {
    let message = '';
    if (isArray(partyGroups)) {
      const partyGroupsList = partyGroups.map(
        (partyGroup) =>
          `Name: ${partyGroup.strings.name.en}\nDescription: ${
            // eslint-disable-line
            partyGroup.strings.description.en
          }\n`
      );

      message = partyGroupsList.join('\n\n\n');
    } else {
      message = `Name: ${partyGroups.strings.name.en}\nDescription: ${
        // eslint-disable-line
        partyGroups.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name handleRefreshPartyGroups
   * @description Refresh Stakeholder Groups list
   *
   * @returns {undefined}
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshPartyGroups = () =>
    refreshPartyGroups(
      () => notifySuccess('Stakeholder groups refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Stakeholder groups, please contact system administrator'
        )
    );

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a party group
   * @param {object} item Resource item to be archived
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  showArchiveConfirm = (item) => {
    confirm({
      title: `Are you sure you want to archive this record ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deletePartyGroup(
          item._id, // eslint-disable-line
          () => notifySuccess('Stakeholder group was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Stakeholder group, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      partyGroups,
      loading,
      page,
      posting,
      partyGroup,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { isEditForm, notificationBody, showNotificationForm } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for stakeholder groups here ...',
            onChange: this.searchPartyGroups,
            value: searchQuery,
          }}
          action={{
            label: 'New Stakeholder Group',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Stakeholder Group',
            onClick: this.openPartyGroupsForm,
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
          onShare={this.handleShare}
          onRefresh={this.handleRefreshPartyGroups}
          generateExportUrl={getPartyGroupsExportUrl}
          onPaginate={(nextPage) => paginatePartyGroups(nextPage)}
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
                  onClick: () => this.handleEdit(item),
                  icon: 'edit',
                },
                {
                  name: 'Share Stakeholder Group',
                  title: 'Share Stakeholder Group details with others',
                  onClick: () => this.handleShare(item),
                  icon: 'share',
                },
                {
                  name: 'Archive Stakeholder Group',
                  title:
                    'Remove Stakeholder Group from list of active focal people',
                  onClick: () => this.showArchiveConfirm(item),
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
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
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
          onCancel={this.closePartyGroupsForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <SettingForm
            setting={partyGroup}
            posting={posting}
            onCancel={this.closePartyGroupsForm}
            onCreate={postPartyGroup}
            onUpdate={putPartyGroup}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

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
