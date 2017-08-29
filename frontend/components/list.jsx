import React from 'react';

class List extends React.Component {
  constructor(props){
    super(props);
    this.marker = null;
    this.infowindow = null;
  }

  addTarget(place){
    let that = this;

    return (e)=>{
      e.preventDefault();
      createMarker(place);

      function createMarker(x){

        that.marker = new google.maps.Marker({
          map: window.map,
          position: x.geometry.location
        });

        const contentString = '<div id="content">'+
      `<h1 id="firstHeading" class="firstHeading">${x.name}</h1>`+

      '</div>';


       if(!that.infowindow){
         that.infowindow = new google.maps.InfoWindow({
             content: contentString,
             position: that.marker.position,
             disableAutoPan: true
         });

       }
       that.infowindow.open(window.map);

      }
    };
  }


  removeTarget(place){
    let that = this;
    return (e)=>{

      e.preventDefault();
      that.marker.setMap(null);
      that.marker=null;
      that.infowindow.close();
      that.infowindow = null;

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
