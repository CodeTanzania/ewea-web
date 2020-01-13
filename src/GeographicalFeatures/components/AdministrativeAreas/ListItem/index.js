import { Avatar, Checkbox, Col, Modal, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ListItemActions from '../../../../components/ListItemActions';
import './styles.css';
import { truncateString } from '../../../../util';

/* constants */
const { confirm } = Modal;
const sideSpan = { xxl: 1, xl: 1, lg: 1, md: 2, sm: 3, xs: 3 };
const nameSpan = { xxl: 5, xl: 3, lg: 3, md: 5, sm: 10, xs: 10 };
const codeSpan = { xxl: 3, xl: 7, lg: 7, md: 0, sm: 0, xs: 0 };
const descriptionSpan = { xxl: 14, xl: 7, lg: 8, md: 11, sm: 0, xs: 0 };
const isHoveredSpan = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 2, xs: 2 };

/**
 * @class
 * @name AdministrativeAreasListItem
 * @description Single administrative area list item component.
 * Render single administrative area details
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class AdministrativeAreasListItem extends Component {
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
   * @description show confirm modal before archiving a administrative area
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

  /**
   * @function
   * @name previewOnMap
   * @description preview geo-spatial data on map
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  previewOnMap = () => {
    const { history } = this.props;
    history.push('/map');
  };

  render() {
    const {
      abbreviation,
      code,
      name,
      description,
      onEdit,
      onMapPreview,
      color,
    } = this.props;
    const { isHovered } = this.state;
    const { isSelected } = this.props;
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
        <Avatar style={{ backgroundColor: color }}>{abbreviation}</Avatar>
      );
    }

    return (
      <div
        className="AdministrativeAreasListItem"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Row>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <Col {...sideSpan}>{sideComponent}</Col>
          <Col {...nameSpan}>{name}</Col>
          <Col {...codeSpan}>{code}</Col>
          <Col {...descriptionSpan}>
            <span title={description}>{truncateString(description, 120)}</span>
          </Col>
          <Col {...isHoveredSpan}>
            {/* eslint-enable react/jsx-props-no-spreading */}
            {isHovered && (
              <ListItemActions
                edit={{
                  name: 'Edit Administrative Area',
                  title: 'Update Administrative Area Details',
                  onClick: onEdit,
                }}
                archive={{
                  name: 'Archive Administrative Area',
                  title:
                    'Remove Administrative Area from list of active Administrative Areas',
                  onClick: this.showArchiveConfirm,
                }}
                onMapPreview={{
                  name: 'Preview Administrative Area on Map',
                  title: 'Preview Administrative Area on Map',
                  onClick: onMapPreview,
                }}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

AdministrativeAreasListItem.propTypes = {
  abbreviation: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onArchive: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onMapPreview: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  onDeselectItem: PropTypes.func.isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default withRouter(AdministrativeAreasListItem);
