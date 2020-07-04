import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect, reduxActions } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import map from 'lodash/map';
import Topbar from '../../components/Topbar';
import FeatureForm from './Form';
import FeatureFiltersForm from './Filters';
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
  getFeaturesExportUrl,
} = httpActions;

/* state actions */
const {
  getFeatures,
  openFeatureForm,
  searchFeatures,
  selectFeature,
  closeFeatureForm,
  paginateFeatures,
  refreshFeatures,
  deleteFeature,
} = reduxActions;

/* ui */
const { confirm } = Modal;
const nameSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 16, xs: 14 };
const codeSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 0, xs: 0 };
const typeSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 4, xs: 4 };
const areaSpan = { xxl: 4, xl: 4, lg: 4, md: 4, sm: 0, xs: 0 };
const custodiansSpan = { xxl: 6, xl: 6, lg: 6, md: 4, sm: 0, xs: 0 };
const headerLayout = [
  {
    ...typeSpan,
    header: 'Type',
    title: 'Critical Infrastructure Type',
  },
  { ...codeSpan, header: 'Code/Number', title: 'Critical Infrastructure Code' },
  { ...nameSpan, header: 'Name', title: 'Critical Infrastructure Name' },
  { ...areaSpan, header: 'Area', title: 'Critical Infrastructure Area' },
  {
    ...custodiansSpan,
    header: 'Custodians',
    title: 'Critical Infrastructure Custodians',
  },
];

/* messages */
const MESSAGE_LIST_REFRESH_SUCCESS =
  'Critical Infrastructures were refreshed successfully';
const MESSAGE_LIST_REFRESH_ERROR =
  'An Error occurred while refreshing Critical Infrastructures, Please try again!';
const MESSAGE_ITEM_ARCHIVE_SUCCESS =
  'Critical Infrastructure was archived successfully';
const MESSAGE_ITEM_ARCHIVE_ERROR =
  'An error occurred while archiving Critical Infrastructure, Please try again!';

/* helpers */
const getCustodiansFor = (item) => {
  const custodians = [].concat(get(item, 'relations.custodians', []));
  if (isEmpty(custodians)) {
    return 'N/A';
  }
  const joinedCustodians = map(custodians, (custodian) => {
    return get(custodian, 'name', '');
  }).join(', ');
  return joinedCustodians;
};

/**
 * @function FeatureList
 * @name FeatureList
 * @description List features
 * @param {object} props Valid list properties
 * @param {object} props.features Valid list items
 * @param {boolean} props.loading Flag whether list is loading data
 * @param {boolean} props.posting Flag whether list is posting data
 * @param {boolean} props.showForm Flag whether to show feature form
 * @param {string} props.searchQuery Applied search term
 * @param {number} props.page Current page number
 * @param {number} props.total Available list items
 * @param {object} props.feature Current selected list item
 * @returns {object} FeatureList component
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 *
 * <FeatureList />
 *
 */
class FeatureList extends Component {
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
      showFilters: false,
      isEditForm: false,
      showNotificationForm: false,
      notificationSubject: undefined,
      notificationBody: undefined,
      cached: null,
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
    getFeatures();
  }

  /**
   * @function handleOnCache
   * @name handleOnCache
   * @description Handle updating cache
   * @param {object} cached values cached
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnCache = (cached) => {
    const { cached: previousCached } = this.state;
    const values = { ...previousCached, ...cached };
    this.setState({ cached: values });
  };

  /**
   * @function handleOnClearCache
   * @name handleOnClearCache
   * @description Handle clearing cache
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleOnClearCache = () => {
    // TODO: support keys to clear specific cached value
    this.setState({ cached: null });
  };

  /**
   * @function handleListSearch
   * @name handleListSearch
   * @description Handle list search
   * @param {object} event List search event
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListSearch = (event) => {
    searchFeatures(event.target.value);
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
    refreshFeatures(
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
    paginateFeatures(nextPage);
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

    const notificationSubject = 'List of Critical Infrastructures';
    const notificationBody = itemList
      .map((item) => {
        const itemName = get(item, 'strings.name.en', 'N/A');
        const itemCode = get(item, 'strings.code', 'N/A');
        const itemType = get(item, 'relations.type.strings.name.en', 'N/A');
        const itemArea = get(item, 'relations.area.strings.name.en', 'N/A');
        const itemCustodians = getCustodiansFor(item);
        const itemDescription = get(item, 'strings.description.en', 'N/A');
        const body = `Type: ${itemType}\nName: ${itemName}\nCode: ${itemCode}\nArea: ${itemArea}\nCustodian: ${itemCustodians}\nDescription: ${itemDescription}\n`;
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
    openFeatureForm();
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
    closeFeatureForm();
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
    selectFeature(null);
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
    selectFeature(item);
    this.setState({ isEditForm: true });
    openFeatureForm();
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
        deleteFeature(
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
    const itemCode = get(item, 'strings.code', 'N/A');
    const itemType = get(item, 'relations.type.strings.name.en', 'N/A');
    const itemArea = get(item, 'relations.area.strings.name.en', 'N/A');
    const itemCustodians = getCustodiansFor(item);
    const itemDescription = get(item, 'strings.description.en', 'N/A');

    const notificationSubject = 'List of Critical Infrastructures';
    const notificationBody = `Type: ${itemType}\nName: ${itemName}\nCode: ${itemCode}\nArea: ${itemArea}\nCustodian: ${itemCustodians}\nDescription: ${itemDescription}\n`;
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
   * @function handleNotificationFormClose
   * @name handleNotificationFormClose
   * @description Handle filters form opening
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListFiltersFormOpen = () => {
    this.setState({ showFilters: true });
  };

  /**
   * @function handleNotificationFormClose
   * @name handleNotificationFormClose
   * @description Handle filters form closing
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleListFiltersFormClose = () => {
    this.setState({ showFilters: false });
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
      features,
      loading,
      page,
      posting,
      feature,
      showForm,
      searchQuery,
      total,
    } = this.props;

    // states
    const {
      showFilters,
      cached,
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
            placeholder: 'Search critical infrastructures ...',
            title: 'Search critical infrastructures ...',
            onChange: this.handleListSearch,
            value: searchQuery,
          }}
          action={{
            label: 'New Infrastructure',
            icon: <PlusOutlined />,
            size: 'large',
            title: 'Add New Critical Infrastructure',
            onClick: this.handleFormOpen,
          }}
        />
        {/* end: list topbar */}

        {/* start: list */}
        <ItemList
          itemName="CriticalInfrastructure"
          items={features}
          page={page}
          itemCount={total}
          loading={loading}
          onFilter={this.handleListFiltersFormOpen}
          onShare={this.handleListShare}
          onRefresh={this.handleListRefresh}
          onPaginate={this.handleListPaginate}
          generateExportUrl={getFeaturesExportUrl}
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
                avatarBackgroundColor={get(
                  item,
                  'relations.type.strings.color'
                )}
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
                        {get(item, 'relations.area.strings.name.en', 'N/A')}
                      </span>
                    </Col>
                  </Row>
                }
                secondaryText={
                  <span className="text-xs">
                    {get(item, 'relations.type.strings.name.en', 'N/A')}
                  </span>
                }
                actions={[
                  {
                    name: 'Edit Critical Infrastructure',
                    title: 'Update critical infrastructure details',
                    onClick: () => this.handleItemEdit(item),
                    icon: 'edit',
                  },
                  {
                    name: 'Share Critical Infrastructure',
                    title: 'Share critical infrastructure details with others',
                    onClick: () => this.handleItemShare(item),
                    icon: 'share',
                  },
                  {
                    name: 'Archive Feature',
                    title:
                      'Remove critical infrastructure from list of active critical infrastructures',
                    onClick: () => this.handleItemArchive(item),
                    icon: 'archive',
                  },
                ]}
              >
                {/* eslint-disable react/jsx-props-no-spreading */}
                <Col {...typeSpan}>
                  {get(item, 'relations.type.strings.name.en', 'N/A')}
                </Col>
                <Col {...codeSpan}>{get(item, 'strings.code', 'N/A')}</Col>
                <Col {...nameSpan}>
                  <span title={get(item, 'strings.name.en', 'N/A')}>
                    {get(item, 'strings.name.en', 'N/A')}
                  </span>
                </Col>
                <Col {...areaSpan}>
                  {get(item, 'relations.area.strings.name.en', 'N/A')}
                </Col>
                <Col {...custodiansSpan}>
                  <span title={getCustodiansFor(item)}>
                    {truncateString(getCustodiansFor(item), 100)}
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
          title="Share Critical Infrastructures"
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

        {/* start: filter modal */}
        <Modal
          title="Filter Critical Infrastructures"
          visible={showFilters}
          className="modal-window-50"
          footer={null}
          onCancel={this.handleListFiltersFormClose}
          destroyOnClose
          maskClosable={false}
        >
          <FeatureFiltersForm
            cached={cached}
            onCache={this.handleOnCache}
            onCancel={this.handleListFiltersFormClose}
            onClearCache={this.handleOnClearCache}
          />
        </Modal>
        {/* end: filter modal */}

        {/* start: form modal */}
        <Modal
          title={
            isEditForm
              ? 'Edit Critical Infrastructure'
              : 'Add New Critical Infrastructure'
          }
          visible={showForm}
          className="modal-window-50"
          footer={null}
          onCancel={this.handleFormClose}
          afterClose={this.handleAfterFormClose}
          maskClosable={false}
          destroyOnClose
        >
          <FeatureForm
            feature={feature}
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

FeatureList.propTypes = {
  features: PropTypes.arrayOf(
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
  feature: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

FeatureList.defaultProps = {
  feature: null,
  searchQuery: undefined,
};

export default Connect(FeatureList, {
  features: 'features.list',
  loading: 'features.loading',
  posting: 'features.posting',
  searchQuery: 'features.q',
  showForm: 'features.showForm',
  page: 'features.page',
  total: 'features.total',
  feature: 'features.selected',
});
