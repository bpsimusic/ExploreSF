/*global google*/
/*global jest*/
/*global bounds*/

import React from 'react';
import { shallow, mount, render } from 'enzyme';
import SearchBar from '../components/search_bar';

jest.mock('google');

describe('searchBar Component', ()=>{
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

  describe(`searchBar's form functions correctly`, ()=>{
    let instance;
    let event;
    beforeEach(() => {
      google.maps.places.PlacesService.prototype.textSearch = jest.fn();
      wrapper = mount(<SearchBar />);
      instance = wrapper.instance();
      event = {preventDefault: function(){}, target: {value: 5}};
    });

    it("should call handleInput when typing in input", ()=>{
      instance.handleInput = jest.fn();
      wrapper.update();
      wrapper.find("input").simulate("change");
      expect(instance.handleInput).toBeCalled();
    });

    it("handleInput should call setState with event", ()=>{
      instance.setState = jest.fn();
      instance.handleInput(event);
      expect(instance.setState).toBeCalledWith({value: event.target.value});
    });

    it("setState should change input's value", ()=>{
      wrapper.setState({value: 'dinner'});
      expect(wrapper.find("input").get(0).value).toBe('dinner');
    });

    it("should submit the form when submit is clicked", ()=>{
      instance.handleSubmit = jest.fn();
      wrapper.update();
      wrapper.find("form").simulate("submit");
      expect(instance.handleSubmit).toBeCalled();
    });

    it('query method is invoked when form is submitted', ()=>{
      instance.query = jest.fn();
      wrapper.update();
      wrapper.setState({value: 'gym'});
      instance.handleSubmit(event);
      expect(instance.query).toBeCalledWith('gym');
    });
  });

  describe('google maps API', ()=>{
    let instance;
    let entry = "gym";
    let textSearch;
    let obj= {
      location: {lat: 37.773972, lng: -122.431297},
      radius: '500',
      query: entry
    };

    beforeEach(() => {
      wrapper = shallow(<SearchBar />);
      instance = wrapper.instance();
      google.maps.places.PlacesService.prototype.textSearch =
      jest.fn((object, callback)=>callback());
      textSearch = google.maps.places.PlacesService.prototype.textSearch;
      wrapper.update();
    });

    describe('method query', ()=>{
      beforeEach(()=>{
        instance.retrievePlaces = jest.fn();
        wrapper.update();
        instance.query(entry);
      });
      it('query calls method textSearch with correct arguments', ()=>{
        expect(textSearch).toBeCalledWith(obj, instance.retrievePlaces);
      });
      it('textSearch invokes retrievePlaces callback', ()=>{
        expect(instance.retrievePlaces).toBeCalled();
      });
    });

    describe('method retrievePlaces', ()=>{
      let results = [1,2,3,4,5,6,7,8,9,10];
      let success = "OK";
      let fail = "FAIL";

      it("should set state.places to empty array if status fails", ()=>{
        wrapper.setState({places: "dummy"});
        instance.retrievePlaces(results, fail);
        expect(instance.state.places).toEqual([]);
      });

      it("should set state.places to results if status succeeds", ()=>{
        instance.createMarker = jest.fn(()=>({getPosition: function(){}}));
        wrapper.update();
        wrapper.setState({places: "dummy"});
        instance.retrievePlaces(results, success);
        expect(instance.state.places).toEqual(results);
      });
    });
  });
});
