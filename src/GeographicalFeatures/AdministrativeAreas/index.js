import React from 'react';
import PropTypes from 'prop-types';
import { httpActions } from '@codetanzania/ewea-api-client';
import { Connect } from '@codetanzania/ewea-api-states';
import { Modal, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import Topbar from '../../components/Topbar';
import AdministrativeAreaForm from './Form';
import NotificationForm from '../../components/NotificationForm';
import { truncateString } from '../../util';
import { useList } from '../../hooks';
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

/* ui */
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

// const itemName = get(item, 'strings.name.en', 'N/A');
// const itemCode = get(item, 'strings.code', 'N/A');
// const itemLevel = get(item, 'relations.level.strings.name.en', 'N/A');
// const itemParent = get(item, 'relations.parent.strings.name.en', 'N/A');
// const itemDescription = get(item, 'strings.description.en', 'N/A');
// const body = `Name: ${itemName}\nCode: ${itemCode}\nLevel: ${itemLevel}\nParent: ${itemParent}\nDescription: ${itemDescription}\n`;
const FIELDS_TO_SHARE = {
  name: { header: 'Name', dataIndex: 'strings.name.en', defaultValue: 'N/A' },
  code: { header: 'Code', dataIndex: 'strings.code', defaultValue: 'N/A' },
  level: {
    header: 'Level',
    dataIndex: 'relations.level.strings.name.en',
    defaultValue: 'N/A',
  },
  parent: {
    header: 'Parent',
    dataIndex: 'relations.parent.strings.name.en',
    defaultValue: 'N/A',
  },
  description: {
    header: 'Description',
    dataIndex: 'strings.description.en',
    defaultValue: 'N/A',
  },
};

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

const AdministrativeAreasList = ({
  administrativeAreas,
  loading,
  page,
  posting,
  administrativeArea,
  showForm,
  searchQuery,
  total,
}) => {
  const {
    isEditForm,
    showNotificationForm,
    notificationSubject,
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
  } = useList('administrativeAreas');

  return (
    <>
      {/* start: list top bar */}
      <Topbar
        search={{
          size: 'large',
          placeholder: 'Search administrative areas ...',
          title: 'Search administrative areas ...',
          onChange: handleOnSearch,
          value: searchQuery,
        }}
        action={{
          label: 'New Area',
          icon: <PlusOutlined />,
          size: 'large',
          title: 'Add New Administrative Area',
          onClick: handleOnOpenForm,
        }}
      />
      {/* end: list top bar */}

      {/* start: list */}
      <ItemList
        itemName="AdministrativeArea"
        items={administrativeAreas}
        page={page}
        itemCount={total}
        loading={loading}
        // onFilter={this.handleListFiltersFormOpen}
        onShare={(items) => handleOnShare(items, FIELDS_TO_SHARE)}
        onRefresh={handleOnRefreshList}
        onPaginate={handleOnPaginate}
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
                  onClick: () => handleOnEdit(item),
                  icon: 'edit',
                },
                {
                  name: 'Share Administrative Area',
                  title: 'Share administrative area details with others',
                  onClick: () => handleOnShare(item, FIELDS_TO_SHARE),
                  icon: 'share',
                },
                {
                  name: 'Archive AdministrativeArea',
                  title:
                    'Remove administrative area from list of active administrative areas',
                  onClick: () => handleOnArchiveItem(item),
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
        onCancel={handleOnCloseNotificationForm}
        footer={null}
        destroyOnClose
        maskClosable={false}
        className="modal-window-50"
        afterClose={handleAfterCloseNotificationForm}
      >
        <NotificationForm
          onSearchRecipients={getFocalPeople}
          onSearchJurisdictions={getJurisdictions}
          onSearchGroups={getPartyGroups}
          onSearchAgencies={getAgencies}
          onSearchRoles={getRoles}
          subject={notificationSubject}
          body={notificationBody}
          onCancel={handleOnCloseNotificationForm}
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
        onCancel={handleOnCloseForm}
        afterClose={handleAfterCloseForm}
        maskClosable={false}
        destroyOnClose
      >
        <AdministrativeAreaForm
          administrativeArea={administrativeArea}
          posting={posting}
          isEditForm={isEditForm}
          onCancel={handleOnCloseForm}
          onCreate={handleOnCreateItem}
          onUpdate={handleOnUpdateItem}
        />
      </Modal>
      {/* end: form modal */}
    </>
  );
};

AdministrativeAreasList.propTypes = {
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

AdministrativeAreasList.defaultProps = {
  administrativeArea: null,
  searchQuery: undefined,
};

export default Connect(AdministrativeAreasList, {
  administrativeAreas: 'administrativeAreas.list',
  loading: 'administrativeAreas.loading',
  posting: 'administrativeAreas.posting',
  searchQuery: 'administrativeAreas.q',
  showForm: 'administrativeAreas.showForm',
  page: 'administrativeAreas.page',
  total: 'administrativeAreas.total',
  administrativeArea: 'administrativeAreas.selected',
});
