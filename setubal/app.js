(function () {

  // Setubal map options
  var options = {
    zoomSnap: .1,
    center: [38.525, -8.893],
    zoom: 16,
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
    position: 'topleft'
  }).addTo(map);

  // change zoom control position
  L.control.zoom({
    position: 'topleft'
  }).addTo(map);

  //Get the button
  let scrollToTopBtn = document.getElementById("btn-back-to-top");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  }
  // When the user clicks on the button, scroll to the top of the document
  scrollToTopBtn.addEventListener("click", backToTop);

  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const div = document.getElementById('information');

  // GET DATA
  processData(propertiesJSON);

  // PROCESS DATA FUNCTION
  function processData(properties) {
    console.log(properties.features);
    drawMap(properties);
    // createInfoSections(properties, div);

  }   //end processData()

  // DRAW MAP FUNCTION
  function drawMap(properties) {

    const breaks = ["Listed","Unlisted","Interesting","Joao's Building"];
    const colors = ["#267ec9","#1a9e06","","#d95f02"];
    const anchor = [12,41];
    const popupAnchor = [-3, -23]
    // console.log(L.Icon.Default.prototype.options);

    blueIcon = L.icon({
      iconUrl: '../images/marker.svg',
      iconSize: [20, 45],
      iconAnchor: anchor,
      popupAnchor: popupAnchor
    });

    greenIcon = L.icon({
      iconUrl: '../images/marker-green.svg',
      iconSize: [20, 45],
      iconAnchor: anchor,
      popupAnchor: popupAnchor
    });

    redIcon = L.icon({
      iconUrl: '../images/marker-red.svg',
      iconSize: [20, 45],
      iconAnchor: anchor
    });

    purpleIcon = L.icon({
      iconUrl: '../images/marker-purple.svg',
      iconSize: [20, 45],
      iconAnchor: anchor
    });

    purpleIcon = L.icon({
      iconUrl: '../images/marker-purple.svg',
      iconSize: [20, 45],
      iconAnchor: anchor
    });

    blueStar = L.icon({
      iconUrl: '../images/star-blue.svg',
      iconSize: [35, 35],
      iconAnchor: anchor
    });

    greenStar = L.icon({
      iconUrl: '../images/star-green.svg',
      iconSize: [35, 35],
      iconAnchor: anchor
    });

    myIcons = {
      'normal': blueIcon,
      'red': redIcon,
      'green': greenIcon,
      'normal-interesting': blueStar,
      'green-interesting': greenStar
    }

    drawLegend(breaks, colors);

    // var markers = L.markerClusterGroup({
    //   showCoverageOnHover: false,
    //   maxClusterRadius: 25
    // });

    var propertiesLayer = L.geoJSON(properties, {
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
          return L.marker(latlng, {
            icon: icon,
            riseOnHover: true
          });
          // markers.addLayer(L.marker(latlng, {icon: blueIcon}));
        },
      onEachFeature: function (feature, layer) {
        let popupText = "";
        popupText += "<a target='_blank' href='"+feature.properties.link+"'><img class='mainImage mx-auto' src='./images/" + feature.properties.mainImage + "'></a>"
        popupText += "<div class='row'>";
        if (feature.properties.price != "N/A") {
            popupText += "<div class='col-md-6 col-xs-6'>Price: " + feature.properties.price + "</div>";
        }
        if (feature.properties["price/sqm"] != "N/A") {
          popupText += "<div class='col-md-6 col-xs-6'>Price/SqMeter: " + feature.properties["price/sqm"] + "</div>";
        }
        // if (feature.properties.area != "N/A") {
        //   popupText += "<div class='col-md-4 col-xs-6'>Acres: " + feature.properties.area + "</div>";
        // }
        if (feature.properties.link) {
          popupText += "<div class='col-12 py-1'><a target='_blank' href='"+feature.properties.link+"'>Learn more...</a></div><div>"
        }


        layer.bindPopup(popupText, {maxWidth: 400});
      }
    }).addTo(map);

    map.fitBounds(propertiesLayer.getBounds()).zoomOut(.1);

    // map.addLayer(markers);

  }   //end drawMap()


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
    legend.innerHTML = '<h3>Location</h3><ul>' +
    '<li><span style="background:' + colors[0] + '"></span> ' + breaks[0] + '</li>' +
    '<li><span style="background:' + colors[1] + '"></span> ' + breaks[1] + '</li>' +
    '<li><span><img src="../images/star-blue.svg"></span> ' + 'Interesting' + '</li>' +
    '<li><span style="background:' + colors[3] + '"></span> ' + breaks[3] + '</li>' +
    '</ul>';
    // legend.innerHTML += '</ul><p>(Data from SOURCE)</p>';
  //
  } // end drawLegend()

  // function createInfoSections(properties, div) {
  //
  //   properties.features.forEach((prop, i) => {
  //     if (prop.properties.category == 'Available') {
  //       const propDiv = document.createElement('div');
  //       propDiv.classList.add('property');
  //       // console.log(prop.properties.id);
  //       propDiv.id = 'prop-'+prop.properties.id;
  //       div.appendChild(propDiv);
  //
  //       if (prop.properties.numImages) {
  //         addCarousel(prop,propDiv,'info');
  //         const moreInfo = document.createElement('h6');
  //         moreInfo.innerHTML = '<a href="#header-'+prop.properties.id+'">More Information Below</a>'
  //         propDiv.appendChild(moreInfo);
  //       }
  //
  //       const header = document.createElement('h3');
  //       header.innerHTML = prop.properties.display_address;
  //       header.id = 'header-'+prop.properties.id;
  //       propDiv.appendChild(header);
  //
  //       if (prop.properties.features) {
  //         const featureSect = document.createElement('ul');
  //         const featureH5 = document.createElement('h5');
  //         featureH5.innerHTML = "Features";
  //         featureSect.appendChild(featureH5);
  //         const featuresList = prop.properties.features;
  //         featuresList.forEach((item, i) => {
  //           const featureLi = document.createElement('li');
  //           featureLi.innerHTML = item;
  //           featureSect.appendChild(featureLi);
  //         });
  //         propDiv.appendChild(featureSect);
  //
  //       }
  //
  //     }
  //   });
  //
  // }   // end createInfoSections()


})();
