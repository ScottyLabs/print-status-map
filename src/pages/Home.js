import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import greenPrinter from "../images/green_printer.png";
import yellowPrinter from "../images/yellow_printer.png";
import redPrinter from "../images/red_printer.png";
import testUtils from "react-dom/test-utils";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 40.443,
  lng: -79.9438,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
export default function Home() {
  const [printers, setPrinter] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [infoOpen, setInfoOpen] = useState(false);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "",
    libraries,
  });

  useEffect(() => {
    fetch("https://apis.scottylabs.org/print/status", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        setPrinter(response);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, []);

  if (loadError) return "Error Loading Maps";
  if (!isLoaded) return "Loading Maps";

  const markerLoadHandler = (marker, place) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    // Remember which place was clicked
    setSelectedPlace(place);

    // Required so clicking a 2nd marker works as expected
    if (infoOpen) {
      setInfoOpen(false);
    }

    setInfoOpen(true);

    // If you want to zoom in a little on marker click
    // if (zoom < 13) {
    //   setZoom(13);
    // }

    // if you want to center the selected Marker
    //setCenter(place.pos)
  };

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={17}
        center={center}
        options={options}
      >
        {printers.map((printer) => {
          console.log(printer.name);
          let printerimg = {};
          if (printer.signal === "RED") {
            printerimg = redPrinter;
          } else if (printer.signal === "GREEN") {
            printerimg = greenPrinter;
          } else {
            printerimg = yellowPrinter;
          }

          return (
            <Marker
              key={printer.name}
              position={printer.coordinates}
              icon={printerimg}
              onLoad={(marker) => markerLoadHandler(marker, printer)}
              onClick={(event) => markerClickHandler(event, printer)}
            />
          );
        })}

        {infoOpen && selectedPlace && (
          <InfoWindow
            anchor={markerMap[selectedPlace.id]}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div>
              <h3>{selectedPlace.id}</h3>
              <div>This is your info window content</div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
