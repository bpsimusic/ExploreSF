import React from 'react';

class List extends React.Component {
  constructor(props){
    super(props);
    this.marker = null;
  }

  addTarget(place){
    let that = this;
    return (e)=>{
      e.preventDefault();
      createMarker(place.geometry.location);

      function createMarker(location){
          that.marker = new google.maps.Marker({
          map: window.map,
          position: location
        });
      }
    };
  }


  removeTarget(place){
    let that = this;
    return (e)=>{

      e.preventDefault();
      that.marker.setMap(null);
      that.marker=null;
    };
  }







  render(){
    return (
      <div className={"list"}>
        <ul>
          {this.props.places.map((place, id)=>{
            return (
              <li key={id}
                onMouseEnter={this.addTarget(place)}
                onMouseLeave={this.removeTarget(place)}>{place.name}</li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default List;
