import React from 'react';
import List from './list';
import Map from './map';

class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: 'restaurant', places: [], loading: true};
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.query(this.state.value);
  }

  handleInput(e){
    e.preventDefault();
    this.setState({value: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    this.setState({loading: true}, ()=>{this.query(this.state.value);});
  }

  query(entry){
    let infowindow;
    let location = {lat: 37.773972, lng: -122.431297};

    window.map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom: 13
    });

    infowindow = new google.maps.InfoWindow();
    let service = new google.maps.places.PlacesService(window.map);
    service.textSearch({
      location,
      radius: '500',
      query: entry
    }, callback.bind(this));

    function callback(results, status){
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        let length = 10;
        if (results.length < length){
          length = results.length;
        }
        this.setState({places: results.slice(0,10), loading: false}, ()=>{
          let markers = [];
          for (var i = 0; i < length; i++) {
            markers.push(createMarker(results[i]));
          }

          let bounds = new google.maps.LatLngBounds();
          for (let j = 0; j < markers.length; j++) {
           bounds.extend(markers[j].getPosition());
          }

          window.map.fitBounds(bounds);
        });

      } else {
        this.setState({places: []});
      }
    }

    function createMarker(place){
      if(!place){
        return;
      }
      var symbolOne = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        strokeColor: '#e60000',
        strokeWeight: 7,
        fillColor: 'white',
        fillOpacity: 1
      };

      var marker = new google.maps.Marker({
        icon: symbolOne,
        map: window.map,
        position: place.geometry.location
      });

      let percent = (place.rating / 5 * 100);

      let contentString = '<div id="content">'+
    `<h1 id="firstHeading" class="firstHeading">${place.name}</h1>`+
    '<div id="bodyContent">'+
    `<p class="rating"> ${place.rating} </p>`+
    `<div class="star-ratings-css">
    <div class="star-ratings-css-top" style="width: ${percent}%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
    <div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
    </div>` +
    '</div>'+
    '</div>';


      marker.addListener('mouseover', function() {
        infowindow.setContent(contentString);
        infowindow.open(window.map, marker);
      });

      marker.addListener('mouseout', function() {
          infowindow.close();
      });
      return marker;
    }
  }

  render(){
    return (
      <div className={"searchBarContainer"}>
        <form onSubmit={this.handleSubmit} className={"searchBarForm"}>
          <input onChange={this.handleInput}
            value={this.state.value}
            className={"searchBar"}/>
          <button>Search</button>
        </form>
        <div className={"locationsContainer"} >
          <List places={this.state.places} loading={this.state.loading}/>
          <Map />
        </div>
      </div>
    );
  }

}


export default SearchBar;
