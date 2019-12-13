import { Avatar, Checkbox, Col, Modal, Row } from 'antd';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import React, { Component } from 'react';
import ListItemActions from '../../../../components/ListItemActions';
import './styles.css';

/* constants */
const { confirm } = Modal;
const sideSpan = { xxl: 1, xl: 1, lg: 1, md: 2, sm: 3, xs: 3 };
const referenceIDSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const typeSpan = { xxl: 3, xl: 3, lg: 4, md: 5, sm: 0, xs: 0 };
const groupSpan = { xxl: 4, xl: 4, lg: 5, md: 7, sm: 0, xs: 0 };
const eventSpan = { xxl: 8, xl: 9, lg: 17, md: 0, sm: 19, xs: 19 };
// const areaSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 0, xs: 0 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 2 };

/**
 * @class
 * @name EventListItem
 * @description Single event list item component.
 * Render single event details
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventListItem extends Component {
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
   * @description show confirm modal before archiving a event
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  showArchiveConfirm = () => {
    const { event, onArchive } = this.props;
    confirm({
      title: `Are you sure you want to archive ${event} ?`,
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
      number,
      abbreviation,
      group = 'N/A',
      type = 'N/A',
      // urgency,
      // severity,
      // status,
      description,
      // event,
      color,
      // location,
      onEdit,
      onView,
    } = this.props;
    const { isHovered } = this.state;
    const { isSelected } = this.props;
    const avatarBackground = color || randomColor();
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
        className="EventListItem"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Row>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <Col {...sideSpan}>{sideComponent}</Col>
          <Col {...eventSpan} title={description}>
            {description}
          </Col>
          {/* <Col {...areaSpan}>{location}</Col> */}
          <Col {...referenceIDSpan}>{number}</Col>
          <Col {...typeSpan}>{type}</Col>
          <Col {...groupSpan}>{group}</Col>
          <Col {...isHoveredSpan}>
            {/* eslint-enable react/jsx-props-no-spreading */}
            {isHovered && (
              <ListItemActions
                view={{
                  name: 'View Event',
                  title: 'View Event Details',
                  onClick: onView,
                }}
                edit={{
                  name: 'Edit Event',
                  title: 'Update Event Details',
                  onClick: onEdit,
                }}
                archive={{
                  name: 'Archive Event',
                  title: 'Remove Event from list of active Events',
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

EventListItem.propTypes = {
  abbreviation: PropTypes.string.isRequired,
  urgency: PropTypes.string.isRequired,
  severity: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  event: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  onArchive: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onDeselectItem: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default EventListItem;
