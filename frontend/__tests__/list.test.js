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
    places = [{opening_hours: {open_now: true}, formatted_address: '', name: ''}]
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

});
