let map;

var imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
var cascaisBtn = document.getElementById('cascaisBtn');
var setubalBtn = document.getElementById('setubalBtn');

function initMap() {

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


  const breaks = [1500,10000,"Vacant"];
  const colors = ["#267ec9","#ffcc00","#d95f02","#1a9e06"];

  map.data.setStyle(function (feature) {
    // console.log(myIcons[feature.getProperty('marker')]);
    let pricesqm = feature.getProperty('price/sqm');
    if (pricesqm == "N/A") {
      return {icon:myIcons['N/A']};
    } else {
      pricesqm = +pricesqm.replace('€','').replace(/,/g,'');
      if (pricesqm < breaks[0]) {
        return {icon:myIcons['tier1']};
      } else if (pricesqm < breaks[1]) {
        return {icon:myIcons['tier2']};
      } else {
        return {icon:myIcons['tier3']};
      }
    }
    console.log(pricesqm);

    return {icon:myIcons[feature.getProperty('marker')]};
  });

  var marker1 = new google.maps.Marker({
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
    var propertyFeatures = map.data.addGeoJson(geojson,{idPropertyName:"id"});

    // console.log(propertyFeatures);
    // propertyFeatures.forEach((feature) => {
    //   // console.log(feature);
    // });

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
      // map.setTilt(45);
    }

  } // end drawMarkers

  const legend = document.createElement('div');
  legend.id = "legend";
  legend.classList = "legend ms-2";

  let legendHTML = '<h3>€/SqMeter</h3><ul>';

  legendHTML += '<li><span style="background:' + colors[0] + '"></span> < ' + breaks[0] + '</li>';
  legendHTML += '<li><span style="background:' + colors[1] + '"></span> ' + breaks[0] + ' &mdash; ' + breaks[1] + '</li>';
  legendHTML += '<li><span style="background:' + colors[2] + '"></span> > ' + breaks[1] + '</li>';
  legendHTML += '<li><span style="background:' + colors[3] + '"></span> ' + breaks[2] + '</li>';
  legendHTML += '</ul>';

  legend.innerHTML = legendHTML;

  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);

} //end initMap
