import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';
import MapGL, { Source, Layer, NavigationControl } from 'react-map-gl';

const TOKEN = process.env.REACT_APP_MapboxAccessToken;
export const dataLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': '#088',
    'fill-opacity': 0.2,
  },
};

class MapPolygon extends Component {
  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    geometry: PropTypes.shape({
      type: PropTypes.string.isRequired,
      coordinates: PropTypes.array.isRequired,
    }).isRequired,
  };

  // eslint-disable-next-line react/state-in-constructor
  state = {
    viewport: {
      latitude: -6.8042752,
      longitude: 39.247872,
      zoom: 13,
    },
  };

  render() {
    const { viewport } = this.state;
    const { geometry } = this.props;
    return (
      <MapGL
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxApiAccessToken={TOKEN}
        width="100%"
        height="94vh"
        /* eslint-disable-next-line react/jsx-props-no-spreading,react/destructuring-assignment */
        {...viewport}
        onViewportChange={updatedViewPort => {
          const { latitude, longitude, zoom } = updatedViewPort;
          this.setState({ viewport: { latitude, longitude, zoom } });
        }}
      >
        <div style={{ position: 'absolute' }}>
          <NavigationControl />
        </div>
        <Source type="geojson" data={geometry}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Layer {...dataLayer} />
        </Source>
      </MapGL>
    );
  }
}
export default MapPolygon;
