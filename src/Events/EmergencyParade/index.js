import React, { useState } from 'react';
import { Card, Typography, Modal } from 'antd';
import { map } from 'lodash';

import Grid from '../../components/Grid';

const { Text } = Typography;
// simple data structure for emergency parade
const DATA_STRUCTURE = {
  indicators: [
    {
      name: 'Health Facilities',
      items: [
        {
          name: 'Amana Hospital',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'Available Beds', value: 200 },
          ],
        },
        {
          name: 'Mloganzila Hospital',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'Available Beds', value: 200 },
          ],
        },
        {
          name: 'Palestina Hospital',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'Available Beds', value: 200 },
          ],
        },
        {
          name: 'Palestina Hospital',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'available Beds', value: 200 },
          ],
        },
        {
          name: 'Palestina Hospital',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'available Beds', value: 200 },
          ],
        },
      ],
    },
    {
      name: 'Fire and Rescue Stations',
      items: [
        {
          name: 'Ilala Station',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'Available Beds', value: 200 },
          ],
        },
        {
          name: 'Temeke Station',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'Available Beds', value: 200 },
          ],
        },
        {
          name: 'Kinondoni Station',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'Available Beds', value: 200 },
          ],
        },
        {
          name: 'JNIA Station',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'available Beds', value: 200 },
          ],
        },
        {
          name: 'Kigamboni Station',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Capacity', value: 1200 },
            { label: 'available Beds', value: 200 },
          ],
        },
      ],
    },
    {
      name: 'Communications Channels',
      items: [
        {
          name: 'USSD',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Payment Due At', value: '2020-01-09' },
          ],
        },
        {
          name: 'Internet',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Payment Due At', value: '2020-01-09' },
          ],
        },
        {
          name: 'SMS',
          instance: [
            { label: 'Status', value: 'Operational' },
            { label: 'Balance', value: 300000 },
          ],
        },
        {
          name: 'Radio',
          instance: [
            { label: 'Status', value: 'Operational' },
            {
              label: 'Coverage',
              value: '80%',
            },
          ],
        },
      ],
    },
  ],
};

/**
 * @function
 * @name EmergencyParade
 * @description List of all items that needs to be checked daily
 * @returns {object} Emergency Parade Dashboard
 * @version 0.1.0
 * @since 0.1.0
 */
const EmergencyParade = () => {
  const [isModalOpen, openModal] = useState(false);
  return (
    <>
      <div style={{ padding: '24px' }}>
        {map(DATA_STRUCTURE.indicators, (indicator) => (
          <div
            style={{
              margin: '10px 0',
            }}
          >
            <Grid
              header={indicator.name}
              items={indicator.items}
              colPerRow={4}
              renderItem={(item) => (
                <Card
                  style={{
                    margin: '5px',
                    boxShadow: '0 0 10px #e9e9e9',
                  }}
                  hoverable
                  onClick={() => openModal(true)}
                >
                  <Text strong>{item.value.name}</Text>
                  {map(item.value.instance, (instanceItem) => (
                    <>
                      <br />
                      <Text>{instanceItem.label}</Text> :{' '}
                      <Text> {instanceItem.value}</Text>
                    </>
                  ))}
                </Card>
              )}
            />
          </div>
        ))}
      </div>
      <Modal visible={isModalOpen} onCancel={() => openModal(false)}>
        Update something
      </Modal>
    </>
  );
};

export default EmergencyParade;
