import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Checkbox, Col, Row } from 'antd';
import randomColor from 'randomcolor';
import './styles.css';

/* constants */
const sideSpan = { xxl: 1, xl: 1, lg: 1, md: 2, sm: 2, xs: 3 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 3 };

/**
 * @param {*} props props object
 * @param {*} props.name item name
 * @param {*} props.avatarBackgroundColor item avatar background color
 * @param {*} props.item valid item
 * @param {*} props.isSelected select flag
 * @param {*} props.onSelectItem select callback
 * @param {*} props.onDeselectItem deselect callback
 * @param {*} props.renderActions item render actions
 * @param {*} props.children item children
 * @function
 * @name ListItem
 * @description Generic list item(row) for list component
 * @returns {object} React Component
 * @version 0.1.0
 * @since 0.1.0
 */
const ListItem = ({
  name,
  avatarBackgroundColor,
  item,
  isSelected,
  onSelectItem,
  onDeselectItem,
  renderActions,
  children,
}) => {
  const [isHovered, setHovered] = useState(false);
  const avatarBackground = avatarBackgroundColor || randomColor();

  /**
   * @function
   * @name handleMouseEnter
   * @description Handle on MouseEnter ListItem event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleMouseEnter = () => {
    setHovered(true);
  };

  /**
   * @function
   * @name handleMouseEnter
   * @description Handle on MouseLeave ListItem event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleMouseLeave = () => {
    setHovered(false);
  };

  /**
   * @function
   * @name handleToggleSelect
   * @description Handle Toggling List Item checkbox
   *
   * @param {object} event - Event object
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  const handleToggleSelect = (event) => {
    if (event.target.checked) {
      onSelectItem();
    } else {
      onDeselectItem();
    }
  };

  const renderSideComponent = () => {
    if (isSelected) {
      return (
        <Checkbox
          className="Checkbox"
          onChange={handleToggleSelect}
          checked={isSelected}
        />
      );
    }

    return isHovered ? (
      <Checkbox
        className="Checkbox"
        onChange={handleToggleSelect}
        checked={isSelected}
      />
    ) : (
      <Avatar style={{ backgroundColor: avatarBackground }}>
        {(name || item.name).toUpperCase().charAt(0)}
      </Avatar>
    );
  };

  return (
    <div
      className="ListItem"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Row>
        {/* eslint-disable react/jsx-props-no-spreading */}
        <Col {...sideSpan}>{renderSideComponent()}</Col>
        {children}
        <Col {...isHoveredSpan}>
          {/* eslint-enable react/jsx-props-no-spreading */}
          {renderActions()}
        </Col>
      </Row>
    </div>
  );
};

ListItem.propTypes = {
  item: PropTypes.shape({
    location: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.shape({ strings: PropTypes.object }),
    area: PropTypes.shape({ strings: PropTypes.object }),
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    party: PropTypes.shape({
      name: PropTypes.string,
      abbreviation: PropTypes.string,
    }),
  }).isRequired,
  name: PropTypes.string,
  avatarBackgroundColor: PropTypes.string,
  children: PropTypes.node.isRequired,
  renderActions: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onDeselectItem: PropTypes.func.isRequired,
};

ListItem.defaultProps = {
  name: undefined,
  avatarBackgroundColor: undefined,
};

export default ListItem;
