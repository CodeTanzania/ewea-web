import { reduxActions } from '@codetanzania/ewea-api-states';
import { FilterOutlined, HddOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Pagination, Row, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { notifyError, notifySuccess } from '../../../util';
import './styles.css';

const { refreshFeatures, paginateFeatures } = reduxActions;
/**
 *
 * @function
 * @name FacilitiesActionBar
 * @description Render action bar for actions which are applicable to list
 * content
 *
 * @param {object} props props object
 * @param {number} props.page current page
 * @param {number} props.total total number of facilities
 * @param {Function} props.onFilter filters facilities
 *
 * @returns {object} React Component
 *
 * @version 0.1.0
 * @since 0.1.0
 */
const FacilitiesActionBar = ({ page, total, onFilter }) => (
  <div className="FacilitiesActionBar">
    <Row>
      <Col span={1} xl={1} className="checkbox">
        <Checkbox />
      </Col>

      <Col span={1} xl={1}>
        <Button
          shape="circle"
          icon={<ReloadOutlined />}
          title="Refresh Facilities"
          onClick={() =>
            refreshFeatures(
              () => {
                notifySuccess('Facilities refreshed successfully');
              },
              () => {
                notifyError(
                  `An Error occurred while refreshing Facilities, 
                  please Facilities system administrator!`
                );
              }
            )
          }
          className="actionButton"
          size="large"
        />
      </Col>

      <Col span={1} xl={1}>
        <Button
          type="circle"
          icon={<HddOutlined />}
          title="Archive selected Facilities"
          className="actionButton"
          size="large"
        />
      </Col>

      <Col
        span={1}
        offset={17}
        xl={{ span: 1, offset: 16 }}
        xxl={{ span: 1, offset: 17 }}
      >
        <Button
          type="circle"
          icon={<FilterOutlined />}
          title="Filter Facilities"
          className="actionButton"
          size="large"
          onClick={onFilter}
        />
      </Col>

      <Col span={3} xl={4} xxl={3}>
        <Pagination
          simple
          defaultCurrent={page}
          total={total}
          onChange={(nextPage) => paginateFeatures(nextPage)}
          className="pagination"
        />
      </Col>
    </Row>
  </div>
);

/* props validation */
FacilitiesActionBar.propTypes = {
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default FacilitiesActionBar;
