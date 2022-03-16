let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("mapid"), {
    mapId: "90e7ec06f513d4a4",
    center: { lat: 38.525, lng: -8.893 },
    zoom: 15,
    fullscreenControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_LEFT
    },
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
      style: google.maps.MapTypeControlStyle.DEFAULT,
      mapTypeIds: ["roadmap", "satellite"],
    }
  });

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
  blueMarker = Object.assign(blueMarker,{fillColor: "blue"});

  var redMarker = Object.assign({},svgMarker);
  redMarker = Object.assign(redMarker,{fillColor: "red"});

  var greenMarker = Object.assign({},svgMarker);
  greenMarker = Object.assign(greenMarker,{fillColor: "green"});

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

  new google.maps.Marker({
    position: { lat: 38.80905, lng: -9.289156 },
    map,
    title: "Marker",
  });


  function drawMarkers(data) {
    var geojson = {
      type: "FeatureCollection",
      features: data
    };
    console.log(geojson);
    var propertyFeatures = map.data.addGeoJson(geojson);

    console.log(propertyFeatures);
    propertyFeatures.forEach((feature) => {
      // console.log(feature);
    });

    const infowindow = new google.maps.InfoWindow({
      content: "Test",
      maxWidth: 200
    });
    map.data.addListener("click", (event) => {
      console.log(event.feature.getProperty("locationName"));
      console.log(event.feature.getGeometry().getType());
      infowindow.open({
        anchor:event.latLng,
        map,
        shouldFocus: false
      })
    });
  }
} //end initMap
