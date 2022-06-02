import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

import Home from "../public/home.png";
import Car from "../public/car.png";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [house, setHouse] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: -23.2954323, lng: -46.7400958 }),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "ee930ed25ba34625",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const vehicles = useMemo(() => generateVehicles(center), [center]);

  const fetchDirections = (vehicle: LatLngLiteral) => {
    if (!house) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: vehicle,
        destination: house,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <div className="container">
      <div className="controls">
        <h1>Cliente</h1>
        <Places
          setHouse={(position) => {
            setHouse(position);
            mapRef.current?.panTo(position);
          }}
        />
        {!house && <p>Insira o endereço do cliente</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {house && (
            <>
              <Marker position={house} icon={Home.src} />

              <MarkerClusterer>
                {(clusterer) =>
                  vehicles.map((vehicle) => (
                    <Marker
                      key={vehicle.lat}
                      position={vehicle}
                      icon={Car.src}
                      clusterer={clusterer}
                      onClick={() => {
                        fetchDirections(vehicle);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>

              {}

              <Circle center={house} radius={1500} options={closeOptions} />
              <Circle center={house} radius={2500} options={middleOptions} />
              <Circle center={house} radius={4000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

const generateVehicles = (position: LatLngLiteral) => {
  const _vehicles: Array<LatLngLiteral> = [];
  for (let i = 0; i < 10; i++) {
    const direction = Math.random() < 5 ? -40 : 800;
    _vehicles.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _vehicles;
};
