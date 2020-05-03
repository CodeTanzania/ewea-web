import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Col, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import AdministrativeLevelForm from './Form';
import ListItemActions from '../../components/ListItemActions';
import ListItem from '../../components/ListItem';
import ItemList from '../../components/List';
import { notifyError, notifySuccess } from '../../util';
import './styles.css';

/* constants */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  getAdministrativeLevelsExportUrl,
} = httpActions;
const {
  closeAdministrativeLevelForm,
  getAdministrativeLevels,
  openAdministrativeLevelForm,
  searchAdministrativeLevels,
  selectAdministrativeLevel,
  refreshAdministrativeLevels,
  paginateAdministrativeLevels,
  deleteAdministrativeLevel,
} = reduxActions;

const nameSpan = { xxl: 4, xl: 5, lg: 6, md: 7, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 18, xl: 17, lg: 16, md: 14, sm: 20, xs: 18 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...descriptionSpan, header: 'Description' },
];

const { confirm } = Modal;

/**
 * @class
 * @name AdministrativeLevels
 * @description Render administrativeLevel list which have search box, actions and administrativeLevel list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AdministrativeLevels extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isEditForm: false,
    showNotificationForm: false,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getAdministrativeLevels();
  }

  /**
   * @function
   * @name handleOnCachedValues
   * @description Cached selected values for filters
   *
   * @param {object} cached values to be cached from filter
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnCachedValues = (cached) => {
    const { cached: previousCached } = this.state;
    const values = { ...previousCached, ...cached };
    this.setState({ cached: values });
  };

  /**
   * @function
   * @name handleClearCachedValues
   * @description Clear cached values
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleClearCachedValues = () => {
    this.setState({ cached: null });
  };

  /**
   * @function
   * @name openAdministrativeLevelForm
   * @description Open administrativeLevel form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openAdministrativeLevelForm = () => {
    openAdministrativeLevelForm();
  };

  /**
   * @function
   * @name openAdministrativeLevelForm
   * @description close administrativeLevel form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeAdministrativeLevelForm = () => {
    closeAdministrativeLevelForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchAdministrativeLevels
   * @description Search AdministrativeLevels List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchAdministrativeLevels = (event) => {
    searchAdministrativeLevels(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} administrativeLevel administrativeLevel to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (administrativeLevel) => {
    selectAdministrativeLevel(administrativeLevel);
    this.setState({ isEditForm: true });
    openAdministrativeLevelForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple event Actions
   *
   * @param {object[]| object} administrativeLevels event Actions list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (administrativeLevels) => {
    let message = '';
    if (isArray(administrativeLevels)) {
      const administrativeLevelList = administrativeLevels.map(
        (administrativeLevel) =>
          `Name: ${administrativeLevel.strings.name.en}\nDescription: ${
            // eslint-disable-line
            administrativeLevel.strings.description.en
          }\n`
      );

      message = administrativeLevelList.join('\n\n\n');
    } else {
      message = `Name: ${administrativeLevels.strings.name.en}\nDescription: ${
        // eslint-disable-line
        administrativeLevels.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify administrativeLevel
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
   * @description Perform post close form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseForm = () => {
    selectAdministrativeLevel(null);
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
   * @name showArchiveConfirm
   * @description show confirm modal before archiving an administrative level
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
        deleteAdministrativeLevel(
          item._id, // eslint-disable-line
          () => notifySuccess('Administrative Level was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Administrative Level, Please contact your system Administrator'
            )
        );
      },
    });
  };

  handleRefreshAdministrativeLevels = () =>
    refreshAdministrativeLevels(
      () => notifySuccess('Administrative Levels refreshed successfully'),
      () =>
        notifyError(
          'An Error occurred while refreshing Administrative Levels, please contact system administrator'
        )
    );

  render() {
    const {
      administrativeLevels,
      administrativeLevel,
      loading,
      posting,
      page,
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
            placeholder: 'Search for administrative level here ...',
            onChange: this.searchAdministrativeLevels,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Level',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Administrative Level',
              onClick: this.openAdministrativeLevelForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="administrative levels"
          items={administrativeLevels}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.openFiltersModal}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshAdministrativeLevels}
          onPaginate={(nextPage) => paginateAdministrativeLevels(nextPage)}
          generateExportUrl={getAdministrativeLevelsExportUrl}
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
              avatarBackgroundColor={item.strings.color}
              item={item}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Administrative Level',
                    title: 'Update Administrative Level Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Administrative Level',
                    title: 'Share Administrative Level details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Administrative Level',
                    title:
                      'Remove Administrative Level from list of active administrative leveles',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable-next-line */}
              <Col {...nameSpan}>{get(item, 'strings.name.en', 'N/A')} </Col>

              {/* eslint-disable-next-line */}
              <Col {...descriptionSpan}>
                {get(item, 'strings.description.en', 'N/A')}{' '}
              </Col>
            </ListItem>
          )}
        />
        {/* end list */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Administrative Levels"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
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
            isEditForm
              ? 'Edit Administrative Level'
              : 'Add New Administrative Level'
          }
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeAdministrativeLevelForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <AdministrativeLevelForm
            posting={posting}
            isEditForm={isEditForm}
            administrativeLevel={administrativeLevel}
            onCancel={this.closeAdministrativeLevelForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

AdministrativeLevels.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  administrativeLevels: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  administrativeLevel: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

AdministrativeLevels.defaultProps = {
  administrativeLevel: null,
  searchQuery: undefined,
};

export default Connect(AdministrativeLevels, {
  administrativeLevels: 'administrativeLevels.list',
  administrativeLevel: 'administrativeLevels.selected',
  loading: 'administrativeLevels.loading',
  posting: 'administrativeLevels.posting',
  page: 'administrativeLevels.page',
  showForm: 'administrativeLevels.showForm',
  total: 'administrativeLevels.total',
  searchQuery: 'administrativeLevels.q',
});
