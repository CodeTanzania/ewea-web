import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import Topbar from '../../components/Topbar';
import PartyOwnershipForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess } from '../../util';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';

const {
  getPartyOwnerships,
  openPartyOwnershipForm,
  searchPartyOwnerships,
  selectPartyOwnership,
  closePartyOwnershipForm,
  paginatePartyOwnerships,
  refreshPartyOwnerships,
  deletePartyOwnership,
} = reduxActions;
const { confirm } = Modal;

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

/**
 * @class
 * @name PartyOwnership
 * @description Render Party(Agency) Ownership types list which have search box,
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class PartyOwnership extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
  };

  componentDidMount() {
    getPartyOwnerships();
  }

  /**
   * @function
   * @name openPartyOwnershipsForm
   * @description Open party ownership form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openPartyOwnershipsForm = () => {
    openPartyOwnershipForm();
  };

  /**
   * @function
   * @name closePartyOwnershipForm
   * @description close party ownership form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closePartyOwnershipForm = () => {
    closePartyOwnershipForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchPartyOwnerships
   * @description Search Agency Ownerships List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchPartyOwnerships = (event) => {
    searchPartyOwnerships(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} partyOwnership party ownership to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (partyOwnership) => {
    selectPartyOwnership(partyOwnership);
    this.setState({ isEditForm: true });
    openPartyOwnershipForm();
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
    selectPartyOwnership(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleRefreshPartyOwnership
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshPartyOwnership = () => {
    refreshPartyOwnerships(
      () => {
        notifySuccess('Agency Ownerships were refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Agency Ownerships please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a party ownership
   *
   * @param item {object} partyOwnership to archive
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
        deletePartyOwnership(
          item._id, // eslint-disable-line
          () => notifySuccess('Agency Ownership was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Agency Ownership, Please contact your system Administrator'
            )
        );
      },
    });
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Indicators
   *
   * @param {object[]| object} partyOwnerships event Indicators list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (partyOwnerships) => {
    let message = '';
    if (isArray(partyOwnerships)) {
      const partyOwnershipList = partyOwnerships.map(
        (partyOwnership) =>
          `Name: ${partyOwnership.strings.name.en}\nDescription: ${
            // eslint-disable-line
            partyOwnership.strings.description.en
          }\n`
      );

      message = partyOwnershipList.join('\n\n\n');
    } else {
      message = `Name: ${partyOwnerships.strings.name.en}\nDescription: ${
        // eslint-disable-line
        partyOwnerships.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify partyOwnerships
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationForm = () => {
    this.setState({ showNotificationForm: false });
  };

  render() {
    const {
      partyOwnerships,
      loading,
      page,
      posting,
      partyOwnership,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const { isEditForm, showNotificationForm, notificationBody } = this.state;

    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for ownerships here ...',
            onChange: this.searchPartyOwnerships,
            value: searchQuery,
          }}
          action={{
            label: 'New Ownership',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Agency Ownership',
            onClick: this.openPartyOwnershipsForm,
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
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshPartyOwnership}
          onPaginate={(nextPage) => paginatePartyOwnerships(nextPage)}
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
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Agency Ownership',
                    title: 'Update Agency Ownership Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Agency Ownership',
                    title: 'Share Agency Ownership details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Agency Ownership',
                    title:
                      'Remove Agency Ownership from list of active agency ownerships',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
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
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={getFocalPeople}
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
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
          onCancel={this.closePartyOwnershipForm}
          afterClose={this.handleAfterCloseForm}
          maskClosable={false}
          destroyOnClose
        >
          <PartyOwnershipForm
            posting={posting}
            isEditForm={isEditForm}
            partyOwnership={partyOwnership}
            onCancel={this.closePartyOwnershipForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

PartyOwnership.propTypes = {
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

PartyOwnership.defaultProps = {
  partyOwnership: null,
  searchQuery: undefined,
};

export default Connect(PartyOwnership, {
  partyOwnerships: 'partyOwnerships.list',
  partyOwnership: 'partyOwnerships.selected',
  loading: 'partyOwnerships.loading',
  posting: 'partyOwnerships.posting',
  page: 'partyOwnerships.page',
  showForm: 'partyOwnerships.showForm',
  total: 'partyOwnerships.total',
  searchQuery: 'partyOwnerships.q',
});
