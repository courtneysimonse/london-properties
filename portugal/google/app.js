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

  const myIcons = {
    'normal': '../../images/marker.svg',
    'red': '../../images/marker-red.svg',
    'green': '../../images/marker-green.svg',
    'normal-interesting': '../../images/star-yellow.svg',
    'green-interesting': '../../images/star-yellow.svg'
  };

  const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };

  // map.data.setStyle(function (feature) {
  //   if (!myIcons[feature.getProperty('marker')]) {
  //     console.log(feature);
  //   }
  //   return {
  //     icon:{url:myIcons[feature.getProperty('marker')]}
  //   };
  // });

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
    map.data.addGeoJson(geojson);
  }
} //end initMap
