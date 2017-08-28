import React from 'react';
import List from './list';
import Map from './map';

class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: 'restaurant'};
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
    this.query(this.state.value);
  }

  query(entry){
    let map;
    let infowindow;

    let location = {lat: 37.773972, lng: -122.431297};

    map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom: 15
    });
    infowindow = new google.maps.InfoWindow();
    let service = new google.maps.places.PlacesService(map);
    service.textSearch({
      location,
      radius: '500',
      query: entry
    }, callback);

    function callback(results, status){
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      }
    }

    function createMarker(place){
      var placeLoc = place.geometry.location;
      var marker = new google.maps.Marker({
        map,
        position: place.geometry.location
      });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
      });
    }
  }

  render(){
    return (
      <div className={"searchBarContainer"}>
        <form onSubmit={this.handleSubmit} className={"searchBar"}>
          <input onChange={this.handleInput} value={this.state.value}/>
          <button>Submit</button>
        </form>
        <div className={"locationsContainer"} >
          <List />
          <Map />
        </div>
      </div>
    );
  }

}


export default SearchBar;
