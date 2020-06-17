import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Row, Col } from 'antd';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { assignItemsGridSpan } from '../../util';

/**
 * @function
 * @name Grid
 * @description Render Grid components with provided params
 * @param {object} props Component object properties
 * @param {object[]} props.items Items to be rendered on the grid
 * @param {string} props.header Grid Header
 * @param {number} props.colPerRow Max items per grid row
 * @param {Function} props.renderItem Callback for rendering  a single item
 * @returns {object} Grid components
 * @version 0.1.0
 * @since 0.1.0
 */
const Grid = ({ items, header, colPerRow, renderItem }) => {
  const spannedItems = assignItemsGridSpan(sortBy(items, 'weight'), colPerRow);
  const columns = map(spannedItems, (item) => (
    <Col xs={24} sm={24} md={items.length > 1 ? 12 : 24} lg={item.span}>
      {renderItem(item)}
    </Col>
  ));

  return (
    <>
      {header && (
        <Divider orientation="left" plain>
          {header}
        </Divider>
      )}
      <Row>{columns}</Row>
    </>
  );
};

Grid.propTypes = {
  header: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  colPerRow: PropTypes.number,
  renderItem: PropTypes.func.isRequired,
};

Grid.defaultProps = {
  header: undefined,
  colPerRow: 4,
  items: [],
};

export default Grid;
