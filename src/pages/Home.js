import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import printerimg from "../images/printer2.png";
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

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
      >
        {
          printers.map(printer => {
            console.log(printer.name)
            return (
              <Marker key={printer.name} position = {printer.coordinates} icon = {printerimg}/>
            )
          })
        }
      </GoogleMap>
    </div>  
  );
}
