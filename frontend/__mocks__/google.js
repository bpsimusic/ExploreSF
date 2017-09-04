/*global jest*/

const google = jest.genMockFromModule('../google');

function InfoWindow(x){
  this.x = x;
}
function Marker(x){
  this.x = x;
}

function LatLngBounds(x){
  this.x = x;
}

LatLngBounds.prototype.extend = function(){};
function Map(x){
  this.x = x;
}

Map.prototype.fitBounds = function(){};

const places = {
  PlacesService,
  PlacesServiceStatus: {OK: "OK"}
};

function PlacesService(x){
  this.x = x;
}




const SymbolPath = {
  CIRCLE: {}
};

const maps = {
  InfoWindow,
  Marker,
  LatLngBounds,
  Map,
  places,
  SymbolPath
};

google.maps = maps;

module.exports = google;
