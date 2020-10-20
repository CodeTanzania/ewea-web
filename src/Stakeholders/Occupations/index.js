import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect } from '@codetanzania/ewea-api-states';
import { Modal, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import ItemList from '../../components/List';
import ListItem from '../../components/ListItem';
import NotificationForm from '../../components/NotificationForm';
import { useList } from '../../hooks';
import { truncateString } from '../../util';
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

/* constants */
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
const FIELDS_TO_SHARE = {
  name: { header: 'Name', dataIndex: 'strings.name.en', defaultValue: 'N/A' },
  description: {
    header: 'Description',
    dataIndex: 'strings.description.en',
    defaultValue: 'N/A',
  },
};

/**
 * @function
 * @name Occupations
 * @description Render occupation module which has search box, actions and list of occupations
 * @param { object} props component properties object
 * @param {object[]} props.occupations List of occupations from the API
 * @param {object} props.occupation Selected occupation
 * @param {boolean} props.loading Flag to indicate fetching data from API
 * @param {boolean} props.posting Flag to indicate posting data to the API
 * @param {number} props.page Current page
 * @param {boolean} props.showForm Flag for controlling visibility of the form for
 * creating or updating resource
 * @param {string} props.searchQuery Search query string
 * @param {number} props.total Total number of resources in the API
 * @returns {object} Party Occupations list ui
 * @version 0.1.0
 * @since 0.1.0
 */
const Occupations = ({
  occupations,
  loading,
  showForm,
  posting,
  page,
  total,
  occupation,
  searchQuery,
}) => {
  const {
    isEditForm,
    showNotificationForm,
    notificationBody,

    handleOnOpenForm,
    handleOnCloseForm,
    handleOnSearch,
    handleOnEdit,
    handleOnCloseNotificationForm,
    handleAfterCloseForm,
    handleAfterCloseNotificationForm,
    handleOnRefreshList,
    handleOnArchiveItem,
    handleOnCreateItem,
    handleOnUpdateItem,
    handleOnShare,
    handleOnPaginate,
  } = useList('partyOccupations', { wellknown: 'occupations' });

  return (
    <>
      {/* Topbar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search for occupations here ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Occupation',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Occupation',
          onClick: handleOnOpenForm,
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
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onRefresh={handleOnRefreshList}
        onPaginate={handleOnPaginate}
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
                onClick: () => handleOnEdit(item),
                icon: 'edit',
              },
              {
                name: 'Share Stakeholder Occupation',
                title: 'Share Stakeholder Occupation details with others',
                onClick: () => handleOnShare(item, FIELDS_TO_SHARE),
                icon: 'share',
              },
              {
                name: 'Archive Stakeholder Occupation',
                title:
                  'Remove Stakeholder Occupation from list of active focal people',
                onClick: () => handleOnArchiveItem(item),
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
        onCancel={handleOnCloseNotificationForm}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="modal-window-50"
        afterClose={handleAfterCloseNotificationForm}
      >
        <NotificationForm
          //
          onSearchRecipients={getFocalPeople}
          onSearchJurisdictions={getJurisdictions}
          onSearchGroups={getPartyGroups}
          onSearchAgencies={getAgencies}
          onSearchOccupations={getPartyOccupationsFromAPI}
          body={notificationBody}
          onCancel={handleOnCloseNotificationForm}
        />
      </Modal>
      {/* end Notification modal */}

      {/* create/edit form modal */}
      <Modal
        className="modal-window-50"
        title={isEditForm ? 'Edit Occupation' : 'Add New Occupation'}
        visible={showForm}
        footer={null}
        onCancel={handleOnCloseForm}
        destroyOnClose
        maskClosable={false}
        afterClose={handleAfterCloseForm}
      >
        <OccupationForm
          posting={posting}
          occupation={occupation}
          onCancel={handleOnCloseForm}
          onCreate={handleOnCreateItem}
          onUpdate={handleOnUpdateItem}
        />
      </Modal>
      {/* end create/edit form modal */}
    </>
  );
};

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
