import React from 'react';
import { Button, Row, Col, Input, Grid } from 'antd';
import PropTypes from 'prop-types';

import { CreateFloatingButton } from '../FloatingButton';
import { isMobileScreen } from '../../util';
import './styles.css';

/* constants */
const { Search } = Input;
const { useBreakpoint } = Grid;

/**
 * @function
 * @name Topbar
 * @description Topbar component which renders search input and primary actions
 *
 * @param {object} props props object
 * @param {object} props.search on Search callback
 * @param {object} props.action primary action
 * @returns {object} react element
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const Topbar = ({ search, action }) => {
  const screens = useBreakpoint();
  const searchComponent = (
    <Search
      size={search.size}
      placeholder={search.placeholder}
      onChange={search.onChange}
      value={search.value}
      allowClear
      className="TopbarSearch"
    />
  );

  return (
    <div>
      {isMobileScreen(screens) && (
        <CreateFloatingButton onClick={action.onClick} />
      )}
      <div className="Topbar">
        {isMobileScreen(screens) ? (
          searchComponent
        ) : (
          <Row>
            {/* search box */}
            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
              {searchComponent}
            </Col>
            {/* start: primary action */}
            <Col
              xxl={{ span: 4, offset: 8 }}
              xl={{ span: 4, offset: 8 }}
              lg={{ span: 10, offset: 2 }}
              md={{ span: 6, offset: 6 }}
              sm={24}
              xs={24}
            >
              <Button
                icon={action.icon}
                onClick={action.onClick}
                type="primary"
                size="large"
                block
              >
                {action.label}
              </Button>
            </Col>
            {/* end: primary actions */}
          </Row>
        )}
      </div>
    </div>
  );
};
/* props validations */
Topbar.propTypes = {
  search: PropTypes.shape({
    placeholder: PropTypes.string,
    size: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    title: PropTypes.string,
    onClick: PropTypes.func,
    icon: PropTypes.node,
  }),
};

Topbar.defaultProps = {
  action: null,
};

export default Topbar;
