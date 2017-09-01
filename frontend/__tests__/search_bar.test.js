/*global google*/
/*global jest*/

import React from 'react';
import { shallow, mount, render } from 'enzyme';
import SearchBar from '../components/search_bar';
import sinon from 'sinon';

jest.mock('google');

describe('searchBar', ()=>{
  let wrapper;
  beforeEach(() => {
    google.maps.InfoWindow = require('google').maps.InfoWindow;
    google.maps.Marker = require('google').maps.Marker;
    google.maps.LatLngBounds = require('google').maps.LatLngBounds;
    google.maps.Map = require('google').maps.Map;
    google.maps.places = require('google').maps.places;
    google.maps.SymbolPath = require('google').maps.SymbolPath;
    wrapper = shallow(<SearchBar />);
  });

  it("should render an input field", ()=>{
    expect(wrapper.find("input").length).toBe(1);
  });

  it("should render a button", ()=>{
    expect(wrapper.find("button").length).toBe(1);
  });

  it("should render a form", ()=>{
    expect(wrapper.find("form").length).toBe(1);
  });

  describe('form functionality', ()=>{
    let instance;
    beforeEach(() => {
      google.maps.places.PlacesService.prototype.textSearch = jest.fn();
      wrapper = mount(<SearchBar />);
      instance = wrapper.instance();
    });

    it("should submit the form when submit is clicked", ()=>{
      instance.handleSubmit = jest.fn();
      wrapper.update();
      wrapper.find("form").simulate("submit");
      expect(instance.handleSubmit).toBeCalled();
    });

    it("should call onChange method when typing in input", ()=>{
      instance.handleInput = jest.fn();
      wrapper.update();
      wrapper.find("input").simulate("change");
      expect(instance.handleInput).toBeCalled();
    });

    it("setState should change input's value when typing", ()=>{
      wrapper.setState({value: 'dinner'});
      expect(wrapper.find("input").get(0).value).toBe('dinner');
    });
  });
});
