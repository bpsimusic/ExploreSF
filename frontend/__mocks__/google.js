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
function Map(x){
  this.x = x;
}

const places = {
  PlacesService,
  PlacesServiceStatus: {OK: true}
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
