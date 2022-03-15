(function () {

  // Setubal map options
  var options = {
    zoomSnap: .1,
    center: [38.525, -8.893],
    zoom: 15.1,
    minZoom: 10,
    maxZoom: 20,
    zoomControl: false,
  }

  // create map
  var map = L.map('mapid', options);

  // request tiles and add to map
  // var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
  // 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  // 	subdomains: 'abcd',
  // 	maxZoom: 20
  // }).addTo(map);

  // with labels
  var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  	subdomains: 'abcd',
  	maxZoom: 20
  }).addTo(map);

  // ESRI World Imagery layer
  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  	attribution: 'Tiles Powered by ESRI &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  // group basemaps
  var baseMaps = {
    "Streets": CartoDB_Positron,
    "Satellite": Esri_WorldImagery
  };

  L.control.layers(baseMaps, null, {
    collapsed: false,
    position: 'bottomright'
  }).addTo(map);

  // change zoom control position
  var zoomControl = L.control.zoom({
    position: 'bottomleft'
  }).addTo(map);

  L.DomUtil.addClass(zoomControl.getContainer(), 'zoomControl');

  const breaks = ["Listed","Vacant","Interesting","Joao's Building"];
  const colors = ["#267ec9","#1a9e06","","#d95f02"];
  const anchor = [12,41];
  const popupAnchor = [-3, -23]
  // console.log(L.Icon.Default.prototype.options);

  const blueIcon = L.icon({
    iconUrl: '../images/marker.svg',
    iconSize: [20, 45],
    iconAnchor: anchor,
    popupAnchor: popupAnchor
  });

  const greenIcon = L.icon({
    iconUrl: '../images/marker-green.svg',
    iconSize: [20, 45],
    iconAnchor: anchor,
    popupAnchor: popupAnchor
  });

  const redIcon = L.icon({
    iconUrl: '../images/marker-red.svg',
    iconSize: [20, 45],
    iconAnchor: anchor
  });

  const purpleIcon = L.icon({
    iconUrl: '../images/marker-purple.svg',
    iconSize: [20, 45],
    iconAnchor: anchor
  });

  const blueStar = L.icon({
    iconUrl: '../images/star-blue.svg',
    iconSize: [35, 35],
    iconAnchor: anchor
  });

  const greenStar = L.icon({
    iconUrl: '../images/star-green.svg',
    iconSize: [35, 35],
    iconAnchor: anchor
  });

  const yellowStar = L.icon({
    iconUrl: '../images/star-yellow.svg',
    iconSize: [35, 35],
    iconAnchor: [18,15]
  });

  const myIcons = {
    'normal': blueIcon,
    'red': redIcon,
    'green': greenIcon,
    'normal-interesting': yellowStar,
    'green-interesting': yellowStar
  }

  var propertiesData = [
    {
      name: "setubal",
      data: setubalJSON
    },
    {
      name: "cascais",
      data: cascaisJSON
    }
  ];

  var imageModal = new bootstrap.Modal(document.getElementById('imageModal'));

  // GET DATA
  processData(propertiesData);

  // PROCESS DATA FUNCTION
  function processData(properties) {
    console.log(properties[0].data.features);
    var setubalLayer = drawMap(properties[0]);
    var cascaisLayer = drawMap(properties[1]);

    map.setZoom(map.getBoundsZoom(setubalLayer.getBounds()),{animate:false});
    map.zoomOut(.1,{animate:false});

    drawLegend(breaks, colors);

    // createInfoSections(properties, div);

  }   //end processData()

  // DRAW MAP FUNCTION
  function drawMap(properties) {


    // var markers = L.markerClusterGroup({
    //   showCoverageOnHover: false,
    //   maxClusterRadius: 25
    // });

    var propertiesLayer = L.geoJSON(properties.data, {
      pointToLayer: function (geoJsonPoint, latlng) {
        // if (geoJsonPoint.properties.marker == 'normal') {
        //     return L.marker(latlng, {
        //       icon: blueIcon,
        //       riseOnHover: true
        //     });
        //   } else if (geoJsonPoint.properties.marker == 'green') {
        //     return L.marker(latlng, {
        //       icon: greenIcon,
        //       riseOnHover: true
        //     });
        //   } else {
        //     return L.marker(latlng, {
        //       icon: redIcon,
        //       riseOnHover: true
        //     });
        //   }
          var icon = myIcons[geoJsonPoint.properties.marker];
          if (myIcons[geoJsonPoint.properties.marker] == undefined) {
            icon = blueIcon
          }
          return L.marker(latlng, {
            icon: icon,
            riseOnHover: true
          });
          // markers.addLayer(L.marker(latlng, {icon: blueIcon}));
        },
      onEachFeature: function (feature, layer) {
        let popupText = "";
        popupText += "<img class='mainImage mx-auto' src='./images/" + feature.properties.mainImage + "'>"
        popupText += "<div class='row'>";
        popupText += "<div class='col-md-6 col-xs-6'>";
        if (feature.properties.price != "N/A") {
          popupText += "Price: " + feature.properties.price + "<br>";
        }
        if (feature.properties["locationLink"] != undefined) {
          popupText += "<a href='" + feature.properties["locationLink"] + "' target='_blank'>" + feature.properties["locationName"] + "</a>";
        } else {
          popupText += feature.properties["locationName"];
        }
        popupText += "</div>";
        if (feature.properties["price/sqm"] && feature.properties["price/sqm"] != "N/A") {
          popupText += "<div class='col-md-6 col-xs-6'>Price/SqMeter: " + feature.properties["price/sqm"];
          popupText += "<br>" + feature.properties["area-sqm"] + " sq m</div>";
        }
        if (feature.properties["price/sqft"] && feature.properties["price/sqft"] != "N/A") {
          popupText += "<div class='col-md-6 col-xs-6'>Price/SqFt: " + feature.properties["price/sqft"];
          popupText += "<br>" + feature.properties["acres"] + " acres</div>";
        }
        if (feature.properties.link) {
          popupText += "<div class='col-12 py-1'><a target='_blank' href='"+feature.properties.link+"'>Learn more...</a></div>";
        }
        if (feature.properties.documents) {
          popupText += "<div class='col-12 py-0'>Documents:";
          feature.properties.documents.forEach((item, i) => {
            popupText += "<a target='_blank' href='./documents/"+item[1]+"'>"+item[0]+"</a> ";
          });
          popupText += "</div>";
        }


        layer.bindPopup(popupText, {maxWidth: 400});
      }
    }).addTo(map);

    // console.log(propertiesLayer.getBounds());
    // map.fitBounds(propertiesLayer.getBounds()).zoomOut(.2);
    // map.setZoom(map.getBoundsZoom(propertiesLayer.getBounds()),{animate:false});
    // map.zoomOut(.1,{animate:false});
    // console.log(map.getZoom());

    map.on('popupopen', function (event) {
      // console.log(document.getElementsByClassName('mainImage'));
      // console.log(event.popup);
      var images = document.getElementsByClassName('mainImage');
      images[images.length-1].addEventListener('click', function () {
        // console.log('click');
        // console.log(images[images.length-1].attributes[1]);
        document.getElementById('image').innerHTML = "<button type='button' class='btn-close pt-3 px-3' data-bs-dismiss='modal' aria-label='Close'></button>" +
                "<img class='modalImg' src='"+images[images.length-1].attributes[1].nodeValue+"'>"
        imageModal.show();
      });
    });

    // map.addLayer(markers);

    return propertiesLayer;

  }   //end drawMap()


  function drawLegend(breaks, colors) {

    var legendControl = L.control({
      position: 'topleft'
    });

    legendControl.onAdd = function(map) {

      var legend = L.DomUtil.create('div', 'legend');
      return legend;

    };

    legendControl.addTo(map);

    var legend = document.querySelector('.legend');
    legend.innerHTML = '<h3>Location</h3><ul>' +
    '<li><span style="background:' + colors[0] + '"></span> ' + breaks[0] + '</li>' +
    '<li><span style="background:' + colors[1] + '"></span> ' + breaks[1] + '</li>' +
    '<li><span><img src="../images/star-yellow.svg"></span> ' + 'Interesting' + '</li>' +
    '<li><span style="background:' + colors[3] + '"></span> ' + breaks[3] + '</li>' +
    '</ul>';
    // legend.innerHTML += '</ul><p>(Data from SOURCE)</p>';
  //
  } // end drawLegend()




})();
