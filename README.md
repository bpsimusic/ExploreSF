# Explore SF

[Explore SF live](https://bpsimusic.github.io/ExploreSF/)

Users can use this app to search for places in San Francisco.
I used the Google Maps API to return a list of locations
most closely matching the searched words.

Simply type in any word related to what you're looking for, and a list of places
will appear on the map.

![demo of project](/docs/demo.png)

## Design Choices

I wanted to create something convenient for indecisive end-users, so in my app
I included business hours and its rating. I decided
to use the hover event for a quick scan of location and quality. If the user wants to know more about a place,
I will use the click event to provide the place's phone number and location in the future.

```javascript
//Each list item
  <li key={id}
    onMouseEnter={this.addTarget(place)}
    onMouseLeave={this.removeTarget(place)}>
    <p className={"locationName"}>{place.name}</p>
    <p>{this.editAddress(place.formatted_address)}</p>
    {this.storeHours(open)}
  </li>
```

## Google Maps API

I decided to use the textSearch method from Google Maps API; in case users didn't
know what to look for, they could enter a generic term.

```javascript
service.textSearch({
  location,
  radius: '500',
  query: entry
}, this.retrievePlaces);
```

The query key maps to entry, which is what the user types in the search bar. A callback
is passed to receive the results of the API call. If the API call is successful, the callback
will receive an array up to 10 locations. Each location will be drawn as a marker to the map.


```javascript
let marker = new google.maps.Marker({
  icon: symbolOne,
  map: window.map,
  position: place.geometry.location
});
```

## Testing

I had never tested an API before, so I was excited to try something new. I used Jest and Enzyme
to test my List Component and SearchBar component.

To mock an external API, I had to create a folder "__mocks__", create a file (google.js), and call jest.genMockFromModule. The file (google.js) served as my fake module, and anytime I used
the Google API in my React Components, I had to use my mock implementations in my tests.  

```javascript
//search_bar.jsx
  constructor(props){
    this.infowindow = new google.maps.InfoWindow({disableAutoPan: true});
  }
```

```javascript
//google.js
const google = jest.genMockFromModule('../google');

function InfoWindow(x){
  this.x = x;
}
```

Before each test, I had to require my fake module:

```javascript
//search_bar.test.js
beforeEach(() => {
  google.maps.InfoWindow = require('google').maps.InfoWindow;
  google.maps.Marker = require('google').maps.Marker;
  google.maps.LatLngBounds = require('google').maps.LatLngBounds;
  google.maps.Map = require('google').maps.Map;
  google.maps.places = require('google').maps.places;
  google.maps.SymbolPath = require('google').maps.SymbolPath;
});
```
I ran into a problem during testing that didn't break the app, but I couldn't find a good alternative. Google Maps API draws markers onto its map. There was no way to mock the function
"google.maps.Marker" and have it actually draw a marker at the accurate location.

I tried importing the actual Google Maps API into a script, but ran into an error:

```javascript
Test suite failed to run

    TypeError: Cannot use 'in' operator to search for 'Array' in undefined

      at xa (frontend/__tests__/google_maps_api.js:25:146)
      at frontend/__tests__/google_maps_api.js:98:278
      at Object.<anonymous> (frontend/__tests__/google_maps_api.js:134:85)
          at <anonymous>
      at process._tickCallback (internal/process/next_tick.js:188:7)

```

It seemed like the API had a syntax error. As an alternative, I tested eventListeners on my List Component and the markers:


```javascript
//list.test.js
  it("attaches a mouseenter listener to a list item",()=>{
    instance.createLabel = jest.fn();
    wrapper.update();
    wrapper.find("li").simulate('mouseEnter', event);
    expect(instance.createLabel).toHaveBeenCalledTimes(1);
  });
```
```javascript
//search_bar.test.js
  it("adds a mouseover listener to the marker", ()=>{
    let marker = instance.createMarker(place);
    map['mouseover']();
    expect(instance.infowindow.setContent).toBeCalled();
    expect(instance.infowindow.open).toBeCalled();
  });
```

## Future Project Plans

- Create better tests for map API functionality
- Add a click event to list items that display more information
