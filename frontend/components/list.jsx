import React from 'react';

class List extends React.Component {
  constructor(props){
    super(props);
    this.infowindow = null;
  }

  addTarget(place){
    let that = this;

    return (e)=>{
      e.preventDefault();
      createLabel(place);

      function createLabel(x){

        let percent = (x.rating / 5 * 100);

        let contentString = '<div id="content">'+
      `<h1 id="firstHeading" class="firstHeading">${x.name}</h1>`+
      '<div id="bodyContent">'+
      `<p class="rating"> ${x.rating}`+ '<p>'+
      `<div class="star-ratings-css">
  <div class="star-ratings-css-top" style="width: ${percent}%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
  <div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
</div>` +
      '</div>'+
      '</div>';


       if(!that.infowindow){
         that.infowindow = new google.maps.InfoWindow({
             content: contentString,
             position: x.geometry.location,
             disableAutoPan: true,
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
