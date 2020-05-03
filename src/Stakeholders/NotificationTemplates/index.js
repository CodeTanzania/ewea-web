import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import NotificationTemplateForm from './Form';
import { notifyError, notifySuccess } from '../../util';
import './styles.css';

const { confirm } = Modal;

/* constants */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
  // getFocalPeople,
} = httpActions;
const {
  closeNotificationTemplateForm,
  getNotificationTemplates,
  openNotificationTemplateForm,
  searchNotificationTemplates,
  selectNotificationTemplate,
  paginateNotificationTemplates,
  deleteNotificationTemplate,
  refreshNotificationTemplates,
} = reduxActions;

const nameSpan = { xxl: 6, xl: 6, lg: 6, md: 7, sm: 7, xs: 7 };
const descriptionSpan = { xxl: 12, xl: 12, lg: 12, md: 10, sm: 10, xs: 11 };
const codeSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 3, xs: 0 };

const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...descriptionSpan, header: 'Description' },
  { ...codeSpan, header: 'Code' },
];

/**
 * @class
 * @name NotificationTemplates
 * @description Render notification templates list which have search box, actions and Notification template list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class NotificationTemplates extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    cached: null,
    notificationBody: undefined,
    showNotificationForm: false,
  };

  componentDidMount() {
    getNotificationTemplates();
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
   * @name openFiltersModal
   * @description open filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openFiltersModal = () => {
    this.setState({ showFilters: true });
  };

  /**
   * @function
   * @name closeFiltersModal
   * @description Close filters modal by setting it's visible property
   * to false via state
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeFiltersModal = () => {
    this.setState({ showFilters: false });
  };

  /**
   * @function
   * @name openNotificationTemplateForm
   * @description Open Notification Template form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationTemplateForm = () => {
    openNotificationTemplateForm();
  };

  /**
   * @function
   * @name openNotificationTemplateForm
   * @description close NotificationTemplate form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeNotificationTemplateForm = () => {
    closeNotificationTemplateForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchNotificationTemplates
   * @description Search Notification Templates List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchNotificationTemplates = (event) => {
    searchNotificationTemplates(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} notificationTemplate template to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (notificationTemplate) => {
    selectNotificationTemplate(notificationTemplate);
    this.setState({ isEditForm: true });
    openNotificationTemplateForm();
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify notificationTemplate
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
   * @name handleAfterCloseForm
   * @description Perform post close form cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterCloseForm = () => {
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share multiple Notification Template
   *
   * @param {object[]| object} notificationTemplate Notification Template list to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (notificationTemplate) => {
    let message = '';
    if (isArray(notificationTemplate)) {
      const notificationTemplatesList = notificationTemplate.map(
        (notificationTemplates) =>
          `Name: ${notificationTemplates.strings.name.en}\nDescription: ${
            // eslint-disable-line
            notificationTemplates.strings.description.en
          }\n`
      );

      message = notificationTemplatesList.join('\n\n\n');
    } else {
      message = `Name: ${notificationTemplate.strings.name.en}\nDescription: ${
        // eslint-disable-line
        notificationTemplate.strings.description.en
      }\n`;
    }

    this.setState({ notificationBody: message, showNotificationForm: true });
  };

  /**
   * @function
   * @name handleRefreshNotificationTemplate
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshNotificationTemplate = () => {
    refreshNotificationTemplates(
      () => {
        notifySuccess('Notification Templates refreshed successfully');
      },
      () => {
        notifyError(
          'An Error occurred while refreshing Notification Templates please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a notification template
   *
   * @param item {object} notificationTemplate to archive
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
        deleteNotificationTemplate(
          item._id, // eslint-disable-line
          () =>
            notifySuccess('Notification Template was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Notification Template, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      notificationTemplates,
      notificationTemplate,
      loading,
      posting,
      page,
      showForm,
      searchQuery,
      total,
    } = this.props;
    const {
      showFilters,
      isEditForm,
      showNotificationForm,
      notificationBody,
      // cached,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for notification templates here ...',
            onChange: this.searchNotificationTemplates,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Template',
              icon: <PlusOutlined />,
              size: 'large',
              title: 'Add New Notification Template',
              onClick: this.openNotificationTemplateForm,
            },
          ]}
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
          onShare={this.handleShare}
          onRefresh={this.handleRefreshNotificationTemplate}
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
              avatarBackgroundColor={item.strings.color}
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Notification Template',
                    title: 'Update Notification Template Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Notification Template',
                    title: 'Share Notification Template details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Notification Template',
                    title:
                      'Remove Notification Template from list of active notification templates',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
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

        {/* filter modal */}
        <Modal
          title="Filter Notification templates"
          visible={showFilters}
          onCancel={this.closeFiltersModal}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
        >
          <></>
        </Modal>
        {/* end filter modal */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Notification Template"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            // recipients={getFocalPeople}
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
              ? 'Edit Notification Template'
              : 'Add New Notification Template'
          }
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeNotificationTemplateForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <NotificationTemplateForm
            posting={posting}
            isEditForm={isEditForm}
            notificationTemplate={notificationTemplate}
            onCancel={this.closeNotificationTemplateForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

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
