import { Avatar, Checkbox, Col, Modal, Row } from 'antd';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import React, { Component } from 'react';
import ListItemActions from '../../../../components/ListItemActions';
import './styles.css';

/* constants */
const { confirm } = Modal;
const sideSpan = { xxl: 1, xl: 1, lg: 1, md: 2, sm: 3, xs: 3 };
const nameSpan = { xxl: 3, xl: 3, lg: 4, md: 5, sm: 10, xs: 10 };
const codeSpan = { xxl: 3, xl: 3, lg: 3, md: 4, sm: 9, xs: 9 };
const amenitySpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const addressSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 7, xl: 7, lg: 6, md: 0, sm: 0, xs: 0 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 2 };

/**
 * @class
 * @name FeaturesListItem
 * @description Single critical facility list item component.
 * Render single critical facility details
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class FeaturesListItem extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isHovered: false,
  };

  /**
   * @function
   * @name handleMouseEnter
   * useEnter
   * @description Handle on MouseEnter ListItem event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  /**
   * @function
   * @name handleMouseEnter
   * @description Handle on MouseLeave ListItem event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  handleMouseLeave = () => {
    this.setState({ isHovered: false });
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
  handleToggleSelect = event => {
    const { isSelected } = this.state;
    const { onSelectItem, onDeselectItem } = this.props;

    this.setState({ isSelected: !isSelected });
    if (event.target.checked) {
      onSelectItem();
    } else {
      onDeselectItem();
    }
  };

  /**
   * @function
   * @name showArchiveConfirm
   * @description show confirm modal before archiving a critical facility
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  showArchiveConfirm = () => {
    const { name, onArchive } = this.props;
    confirm({
      title: `Are you sure you want to archive ${name} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onArchive();
      },
    });
  };

  render() {
    const {
      abbreviation,
      description,
      code,
      amenity,
      address,
      name,
      onEdit,
    } = this.props;
    const { isHovered } = this.state;
    const { isSelected } = this.props;
    const avatarBackground = randomColor();
    let sideComponent = null;

    if (isSelected) {
      sideComponent = (
        <Checkbox
          className="Checkbox"
          onChange={this.handleToggleSelect}
          checked={isSelected}
        />
      );
    } else {
      sideComponent = isHovered ? (
        <Checkbox
          className="Checkbox"
          onChange={this.handleToggleSelect}
          checked={isSelected}
        />
      ) : (
        <Avatar style={{ backgroundColor: avatarBackground }}>
          {abbreviation}
        </Avatar>
      );
    }

    return (
      <div
        className="FeaturesListItem"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Row>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <Col {...sideSpan}>{sideComponent}</Col>
          <Col {...nameSpan}>{name}</Col>
          <Col {...codeSpan}>{code}</Col>
          <Col {...amenitySpan}>{amenity}</Col>
          <Col {...addressSpan}>{address}</Col>
          <Col {...descriptionSpan} title={description}>
            {' '}
            {description}{' '}
          </Col>
          <Col {...isHoveredSpan}>
            {/* eslint-disable react/jsx-props-no-spreading */}
            {isHovered && (
              <ListItemActions
                edit={{
                  name: 'Edit Critical Facility',
                  title: 'Update Critical Facility Details',
                  onClick: onEdit,
                }}
                archive={{
                  name: 'Archive Critical Facility',
                  title:
                    'Remove Critical Facility from list of active Critical Facilities',
                  onClick: this.showArchiveConfirm,
                }}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

FeaturesListItem.propTypes = {
  abbreviation: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  amenity: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  onArchive: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onDeselectItem: PropTypes.func.isRequired,
};

export default FeaturesListItem;
