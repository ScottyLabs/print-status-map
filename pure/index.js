const picdict = {
  "GREEN": "images/resizedgreen_printer.png",
  "YELLOW": "images/resizedyellow_printer.png",
  "RED": "images/resizedred_printer.png"
}

const colorpicdict = {
  "GREEN": "images/resizedcolor_green_printer.png",
  "YELLOW": "images/resizedcolor_yellow_printer.png",
  "RED": "images/resizedcolor_red_printer.png"
}

let map;
const state = {
  printers: null,
  selectedMarker: null,
}

async function callAPI() {
  try {
    let hold = await axios.get("https://apis.scottylabs.org/print/status");
    state.printers = hold.data
  } catch (err) {
    console.error(err);
  }
}

function makeInfoBody(printer) {
  let colortext = printer.color ? "Yes" : "No";
  let body = `
  <style>
  h2 { margin: 3px; }
  h4 { margin: 1px; }
  </style>
  <h2>${printer.name}</h2>
  <hr>
  <br>
  Put an image here whenever...
  <br>
  <br>
  <h4>Color: ${colortext} </h4>
  <h4>Signal: ${printer.signal} </h4>
  <h4>LCD Message: ${printer.lcd_message} </h4>
  <h4>Tray Statuses: [${printer.tray_statuses}] </h4>`;
  
  return body
}

function makeMap() {
  state.printers.forEach((printer) => {
      const marker = new google.maps.Marker({
        position: printer.coordinates,
        icon: (printer.color ? colorpicdict[printer.signal] : picdict[printer.signal]),
        map: map,
      });
      marker.setAnimation(google.maps.Animation.DROP);
      const infowindow = new google.maps.InfoWindow({content: makeInfoBody(printer)});
      marker.addListener("click", () => {
        if (state.selectedMarker !== null) {
          state.selectedMarker.close()
        }
        infowindow.open(map, marker);
        state.selectedMarker = infowindow;
      });
  })
}

async function main() {
  map = new google.maps.Map(
    document.getElementById("map"), 
    {
      center: {lat: 40.443, lng: -79.9438 }, 
      zoom: 17, 
      mapTypeControl: false,
      streetViewControl: false,
    }
  );
  await callAPI();
  console.log(state.printers);
  makeMap();
  const infoButton = document.createElement("button");
  infoButton.textContent = "i";
  infoButton.classList.add("button");
  infoButton.classList.add("round");
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(infoButton);
  infoButton.addEventListener("click", () => {
    location.href = "./html/info.html";
  });
}

function initMap() {
  main();
}