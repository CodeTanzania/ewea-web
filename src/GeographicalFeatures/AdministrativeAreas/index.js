import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import AdministrativeAreaForm from './Form';
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
  getAdministrativeAreasExportUrl,
} = httpActions;

/* state actions */
const {
  getAdministrativeAreas,
  openAdministrativeAreaForm,
  searchAdministrativeAreas,
  selectAdministrativeArea,
  closeAdministrativeAreaForm,
  paginateAdministrativeAreas,
  refreshAdministrativeAreas,
  deleteAdministrativeArea,
} = reduxActions;

/* ui */
const { confirm } = Modal;
const nameSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 0, xs: 0 };
const codeSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 16, xs: 14 };
const levelSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 4, xs: 4 };
const parentSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 6, xl: 6, lg: 6, md: 4, sm: 0, xs: 0 };
const headerLayout = [
  { ...nameSpan, header: 'Name', title: 'Administrative Area Name' },
  { ...codeSpan, header: 'Code', title: 'Administrative Area Code' },
  {
    ...levelSpan,
    header: 'Level',
    title: 'Administrative Area Level',
  },
  { ...parentSpan, header: 'Parent', title: 'Administrative Area Parent' },
  {
    ...descriptionSpan,
    header: 'Description',
    title: 'Administrative Area Description',
  },
];

/* messages */
const MESSAGE_LIST_REFRESH_SUCCESS =
  'Administrative Areas were refreshed successfully';
const MESSAGE_LIST_REFRESH_ERROR =
  'An Error occurred while refreshing Administrative Areas, Please try again!';
const MESSAGE_ITEM_ARCHIVE_SUCCESS =
  'Administrative Area was archived successfully';
const MESSAGE_ITEM_ARCHIVE_ERROR =
  'An error occurred while archiving Administrative Area, Please try again!';

/**
 * @function AdministrativeAreaList
 * @name AdministrativeAreaList
 * @description List administrative areas
 * @param {object} props Valid list properties
 * @param {object} props.administrativeAreas Valid list items
 * @param {boolean} props.loading Flag whether list is loading data
 * @param {boolean} props.posting Flag whether list is posting data
 * @param {boolean} props.showForm Flag whether to show administrative area form
 * @param {string} props.searchQuery Applied search term
 * @param {number} props.page Current page number
 * @param {number} props.total Available list items
 * @param {object} props.administrativeArea Current selected list item
 * @returns {object} AdministrativeAreaList component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <AdministrativeAreaList />
 *
 */
class AdministrativeAreaList extends Component {
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
    getAdministrativeAreas();
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
    searchAdministrativeAreas(event.target.value);
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
    refreshAdministrativeAreas(
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
    paginateAdministrativeAreas(nextPage);
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

    const notificationSubject = 'List of Administrative Areas';
    const notificationBody = itemList
      .map((item) => {
        const itemName = get(item, 'strings.name.en', 'N/A');
        const itemCode = get(item, 'strings.code', 'N/A');
        const itemLevel = get(item, 'relations.level.strings.name.en', 'N/A');
        const itemParent = get(item, 'relations.parent.strings.name.en', 'N/A');
        const itemDescription = get(item, 'strings.description.en', 'N/A');
        const body = `Name: ${itemName}\nCode: ${itemCode}\nLevel: ${itemLevel}\nParent: ${itemParent}\nDescription: ${itemDescription}\n`;
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
    openAdministrativeAreaForm();
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
    closeAdministrativeAreaForm();
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
    selectAdministrativeArea(null);
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
    selectAdministrativeArea(item);
    this.setState({ isEditForm: true });
    openAdministrativeAreaForm();
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
        return new Promise((resolve) => {
          deleteAdministrativeArea(
            itemId,
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
    const itemCode = get(item, 'strings.code', 'N/A');
    const itemLevel = get(item, 'relations.level.strings.name.en', 'N/A');
    const itemParent = get(item, 'relations.parent.strings.name.en', 'N/A');
    const itemDescription = get(item, 'strings.description.en', 'N/A');

    const notificationSubject = 'List of Administrative Areas';
    const notificationBody = `Name: ${itemName}\nCode: ${itemCode}\nLevel: ${itemLevel}\nParent: ${itemParent}\nDescription: ${itemDescription}\n`;
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
      administrativeAreas,
      loading,
      page,
      posting,
      administrativeArea,
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
            placeholder: 'Search administrative areas ...',
            title: 'Search administrative areas ...',
            onChange: this.handleListSearch,
            value: searchQuery,
          }}
          action={{
            label: 'New Area',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Administrative Area',
            onClick: this.handleFormOpen,
          }}
        />
        {/* end: list topbar */}

        {/* start: list */}
        <ItemList
          itemName="AdministrativeArea"
          items={administrativeAreas}
          page={page}
          itemCount={total}
          loading={loading}
          // onFilter={this.handleListFiltersFormOpen}
          onShare={this.handleListShare}
          onRefresh={this.handleListRefresh}
          onPaginate={this.handleListPaginate}
          generateExportUrl={getAdministrativeAreasExportUrl}
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
                    {get(item, 'relations.level.strings.name.en', 'N/A')}
                  </span>
                }
                actions={[
                  {
                    name: 'Edit Administrative Area',
                    title: 'Update administrative area details',
                    onClick: () => this.handleItemEdit(item),
                    icon: 'edit',
                  },
                  {
                    name: 'Share Administrative Area',
                    title: 'Share administrative area details with others',
                    onClick: () => this.handleItemShare(item),
                    icon: 'share',
                  },
                  {
                    name: 'Archive AdministrativeArea',
                    title:
                      'Remove administrative area from list of active administrative areas',
                    onClick: () => this.handleItemArchive(item),
                    icon: 'archive',
                  },
                ]}
              >
                {/* eslint-disable react/jsx-props-no-spreading */}
                <Col {...nameSpan}>{get(item, 'strings.name.en', 'N/A')}</Col>
                <Col {...codeSpan}>{get(item, 'strings.code', 'N/A')}</Col>
                <Col {...levelSpan}>
                  {get(item, 'relations.level.strings.name.en', 'N/A')}
                </Col>
                <Col {...parentSpan}>
                  {get(item, 'relations.parent.strings.name.en', 'N/A')}
                </Col>
                <Col {...descriptionSpan}>
                  <span title={get(item, 'strings.description.en', 'N/A')}>
                    {truncateString(
                      get(item, 'strings.description.en', 'N/A'),
                      50
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
          title="Share Administrative Areas"
          visible={showNotificationForm}
          onCancel={this.handleNotificationFormClose}
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
              ? 'Edit Administrative Area'
              : 'Add New Administrative Area'
          }
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.handleFormClose}
          afterClose={this.handleAfterFormClose}
          maskClosable={false}
          destroyOnClose
        >
          <AdministrativeAreaForm
            administrativeArea={administrativeArea}
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

AdministrativeAreaList.propTypes = {
  administrativeAreas: PropTypes.arrayOf(
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
  administrativeArea: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

AdministrativeAreaList.defaultProps = {
  administrativeArea: null,
  searchQuery: undefined,
};

export default Connect(AdministrativeAreaList, {
  administrativeAreas: 'administrativeAreas.list',
  loading: 'administrativeAreas.loading',
  posting: 'administrativeAreas.posting',
  searchQuery: 'administrativeAreas.q',
  showForm: 'administrativeAreas.showForm',
  page: 'administrativeAreas.page',
  total: 'administrativeAreas.total',
  administrativeArea: 'administrativeAreas.selected',
});
