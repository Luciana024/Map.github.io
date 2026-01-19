// ===============================
// 1. Access token
// ===============================
mapboxgl.accessToken =
  "pk.eyJ1IjoiZmVuZ2ppYW9saSIsImEiOiJjbWtrNWw1M3AxOHZ6M2VyMWU3MzAxNWcxIn0.c_4ttTImTj6ej0QIWYFQQQ";

// ===============================
// 2. Initialise the map
// ===============================
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/fengjiaoli/cmkk6c3px002901ph2yu61aoy",
  center: [-4.2518, 55.8642], // Glasgow
  zoom: 10
});

// ===============================
// 3. Everything after map loads
// ===============================
map.on("load", () => {
  // -------------------------------------------------
  // Step 5: Legend
  // -------------------------------------------------
  const layers = ["<10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];

  const colors = [
    "#67001f",
    "#b2182b",
    "#d6604d",
    "#f4a582",
    "#fddbc7",
    "#d1e5f0",
    "#92c5de",
    "#4393c3",
    "#2166ac",
    "#053061"
  ];

  const legend = document.getElementById("legend");

  layers.forEach((layer, i) => {
    const key = document.createElement("div");
    key.className = "legend-key";
    key.style.backgroundColor = colors[i];
    key.innerHTML = layer;

    // Dark colours use white text
    if (i <= 1 || i >= 8) {
      key.style.color = "white";
    }

    legend.appendChild(key);
  });

  // -------------------------------------------------
  // Step 8: Hover highlight (source + layer)
  // -------------------------------------------------
  map.addSource("hover", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: []
    }
  });

  map.addLayer({
    id: "dz-hover",
    type: "line",
    source: "hover",
    layout: {},
    paint: {
      "line-color": "black",
      "line-width": 4
    }
  });

  // -------------------------------------------------
  // Step 7: Map controls
  // -------------------------------------------------
  map.addControl(new mapboxgl.NavigationControl(), "top-left");

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }),
    "top-left"
  );

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
    placeholder: "Search for places in Glasgow",
    proximity: {
      longitude: -4.2518,
      latitude: 55.8642
    }
  });

  map.addControl(geocoder, "top-left");
});

// ===============================
// 4. Step 4 + Step 8: Hover interaction
// ===============================
map.on("mousemove", (event) => {
  const dzone = map.queryRenderedFeatures(event.point, {
    layers: ["glasgow-simd"]
  });

  // Update hover info box
  document.getElementById("pd").innerHTML = dzone.length
    ? `<h3>${dzone[0].properties.DZName}</h3>
       <p>Rank: <strong>${dzone[0].properties.Percentv2}</strong> %</p>`
    : `<p>Hover over a data zone!</p>`;

  // Update hover highlight geometry
  map.getSource("hover").setData({
    type: "FeatureCollection",
    features: dzone.map((f) => ({
      type: "Feature",
      geometry: f.geometry
    }))
  });
});