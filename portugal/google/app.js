let map;

var imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
var cascaisBtn = document.getElementById('cascaisBtn');
var setubalBtn = document.getElementById('setubalBtn');

function initMap() {
  // const styledMapTerrain = new google.maps.StyledMapType(
  //   [
  //     {
  //       "elementType": "geometry",
  //       "stylers": [
  //         {
  //           "color": "#f5f5f5"
  //         }
  //       ]
  //     },
  //     {
  //       "elementType": "labels.icon",
  //       "stylers": [
  //         {
  //           "visibility": "off"
  //         }
  //       ]
  //     },
  //     {
  //       "elementType": "labels.text.fill",
  //       "stylers": [
  //         {
  //           "color": "#616161"
  //         }
  //       ]
  //     },
  //     {
  //       "elementType": "labels.text.stroke",
  //       "stylers": [
  //         {
  //           "color": "#f5f5f5"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "administrative.land_parcel",
  //       "elementType": "labels.text.fill",
  //       "stylers": [
  //         {
  //           "color": "#bdbdbd"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "poi",
  //       "stylers": [
  //         {
  //           "visibility": "off"
  //         }
  //       ]
  //     },
  //     // {
  //     //   "featureType": "poi",
  //     //   "elementType": "geometry",
  //     //   "stylers": [
  //     //     {
  //     //       "color": "#eeeeee"
  //     //     }
  //     //   ]
  //     // },
  //     // {
  //     //   "featureType": "poi",
  //     //   "elementType": "labels.text.fill",
  //     //   "stylers": [
  //     //     {
  //     //       "color": "#757575"
  //     //     }
  //     //   ]
  //     // },
  //     {
  //       "featureType": "poi.park",
  //       "elementType": "geometry",
  //       "stylers": [
  //         {
  //           "color": "#e5e5e5"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "poi.park",
  //       "elementType": "labels.text.fill",
  //       "stylers": [
  //         {
  //           "color": "#9e9e9e"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "road",
  //       "elementType": "geometry",
  //       "stylers": [
  //         {
  //           "color": "#ffffff"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "road.arterial",
  //       "elementType": "labels.text.fill",
  //       "stylers": [
  //         {
  //           "color": "#757575"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "road.highway",
  //       "elementType": "geometry",
  //       "stylers": [
  //         {
  //           "color": "#dadada"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "road.highway",
  //       "elementType": "labels.text.fill",
  //       "stylers": [
  //         {
  //           "color": "#616161"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "road.local",
  //       "elementType": "labels.text.fill",
  //       "stylers": [
  //         {
  //           "color": "#9e9e9e"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "transit.line",
  //       "stylers": [
  //         {
  //           "visibility": "simplified"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "transit.line",
  //       "elementType": "geometry",
  //       "stylers": [
  //         {
  //           "color": "#e5e5e5"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "transit.station",
  //       "elementType": "geometry",
  //       "stylers": [
  //         {
  //           "color": "#eeeeee"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "water",
  //       "elementType": "geometry",
  //       "stylers": [
  //         {
  //           "color": "#c9c9c9"
  //         }
  //       ]
  //     },
  //     {
  //       "featureType": "water",
  //       "elementType": "labels.text.fill",
  //       "stylers": [
  //         {
  //           "color": "#9e9e9e"
  //         }
  //       ]
  //     }
  //   ],
  //   { name: "Streets with Terrain" }
  // );

  map = new google.maps.Map(document.getElementById("mapid"), {
    mapId: "4b8d32be0b6717d",
    center: { lat: 38.525, lng: -8.893 },
    zoom: 15,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_LEFT
    },
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
      style: google.maps.MapTypeControlStyle.DEFAULT,
      mapTypeIds: ["roadmap","satellite"],
    }
  });

  map.setTilt(45);

  // map.mapTypes.set("terrain_simple", styledMapTerrain);

  d3.csv("./portugal_properties.csv", (d) => {
    return {
      type: "Feature",
      properties: {
        id: d.id,
        mainImage: d.mainImage,
        marker: d.marker,
        locationName: d.locationName,
        locationLink: d.locationLink,
        price: d.price,
        "price/sqm": d["price/sqm"],
        "area-sqm": d["area-sqm"],
        acres: d.acres,
        link: d.link,
        documents: d.documents,
        locationType: d.locationType
      },
      geometry: {
        type: "Point",
        coordinates: [+d.longitude,+d.latitude]
      }
    }
  }).then((data) => {
    console.log(data);
    drawMarkers(data);
  });

  const svgMarker = {
    path: "M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z",
    // fillColor: "blue",
    fillOpacity: 0.8,
    strokeWeight: 0,
    rotation: 0,
    scale: .5,
    // anchor: new google.maps.Point(15, 30),
  };
  // console.log(svgMarker);

  var blueMarker = Object.assign({},svgMarker);
  blueMarker = Object.assign(blueMarker,{fillColor: "#267ec9"});

  var redMarker = Object.assign({},svgMarker);
  redMarker = Object.assign(redMarker,{fillColor: "#d95f02"});

  var greenMarker = Object.assign({},svgMarker);
  greenMarker = Object.assign(greenMarker,{fillColor: "#1a9e06"});

  var yellowStar = {
    url: '../../images/star-yellow.svg'
  };

  const myIcons = {
    'normal': blueMarker,
    'red': redMarker,
    'green': greenMarker,
    'normal-interesting': yellowStar,
    'green-interesting': yellowStar
  };

  // console.log(myIcons);

  map.data.setStyle(function (feature) {
    // console.log(myIcons[feature.getProperty('marker')]);
    return {icon:myIcons[feature.getProperty('marker')]};
  });

  var markerEx = new google.maps.Marker({
    position: { lat: 38.80905, lng: -9.289156 },
    map,
    title: "Marker",
  });

  // const testInfowindow = new google.maps.InfoWindow({
  //   content: "test",
  //   maxWidth: 200
  // });
  //
  // markerEx.addListener("click", () => {
  //   testInfowindow.open({
  //     anchor:markerEx,
  //     map,
  //     shouldFocus: false
  //   });
  // });


  function drawMarkers(data) {
    var geojson = {
      type: "FeatureCollection",
      features: data
    };
    console.log(geojson);
    var propertyFeatures = map.data.addGeoJson(geojson,{idPropertyName:"id"});

    console.log(propertyFeatures);
    propertyFeatures.forEach((feature) => {
      // console.log(feature);
    });

    const infowindow = new google.maps.InfoWindow({
      content: "Test",
      maxWidth: 400,
      pixelOffset: new google.maps.Size(0,-20)
    });

    map.data.addListener("click", (event) => {
      console.log(event.feature.getProperty("locationName"));

      let popupHTML = '';
      popupHTML += "<img class='mainImage mx-auto' src='../images/" + event.feature.getProperty('mainImage') + "'>"
      popupHTML += "<div class='row' style='max-width: 100%;'>";
      popupHTML += "<div class='col-md-6 col-xs-6'>";
      if (event.feature.getProperty('price') != "N/A") {
        popupHTML += "Price: " + event.feature.getProperty('price') + "<br>";
      }
      if (event.feature.getProperty("locationLink") != "") {
        popupHTML += "<a href='" + event.feature.getProperty("locationLink") + "' target='_blank'>" + event.feature.getProperty("locationName") + "</a>";
      } else {
        popupHTML += event.feature.getProperty("locationName");
      }
      popupHTML += "</div>";
      if (event.feature.getProperty("price/sqm") != "N/A") {
        popupHTML += "<div class='col-md-6 col-xs-6'>Price/SqMeter: " + event.feature.getProperty("price/sqm");
        popupHTML += "<br>" + event.feature.getProperty("area-sqm") + " sq m</div>";
      }
      if (event.feature.getProperty('link') != "") {
        popupHTML += "<div class='col-12 py-1'><a target='_blank' href='"+event.feature.getProperty('link')+"'>Learn more...</a></div>";
      }
      if (event.feature.getProperty('documents') != "") {
        console.log(event.feature.getProperty('documents'));
        let documents = eval(event.feature.getProperty('documents'));
        popupHTML += "<div class='col-12 py-0'>Documents:";
        documents.forEach((item, i) => {
          popupHTML += "<a target='_blank' href='../documents/"+item[1]+"'>"+item[0]+"</a> ";
        });
        popupHTML += "</div>";
      }

      infowindow.setContent(popupHTML);

      infowindow.setPosition(event.feature.getGeometry().get());

      infowindow.open(map);
    });

    infowindow.addListener('domready', () => {
      console.log('domready');

      var images = document.getElementsByClassName('mainImage');
      images[images.length-1].addEventListener('click', function () {
        // console.log('click');
        // console.log(images[images.length-1].attributes[1]);
        document.getElementById('image').innerHTML = "<button type='button' class='btn-close pt-3 px-3' data-bs-dismiss='modal' aria-label='Close'></button>" +
                "<img class='modalImg' src='"+images[images.length-1].attributes[1].nodeValue+"'>"
        imageModal.show();
      });
    });

    cascaisBtn.addEventListener('click', () => {zoomToCenter({lat: 38.75, lng: -9.39},12)});
    setubalBtn.addEventListener('click', () => {zoomToCenter({lat: 38.525, lng: -8.893},15)});

    function zoomToCenter(latLng, zoom) {
      map.panTo(latLng);
      map.setZoom(zoom);
    }

  } // end drawMarkers

  const legend = document.createElement('div');
  legend.id = "legend";
  legend.classList = "legend ms-2";

  const breaks = ["Listed","Vacant","Interesting","Joao's Building"];
  const colors = ["#267ec9","#1a9e06","","#d95f02"];

  legend.innerHTML = '<h3>Location</h3><ul>' +
  '<li><span style="background:' + colors[0] + '"></span> ' + breaks[0] + '</li>' +
  '<li><span style="background:' + colors[1] + '"></span> ' + breaks[1] + '</li>' +
  '<li><span><img src="../../images/star-yellow.svg"></span> ' + 'Interesting' + '</li>' +
  '<li><span style="background:' + colors[3] + '"></span> ' + breaks[3] + '</li>' +
  '</ul>';

  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

} //end initMap
