import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'mapbox-gl/dist/mapbox-gl.css';
import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';

const TOKEN = process.env.REACT_APP_MapboxAccessToken;

class BaseMap extends Component {
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
      width: '100%',
      height: '94vh',
      latitude: -6.8042752,
      longitude: 39.247872,
      zoom: 13,
    },
  };

  componentDidMount() {
    this.map = this.reactMap.getMap();
    const { geometry } = this.props;
    this.map.on('load', () => {
      this.map.addLayer({
        id: 'administrativearea',
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry,
          },
        },
        layout: {},
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.8,
        },
      });
      this.renderGeoJSON(geometry);
    });
  }

  componentDidUpdate(prevProps): void {
    // eslint-disable-next-line react/destructuring-assignment
    if (prevProps.geometry !== this.props.geometry) {
      // eslint-disable-next-line react/destructuring-assignment
      this.renderGeoJSON(this.props.geometry);
    }
  }

  renderGeoJSON = geometry => {
    if (this.map.getLayer('administrativearea'))
      this.map.removeLayer('administrativearea');
    this.map.getSource('administrativearea').setData({
      type: 'Feature',
      properties: {},
      geometry,
    });
  };

  render() {
    return (
      <MapGL
        /* eslint-disable-next-line no-return-assign */
        ref={reactMap => (this.reactMap = reactMap)}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxApiAccessToken={TOKEN}
        /* eslint-disable-next-line react/jsx-props-no-spreading,react/destructuring-assignment */
        {...this.state.viewport}
      />
    );
  }
}
export default BaseMap;
