let map;

var imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
var cascaisBtn = document.getElementById('cascaisBtn');
var setubalBtn = document.getElementById('setubalBtn');

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
      mapTypeIds: ["roadmap","terrain", "satellite"],
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
      popupHTML += "<div class='row'>";
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
} //end initMap
