(function () {

  // London map options
  var options = {
    zoomSnap: .2,
    center: [51.512, -0.155],
    zoom: 13.2,
    minZoom: 13,
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

  //Get the button
  let mybutton = document.getElementById("btn-back-to-top");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }
  // When the user clicks on the button, scroll to the top of the document
  mybutton.addEventListener("click", backToTop);

  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  // Mapillary Viewer
  // var viewer = new mapillary.Viewer({
  //   accessToken: 'MLY|7147044735321690|421cff42a53ffc1154343a5e5657a25d',
  //   container: 'mly', // the ID of our container defined in the HTML body
  //   component: {cover: false},
  //   imageId: '608164680105276' // starting imageId
  // });

  // document.getElementById("x").onclick =
  //   function() {
  //     document.querySelector("#mly").style.visibility = 'hidden';
  //     document.querySelector("#x").style.visibility = 'hidden';
  //   };

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

    const breaks = ["Available","Comparables","Recent Sales"];
    const colors = ["#1b9e77", "#267ec9", "#7570b3"];

    blueIcon = L.icon({
      iconUrl: 'images/marker.svg',
      iconSize: [20, 45]
    });

    greenIcon = L.icon({
      iconUrl: 'images/marker-green.svg',
      iconSize: [20, 45]
    });

    redIcon = L.icon({
      iconUrl: 'images/marker-red.svg',
      iconSize: [20, 45]
    });

    purpleIcon = L.icon({
      iconUrl: 'images/marker-purple.svg',
      iconSize: [20, 45]
    });

    myIcons = {
      'Available': greenIcon,
      'Comparables': blueIcon,
      'Recent Sales': purpleIcon
    }

    drawLegend(breaks, colors);

    L.geoJSON(properties, {
      pointToLayer: function (geoJsonPoint, latlng) {
        if (geoJsonPoint.properties.category == 'Available' || geoJsonPoint.properties.category == 'Comparables') {
            return L.marker(latlng, {icon: myIcons['Available']});
          } else {
            return L.marker(latlng, {icon: myIcons['Recent Sales']});
          }
          // icon: myIcons[geoJsonPoint.properties.category]
        },
      onEachFeature: function (feature, layer) {
        popupText = "<p>" + feature.properties.display_address + "</p>";
        if (feature.properties.category == 'Available') {
          popupText += "<img class='mainImage' src='" + feature.properties.mainImage + "'>" +
            "<p><a href='#prop-" + feature.properties.id + "'>More information...</a></p>";
        } else if (feature.properties.category == 'Recent Sales' || feature.properties.category == 'Comparables') {
          popupText += "<p>" + feature.properties.description + "</p>"
          popupText += "<p>Price: " + feature.properties.price + "</p>";
        } else {

        }

        layer.bindPopup(popupText);
      }
    }).addTo(map);
    // .on('click', function(e) {
      // on click, show mapillary viewer
      // document.querySelector("#mly").style.visibility = 'visible';
      // document.querySelector("#x").style.visibility = 'visible';
      // viewer.moveTo(e.layer.feature.properties.imageId);
    // });

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
  function drawLegend(breaks, colors) {
  //
    var legendControl = L.control({
      position: 'topright'
    });
  //
    legendControl.onAdd = function(map) {

      var legend = L.DomUtil.create('div', 'legend');
      return legend;

    };

    legendControl.addTo(map);

    var legend = document.querySelector('.legend');
    legend.innerHTML = '<h3>Legend</h3><ul>' +
    '<li><span style="background:' + colors[0] + '"></span> ' + breaks[0] + '</li>' +
    // '<li><span style="background:' + colors[1] + '"></span> ' + breaks[1] + '</li>' +
    '<li><span style="background:' + colors[2] + '"></span> ' + breaks[2] + '</li>' +
    '</ul>';
    // legend.innerHTML += '</ul><p>(Data from SOURCE)</p>';
  //
  } // end drawLegend()

})();
