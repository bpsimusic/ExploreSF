import React from 'react';
import { ClipLoader } from 'react-spinners';

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

  displayList(){
    if(this.props.loading){
      return <div></div>;
    }
    if (this.props.places.length === 0 && !this.props.loading){
      return <div className={"noResults"}>No results found</div>;
    } else {
      return (
        <ul>
          {this.props.places.map((place, id)=>{
            let open = place.opening_hours ? place.opening_hours.open_now : "";
            open = open ? "Open Now" : "Closed";
            return (
              <li key={id}
                onMouseEnter={this.addTarget(place)}
                onMouseLeave={this.removeTarget(place)}>
                <p className={"locationName"}>{place.name}</p>
                <p>{this.editAddress(place.formatted_address)}</p>
                <p>{`${open}`}</p>
              </li>
            );
          })}
        </ul>
      );
    }

  }

  editAddress(address){
    const editedAddress = address.split(", United States");
    return editedAddress[0];
  }

  loading(){
    if (this.props.loading){
      return (
        <div className={"spinner"}>
      <ClipLoader
          color={'#123abc'}
          loading={true}
          size={80}
        />
      </div>
      );
    }
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
        {this.loading()}
        {this.displayList()}
      </div>
    );
  }
}

export default List;
