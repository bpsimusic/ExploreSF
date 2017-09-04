/*global google*/
/*global jest*/
/*global bounds*/

import React from 'react';
import { shallow, mount, render } from 'enzyme';
import SearchBar from '../components/search_bar';
import List from '../components/list';

jest.mock('google');

describe('searchBar Component', ()=>{
  let wrapper;
  let instance;

  beforeEach(() => {
    google.maps.InfoWindow = require('google').maps.InfoWindow;
    google.maps.Marker = require('google').maps.Marker;
    google.maps.LatLngBounds = require('google').maps.LatLngBounds;
    google.maps.Map = require('google').maps.Map;
    google.maps.places = require('google').maps.places;
    google.maps.SymbolPath = require('google').maps.SymbolPath;
  });

  describe("componentDidMount", ()=>{
    it('calls componentDidMount', () => {
      SearchBar.prototype.componentDidMount = jest.fn();
      wrapper = mount(<SearchBar />);
      expect(SearchBar.prototype.componentDidMount).toHaveBeenCalledTimes(1);
    });
  });

  describe(`searchBar's html elements`, ()=>{
    beforeEach(()=>{
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
  });

  describe(`searchBar's form functions correctly`, ()=>{
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
      wrapper.setState({value: 'gym'});
      instance.handleSubmit(event);
      expect(instance.query).toBeCalledWith('gym');
    });
  });

  describe('google maps API', ()=>{
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
    });

    describe('method query', ()=>{
      beforeEach(()=>{
        instance.retrievePlaces = jest.fn();
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
        wrapper.setState({places: "dummy"});
        instance.retrievePlaces(results, success);
        expect(instance.state.places).toEqual(results);
      });
    });

    describe('method createMarker', ()=>{
      let place;
      let map;
      beforeEach(()=>{
        map = {};
        place = {getPosition: function(){}, rating: 5, geometry: {location: ''}};
        instance.infowindow.setContent = jest.fn();
        instance.infowindow.open = jest.fn();
        instance.infowindow.close = jest.fn();
        google.maps.Marker = jest.fn();
        google.maps.Marker.prototype.addListener = jest.fn((event, cb) => {
          map[event] = cb;
        });
      });
      it("should stop if place is undefined", ()=>{
        let dummyPlace;
        instance.createMarker(dummyPlace);
        expect(instance.createMarker()).toEqual(undefined);
      });

      it("should invoke google.maps.Marker constructor", ()=>{
        instance.createMarker(place);
        expect(google.maps.Marker).toBeCalled();
      });

      it("adds a mouseover listener to the marker", ()=>{
        let marker = instance.createMarker(place);
        map['mouseover']();
        expect(instance.infowindow.setContent).toBeCalled();
        expect(instance.infowindow.open).toBeCalled();
      });

      it("adds a mouseout listener to the marker", ()=>{
        let marker = instance.createMarker(place);
        map['mouseout']();
        expect(instance.infowindow.close).toBeCalled();
      });
    });

    describe("method setBoundsAndMarkers", ()=>{
      let results;
      beforeEach(()=>{
        results = [1,2,3,4,5,6,7,8,9,10];
        wrapper = shallow(<SearchBar />);
        google.maps.LatLngBounds = jest.fn();
        google.maps.LatLngBounds.prototype.extend = jest.fn();
        instance = wrapper.instance();
        instance.createMarker = jest.fn((object)=>{
          return {getPosition: function(){}};
        });
      });


      it("should call LatLngBounds constructor", ()=>{
        instance.setBoundsAndMarkers(results);
        expect(google.maps.LatLngBounds).toBeCalled();
      });

      it("should call the map's fitBounds method", ()=>{
        window.map.fitBounds = jest.fn();
        instance.setBoundsAndMarkers(results);
        expect(window.map.fitBounds).toBeCalled();
      });

      it("length of markers array should be 10 by default", ()=>{
        instance.setBoundsAndMarkers(results);
        expect(instance.createMarker).toHaveBeenCalledTimes(10);
      });

      it("if results length is less than 10, set markers length to be results length", ()=>{
        results = [1,2,3];
        instance.setBoundsAndMarkers(results);
        expect(instance.createMarker).toHaveBeenCalledTimes(3);
      });
    });

    describe("passes props to List Component", ()=>{
      it("passes places to List", ()=>{
        wrapper = mount(<SearchBar />);
        expect(wrapper.find(List).props().places).toBeInstanceOf(Array);
        expect(wrapper.find(List).props()).toHaveProperty("loading");
      });
    });
  });
});
