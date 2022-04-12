let map;

var imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
// var cascaisBtn = document.getElementById('cascaisBtn');
// var setubalBtn = document.getElementById('setubalBtn');

function initMap() {

  map = new google.maps.Map(document.getElementById("mapid"), {
    mapId: "ddda8f9544c3072b",
    center: { lat: 51.515, lng: -0.155 },
    zoom: 12,
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

  d3.csv("./london-properties.csv", (d) => {
    console.log(d);
    return {
      type: "Feature",
      properties: {
        id: d.id,
        mainImage: d.mainImage,
        marker: d.marker,
        locationName: d.locationName,
        locationLink: d.locationLink,
        price: d.price,
        "price-sqft": d["price-sqft"],
        "area-sqft": d["area-sqft"],
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

  var yellowMarker = Object.assign({},svgMarker);
  yellowMarker = Object.assign(yellowMarker,{fillColor: "#ffcc00"});

  // var yellowStar = {
  //   url: '../../images/star-yellow.svg'
  // };

  // const myIcons = {
  //   'normal': blueMarker,
  //   'red': redMarker,
  //   'green': greenMarker,
  //   'normal-interesting': yellowStar,
  //   'green-interesting': yellowStar
  // };

  const myIcons = {
    'tier1': blueMarker,
    'tier2': yellowMarker,
    'tier3': redMarker,
    'N/A': greenMarker,
  };

  // console.log(myIcons);

  // 15-25, 25-35, 35+
  const breaks = [15000000,25000000,35000000,"Price on Application"];
  const colors = ["#267ec9","#ffcc00","#d95f02","#1a9e06"];

  map.data.setStyle(function (feature) {
    // console.log(myIcons[feature.getProperty('marker')]);
    let tier = feature.getProperty('price');
    if (tier == "N/A") {
      return {icon:myIcons['N/A']};
    } else {
      tier = +tier.replace('£','').replace(/,/g,'');
      // console.log(tier);
      if (tier < breaks[1]) {
        return {icon:myIcons['tier1']};
      } else if (tier < breaks[2]) {
        return {icon:myIcons['tier2']};
      } else {
        return {icon:myIcons['tier3']};
      }
    }
    console.log(tier);

    return {icon:myIcons[feature.getProperty('marker')]};
  });

  // var marker1 = new google.maps.Marker({
  //   position: { lat: 38.80905, lng: -9.289156 },
  //   map,
  //   title: "Marker",
  // });

  function drawMarkers(data) {
    var geojson = {
      type: "FeatureCollection",
      features: data
    };
    console.log(geojson);
    var propertyFeatures = map.data.addGeoJson(geojson,{idPropertyName:"id"});
    // console.log(propertyFeatures);

    // console.log(propertyFeatures);
    // propertyFeatures.forEach((feature) => {
    //   // console.log(feature);
    // });


    google.maps.event.addListenerOnce(map, 'idle', function () {

          const bounds = new google.maps.LatLngBounds();

          propertyFeatures.forEach((feature) => {
            const geometry = feature.getGeometry();

            if (geometry) {
              processPoints(geometry, bounds.extend, bounds);
            }
          });
          map.fitBounds(bounds, 0);
    });

    const infowindow = new google.maps.InfoWindow({
      content: "Test",
      maxWidth: 400,
      minWidth: 400,
      pixelOffset: new google.maps.Size(0,-20)
    });

    map.data.addListener("click", (event) => {
      console.log(event.feature.getProperty("locationName"));

      let popupHTML = "<div class='m-0 p-0' style='height: 100px;'><div class='row' style='max-width: 100%; height: 100px;'>";
      popupHTML += "<div class='col-6'><img class='mainImage' style='width:175px;height:98px;' src='images/" + event.feature.getProperty('mainImage') + "?nf_resize=smartcrop&w=175&h=98'></div>"
      popupHTML += "<div class='col-6 ps-0'>";
      // popupHTML += "<div class='col-md-6 col-xs-6'>";
      popupHTML += "<div>"
      popupHTML += "<p class='mb-1 pb-0 fs-6'><strong>";
      if (event.feature.getProperty("locationLink") != "") {
        popupHTML += "<a class='iw-link' href='" + event.feature.getProperty("locationLink") + "' target='_blank'>" + event.feature.getProperty("locationName") + "</a>";
      } else {
        popupHTML += event.feature.getProperty("locationName");
      }
      popupHTML += "</strong></p>";

      if (event.feature.getProperty('price') != "N/A") {
        popupHTML += "<p class='fs-6'>Price: " + event.feature.getProperty('price') + "</p>";
      }

      popupHTML += "</div>";
      if (event.feature.getProperty("price-sqft") != "N/A") {
        popupHTML += "<div class='row'><div class='col-7 pe-0'>&pound;/SqFt: " + event.feature.getProperty("price-sqft") + "</div>";
        popupHTML += "<div class='col-5 ps-0'>" + event.feature.getProperty("area-sqft") + " sq ft</div></div>";
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
      popupHTML += "</div>"

      infowindow.setContent(popupHTML);

      // center map on marker
      map.panTo(event.feature.getGeometry().get());

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

    // cascaisBtn.addEventListener('click', () => {zoomToCenter({lat: 38.75, lng: -9.39},12)});
    // setubalBtn.addEventListener('click', () => {zoomToCenter({lat: 38.525, lng: -8.893},15)});

    function zoomToCenter(latLng, zoom) {
      map.panTo(latLng);
      map.setZoom(zoom);
      // map.setTilt(45);
    }

  } // end drawMarkers

  const legend = document.createElement('div');
  legend.id = "legend";
  legend.classList = "legend ms-2";

  let legendHTML = '<h3>Price (&pound;)</h3><ul>';

  legendHTML += '<li><span style="background:' + colors[0] + '"></span> ' + breaks[0]/1000000 + ' &mdash; ' + breaks[1]/1000000 + ' million</li>';
  legendHTML += '<li><span style="background:' + colors[1] + '"></span> ' + breaks[1]/1000000 + ' &mdash; ' + breaks[2]/1000000 + ' million</li>';
  legendHTML += '<li><span style="background:' + colors[2] + '"></span> > ' + breaks[2]/1000000 + ' million</li>';
  legendHTML += '<li><span style="background:' + colors[3] + '"></span> ' + breaks[3] + '</li>';
  legendHTML += '</ul>';

  legend.innerHTML = legendHTML;

  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

} //end initMap

function processPoints(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get());
  } else {
    geometry.getArray().forEach((g) => {
      processPoints(g, callback, thisArg);
    });
  }
}
