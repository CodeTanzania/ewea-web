import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isArray from 'lodash/isArray';
import get from 'lodash/get';

import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import FocalPersonFilters from './Filters';
import StakeholderForm from '../../components/StakeholderForm';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import {
  notifyError,
  notifySuccess,
  generateFocalPersonVCard,
} from '../../util';

/* http actions */
const {
  getFocalPeople: getFocalPeopleFromAPI,
  getAdministrativeAreas,
  getPartyGroups,
  getPartyRoles,
  getAgencies,
  getFocalPeopleExportUrl,
} = httpActions;
/* redux actions */
const {
  closeFocalPersonForm,
  getFocalPeople,
  openFocalPersonForm,
  searchFocalPeople,
  selectFocalPerson,
  refreshFocalPeople,
  paginateFocalPeople,
  deleteFocalPerson,
  postFocalPerson,
  putFocalPerson,
} = reduxActions;
/* ui */
const { confirm } = Modal;
/* constants */
const nameSpan = { xxl: 3, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const roleSpan = { xxl: 6, xl: 5, lg: 5, md: 0, sm: 0, xs: 0 };
const phoneSpan = { xxl: 4, xl: 5, lg: 5, md: 4, sm: 9, xs: 8 };
const emailSpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const areaSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name' },
  { ...roleSpan, header: 'Title & Organization' },
  { ...phoneSpan, header: 'Phone Number' },
  { ...emailSpan, header: 'Email' },
  { ...areaSpan, header: 'Area' },
];
const SHARE_FOCAL_PERSON_SUBJECT = 'Contact Details for Focal People';

/* messages */
const MESSAGE_ITEM_CREATE_SUCCESS = 'Focal Person was created successfully';
const MESSAGE_ITEM_CREATE_ERROR =
  'Something occurred while saving focal Person, please try again!';
const MESSAGE_ITEM_UPDATE_SUCCESS = 'Focal Person was updated successfully';
const MESSAGE_ITEM_UPDATE_ERROR =
  'Something occurred while updating focal Person, please try again!';
const MESSAGE_LIST_REFRESH_SUCCESS = 'Focal People refreshed successfully';
const MESSAGE_LIST_REFRESH_ERROR =
  'An error occurred while refreshing focal people please contact system administrator';
const MESSAGE_ITEM_ARCHIVE_SUCCESS = 'Focal Person was archived successfully';
const MESSAGE_ITEM_ARCHIVE_ERROR =
  'An error occurred while archiving Focal Person, Please contact your system Administrator';

/**
 * @class
 * @name FocalPeople
 * @description Render focalPerson list which have search box, actions and focalPerson list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class FocalPeople extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    showNotificationForm: false,
    selectedFocalPeople: [],
    notificationSubject: undefined,
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getFocalPeople();
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
   * @name openFocalPersonForm
   * @description Open focalPerson form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openFocalPersonForm = () => {
    openFocalPersonForm();
  };

  /**
   * @function
   * @name openFocalPersonForm
   * @description close focalPerson form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeFocalPersonForm = () => {
    closeFocalPersonForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchFocalPeople
   * @description Search FocalPeople List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchFocalPeople = (event) => {
    searchFocalPeople(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} focalPerson focalPerson to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = (focalPerson) => {
    selectFocalPerson(focalPerson);
    this.setState({ isEditForm: true });
    openFocalPersonForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share single focalPerson action
   *
   * @param {object| object[]} focalPeople focalPerson to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = (focalPeople) => {
    let message = '';
    let subject = '';
    if (isArray(focalPeople)) {
      subject = SHARE_FOCAL_PERSON_SUBJECT;
      const focalPeopleList = focalPeople.map(
        (focalPerson) => generateFocalPersonVCard(focalPerson).body
      );

      message = focalPeopleList.join('\n\n\n');
    } else {
      const { subject: title, body } = generateFocalPersonVCard(focalPeople);
      subject = title;
      message = body;
    }

    this.setState({
      notificationSubject: subject,
      notificationBody: message,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name openNotificationForm
   * @description Handle on notify focalPeople
   *
   * @param {object[]} focalPeople List of focalPeople selected to be notified
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = (focalPeople) => {
    this.setState({
      selectedFocalPeople: focalPeople,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify focalPeople
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
    selectFocalPerson(null);
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
   * @name handleRefreshFocalPeople
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshFocalPeople = () => {
    refreshFocalPeople(
      () => {
        notifySuccess(MESSAGE_LIST_REFRESH_SUCCESS);
      },
      () => {
        notifyError(MESSAGE_LIST_REFRESH_ERROR);
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a focal person
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
        return new Promise((resolve) => {
          deleteFocalPerson(
            item._id, // eslint-disable-line
            () => {
              resolve();
              notifySuccess(MESSAGE_ITEM_ARCHIVE_SUCCESS);
            },
            () => {
              resolve();
              notifyError(MESSAGE_ITEM_ARCHIVE_ERROR);
            }
          );
        });
      },
    });
  };

  render() {
    const {
      focalPeople,
      focalPerson,
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
      selectedFocalPeople,
      notificationSubject,
      notificationBody,
      cached,
    } = this.state;

    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for focal people here ...',
            onChange: this.searchFocalPeople,
            value: searchQuery,
          }}
          action={{
            label: 'New Person',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Focal Person',
            onClick: this.openFocalPersonForm,
          }}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="focal people"
          items={focalPeople}
          page={page}
          itemCount={total}
          loading={loading}
          onFilter={this.openFiltersModal}
          onNotify={this.openNotificationForm}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshFocalPeople}
          onPaginate={(nextPage) => paginateFocalPeople(nextPage)}
          generateExportUrl={getFocalPeopleExportUrl}
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
              title={
                <Row>
                  <Col span={15}>
                    <span className="text-sm">{item.name}</span>
                  </Col>
                  <Col span={6}>
                    <span className="text-xs">{item.mobile}</span>
                  </Col>
                </Row>
              }
              secondaryText={
                <span className="text-xs">
                  {`${get(item, 'role.strings.name.en', 'N/A')}, ${get(
                    item,
                    'party.abbreviation',
                    'N/A'
                  )}`}
                </span>
              }
              isSelected={isSelected}
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              actions={[
                {
                  name: 'Edit Focal Person',
                  title: 'Update Focal Person Details',
                  onClick: () => this.handleEdit(item),
                  icon: 'edit',
                },
                {
                  name: 'Share Focal Person',
                  title: 'Share Focal Person details with others',
                  onClick: () => this.handleShare(item),
                  icon: 'share',
                },
                {
                  name: 'Share on WhatsApp',
                  title: 'Share Contact on Whatsapp',
                  link: `https://wa.me/?text=${encodeURI(
                    generateFocalPersonVCard(item).body
                  )}`,
                  icon: 'whatsapp',
                },
                {
                  name: 'Archive Focal Person',
                  title: 'Remove focal person from list of active focal people',
                  onClick: () => this.showArchiveConfirm(item),
                  icon: 'archive',
                },
              ]}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...nameSpan}>{item.name}</Col>
              <Col
                {...roleSpan}
                title={get(item, 'role.strings.name.en', 'N/A')}
              >
                {`${get(item, 'role.strings.name.en', 'N/A')}, ${get(
                  item,
                  'party.abbreviation',
                  'N/A'
                )}`}
              </Col>
              <Col {...phoneSpan}>{item.mobile}</Col>
              <Col {...emailSpan}>{item.email}</Col>
              <Col {...areaSpan}>
                {get(item, 'area.strings.name.en', 'N/A')}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* filter modal */}
        <Modal
          title="Filter Focal People"
          visible={showFilters}
          onCancel={this.closeFiltersModal}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
        >
          <FocalPersonFilters
            onCancel={this.closeFiltersModal}
            cached={cached}
            onCache={this.handleOnCachedValues}
            onClearCache={this.handleClearCachedValues}
          />
        </Modal>
        {/* end filter modal */}

        {/* Notification Modal modal */}
        <Modal
          title="Notify Focal People"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="modal-window-50"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={selectedFocalPeople}
            onSearchRecipients={getFocalPeopleFromAPI}
            onSearchJurisdictions={getAdministrativeAreas}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getPartyRoles}
            subject={notificationSubject}
            body={notificationBody}
            onCancel={this.closeNotificationForm}
          />
        </Modal>
        {/* end Notification modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Focal Person' : 'Add New Focal Person'}
          visible={showForm}
          className="modal-window-80"
          footer={null}
          onCancel={this.closeFocalPersonForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <StakeholderForm
            stakeholder={focalPerson}
            posting={posting}
            onCancel={this.closeFocalPersonForm}
            onCreate={(data) =>
              postFocalPerson(
                data,
                () => {
                  notifySuccess(MESSAGE_ITEM_CREATE_SUCCESS);
                },
                () => {
                  notifyError(MESSAGE_ITEM_CREATE_ERROR);
                }
              )
            }
            onUpdate={(data) =>
              putFocalPerson(
                data,
                () => {
                  notifySuccess(MESSAGE_ITEM_UPDATE_SUCCESS);
                },
                () => {
                  notifyError(MESSAGE_ITEM_UPDATE_ERROR);
                }
              )
            }
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

FocalPeople.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  focalPeople: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    .isRequired,
  focalPerson: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

FocalPeople.defaultProps = {
  focalPerson: null,
  searchQuery: undefined,
};

export default Connect(FocalPeople, {
  focalPeople: 'focalPeople.list',
  focalPerson: 'focalPeople.selected',
  loading: 'focalPeople.loading',
  posting: 'focalPeople.posting',
  page: 'focalPeople.page',
  showForm: 'focalPeople.showForm',
  total: 'focalPeople.total',
  searchQuery: 'focalPeople.q',
});
