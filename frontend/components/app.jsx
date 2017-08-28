
import React from 'react';
import List from './list';
import Map from './map';
import SearchBar from './search_bar';


const App = ()=>{
  return (
    <div>
      <SearchBar>
        <List />
        <Map />
      </SearchBar>
    </div>
  );
};


export default App;
