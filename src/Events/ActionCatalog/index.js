import { httpActions } from '@codetanzania/ewea-api-client';
import isArray from 'lodash/isArray';
import {
  closeEventActionCatalogueForm,
  Connect,
  getEventActionCatalogues,
  openEventActionCatalogueForm,
  searchEventActionCatalogues,
  selectEventActionCatalogue,
  refreshEventActionCatalogues,
  paginateEventActionCatalogues,
  deleteEventActionCatalogue,
} from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NotificationForm from '../../components/NotificationForm';
import Topbar from '../../components/Topbar';
import EventActionCatalogueFilters from './Filters';
import EventActionCatalogueForm from './Form';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import ListItemActions from '../../components/ListItemActions';
import {
  generateEventActionCatalogueVCard,
  joinArrayOfObjectToString,
  notifyError,
  notifySuccess,
} from '../../util';
import './styles.css';

/* constants */
const eventTypeSpan = { xxl: 3, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const actionSpan = { xxl: 5, xl: 7, lg: 7, md: 4, sm: 9, xs: 9 };
const rolesSpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const eventFunction = { xxl: 3, xl: 3, lg: 3, md: 0, sm: 0, xs: 0 };
const groupsSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };

const headerLayout = [
  { ...eventTypeSpan, header: 'Event Type' },
  { ...eventFunction, header: 'Function' },
  { ...actionSpan, header: 'Action/Responsibility' },
  { ...rolesSpan, header: 'Roles' },
  { ...groupsSpan, header: 'Groups' },
];

const { confirm } = Modal;

const {
  getFocalPeople,
  getJurisdictions,
  getPartyGroups,
  getRoles,
  getAgencies,
} = httpActions;

/**
 * @class
 * @name ActionCatalog
 * @description Render actions list which have search box, actions and Event Action Catalogue list
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class ActionCatalog extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    showFilters: false,
    isEditForm: false,
    showNotificationForm: false,
    notificationSubject: undefined,
    selectedEventActionCatalogues: [],
    notificationBody: undefined,
    cached: null,
  };

  componentDidMount() {
    getEventActionCatalogues();
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
  handleOnCachedValues = cached => {
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
   * @name openEventActionCatalogueForm
   * @description Open Event Action Catalogue form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openEventActionCatalogueForm = () => {
    openEventActionCatalogueForm();
  };

  /**
   * @function
   * @name openEventActionCatalogueForm
   * @description close Event Action Catalogue form
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  closeEventActionCatalogueForm = () => {
    closeEventActionCatalogueForm();
    this.setState({ isEditForm: false });
  };

  /**
   * @function
   * @name searchEventActionCatalogues
   * @description Search Event Action Catalogues List based on supplied filter word
   *
   * @param {object} event - Event instance
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  searchEventActionCatalogues = event => {
    searchEventActionCatalogues(event.target.value);
  };

  /**
   * @function
   * @name handleEdit
   * @description Handle on Edit action for list item
   *
   * @param {object} eventActionCatalogue Event Action Catalogue to be edited
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleEdit = eventActionCatalogue => {
    selectEventActionCatalogue(eventActionCatalogue);
    this.setState({ isEditForm: true });
    openEventActionCatalogueForm();
  };

  /**
   * @function
   * @name handleShare
   * @description Handle share single EventActionCatalogue action
   *
   * @param {object| object[]} eventActionCatalogues EventActionCatalogue to be shared
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleShare = eventActionCatalogues => {
    let message;
    let subject;
    if (isArray(eventActionCatalogues)) {
      const eventActionCataloguesList = eventActionCatalogues.map(
        eventActionCatalogue =>
          generateEventActionCatalogueVCard(eventActionCatalogue).body
      );
      subject = 'Action Catalogue details';
      message = eventActionCataloguesList.join('\n\n\n');
    } else {
      const { body, subject: title } = generateEventActionCatalogueVCard(
        eventActionCatalogues
      );
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
   * @description Handle on notify EventActionCatalogues
   *
   * @param {object[]} eventActionCatalogues List of Event Action Catalogues selected to be notified
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  openNotificationForm = eventActionCatalogues => {
    this.setState({
      selectedEventActionCatalogues: eventActionCatalogues,
      showNotificationForm: true,
    });
  };

  /**
   * @function
   * @name closeNotificationForm
   * @description Handle on notify Event Action Catalogues
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
   * @name handleRefreshEventActionCatalogues
   * @description Handle list refresh action
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleRefreshEventActionCatalogues = () => {
    refreshEventActionCatalogues(
      () => {
        notifySuccess('Event Action Catalogues refreshed successfully');
      },
      () => {
        notifyError(
          'An error occurred while refreshing Event Action Catalogues please contact system administrator'
        );
      }
    );
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a Event Action Catalogue
   * @param {object} item Resource item to be archived
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  showArchiveConfirm = item => {
    confirm({
      title: `Are you sure you want to archive this record ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteEventActionCatalogue(
          item._id, // eslint-disable-line
          () =>
            notifySuccess('Event Action Catalogue was archived successfully'),
          () =>
            notifyError(
              'An error occurred while archiving Event Action Catalogue, Please contact your system Administrator'
            )
        );
      },
    });
  };

  render() {
    const {
      eventActionCatalogues,
      eventActionCatalogue,
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
      selectedEventActionCatalogues,
      notificationBody,
      notificationSubject,
      cached,
    } = this.state;
    return (
      <>
        {/* Topbar */}
        <Topbar
          search={{
            size: 'large',
            placeholder: 'Search for Event Action Catalogues here ...',
            onChange: this.searchEventActionCatalogues,
            value: searchQuery,
          }}
          actions={[
            {
              label: 'New Action',
              icon: 'plus',
              size: 'large',
              title: 'Add New Action',
              onClick: this.openEventActionCatalogueForm,
            },
          ]}
        />
        {/* end Topbar */}

        {/* list starts */}
        <ItemList
          itemName="action catalog"
          items={eventActionCatalogues}
          page={page}
          itemCount={total}
          loading={loading}
          onFilter={this.openFiltersModal}
          onShare={this.handleShare}
          onRefresh={this.handleRefreshEventActionCatalogues}
          onPaginate={nextPage => paginateEventActionCatalogues(nextPage)}
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
              onSelectItem={onSelectItem}
              onDeselectItem={onDeselectItem}
              renderActions={() => (
                <ListItemActions
                  edit={{
                    name: 'Edit Event Action Catalogue',
                    title: 'Update Event Action Catalogue Details',
                    onClick: () => this.handleEdit(item),
                  }}
                  share={{
                    name: 'Share Event Action Catalogue',
                    title: 'Share Event Action Catalogue details with others',
                    onClick: () => this.handleShare(item),
                  }}
                  archive={{
                    name: 'Archive Event Action Catalogue',
                    title:
                      'Remove Event Action Catalogue from list of active Event Action Catalogues',
                    onClick: () => this.showArchiveConfirm(item),
                  }}
                />
              )}
            >
              {/* eslint-disable react/jsx-props-no-spreading */}
              <Col {...eventTypeSpan}>
                {item.relations.type
                  ? item.relations.type.strings.name.en
                  : 'All'}
              </Col>
              <Col {...eventFunction}>
                {item.relations.function.strings.name.en}
              </Col>
              <Col {...actionSpan}>{item.relations.action.strings.name.en}</Col>
              <Col {...rolesSpan}>
                {joinArrayOfObjectToString(item.relations.roles) || 'N/A'}
              </Col>
              <Col {...groupsSpan}>
                {joinArrayOfObjectToString(item.relations.groups) || 'N/A'}
              </Col>
              {/* eslint-enable react/jsx-props-no-spreading */}
            </ListItem>
          )}
        />
        {/* end list */}

        {/* filter modal */}
        <Modal
          title="Filter Event Action Catalogues"
          visible={showFilters}
          onCancel={this.closeFiltersModal}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
        >
          <EventActionCatalogueFilters
            onCancel={this.closeFiltersModal}
            cached={cached}
            onCache={this.handleOnCachedValues}
            onClearCache={this.handleClearCachedValues}
          />
        </Modal>
        {/* end filter modal */}

        {/* Notification Modal modal */}
        <Modal
          title="Share Event Action Catalogues"
          visible={showNotificationForm}
          onCancel={this.closeNotificationForm}
          footer={null}
          destroyOnClose
          maskClosable={false}
          className="FormModal"
          afterClose={this.handleAfterCloseNotificationForm}
        >
          <NotificationForm
            recipients={getFocalPeople}
            onSearchRecipients={getFocalPeople}
            onSearchJurisdictions={getJurisdictions}
            onSearchGroups={getPartyGroups}
            onSearchAgencies={getAgencies}
            onSearchRoles={getRoles}
            onCancel={this.closeNotificationForm}
            selectedAgencies={selectedEventActionCatalogues}
            subject={notificationSubject}
            body={notificationBody}
          />
        </Modal>
        {/* end Notification modal */}

        {/* create/edit form modal */}
        <Modal
          title={isEditForm ? 'Edit Action' : 'Add New Action'}
          visible={showForm}
          className="FormModal"
          footer={null}
          onCancel={this.closeEventActionCatalogueForm}
          destroyOnClose
          maskClosable={false}
          afterClose={this.handleAfterCloseForm}
        >
          <EventActionCatalogueForm
            posting={posting}
            isEditForm={isEditForm}
            eventActionCatalogue={eventActionCatalogue}
            onCancel={this.closeEventActionCatalogueForm}
          />
        </Modal>
        {/* end create/edit form modal */}
      </>
    );
  }
}

ActionCatalog.propTypes = {
  loading: PropTypes.bool.isRequired,
  posting: PropTypes.bool.isRequired,
  eventActionCatalogues: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string })
  ).isRequired,
  eventActionCatalogue: PropTypes.shape({ name: PropTypes.string }),
  page: PropTypes.number.isRequired,
  showForm: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  total: PropTypes.number.isRequired,
};

ActionCatalog.defaultProps = {
  eventActionCatalogue: null,
  searchQuery: undefined,
};

export default Connect(ActionCatalog, {
  eventActionCatalogues: 'eventActionCatalogues.list',
  eventActionCatalogue: 'eventActionCatalogues.selected',
  loading: 'eventActionCatalogues.loading',
  posting: 'eventActionCatalogues.posting',
  page: 'eventActionCatalogues.page',
  showForm: 'eventActionCatalogues.showForm',
  total: 'eventActionCatalogues.total',
  searchQuery: 'eventActionCatalogues.q',
});
