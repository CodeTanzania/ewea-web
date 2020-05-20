import { getJwtToken } from '@codetanzania/ewea-api-client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import remove from 'lodash/remove';

import Toolbar from '../Toolbar';
import ListHeader from '../ListHeader';
import './styles.css';

/**
 * @function
 * @name CustomList
 * @description List UI with tool bar , list header and list items
 * @param {object} props CustomList props
 * @param {string} props.itemName
 * @param {object[]} props.items
 * @param {number} props.page
 * @param {boolean} props.loading
 * @param {number} props.itemCount
 * @param {object} props.headerLayout
 * @param {Function} props.onFilter
 * @param {Function} props.onNotify
 * @param {Function} props.onPaginate
 * @param {Function} props.onRefresh
 * @param {Function} props.onShare
 * @param {Function} props.generateExportUrl
 * @param {Function} props.renderListItem
 * @returns {object} CustomList component
 * @version 0.1.0
 * @since 0.1.0
 */
const CustomList = ({
  itemName,
  items,
  page,
  loading,
  itemCount,
  headerLayout,
  onFilter,
  onNotify,
  onPaginate,
  onRefresh,
  onShare,
  generateExportUrl,
  renderListItem,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  /**
   * @function
   * @name handleSelectItem
   * @description Handle select a single row in a list action
   *
   * @param {object} item selected item object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleSelectItem = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleDeselectItem = (item) => {
    const selectedList = [...selectedItems];

    // eslint-disable-next-line
    remove(selectedList, (listItem) => listItem._id === item._id);
    setSelectedItems(selectedList);
  };

  /**
   * @function
   * @name handleSelectPageItems
   * @description Handle select all items actions from current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleSelectPageItems = () => {
    const uniqueSelectedItems = uniqBy([...selectedItems, ...items], '_id');
    const uniquePages = uniq([...selectedPages, page]);

    setSelectedItems(uniqueSelectedItems);
    setSelectedPages(uniquePages);
  };

  /**
   * @function
   * @name handleDeselectPageItems
   * @description Handle deselect all items in a current page
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleDeselectPageItems = () => {
    const uniqueSelectedList = uniqBy([...selectedItems], '_id');
    const uniquePages = uniq([...selectedPages]);

    remove(uniquePages, (item) => item === page);

    items.forEach((item) => {
      // eslint-disable-next-line
      remove(uniqueSelectedList, (listItem) => listItem._id === item._id);
    });

    setSelectedItems(uniqueSelectedList);
    setSelectedPages(uniquePages);
  };

  /**
   * @function
   * @name isSelected
   * @description Check if item is among selected items
   *
   * @param {object} item item to check if it is selected
   * @returns {boolean} boolean value is item is selected
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const isSelected = (item) => map(selectedItems, '_id').includes(item._id); // eslint-disable-line

  return (
    <div className="List">
      <Toolbar
        itemName={itemName}
        page={page}
        total={itemCount}
        selectedItemsCount={selectedItems.length}
        onFilter={onFilter}
        onNotify={onNotify ? () => onNotify(selectedItems) : null}
        onPaginate={(nextPage) => onPaginate(nextPage)}
        onRefresh={() => onRefresh()}
        onShare={() => onShare(selectedItems)}
        exportUrl={
          generateExportUrl
            ? generateExportUrl({
                filter: { _id: map(selectedItems, '_id') },
                token: getJwtToken(),
              })
            : null
        }
      />

      <ListHeader
        headerLayout={headerLayout}
        onSelectAll={handleSelectPageItems}
        onDeselectAll={handleDeselectPageItems}
        isBulkSelected={selectedPages.includes(page)}
      />

      <List
        loading={loading}
        dataSource={items}
        renderItem={(item) =>
          renderListItem({
            item,
            isSelected: isSelected(item),
            onSelectItem: () => handleSelectItem(item),
            onDeselectItem: () => handleDeselectItem(item),
          })
        }
      />
    </div>
  );
};

CustomList.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({ _id: PropTypes.string }))
    .isRequired,
  headerLayout: PropTypes.arrayOf(PropTypes.shape({ header: PropTypes.string }))
    .isRequired,
  itemName: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  onFilter: PropTypes.func,
  onNotify: PropTypes.func,
  onPaginate: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  generateExportUrl: PropTypes.func,
  renderListItem: PropTypes.func.isRequired,
};

CustomList.defaultProps = {
  onFilter: null,
  onNotify: null,
  generateExportUrl: null,
};

export default CustomList;
