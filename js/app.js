(function () {

  // US map options
  var options = {
    zoomSnap: .2,
    center: [51.512, -0.155],
    zoom: 13.4,
    minZoom: 2,
    zoomControl: false,
    // attributionControl: false
  }

  // create map
  var map = L.map('mapid', options);

  // request tiles and add to map
  var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  	subdomains: 'abcd',
  	maxZoom: 20
  }).addTo(map);

  // change zoom control position
  L.control.zoom({
    position: 'bottomleft'
  }).addTo(map);

  // Mapillary Viewer
  var viewer = new mapillary.Viewer({
    accessToken: 'MLY|7147044735321690|421cff42a53ffc1154343a5e5657a25d',
    container: 'mly', // the ID of our container defined in the HTML body
    component: {cover: false},
    imageId: '608164680105276' // starting imageId
  });

  document.getElementById("x").onclick =
    function() {
      document.querySelector("#mly").style.visibility = 'hidden';
      document.querySelector("#x").style.visibility = 'hidden';
    };

  // GET DATA
  processData(londonProperties, londonNeighborhoods);

  // PROCESS DATA FUNCTION
  function processData(properties, neighborhoods) {



    drawMap(properties, neighborhoods);

    // example breaks for legend
    // var breaks = [1, 4, 7, 10];
    // var colorize = chroma.scale(chroma.brewer.BuGn).classes(breaks).mode('lab');
    //
    // drawLegend(breaks, colorize);

  }   //end processData()

  // DRAW MAP FUNCTION
  function drawMap(properties, neighborhoods) {

    L.geoJSON(properties, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.display_address + "<p><a href='#prop-" + feature.properties.id + "'>More information...</a></p>" );
      }
    }).addTo(map).on('click', function(e) {
      // on click, show mapillary viewer
      document.querySelector("#mly").style.visibility = 'visible';
      document.querySelector("#x").style.visibility = 'visible';
      viewer.moveTo(e.layer.feature.properties.imageId);
    });

    L.geoJSON(neighborhoods, {
      pointToLayer: function (geoJsonPoint, latlng) {
        label = L.divIcon({
          className: "neighborhoods",
          html: geoJsonPoint.properties.name
        })
        return new L.marker(latlng, {icon: label})}
    }).addTo(map);

  }   //end drawMap()

  // function drawLegend(breaks, colorize) {
  //
  //   var legendControl = L.control({
  //     position: 'topright'
  //   });
  //
  //   legendControl.onAdd = function(map) {
  //
  //     var legend = L.DomUtil.create('div', 'legend');
  //     return legend;
  //
  //   };

  //   legendControl.addTo(map);
  //
  //   var legend = document.querySelector('.legend');
  //   legend.innerHTML = "<h3><span>YYYY</span> Legend</h3><ul>";
  //
  //   for (var i = 0; i < breaks.length - 1; i++) {
  //
  //     var color = colorize(breaks[i], breaks);
  //
  //     var classRange = '<li><span style="background:' + color + '"></span> ' +
  //         breaks[i].toLocaleString() + ' &mdash; ' +
  //         breaks[i + 1].toLocaleString() + '</li>'
  //     legend.innerHTML += classRange;
  //
  //   }
  //
  //   legend.innerHTML += '</ul><p>(Data from SOURCE)</p>';
  //
  // } // end drawLegend()

})();
