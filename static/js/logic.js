// Starter code provided by instructor
// We create the tile layer that will be the background of our map.
let basemap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
  
  
  // We create the map object.
  let map = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 3
  });
  
  // Then we add our 'basemap' tile layer to the map.
  basemap.addTo(map);
  
  // Here we make a call that retrieves our earthquake geoJSON data.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
  
    // This function determines the color of the marker based on the magnitude of the earthquake.
    function getColor(depth) {
      switch (true) {
        case depth > 90:
          return "#FF0000"; // RED 
        case depth > 70:
          return "#FF6701"; // DEEP ORANGE 
        case depth > 50:
          return "#FFA500"; // ORANGE
        case depth > 30:
          return "#FBE870"; // YELLOW
        case depth > 10:
          return "#DFFF00"; // YELLOW-GREEN 
        default:
          return "#ADFF2F"; // GREEN 
      }
    }
  
    // This function determines the radius of the earthquake marker based on its magnitude.
    // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
  
      return magnitude * 4;
    }
  
    // This function returns the style data for each of the earthquakes we plot on
    // the map. We pass the magnitude of the earthquake into two separate functions
    // to calculate the color and radius.
    function styleInfo(feature) {
      return {
        // USE STYLE ATTRIBUTES (e.g., opacity, fillOpacity, stroke, weight) 
        fillColor: getColor(feature.geometry.coordinates[2]), // Using depth for color
        color: "#000000",
        radius: getRadius(feature.properties.mag), // Using magnitude for radius
        weight: 0.6, // Make the black outlines thinner
        opacity: 1, // Set the opacity of the black outlines
        fillOpacity: 0.8 // Set the opacity of the fill color
      };
    }
  
    // Add a GeoJSON layer to the map once the file is loaded.
    L.geoJson(data, {
      
      // We turn each feature into a circleMarker on the map.
      pointToLayer: function (feature, latlng) {
        let circleMarker = L.circleMarker(latlng, styleInfo(feature));

        // We add a popup for each marker to display the magnitude, location, and depth of the earthquake.
    circleMarker.bindPopup(
      `<strong>Magnitude:</strong> ${feature.properties.mag}<br><strong>Location:</strong> ${feature.properties.place}<br><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
    );
    
        return circleMarker;
      },
    }).addTo(map);
  
    // Create a legend control object.
    let legend = L.control({
      position: "bottomright"
    });
  
    // Then add all the details for the legend
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
  
      let grades = [-10, 10, 30, 50, 70, 90];
      let colors = [
        // COLOR HEX CODES SPECIFIED IN getColor() function
        "#ADFF2F",
        "#DFFF00",
        "#FBE870",
        "#FFA500",
        "#FF6701",
        "#FF0000"
      ];
  
      // Looping through our intervals to generate a label with a colored square for each interval.
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      
      return div;
    };
  
    // Finally, we our legend to the map.
    legend.addTo(map);
  });
  Collapse