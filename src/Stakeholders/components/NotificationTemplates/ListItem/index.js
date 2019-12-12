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
const abbreviationSpan = { xxl: 6, xl: 8, lg: 5, md: 4, sm: 9, xs: 9 };
const descriptionSpan = { xxl: 8, xl: 7, lg: 4, md: 7, sm: 0, xs: 0 };
const codeSpan = { xxl: 4, xl: 3, lg: 6, md: 0, sm: 0, xs: 0 };
// const areaSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 2 };

/**
 * @class
 * @name NotificationTemplatesListItem
 * @description Single focal person list item component.
 * Render single focal person details
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class NotificationTemplatesListItem extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isHovered: false,
  };

  /**
   * @function
   * @name handleMouseEnter
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
   * @description show confirm modal before archiving a focal person
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
      name,
      description,
      code,
      onEdit,
      onShare,
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
          {name.toUpperCase().charAt(0)}
        </Avatar>
      );
    }

    return (
      <div
        className="FocalPeopleListItem"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Row>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <Col {...sideSpan}>{sideComponent}</Col>
          <Col {...nameSpan}>{name}</Col>
          <Col {...abbreviationSpan}>
            {abbreviation}
            {/* {role ? `${role}, ${agencyAbbreviation}` : 'N/A'} */}
          </Col>
          <Col {...descriptionSpan}>{description}</Col>
          <Col {...codeSpan}>{code}</Col>
          <Col {...isHoveredSpan}>
            {/* eslint-enable react/jsx-props-no-spreading */}
            {isHovered && (
              <ListItemActions
                edit={{
                  name: 'Edit Focal Person',
                  title: 'Update Focal Person Details',
                  onClick: onEdit,
                }}
                share={{
                  name: 'Share Focal Person',
                  title: 'Share Focal Person details with others',
                  onClick: onShare,
                }}
                archive={{
                  name: 'Archive Focal Person',
                  title: 'Remove Focal Person from list of active focal People',
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

NotificationTemplatesListItem.propTypes = {
  abbreviation: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  onArchive: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onDeselectItem: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default NotificationTemplatesListItem;
