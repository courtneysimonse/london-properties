(function () {

  // US map options
  var options = {
    zoomSnap: .5,
    center: [39, -97],
    zoom: 5,
    minZoom: 2,
    zoomControl: false,
    // attributionControl: false
  }

  // create map
  var map = L.map('mapid', options);

  // request tiles and add to map
  var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  	maxZoom: 19,
  	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // change zoom control position
  L.control.zoom({
    position: 'bottomleft'
  }).addTo(map);

  // GET DATA
  processData();

  // PROCESS DATA FUNCTION
  function processData() {

    drawMap();

    // example breaks for legend
    var breaks = [1, 4, 7, 10];
    var colorize = chroma.scale(chroma.brewer.BuGn).classes(breaks).mode('lab');

    drawLegend(breaks, colorize);

  }   //end processData()

  // DRAW MAP FUNCTION
  function drawMap() {

  }   //end drawMap()

  function drawLegend(breaks, colorize) {

    var legendControl = L.control({
      position: 'topright'
    });

    legendControl.onAdd = function(map) {

      var legend = L.DomUtil.create('div', 'legend');
      return legend;

    };

    legendControl.addTo(map);

    var legend = document.querySelector('.legend');
    legend.innerHTML = "<h3><span>YYYY</span> Legend</h3><ul>";

    for (var i = 0; i < breaks.length - 1; i++) {

      var color = colorize(breaks[i], breaks);

      var classRange = '<li><span style="background:' + color + '"></span> ' +
          breaks[i].toLocaleString() + ' &mdash; ' +
          breaks[i + 1].toLocaleString() + '</li>'
      legend.innerHTML += classRange;

    }

    legend.innerHTML += '</ul><p>(Data from SOURCE)</p>';

  } // end drawLegend()

})();
