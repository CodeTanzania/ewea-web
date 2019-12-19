import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGL from 'react-map-gl';

class BaseMap extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    viewport: {
      width: '100%',
      height: '100vh',
      latitude: -6.8042752,
      longitude: 39.247872,
      zoom: 13,
    },
  };

  render() {
    return (
      <ReactMapGL
        /* eslint-disable-next-line react/jsx-props-no-spreading,react/destructuring-assignment */
        {...this.state.viewport}
        onViewportChange={viewport => this.setState({ viewport })}
      />
    );
  }
}
export default BaseMap;
