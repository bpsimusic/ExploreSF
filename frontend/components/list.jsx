import React from 'react';

class List extends React.Component {
  constructor(props){
    super(props);
  }

  render(){

    return (
      <div className={"list"}>
        <ul>
          <li>Barry's</li>
          <li>Barry's</li>
          <li>Barry's</li>
        </ul>
      </div>
    );
  }
}

export default List;
