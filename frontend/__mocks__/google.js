const google = jest.genMockFromModule('../google');

function InfoWindow(x){
  this.x = x;
}
const maps = {
  InfoWindow
};
google.maps = maps;
module.exports = google;
