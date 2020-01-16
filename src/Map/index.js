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
      height: '100vh',
      latitude: -6.8042752,
      longitude: 39.247872,
      zoom: 13,
    },
  };

  componentDidMount() {
    const { geometry } = this.props;
    this.renderGeoJSON(geometry);
  }

  componentDidUpdate(prevProps): void {
    // eslint-disable-next-line react/destructuring-assignment
    if (prevProps.geometry !== this.props.geometry) {
      // eslint-disable-next-line react/destructuring-assignment
      this.renderGeoJSON(this.props.geometry);
    }
  }

  renderGeoJSON = geometry => {
    const map = this.reactMap.getMap();
    map.on('load', function() {
      map.addLayer({
        id: 'maine',
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
    });
  };

  render() {
    console.log('render function is called');
    return (
      <MapGL
        /* eslint-disable-next-line no-return-assign */
        ref={reactMap => (this.reactMap = reactMap)}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxApiAccessToken={TOKEN}
        /* eslint-disable-next-line react/jsx-props-no-spreading,react/destructuring-assignment */
        {...this.state.viewport}
        onViewportChange={viewport => {
          console.log(viewport);
          const modfiyViewPort = { ...viewport, width: 1920 };
          this.setState({ viewport: modfiyViewPort });
        }}
      />
    );
  }
}
export default BaseMap;
