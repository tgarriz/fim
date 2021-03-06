var map, featureList, obrasSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("gid"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(gid) {
  var layer = markerClusters.getLayer(gid);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through theaters layer and add only features which are in the map bounds */
  obras.eachLayer(function (layer) {
    if (map.hasLayer(obrasLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/iconos/marcador.svg"></td><td class="feature-name">' + layer.feature.properties.obra + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers 
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});
/*var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
   maxZoom: 19
});*/
var ggl3 = new L.Google('ROADMAP');
var ggl = new L.Google();
var ggl2 = new L.Google('HYBRID');

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: true,
  color: "#000000",
  weight: 5,
  opacity: 0.6,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var wmsPartidos = L.tileLayer.wms("http://geobasig.com.ar/geoserver29/Geodesia/wms?", {
  layers: 'Provincia',
  format: 'image/png',
  transparent: true,
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var obrasLayer = L.geoJson(null);
var obras = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
//    alert(feature.properties.tipo);
    switch (feature.properties.tipo) {
	case "vialidad":
	  return L.marker(latlng, {
	    icon: L.icon({
		iconUrl: "assets/img/iconos/vialidad2.svg",
		iconSize: [24, 28],
		iconAnchor: [12, 28],
		popupAnchor: [0, -25]
	    }),
	    title: feature.properties.obra,
	    riseOnHover: true
	  });
	  break;
	case "infraestructura":
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: "assets/img/iconos/infraestructura2.svg",
              iconSize: [24, 28],
              iconAnchor: [12, 28],
              popupAnchor: [0, -25]
            }),
	    title: feature.properties.obra,
	    riseOnHover: true
	  });
	  break;
	case "hidraulica":
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: "assets/img/iconos/hidraulica2.svg",
              iconSize: [24, 28],
              iconAnchor: [12, 28],
              popupAnchor: [0, -25]
            }),
            title: feature.properties.obra,
            riseOnHover: true
          });
          break;
	case "salud":
	  return L.marker(latlng, {
	    icon: L.icon({
	      iconUrl: "assets/img/iconos/salud2.svg",
	      iconSize: [24, 28],
	      iconAnchor: [12, 28],
	      popupAnchor: [0, -25]
	    }),
	    title: feature.properties.obra,
	    riseOnHover: true
	  });
	  break;
	case "saneamiento":
	  return L.marker(latlng, {
	    icon: L.icon({
	      iconUrl: "assets/img/iconos/agua2.svg",
	      iconSize: [24, 28],
	      iconAnchor: [12, 28],
	      popupAnchor: [0, -25]
	    }),
	    title: feature.properties.obra,
	    riseOnHover: true
	  });
  }},
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Obra</th><td>" + feature.properties.obra + "</td></tr>" + "<tr><th>Cod.Partido</th><td>" + feature.properties.cod_part + "</td></tr>" + "<tr><th>Tipo</th><td>" + feature.properties.tipo + "</td></tr>" + "<tr><th>Informe Sigos</th><td><a class='url-break' href='http://abierto.geobasig.com.ar/wsdclient.php?ido=" + feature.properties.id_sigos + "' target='_blank'>" + feature.properties.id_sigos + "</a></td></tr>" +  "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.obra);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/iconos/marcador.svg"></td><td class="feature-name">' + layer.feature.properties.obra + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      obrasSearch.push({
        name: layer.feature.properties.obra,
        address: layer.feature.properties.tipo,
        source: "obras",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/obras2016.geojson", function (data) {
  obras.addData(data);
  map.addLayer(obrasLayer);
});

map = L.map("map", 
  {
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: 'topleft'
    }, 
    zoom: 6,
    center: [-36.31073, -60.25376],
    layers: [ggl3, ggl2, ggl, wmsPartidos, markerClusters, highlight],
    zoomControl: false,
    attributionControl: false
  }
);
new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.OpenStreetMap()
}).addTo(map);


/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === obrasLayer) {
    markerClusters.addLayer(obras);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === obrasLayer) {
    markerClusters.removeLayer(obras);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Desarrollado por Dpto.Cartográfico | Geodesia e Img.Satelitales</span>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "topleft"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "topleft",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  //"Street Map": cartoLight,
  "Google Road": ggl3,
  "Google Satelital": ggl,
  "Google Hybrid": ggl2,
};

var groupedOverlays = {
  "Obras": {
    "<img src='assets/img/iconos/provincia.png' width='24' height='24'>&nbsp;Provincia": wmsPartidos,
    "<img src='assets/img/iconos/marcador.svg' width='24' height='28'>&nbsp;F.I.M.": obrasLayer
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var obrasBH = new Bloodhound({
    name: "obras",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: obrasSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  obrasBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "obras",
    displayKey: "obra",
    source: obrasBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/iconos/marcador.svg' width='24' height='28'>&nbsp;Obras</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{tipo}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "obras") {
      if (!map.hasLayer(obrasLayer)) {
        map.addLayer(obrasLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Insertando una leyenda en el mapa
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend hidden-xs');
    div.innerHTML += 
      '<img alt="vialidad" width="20" height="24" src="assets/img/iconos/vialidad2.svg"> Obr.Viales<br>' +
      '<img alt="salud" width="20" height="24" src="assets/img/iconos/salud2.svg"> Obr.Salud<br>' +
      '<img alt="infraetructura" width="20" height="24" src="assets/img/iconos/infraestructura2.svg"> O.Infraestructura<br>' +
      '<img alt="hidraulica" width="20" height="24" src="assets/img/iconos/hidraulica2.svg"> Obr.Hidraulica<br>' +
      '<img alt="saneamiento" width="16" height="20" src="assets/img/iconos/agua2.svg"> Obr.Saneamiento<br>' ;
//    div.addClass("hidden-xs");
    return div;
};
legend.addTo(map);
// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

