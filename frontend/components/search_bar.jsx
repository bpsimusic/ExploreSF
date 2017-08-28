import React from 'react';

class SearchBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: ''};
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInput(e){
    e.preventDefault();
    this.setState({value: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    console.log("test")
      let map;
      let infowindow;

      function initMap() {
        let pyrmont = {lat: -33.867, lng: 151.195};

        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        let service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: pyrmont,
          radius: 500,
          type: ['store']
        }, (results, status)=>{console.log(results, status)});
      }
      initMap();
  }

  render(){
    return (
      <div>
        <form onSubmit={this.handleSubmit} className={"searchBar"}>
          <input onChange={this.handleInput} value={this.state.value}/>
          <button>Submit</button>
        </form>
        <div className={"locationsContainer"} >
          {this.props.children}
        </div>
      </div>
    );
  }

}


export default SearchBar;
