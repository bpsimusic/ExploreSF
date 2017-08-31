import React from 'react';
import { shallow, mount, render } from 'enzyme';
import SearchBar from '../components/search_bar';

jest.mock('google');

describe('searchBar', ()=>{
  let wrapper;
  beforeEach(() => {
    google.maps.InfoWindow = require('google').maps.InfoWindow;
    wrapper = shallow(<SearchBar />);
  });
  it("should render an input field", ()=>{
    expect(wrapper.find("input").length).toBe(1);
  });
});
