import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import AdministrativeLevelForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import { notifyError, notifySuccess, truncateString } from '../../util';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';

/* http actions */
const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getAgencies,
  getRoles,
  getAdministrativeLevelsExportUrl,
} = httpActions;

/* state actions */
const {
  getAdministrativeLevels,
  openAdministrativeLevelForm,
  searchAdministrativeLevels,
  selectAdministrativeLevel,
  closeAdministrativeLevelForm,
  paginateAdministrativeLevels,
  refreshAdministrativeLevels,
  deleteAdministrativeLevel,
} = reduxActions;

/* ui */
const { confirm } = Modal;
const nameSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 16, xs: 14 };
const levelSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 4, xs: 4 };
const parentSpan = { xxl: 4, xl: 3, lg: 4, md: 4, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 10, xl: 10, lg: 10, md: 8, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name', title: 'Administrative Level Name' },
  {
    ...levelSpan,
    header: 'Level',
    title: 'Administrative Level Number',
  },
  { ...parentSpan, header: 'Parent', title: 'Administrative Level Parent' },
  {
    ...descriptionSpan,
    header: 'Description',
    title: 'Administrative Level Usage Description',
  },
];

/* messages */
const MESSAGE_LIST_REFRESH_SUCCESS =
  'Administrative Levels were refreshed successfully';
const MESSAGE_LIST_REFRESH_ERROR =
  'An Error occurred while refreshing Administrative Levels, Please try again!';
const MESSAGE_ITEM_ARCHIVE_SUCCESS =
  'Administrative Level was archived successfully';
const MESSAGE_ITEM_ARCHIVE_ERROR =
  'An error occurred while archiving Administrative Level, Please try again!';

/**
 * @function AdministrativeLevelList
 * @name AdministrativeLevelList
 * @description List administrative levels
 * @param {object} props Valid list properties
 * @param {object} props.administrativeLevels Valid list items
 * @param {boolean} props.loading Flag whether list is loading data
 * @param {boolean} props.posting Flag whether list is posting data
 * @param {boolean} props.showForm Flag whether to show administrative level form
 * @param {string} props.searchQuery Applied search term
 * @param {number} props.page Current page number
 * @param {number} props.total Available list items
 * @param {object} props.administrativeLevel Current selected list item
 * @returns {object} AdministrativeLevelList component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <AdministrativeLevelList />
 *
 */
class AdministrativeLevelList extends Component {
  /**
   * @function constructor
   * @name constructor
   * @description Initialize states
   * @param {object} props Valid component properties
   * @version 0.1.0
   * @since 0.1.0
   */
  constructor(props) {
    super(props);
    this.state = {
      isEditForm: false,
      showNotificationForm: false,
      notificationSubject: undefined,
      notificationBody: undefined,
    };
  }

  /**
   * @function componentDidMount
   * @name componentDidMount
   * @description Load data
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  componentDidMount() {
    getAdministrativeLevels();
  }

  /**
   * @function handleListSearch
   * @name handleListSearch
   * @description Handle list search
   * @param {object} event List search event
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListSearch = (event) => {
    searchAdministrativeLevels(event.target.value);
  };

  /**
   * @function handleListRefresh
   * @name handleListRefresh
   * @description Handle list refresh
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListRefresh = () => {
    refreshAdministrativeLevels(
      () => notifySuccess(MESSAGE_LIST_REFRESH_SUCCESS),
      () => notifyError(MESSAGE_LIST_REFRESH_ERROR)
    );
  };

  /**
   * @function handleListPaginate
   * @name handleListPaginate
   * @description Handle list paginate
   * @param {number} nextPage List next page number
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListPaginate = (nextPage) => {
    paginateAdministrativeLevels(nextPage);
  };

  /**
   * @function handleListShare
   * @name handleListShare
   * @description Handle list sharing
   * @param {object[]} items List of items
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListShare = (items) => {
    const itemList = [].concat(items);

    const notificationSubject = 'List of Administrative Levels';
    const notificationBody = itemList
      .map((item) => {
        const itemName = get(item, 'strings.name.en', 'N/A');
        const itemLevel = get(item, 'numbers.weight', 'N/A');
        const itemParent = get(item, 'relations.parent.strings.name.en', 'N/A');
        const itemDescription = get(item, 'strings.description.en', 'N/A');
        const body = `Name: ${itemName}\nLevel: ${itemLevel}\nParent: ${itemParent}\nDescription: ${itemDescription}\n`;
        return body;
      })
      .join('\n');
    const showNotificationForm = true;

    this.setState({
      notificationSubject,
      notificationBody,
      showNotificationForm,
    });
  };

  /**
   * @function handleFormOpen
   * @name handleFormOpen
   * @description Handle form opening
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleFormOpen = () => {
    openAdministrativeLevelForm();
  };

  /**
   * @function handleFormClose
   * @name handleFormClose
   * @description Handle form closing
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleFormClose = () => {
    closeAdministrativeLevelForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function handleFormClose
   * @name handleFormClose
   * @description Handle post form close and perform cleanups
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleAfterFormClose = () => {
    selectAdministrativeLevel(null);
    this.setState({ isEditForm: false });
  };

  /**
   * @function handleItemEdit
   * @name handleItemEdit
   * @description Handle list item edit
   * @param {object} item List item
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemEdit = (item) => {
    selectAdministrativeLevel(item);
    this.setState({ isEditForm: true });
    openAdministrativeLevelForm();
  };

  /**
   * @function handleItemArchive
   * @name handleItemArchive
   * @description Handle list item archiving with confirmation
   * @param {object} item List item
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemArchive = (item) => {
    const itemId = get(item, '_id');
    const itemName = get(item, 'strings.name.en', 'N/A');
    confirm({
      title: `Are you sure you want to archive ${itemName} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteAdministrativeLevel(
          itemId,
          () => notifySuccess(MESSAGE_ITEM_ARCHIVE_SUCCESS),
          () => notifyError(MESSAGE_ITEM_ARCHIVE_ERROR)
        );
      },
    });
  };

  /**
   * @function handleItemShare
   * @name handleItemShare
   * @description Handle list item sharing
   * @param {object} item List item
   * @version 0.1.0
   * @since 0.1.0
   */
  handleItemShare = (item) => {
    const itemName = get(item, 'strings.name.en', 'N/A');
    const itemLevel = get(item, 'numbers.weight', 'N/A');
    const itemParent = get(item, 'relations.parent.strings.name.en', 'N/A');
    const itemDescription = get(item, 'strings.description.en', 'N/A');

    const notificationSubject = 'List of Administrative Levels';
    const notificationBody = `Name: ${itemName}\nLevel: ${itemLevel}\nParent: ${itemParent}\nDescription: ${itemDescription}\n`;
    const showNotificationForm = true;

    this.setState({
      notificationSubject,
      notificationBody,
      showNotificationForm,
    });
  };

  /**
   * @function handleNotificationFormClose
   * @name handleNotificationFormClose
   * @description Handle notification form closing
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleNotificationFormClose = () => {
    this.setState({ showNotificationForm: false });
  };

  /**
   * @function render
   * @name render
   * @description Render list
   * @returns {object} List to render
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  render() {
    // props
    const {
      administrativeLevels,
      loading,
      page,
      posting,
      administrativeLevel,
      showForm,
      searchQuery,
      total,
    } = this.props;

    // states
    const {
      isEditForm,
      showNotificationForm,
      notificationSubject,
      notificationBody,
    } = this.state;

    return (
      <>
        {/* start: list topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search administrative levels ...',
            title: 'Search administrative levels ...',
            onChange: this.handleListSearch,
            value: searchQuery,
          }}
          action={{
            label: 'New Level',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Administrative Level',
            onClick: this.handleFormOpen,
          }}
        />
        {/* end: list topbar */}

        {/* start: list */}
        <ItemList
          itemName="AdministrativeLevel"
          items={administrativeLevels}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.handleListFiltersFormOpen}
          onShare={this.handleListShare}
          onRefresh={this.handleListRefresh}
          onPaginate={this.handleListPaginate}
          generateExportUrl={getAdministrativeLevelsExportUrl}
          headerLayout={headerLayout}
          renderListItem={({
            item,
            isSelected,
            onSelectItem,
            onDeselectItem,
          }) => (
            <>
              {/* start: list item */}
              <ListItem
                key={get(item, '_id')}
                item={item}
                name={get(item, 'strings.name.en')}
                isSelected={isSelected}
                avatarBackgroundColor={get(item, 'strings.color')}
                onSelectItem={onSelectItem}
                onDeselectItem={onDeselectItem}
                title={
                  <Row>
                    <Col span={16}>
                      <span className="text-sm">
                        {get(item, 'strings.name.en', 'N/A')}
                      </span>
                    </Col>
                    <Col span={6}>
                      <span className="text-xs">
                        {get(item, 'relations.parent.strings.name.en', 'N/A')}
                      </span>
                    </Col>
                  </Row>
                }
                secondaryText={
                  <span className="text-xs">
                    {get(item, 'strings.description.en', 'N/A')}
                  </span>
                }
                actions={[
                  {
                    name: 'Edit Administrative Level',
                    title: 'Update administrative level details',
                    onClick: () => this.handleItemEdit(item),
                    icon: 'edit',
                  },
                  {
                    name: 'Share Administrative Level',
                    title: 'Share administrative level details with others',
                    onClick: () => this.handleItemShare(item),
                    icon: 'share',
                  },
                  {
                    name: 'Archive AdministrativeLevel',
                    title:
                      'Remove administrative level from list of active administrative levels',
                    onClick: () => this.handleItemArchive(item),
                    icon: 'archive',
                  },
                ]}
              >
                {/* eslint-disable react/jsx-props-no-spreading */}
                <Col {...nameSpan}>{get(item, 'strings.name.en', 'N/A')}</Col>
                <Col {...levelSpan}>{get(item, 'numbers.weight', 'N/A')}</Col>
                <Col {...parentSpan}>
                  {get(item, 'relations.parent.strings.name.en', 'N/A')}
                </Col>
                <Col {...descriptionSpan}>
                  <span title={get(item, 'strings.description.en', 'N/A')}>
                    {truncateString(
                      get(item, 'strings.description.en', 'N/A'),
                      100
                    )}
                  </span>
                </Col>
                {/* eslint-enable react/jsx-props-no-spreading */}
              </ListItem>
              {/* end: list item */}
            </>
          )}
        />
        {/* end: list */}

        {/* start: notification modal */}
        <Modal
          title="Share Administrative Levels"
          visible={showNotificationForm}
          onCancel={this.handleNotificationFormClose}
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
            subject={notificationSubject}
            body={notificationBody}
            onCancel={this.handleNotificationFormClose}
          />
        </Modal>
        {/* end: notification modal */}

        {/* start: form modal */}
        <Modal
          title={
            isEditForm
              ? 'Edit Administrative Level'
              : 'Add New Administrative Level'
          }
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.handleFormClose}
          afterClose={this.handleAfterFormClose}
          maskClosable={false}
          destroyOnClose
        >
          <AdministrativeLevelForm
            administrativeLevel={administrativeLevel}
            posting={posting}
            isEditForm={isEditForm}
            onCancel={this.handleFormClose}
          />
        </Modal>
        {/* end: form modal */}
      </>
    );
  }
}

AdministrativeLevelList.propTypes = {
  administrativeLevels: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  showForm: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  administrativeLevel: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

AdministrativeLevelList.defaultProps = {
  administrativeLevel: null,
  searchQuery: undefined,
};

export default Connect(AdministrativeLevelList, {
  administrativeLevels: 'administrativeLevels.list',
  loading: 'administrativeLevels.loading',
  posting: 'administrativeLevels.posting',
  searchQuery: 'administrativeLevels.q',
  showForm: 'administrativeLevels.showForm',
  page: 'administrativeLevels.page',
  total: 'administrativeLevels.total',
  administrativeLevel: 'administrativeLevels.selected',
});
