import { Avatar, Checkbox, Col, Modal, Row } from 'antd';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import React, { Component } from 'react';
import ListItemActions from '../../../components/ListItemActions';
import './styles.css';

/* constants */
const { confirm } = Modal;
const sideSpan = { xxl: 1, xl: 1, lg: 1, md: 2, sm: 3, xs: 3 };
const nameSpan = { xxl: 5, xl: 5, lg: 4, md: 5, sm: 10, xs: 10 };
const codeSpan = { xxl: 2, xl: 2, lg: 2, md: 2, sm: 5, xs: 5 };
const indicatorSpan = { xxl: 5, xl: 5, lg: 5, md: 4, sm: 4, xs: 4 };
const descriptionSpan = { xxl: 9, xl: 9, lg: 10, md: 10, sm: 0, xs: 0 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 2 };

/**
 * @class
 * @name EventQuestionsListItem
 * @description Single event question list item component.
 * Render single event question details
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class EventQuestionsListItem extends Component {
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
   * @name handleMouseLeave
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
   * @description show confirm modal before archiving an event question
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
      name,
      indicator,
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
        className="EventQuestionsListItem"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Row>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <Col {...sideSpan}>{sideComponent}</Col>
          <Col {...nameSpan}>{name}</Col>
          <Col {...codeSpan}>{code}</Col>
          <Col {...indicatorSpan}>{indicator}</Col>
          <Col {...descriptionSpan} title={description}>
            {' '}
            {description}{' '}
          </Col>
          <Col {...isHoveredSpan}>
            {/* eslint-disable react/jsx-props-no-spreading */}
            {isHovered && (
              <ListItemActions
                edit={{
                  name: 'Edit Event Question',
                  title: 'Update Event Question Details',
                  onClick: onEdit,
                }}
                archive={{
                  name: 'Archive Event Question',
                  title:
                    'Remove Event Question from list of active Event Questions',
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

EventQuestionsListItem.propTypes = {
  abbreviation: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  indicator: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onArchive: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onDeselectItem: PropTypes.func.isRequired,
};

export default EventQuestionsListItem;
