/*global google*/
/*global jest*/

import React from 'react';
import { shallow, mount, render } from 'enzyme';
import List from '../components/list';
import { ClipLoader } from 'react-spinners';

jest.mock('google');

describe('searchBar Component', ()=>{
  let wrapper;
  let instance;
  let places;
  let loading;

  beforeEach(() => {
    google.maps.InfoWindow = require('google').maps.InfoWindow;
    google.maps.Marker = require('google').maps.Marker;
    google.maps.LatLngBounds = require('google').maps.LatLngBounds;
    google.maps.Map = require('google').maps.Map;
    google.maps.places = require('google').maps.places;
    google.maps.SymbolPath = require('google').maps.SymbolPath;
    places = [{opening_hours: {open_now: true}, formatted_address: '123 Main St.', name: 'Chipotle'}]
  });

  describe("list's html elements", ()=>{
    it("displays an unordered list of elements", ()=>{
      loading = false;
      wrapper = shallow(<List places={places} loading={loading}/>);
      expect(wrapper.find('ul').length).toBe(1);
    });

    it("displays a wheel if loading", ()=>{
      loading = true;
      wrapper = shallow(<List places={places} loading={loading}/>);
      expect(wrapper.find(ClipLoader).length).toBe(1);
    });

    it("displays 'no results found' if places is empty", ()=>{
      loading = false;
      places = [];
      wrapper = shallow(<List places={places} loading={loading}/>);
      expect(wrapper.contains(<div className={"noResults"}>No results found</div>)).toBeTruthy();
    });
  });

  describe("list item", ()=>{
    let event;
    beforeEach(()=>{
      loading = false;
      wrapper = shallow(<List places={places} loading={loading}/>);
      event = {preventDefault: function(){}, target: {value: 5}};
      instance = wrapper.instance();
    });

    it("attaches a mouseenter listener to a list item",()=>{
      instance.createLabel = jest.fn();
      wrapper.update();
      wrapper.find("li").simulate('mouseEnter', event);
      expect(instance.createLabel).toHaveBeenCalledTimes(1);
    });

    it("attaches a mouseout listener to a list item",()=>{
      google.maps.InfoWindow.prototype.close = jest.fn();
      instance.infowindow = new google.maps.InfoWindow();
      wrapper.find("li").simulate('mouseLeave', event);
      expect(google.maps.InfoWindow.prototype.close).toHaveBeenCalledTimes(1);
    });

    it("displays a name and an address", ()=>{
      loading = false;
      places = [{opening_hours: {open_now: true}, formatted_address: '123 Main St.', name: 'Chipotle'}];
      wrapper = shallow(<List places={places} loading={loading}/>);
      wrapper.contains(<p className={"locationName"}>"Chipotle"</p> );
      wrapper.contains(<p>'123 Main St.'</p> );
    });
  });
});
