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

  L.geoJSON(londonProperties, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.display_address + "<p><a href='#'>More information...</a></p>" );
    }
  }).addTo(map);

  // GET DATA
  processData();

  // PROCESS DATA FUNCTION
  function processData() {



    drawMap();

    // example breaks for legend
    // var breaks = [1, 4, 7, 10];
    // var colorize = chroma.scale(chroma.brewer.BuGn).classes(breaks).mode('lab');
    //
    // drawLegend(breaks, colorize);

  }   //end processData()

  // DRAW MAP FUNCTION
  function drawMap() {



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
