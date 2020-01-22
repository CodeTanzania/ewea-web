import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import remove from 'lodash/remove';
import intersectionBy from 'lodash/intersectionBy';

import Toolbar from '../Toolbar';
import ListHeader from '../ListHeader';
import './styles.css';

const ItemList = ({
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
  const handleSelectItem = item => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleDeselectItem = item => {
    const selectedList = [...selectedItems];

    // eslint-disable-next-line
    remove(selectedList, listItem => listItem._id === item._id);
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

    remove(uniquePages, item => item === page);

    items.forEach(item => {
      // eslint-disable-next-line
      remove(uniqueSelectedList, listItem => listItem._id === item._id);
    });

    setSelectedItems(uniqueSelectedList);
    setSelectedPages(uniquePages);
  };

  /**
   * @function
   * @name getSelectedItemCount
   * @description Count selected items on the list
   *
   * @returns {number} Number of selected items
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const getSelectedItemCount = () =>
    intersectionBy(selectedItems, items, '_id').length;

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
  const isSelected = item => map(selectedItems, '_id').includes(item._id); // eslint-disable-line

  return (
    <div className="List">
      <Toolbar
        itemName={itemName}
        page={page}
        total={itemCount}
        selectedItemsCount={getSelectedItemCount()}
        onFilter={onFilter}
        onNotify={onNotify ? () => onNotify(selectedItems) : null}
        onPaginate={nextPage => onPaginate(nextPage)}
        onRefresh={() => onRefresh()}
        onShare={() => onShare(selectedItems)}
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
        renderItem={item =>
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

ItemList.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({ _id: PropTypes.string }))
    .isRequired,
  headerLayout: PropTypes.arrayOf(PropTypes.shape({ header: PropTypes.string }))
    .isRequired,
  itemName: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  onFilter: PropTypes.func,
  onNotify: PropTypes.func.isRequired,
  onPaginate: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  renderListItem: PropTypes.func.isRequired,
};

ItemList.defaultProps = {
  onFilter: null,
};

export default ItemList;
