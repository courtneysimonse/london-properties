(function () {

  // London map options
  var options = {
    zoomSnap: .2,
    center: [51.512, -0.155],
    zoom: 13.2,
    minZoom: 13,
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

  var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  	maxZoom: 20,
  	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  }).addTo(map);

  // change zoom control position
  L.control.zoom({
    position: 'bottomleft'
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
  processData(londonProperties, londonNeighborhoods);

  // PROCESS DATA FUNCTION
  function processData(properties, neighborhoods) {

    drawMap(properties, neighborhoods);
    createInfoSections(properties, div);

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
        if (geoJsonPoint.properties.category == 'Available') {
            return L.marker(latlng, {icon: myIcons['Available']});
          } else if (geoJsonPoint.properties.category == 'Comparables') {
            return L.marker(latlng, {icon: myIcons['Comparables']});
          } else {
            return L.marker(latlng, {icon: myIcons['Recent Sales']});
          }
          // icon: myIcons[geoJsonPoint.properties.category]
        },
      onEachFeature: function (feature, layer) {
        popupText = "<h6>" + feature.properties.display_address + "</h6>";
        // if (feature.properties.category == 'Available') {
        //   // const popupDiv = document.createElement('div');
        //   // addCarousel(feature,popupDiv,'popup');
        //   // console.log(popupDiv.innerHTML);
        //   popupText += popupDiv.innerHTML;
        //   popupText += "<p><a href='#prop-" + feature.properties.id + "'>More information...</a></p>";
        // } else if (feature.properties.category == 'Recent Sales' || feature.properties.category == 'Comparables') {
        if (feature.properties.description) {
          popupText += "<p>" + feature.properties.description + "</p>";
        }
        if (feature.properties.price) {
          popupText += "<p>Price: " + feature.properties.price + "</p>";
        }

        // } else {
        //
        // }

        layer.bindPopup(popupText, {maxWidth: 700});
      }
    }).addTo(map);

    // L.geoJSON(neighborhoods, {
    //   pointToLayer: function (geoJsonPoint, latlng) {
    //     let label = L.divIcon({
    //       className: "neighborhoods",
    //       html: geoJsonPoint.properties.name,
    //       iconSize: [90,20]
    //     })
    //     return new L.marker(latlng, {icon: label});
    //   }
    // }).addTo(map);

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
    '<li><span style="background:' + colors[1] + '"></span> ' + breaks[1] + '</li>' +
    '<li><span style="background:' + colors[2] + '"></span> ' + breaks[2] + '</li>' +
    '</ul>';
    // legend.innerHTML += '</ul><p>(Data from SOURCE)</p>';
  //
  } // end drawLegend()

  function createInfoSections(properties, div) {

    properties.features.forEach((prop, i) => {
      if (prop.properties.category == 'Available') {
        const propDiv = document.createElement('div');
        propDiv.classList.add('property');
        // console.log(prop.properties.id);
        propDiv.id = 'prop-'+prop.properties.id;
        div.appendChild(propDiv);

        if (prop.properties.numImages) {
          addCarousel(prop,propDiv,'info');
          const moreInfo = document.createElement('h6');
          moreInfo.innerHTML = '<a href="#header-'+prop.properties.id+'">More Information Below</a>'
          propDiv.appendChild(moreInfo);
        }

        const header = document.createElement('h3');
        header.innerHTML = prop.properties.display_address;
        header.id = 'header-'+prop.properties.id;
        propDiv.appendChild(header);

        if (prop.properties.features) {
          const featureSect = document.createElement('ul');
          const featureH5 = document.createElement('h5');
          featureH5.innerHTML = "Features";
          featureSect.appendChild(featureH5);
          const featuresList = prop.properties.features;
          featuresList.forEach((item, i) => {
            const featureLi = document.createElement('li');
            featureLi.innerHTML = item;
            featureSect.appendChild(featureLi);
          });
          propDiv.appendChild(featureSect);

        }

      }
    });

  }   // end createInfoSections()

  function addCarousel(prop, propDiv, loc) {
    const carouselDiv = document.createElement('div');
    carouselDiv.classList.add('carousel', 'slide', 'carousel-fade');
    carouselDiv.id = 'carouselProp-'+prop.properties.id+'-'+loc;
    carouselDiv.setAttribute('data-bs-ride','carousel');
    propDiv.appendChild(carouselDiv);

    const carouselIndicators = document.createElement('div')
    carouselIndicators.classList.add('carousel-indicators');

    const carouselInner = document.createElement('div');
    carouselInner.classList.add('carousel-inner','w-100');

    numImages = prop.properties.numImages;
    images = prop.properties.images;
    for (var i = 0; i < numImages; i++) {
      const carouselBtn = document.createElement('button');
      carouselBtn.setAttribute('data-bs-target',carouselDiv.id);
      carouselBtn.setAttribute('data-bs-slide-to',i);
      carouselBtn.setAttribute('aria-label','Slide'+(i+1));

      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');

      const img = document.createElement('img');
      img.classList.add('d-block','w-100');
      img.setAttribute('src','./images/'+images[i])

      carouselItem.appendChild(img);

      if (i==0) {
        carouselBtn.setAttribute('aria-current','true');
        carouselBtn.classList.add('active');
        carouselItem.classList.add('active');
      }
      carouselIndicators.appendChild(carouselBtn);
      carouselInner.appendChild(carouselItem);

    }

    carouselDiv.appendChild(carouselIndicators);
    carouselDiv.appendChild(carouselInner);

    const carouselCntrlPrev = document.createElement('button');
    carouselCntrlPrev.classList.add('carousel-control-prev');
    carouselCntrlPrev.setAttribute('type','button');
    carouselCntrlPrev.setAttribute('data-bs-target','#'+carouselDiv.id);
    carouselCntrlPrev.setAttribute('data-bs-slide','prev');
    carouselCntrlPrev.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true" style="font-size: 3em; background-image:none"><i class="fas fa-chevron-circle-left"></i></span>' +
      '<span class="visually-hidden">Previous</span>';  //change default arrow icon
    carouselDiv.appendChild(carouselCntrlPrev);

    const carouselCntrlNext = document.createElement('button');
    carouselCntrlNext.classList.add('carousel-control-next');
    carouselCntrlNext.setAttribute('type','button');
    carouselCntrlNext.setAttribute('data-bs-target','#'+carouselDiv.id);
    carouselCntrlNext.setAttribute('data-bs-slide','next');
    carouselCntrlNext.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true" style="font-size: 3em; background-image:none"><i class="fas fa-chevron-circle-right"></i></span>' +
      '<span class="visually-hidden">Next</span>';
    carouselDiv.appendChild(carouselCntrlNext);

  }

})();
