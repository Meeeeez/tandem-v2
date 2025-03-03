import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent = () => {
  const DEFAULT_INFO_TEXT = 'Click on a marker to read more about launch, landing, and meeting points';
  const [infoText, setInfoText] = useState<string>(DEFAULT_INFO_TEXT);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibW9yaXR6bWVzc25lciIsImEiOiJjbGN4OWh6aXQxeTJiM3ZwMHhnODlzcjE5In0.ZiwNLTK6AdJbHPQ0RiCQeA';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v12',
      attributionControl: false,
      center: [11.6882, 46.6991],
      zoom: 12,
      maxZoom: 19,
      minZoom: 8,
    });

    map.on('load', () => {
      map.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                title: 'Launch',
                description: 'The launch point is where we will lauch from.',
              },
              geometry: { type: 'Point', coordinates: [11.7116, 46.6877] },
            },
            {
              type: 'Feature',
              properties: {
                title: 'Meeting',
                description: 'This is where we will meet before the flight.',
              },
              geometry: { type: 'Point', coordinates: [11.6825, 46.6979] },
            },
            {
              type: 'Feature',
              properties: {
                title: 'Landing',
                description: 'The landing point is where we will land after the flight.',
              },
              geometry: { type: 'Point', coordinates: [11.6643, 46.7042] },
            },
          ],
        },
      });

      map.addLayer({
        id: 'circle',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-color': '#ff5000',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Add click event to show popup
      map.on('click', 'circle', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { title, description } = e.features[0].properties;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        if (['mercator', 'equirectangular'].includes(map.getProjection().name)) {
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
        }

        setInfoText(description);

        // Create a popup and set its content
        const popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<h3>${title}</h3>`)
          .addTo(map);

        popup.on('close', () => {
          setInfoText(DEFAULT_INFO_TEXT);
        });

        // Center the map on the selected feature
        map.flyTo({ center: coordinates });
      });

      // Change cursor style on hover
      map.on('mouseenter', 'circle', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'circle', () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-slate-800 text-xl font-semibold">Important locations</h2>
        <div id="map" className="w-full h-96 bg-[#E0E0D1] rounded-xl overflow-hidden"></div>
        <div className="flex items-center gap-5 p-5 py-4 w-full bg-blue-600/10 rounded-xl">
          <img src="img/info_circle.svg" className="h-6 w-auto text-blue-600" alt="Info" />
          <p className="text-sm text-[#205C77]">
            { infoText }
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapComponent;
