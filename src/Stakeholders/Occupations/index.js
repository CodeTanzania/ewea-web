import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess, truncateString } from '../../util';
import OccupationForm from './Form';

/* http actions */
const {
  getPartyOccupationsExportUrl,
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getPartyOccupations: getPartyOccupationsFromAPI,
  getAgencies,
} = httpActions;
/* redux actions */
const {
  getPartyOccupations,
  openPartyOccupationForm,
  selectPartyOccupation,
  closePartyOccupationForm,
  refreshPartyOccupations,
  paginatePartyOccupations,
  deletePartyOccupation,
} = reduxActions;

/* constants */
const { confirm } = Modal;
const nameSpan = { xxl: 7, xl: 7, lg: 7, md: 7, sm: 16, xs: 15 };
const abbreviationSpan = { xxl: 3, xl: 3, lg: 3, md: 3, sm: 3, xs: 3 };
const descriptionSpan = { xxl: 11, xl: 11, lg: 11, md: 10, sm: 0, xs: 0 };
const headerLayout = [
  {
    ...nameSpan,
    header: 'Name',
    title: 'Occupations name associated with focal people',
  },
  {
    ...abbreviationSpan,
    header: 'Abbreviation',
    title: 'A shortened form of occupations',
  },
  {
    ...descriptionSpan,
    header: 'Description',
    title: 'Explanation of occupations',
  },
];

/**
 * @class
 * @name Occupations
 * @description Render occupation module which has search box, actions and list of occupations
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class Occupations extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
  };

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    getPartyOccupations();
  }

  /**
   * @function
   * @name openPartyOccupationsForm
   * @description Open occupation form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openPartyOccupationsForm = () => {
    openPartyOccupationForm();
  };

  /**
   * @function
   * @name closePartyOccupationsForm
   * @description close occupation form
   *
   * @returns {undefined} - Nothing is returned
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closePartyOccupationsForm = () => {
    closePartyOccupationForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchOccupations
   * @description Search Occupations List based on supplied filter word
   *
   * @param {object} event Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchOccupations = (event) => {
    getPartyOccupations({ q: event.target.value });
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} occupation - occupation to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (occupation) => {
    selectPartyOccupation(occupation);
    this.setState({ isEditForm: true });
    openPartyOccupationForm();
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
    selectPartyOccupation(null);
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
   * @name handleRefreshOccupations
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshOccupations = () => {
    refreshPartyOccupations(
      () => {
        notifySuccess('Occupations refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing occupations please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple Party Occupations
   *
   * @param {object[]| object} partyOccupations partyOccupations list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (partyOccupations) => {
    let message = '';
    if (isArray(partyOccupations)) {
      const partyOccupationList = partyOccupations.map(
        (partyOccupation) =>
          `Name: ${partyOccupation.strings.name.en}\nDescription: ${
            // eslint-disable-line
            partyOccupation.strings.description.en
          }\n`
      );

      message = partyOccupationList.join('\n\n\n');
    } else {
      message = `Name: ${partyOccupations.strings.name.en}\nDescription: ${
        // eslint-disable-line
        partyOccupations.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a occupation
   *
   * @param item {object} occupation to archive
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
        deletePartyOccupation(
          item._id, // eslint-disable-line
          () => notifySuccess('Occupation was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving occupation, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      occupations,
      loading,
      showForm,
      posting,
      page,
      total,
      occupation,
      searchQuery,
    } = this.props;
    const { isEditForm, showNotificationForm, notificationBody } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for occupations here ...',
            onChange: this.searchOccupations,
            value: searchQuery,
          }}
          action={{
            label: 'New Occupation',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Occupation',
            onClick: this.openPartyOccupationsForm,
          }}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="Occupations"
          items={occupations}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          // onNotify={this.openNotificationForm}
          generateExportUrl={getPartyOccupationsExportUrl}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshOccupations}
          onPaginate={(nextPage) => paginatePartyOccupations(nextPage)}
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
                  name: 'Edit Stakeholder Occupation',
                  title: 'Update Stakeholder Occupation Details',
                  onClick: () => this.handleEdit(item),
                  icon: 'edit',
                },
                {
                  name: 'Share Stakeholder Occupation',
                  title: 'Share Stakeholder Occupation details with others',
                  onClick: () => this.handleShare(item),
                  icon: 'share',
                },
                {
                  name: 'Archive Stakeholder Occupation',
                  title:
                    'Remove Stakeholder Occupation from list of active focal people',
                  onClick: () => this.showArchiveConfirm(item),
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
          title="Notify according to occupations"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            // recipients={getFocalPeople}
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchOccupations={getPartyOccupationsFromAPI}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Notification modal */}

        {/* create/edit form modal */}
        <Modal
          className="modal-window-50"
          title={isEditForm ? 'Edit Occupation' : 'Add New Occupation'}
          visible={showForm}
          footer={null}
          onCancel={this.closePartyOccupationsForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <OccupationForm
            posting={posting}
            occupation={occupation}
            onCancel={this.closePartyOccupationsForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

Occupations.propTypes = {
  showForm: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
  occupation: PropTypes.shape({
    name: PropTypes.string,
    abbreviation: PropTypes.string,
    description: PropTypes.string,
  }),
  occupations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      abbreviation: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
};

Occupations.defaultProps = {
  occupation: null,
  searchQuery: undefined,
};

export default Connect(Occupations, {
  occupations: 'partyOccupations.list',
  occupation: 'partyOccupations.selected',
  showForm: 'partyOccupations.showForm',
  posting: 'partyOccupations.posting',
  loading: 'partyOccupations.loading',
  page: 'partyOccupations.page',
  total: 'partyOccupations.total',
});
