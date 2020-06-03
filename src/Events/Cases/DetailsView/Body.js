import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { reduxActions } from '@codetanzania/ewea-api-states';
import { Typography, Row, Col, Button } from 'antd';
import ReactToPrint from 'react-to-print';
import { ReloadOutlined, PrinterOutlined } from '@ant-design/icons';
import get from 'lodash/get';

import { formatDate, notifySuccess, notifyError } from '../../../util';
import SectionHeader from '../../../components/SectionHeader';
import './styles.css';

/* redux actions */
const { getCase } = reduxActions;

/* constants */
const { Text } = Typography;

/**
 * @function
 * @name CaseToolbar
 * @description Toolbar for case details view
 * @param {object} props Component properties object
 * @param {object} props.data Selected case data
 * @param {Function} props.onContent Callback for print action used by react-to print
 * @returns {object} CaseToolbar
 * @version 0.1.0
 * @since 0.1.0
 */
const CaseToolbar = ({ data, onContent }) => {
  return (
    <div className="CaseToolbar">
      <Row>
        <Col span={1}>
          <Button
            shape="circle"
            size="large"
            icon={<ReloadOutlined />}
            title="Refresh Case"
            className="actionButton"
            onClick={() =>
              getCase(
                // eslint-disable-next-line
                data._id,
                () => notifySuccess('Case was refreshed successfully'),
                () =>
                  notifyError(
                    'An error occurred while refreshing case, please contact your system administrator'
                  )
              )
            }
          />
        </Col>

        <Col span={1}>
          <ReactToPrint
            trigger={() => (
              <Button
                shape="circle"
                size="large"
                icon={<PrinterOutlined />}
                title="Print Event Details"
                className="actionButton"
              />
            )}
            content={onContent}
            pageStyle={{ margin: '30px' }}
          />
        </Col>
      </Row>
    </div>
  );
};

/**
 * @function
 * @name CaseDetails
 * @param {object} props Case Details component props
 * @param {string} props.number event number
 * @param {Date} props.reportedDate event report date
 * @description This is event details section which will be visible on printed
 * report only
 * @returns {object} CaseDetails Component
 * @version 0.1.0
 * @since 0.1.0
 */
const CaseDetails = ({ number, reportedDate }) => {
  return (
    <>
      <p>
        <Text strong>Case Number: </Text> {number} <br />
      </p>
      <p>
        <Text strong>Reported Date: </Text> {reportedDate} <br />
      </p>
    </>
  );
};

/**
 * @function
 * @name VictimDetails
 * @description Render case victim details
 * @param {object} props Component properties object
 * @param {string} props.name Victim name
 * @param {string} props.mobile Victim mobile number
 * @param {string} props.gender Victim gender
 * @param {string} props.age Victim age
 * @param {string} props.area Victim area
 * @param {string} props.nextOfKinName Victim next of kin name
 * @param {string} props.nextOfKinMobile Victim next of kin mobile number
 * @returns {object} VictimDetails
 * @version 0.1.0
 * @since 0.1.0
 */
const VictimDetails = ({
  name,
  mobile,
  gender,
  age,
  area,
  nextOfKinName,
  nextOfKinMobile,
}) => {
  return (
    <>
      <SectionHeader title="VICTIM DETAILS" />
      <p>
        <Text strong>Name: </Text> {name} <br />
      </p>
      <p>
        <Text strong>Phone Number: </Text> {mobile} <br />
      </p>
      <p>
        <Text strong>Gender: </Text> {gender} <br />
      </p>
      <p>
        <Text strong>Age: </Text> {age} <br />
      </p>
      <p>
        <Text strong>Area: </Text> {area} <br />
      </p>
      <p>
        <Text strong>Next of Kin: </Text> {nextOfKinName} <br />
      </p>

      <p>
        <Text strong>Next of Kin Mobile: </Text> {nextOfKinMobile} <br />
      </p>
    </>
  );
};

/**
 * @function
 * @name CaseDetailsViewBody
 * @description Case Detail view UI
 * @param {object} props Component properties object
 * @param {object} props.data Selected case data to be viewed
 * @returns {object} CaseDetailsViewBody component
 * @version 0.1.0
 * @since 0.1.0
 */
const CaseDetailsViewBody = ({ data }) => {
  const componentRef = useRef();
  return (
    <div className="CaseBody">
      <CaseToolbar data={data} onContent={() => componentRef.current} />
      <div className="CaseBodyContent" ref={componentRef}>
        <CaseDetails
          number={get(data, 'number')}
          reportedDate={formatDate(get(data, 'createdAt'), 'DD/MM/YYYY')}
        />
        <VictimDetails
          name={get(data, 'victim.name', 'N/A')}
          mobile={get(data, 'victim.mobile', 'N/A')}
          gender={get(data, 'victim.gender.strings.name.en')}
          age={get(data, 'victim.age')}
          area={get(data, 'victim.area.strings.name.en', 'N/A')}
          nextOfKinName={get(data, 'victim.nextOfKin.name', 'N/A')}
          nextOfKinMobile={get(data, 'victim.nextOfKin.mobile', 'N/A')}
        />
      </div>
    </div>
  );
};

CaseToolbar.propTypes = {
  data: PropTypes.shape({ _id: PropTypes.string }).isRequired,
  onContent: PropTypes.func.isRequired,
};

CaseDetails.propTypes = {
  number: PropTypes.string.isRequired,
  reportedDate: PropTypes.string.isRequired,
};

VictimDetails.propTypes = {
  name: PropTypes.string.isRequired,
  mobile: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired,
  area: PropTypes.string.isRequired,
  nextOfKinName: PropTypes.string.isRequired,
  nextOfKinMobile: PropTypes.string.isRequired,
};

CaseDetailsViewBody.propTypes = {
  data: PropTypes.shape({ _id: PropTypes.string }).isRequired,
};

export default CaseDetailsViewBody;
